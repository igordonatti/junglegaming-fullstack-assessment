## Notifications Service

Serviço de consumo de eventos via RabbitMQ e integração com o `api-gateway` para emitir notificações em tempo real.

### Requisitos
- Node.js 18+
- RabbitMQ
- (Opcional) PostgreSQL caso entidades sejam persistidas no futuro

### Variáveis de ambiente
Crie `.env` na raiz de `apps/notifications-service`:

```env
# RabbitMQ
RABBITMQ_URI=amqp://guest:guest@localhost:5672

# Comunicação com o API Gateway via TCP
API_GATEWAY_HOST=localhost
API_GATEWAY_PORT=3001

# Banco de Dados Postgres (opcional; usado pelo TypeORM se configurado)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=notifications_db

# Ambiente: 'production' desativa synchronize do TypeORM
NODE_ENV=development
```

### Instalação
```bash
npm install
```

### Execução
```bash
# microserviço (RMQ)
npm run start:dev

# produção
npm run build && npm run start:prod
```

### Filas/Integrações
- Consome da fila `notifications_queue` via `RABBITMQ_URI`.
- Envia eventos para o `api-gateway` (TCP `API_GATEWAY_HOST:API_GATEWAY_PORT`).

### Scripts úteis
- `npm run test`, `npm run test:e2e`, `npm run lint`
