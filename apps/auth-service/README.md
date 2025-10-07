## Auth Service

Serviço de autenticação e usuários. Fornece emissão/validação de JWT e persistência via PostgreSQL.

### Requisitos
- Node.js 18+
- PostgreSQL

### Variáveis de ambiente
Crie `.env` na raiz de `apps/auth-service`:

```env
# Porta HTTP (default: 3002)
PORT=3002

# Banco de Dados Postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auth_db

# JWT
JWT_SECRET=defina-um-segredo-seguro
JWT_EXPIRES_IN=15m

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
- HTTP: `http://localhost:3002`

### Scripts úteis
- `npm run test`, `npm run test:e2e`, `npm run lint`
