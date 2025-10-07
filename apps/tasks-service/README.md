## Tasks Service

Serviço responsável por tarefas e comentários. Integra com PostgreSQL e publica eventos de notificação via RabbitMQ para o `notifications-service`.

### Requisitos
- Node.js 18+
- PostgreSQL
- RabbitMQ

### Variáveis de ambiente
Crie `.env` na raiz de `apps/tasks-service`:

```env
# Porta HTTP (default: 3003)
PORT=3003

# Banco de Dados Postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tasks_db

# RabbitMQ
RABBITMQ_URI=amqp://guest:guest@localhost:5672

# Ambiente: 'production' desativa synchronize do TypeORM
NODE_ENV=development
```

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

### Portas
- HTTP: `http://localhost:3003`

### Integrações
- Publica mensagens em `notifications_queue` no RabbitMQ usando `RABBITMQ_URI`.

### Scripts úteis
- `npm run test`, `npm run test:e2e`, `npm run lint`
