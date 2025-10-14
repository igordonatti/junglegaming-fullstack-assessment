

# Igor - README
Este projeto foi desenvolvido para um teste técnico do processo seletivo da empresa JungleGaming.

Postman da aplicação: https://www.postman.com/igor-donatti/workspace/igor-donatti/collection/9236537-84a27067-bc80-4973-91a7-7e2bffead2f7?action=share&creator=9236537

# Desafio Full-stack Júnior — Sistema de Gestão de Tarefas Colaborativo

Esta é a implementação do desafio prático para a vaga de Full-stack Developer Júnior na Jungle Gaming. O projeto consiste em um Sistema de Gestão de Tarefas Colaborativo construído sobre uma arquitetura de microsserviços, com comunicação em tempo real e orquestrado com Docker.

## 1. Arquitetura

O sistema foi projetado seguindo o padrão de microsserviços, com um API Gateway centralizando a comunicação com o cliente. A comunicação interna entre os serviços utiliza dois padrões: síncrono (TCP) para comandos diretos e assíncrono (AMQP com RabbitMQ) para eventos.

```text
+------------------+      HTTP/S & WebSocket      +---------------------+
|                  | <--------------------------> |                     |
|  Cliente (React) |                              |     API Gateway     |
|   (apps/web)     |                              | (apps/api-gateway)  |
|                  |                              | (Portaria/Segurança)|
+------------------+                              +----------+----------+
                                                               |    ^
                               (TCP: Comandos Síncronos)       |    | (TCP: Comando Interno p/ WS)
                                                               v    |
                                       +-----------------------+    +----------------------+
                                       |                                                  |
 +--------------------------+          |                       +------------------+         |
 |                          |          |                       |                  |         |
 |  Auth Service (Cartório) | <--------+----------------------> |   Tasks Service  |         |
 |   (apps/auth-service)    |                                  | (apps/tasks-svc) |         |
 |                          |                                  +--------+---------+         |
 +--------------------------+                                           |                   |
                                                                        | (AMQP: Eventos)   |
                                                                        v                   |
                                                              +------------------+          |
                                                              |                  |          |
                                                              |     RabbitMQ     |          |
                                                              |    (Correios)    |          |
                                                              +--------+---------+          |
                                                                       |                    |
                                                                       | (AMQP: Consome)    |
                                                                       v                    |
                                                              +---------------------------+ |
                                                              |                           | |
                                                              |  Notifications Service    | |
                                                              | (apps/notifications-svc)  | |
                                                              |                           | |
                                                              +---------------------------+ |
                                                                ^                           |
                                                                |                           |
                                                                +---------------------------+
```
- **Fluxo de Requisição:** O cliente (React) interage exclusivamente com o **API Gateway**. O Gateway atua como a "portaria", validando tokens JWT e roteando as requisições para os serviços internos apropriados (`auth-service`, `tasks-service`) via TCP.
- **Fluxo de Eventos:** Quando uma ação que requer notificação ocorre (ex: criação de tarefa), o `tasks-service` publica um evento no **RabbitMQ**. O `notifications-service` consome este evento, persiste a notificação em seu banco de dados e, em seguida, emite um comando interno (via TCP) para o `api-gateway`.
- **Fluxo de Notificação:** O `api-gateway` recebe o comando interno e, através do seu **WebSocket Gateway**, envia a notificação em tempo real para o cliente específico.

## 2. Decisões Técnicas e Trade-offs

-   **Arquitetura de Microsserviços com API Gateway:**
    -   **Decisão:** Separar as responsabilidades em serviços independentes (`Auth`, `Tasks`, `Notifications`) para promover escalabilidade, resiliência e manutenibilidade. O API Gateway centraliza o acesso, atuando como um *façade* para a complexidade interna.
    -   **Trade-off:** Aumento da complexidade de desenvolvimento e comunicação entre serviços em comparação com uma arquitetura monolítica. A comunicação em rede introduz latência e requer mecanismos de resiliência.

-   **Comunicação Híbrida (TCP Síncrono e AMQP Assíncrono):**
    -   **Decisão:** Utilizar TCP (`ClientProxy` do NestJS) para requisições diretas de comando-resposta (ex: Gateway → Auth para validar um login), onde uma resposta imediata é necessária. Utilizar RabbitMQ (AMQP) para eventos (ex: `task_created`), onde o desacoplamento e a garantia de entrega são mais importantes que a instantaneidade.
    -   **Trade-off:** Gerenciar dois protocolos de comunicação interna adiciona uma leve complexidade de configuração, mas otimiza a arquitetura para os diferentes tipos de interação.

