## API Gateway

Gateway HTTP da plataforma. Expõe a API pública (`/api`), orquestra autenticação (JWT), encaminha chamadas para os microserviços e hospeda o WebSocket de notificações.

### Requisitos
- Node.js 18+
- NPM ou PNPM

### Variáveis de ambiente
Crie um arquivo `.env` na raiz de `apps/api-gateway` (opcional para valores padrão):

```env
# Porta HTTP do Gateway (default: 3000)
PORT=3000

# Autenticação JWT (obrigatório em produção)
JWT_SECRET=defina-um-segredo-seguro
# Tempo de expiração do token (opcional)
JWT_EXPIRES_IN=1h
```

Notas:
- O Gateway também inicia um microserviço TCP para integração com outros serviços na porta `3001` (fixa no código).
- Clientes configurados no código apontam para:
  - `AUTH_SERVICE`: TCP `0.0.0.0:3002`
  - `TASKS_SERVICE`: TCP `0.0.0.0:3003`

### Instalação
```bash
npm install
```

### Execução
```bash
# desenvolvimento (watch)
npm run start:dev

# produção
npm run build && npm run start:prod
```

### Portas e endpoints
- HTTP: `http://localhost:3000/api`
- WebSocket: hospedado pelo Gateway; o frontend deve apontar `VITE_API_URL` para o host/porta corretos (ver `apps/web`).
- Microserviço TCP do Gateway: `localhost:3001`

### Scripts úteis
- `npm run start:dev`: inicia em modo watch
- `npm run test`: testes unitários
- `npm run test:e2e`: testes e2e
- `npm run lint`: lint com correções
