## Web (React + Vite)

Aplicação frontend da plataforma. Consome a API do `api-gateway` e conecta-se ao WebSocket de notificações.

### Requisitos
- Node.js 18+

### Variáveis de ambiente
Crie um arquivo `.env` na raiz de `apps/web` com:

```env
# URL base do API Gateway (inclua protocolo e porta)
VITE_API_URL=http://localhost:3001
```

Observações:
- O app usa `import.meta.env.VITE_API_URL` no cliente Socket.IO (`src/lib/socket.ts`).
- As requisições HTTP usam base `http://localhost:3000/api` por padrão (`src/lib/axios.ts`). Ajuste se necessário.

### Instalação
```bash
npm install
```

### Execução
```bash
# desenvolvimento
npm run dev

# build de produção e preview
npm run build && npm run preview
```

### Scripts úteis
- `npm run lint`: executa ESLint