-   **Autenticação Centralizada na Borda (API Gateway):**
    -   **Decisão:** A validação de `accessToken` (`JwtStrategy`) e a lógica de `Guards` residem exclusivamente no API Gateway. Os serviços internos recebem apenas a identidade já validada (ex: `userId`), confiando no Gateway.
    -   **Trade-off:** O Gateway se torna um componente crítico para a segurança. Isso simplifica e protege enormemente os serviços internos, que não precisam ter acesso aos segredos de assinatura de token.

-   **Orquestração de Dados no API Gateway:**
    -   **Decisão:** Para endpoints que necessitam de dados de múltiplos serviços (ex: buscar detalhes de uma tarefa e, em seguida, buscar os dados dos usuários atribuídos), o API Gateway orquestra essas chamadas internas e agrega os resultados.
    -   **Trade-off:** Adiciona lógica ao Gateway. Em cenários de alta complexidade, isso poderia ser um gargalo, mas para este escopo, simplifica drasticamente o código do frontend, que faz uma única chamada e recebe uma resposta completa.

## 3. Problemas Conhecidos e Melhorias

Dado o escopo e o prazo do desafio, alguns pontos foram implementados de forma funcional, mas poderiam ser refinados em um ambiente de produção contínuo:

-   **Observabilidade e Logging:** Os logs atuais são baseados em `console.log` para fins de depuração. Uma melhoria seria implementar um sistema de logging estruturado (como **Winston** ou **Pino**) e centralizado, facilitando a busca e a análise de eventos em produção.

-   **Refinamento de DTOs e Contratos:** As entidades e DTOs estão funcionais e os tipos principais são compartilhados via `@repo/types`. Para uma maior robustez, seria benéfico expandir este pacote para incluir também as classes DTO com validações, evitando qualquer duplicação entre o `api-gateway` e os serviços internos.

-   **Experiência do Usuário (UI/UX) no Frontend:** A interface atual foca na entrega dos requisitos funcionais. Uma próxima etapa seria realizar um trabalho mais aprofundado de design e usabilidade, explorando layouts mais dinâmicos e melhorando a jornada do usuário.

-   **Tratamento de Erros no Frontend:** A aplicação lida com erros de forma geral (ex: exibindo toasts). Uma melhoria seria um tratamento mais granular, fornecendo feedback mais específico ao usuário (ex: "O campo de e-mail é inválido" em vez de um genérico "Falha na requisição").

-   **Cobertura de Testes:** O projeto não possui uma suíte de testes automatizados (unitários, integração, e2e). A adição de testes com **Jest** aumentaria a resiliência a refatorações e garantiria a qualidade contínua do código.

-   **Otimização do Ambiente Docker:** O `docker-compose.yml` utilizado foi o sugerido, focado no ambiente de desenvolvimento com volumes para *hot-reloading*. Para produção, seria necessário criar um `docker-compose.prod.yml` e otimizar os Dockerfiles (com *multi-stage builds*) para gerar imagens menores e mais seguras.

## 4. Tempo Gasto

| Etapa                                              | Tempo Estimado Gasto |
| :------------------------------------------------- | :------------------- |
| **Fase 1:** Estrutura, Ambiente e Docker           | `10 horas`      |
| **Fase 2:** Backend - Autenticação, CRUD, Relações | `20 horas`     |
| **Fase 3:** Backend - RabbitMQ e Notificações      | `15 horas`     |
| **Fase 4:** Frontend - UI e Integração com API     | `14 horas`     |
| **Fase 5:** Refatoração, Depuração e Documentação  | `2 horas`      |

## 5. Instruções de Execução

### Pré-requisitos
-   Docker
-   Docker Compose
-   Node.js (v18+)
-   NPM ou um gerenciador de pacotes compatível

### Configuração
1.  Clone este repositório.
2.  Na raiz do projeto, instale as dependências:
    ```bash
    npm install
    ```
3.  O projeto utiliza variáveis de ambiente. Para cada serviço em `apps/` (ex: `apps/api-gateway`, `apps/auth-service`), renomeie o arquivo `.env.example` para `.env`.
4.  Gere segredos fortes para as variáveis `AT_SECRET` e `RT_SECRET` nos arquivos `.env` do `api-gateway` e `auth-service`, conforme as necessidades de cada um.

### Executando a Aplicação
Para subir toda a stack (frontend, todos os microsserviços, banco de dados e RabbitMQ), execute o seguinte comando na raiz do projeto:

```bash
docker-compose up --build
```




