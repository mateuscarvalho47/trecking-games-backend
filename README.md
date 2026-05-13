# Fastify Boilerplate

Monolito modular em Node.js com Fastify, Prisma, Redis e sessões persistidas.

## Stack

- **Node 22 LTS** + TypeScript (ESM, `NodeNext`)
- **Fastify 5** — servidor HTTP
- **Prisma 7** — ORM com driver adapter `pg`
- **PostgreSQL 17** — banco principal
- **Redis 7** — store de sessão + cache
- **@fastify/session** + **connect-redis** — sessões server-side
- **argon2** — hash de senha
- **zod 4** — validação de schemas
- **croner** — agendamento de jobs
- **Swagger / OpenAPI 3.1** — documentação automática
- **Vitest** — testes unitários e de integração

## Arquitetura

Padrão **monolito modular** com separação por camadas dentro de cada módulo:

```
src/
├── config/              # env loader (zod)
├── lib/                 # helpers (hash, errors, validate)
├── generated/prisma/    # cliente Prisma gerado (gitignored)
├── plugins/             # Fastify plugins (prisma, redis, session, swagger, cron, errorHandler)
├── modules/
│   ├── user/
│   │   ├── user.repository.ts
│   │   └── user.service.ts
│   └── auth/
│       ├── auth.schema.ts
│       ├── auth.errors.ts
│       ├── auth.service.ts
│       ├── auth.controller.ts
│       └── auth.routes.ts
├── shared/              # tipos/schemas cross-cutting
├── app.ts               # build da instância Fastify
└── server.ts            # bootstrap
```

### Camadas

| Camada | Responsabilidade | Pode tocar |
|---|---|---|
| Controller | parse HTTP, validação, response | service |
| Service | regras de negócio, orquestração | repository, outros services |
| Repository | queries no banco | Prisma |

Cada módulo é uma unidade fechada: schema, erros, lógica e rotas vivem juntos.

## Pré-requisitos

- Node 22+
- pnpm
- Docker (Postgres + Redis via compose)

## Setup

```bash
# 1. instalar dependências
pnpm install

# 2. subir banco e cache
docker compose up -d

# 3. variáveis de ambiente
cp .env.example .env

# 4. rodar migrations
pnpm prisma:migrate

# 5. gerar Prisma Client
pnpm prisma:generate

# 6. rodar em dev
pnpm dev
```

Servidor sobe em `http://localhost:3000`.

## Variáveis de ambiente

```
DATABASE_URL=postgresql://app:app@localhost:5432/app
REDIS_URL=redis://localhost:6379
SESSION_SECRET=<min 32 chars>
COOKIE_SECRET=<min 32 chars>
NODE_ENV=development
PORT=3000
```

Gerar secrets aleatórios (PowerShell):
```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Max 256 }) -as [byte[]])
```

## Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | servidor em modo watch |
| `pnpm build` | compila TypeScript pra `dist/` |
| `pnpm start` | roda build de produção |
| `pnpm prisma:generate` | gera Prisma Client |
| `pnpm prisma:migrate` | aplica migrations (dev) |
| `pnpm test` | roda testes |
| `pnpm test:watch` | testes em watch |
| `pnpm test:cov` | testes com coverage |

## Endpoints

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/register` | cria usuário | não |
| POST | `/auth/login` | autentica e cria sessão | não |
| POST | `/auth/logout` | encerra sessão | sim |
| GET | `/auth/me` | retorna usuário atual | sim |
| GET | `/health` | healthcheck | não |
| GET | `/docs` | Swagger UI (apenas dev) | não |

### Exemplo — registrar

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha12345"}'
```

### Exemplo — login (salva cookie)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@example.com","password":"senha12345"}'
```

### Exemplo — me (envia cookie)

```bash
curl http://localhost:3000/auth/me -b cookies.txt
```

## Tratamento de erros

Todos os erros respondem com formato padronizado:

```json
{
  "error": {
    "code": "EMAIL_TAKEN",
    "message": "Email já cadastrado",
    "details": null
  }
}
```

Erros de domínio estendem `AppError` (`src/lib/errors.ts`). O handler global em `plugins/errorHandler.ts` traduz para status HTTP e padroniza payload.

Códigos comuns:

| Code | Status |
|---|---|
| `VALIDATION_ERROR` | 400 |
| `UNAUTHORIZED` | 401 |
| `FORBIDDEN` | 403 |
| `NOT_FOUND` | 404 |
| `CONFLICT` | 409 |
| `INTERNAL` | 500 |

## Sessões

- Persistidas no Redis (prefix `sess:`)
- TTL padrão: 7 dias
- Cookie `httpOnly`, `sameSite: lax`, `secure` em produção
- Inspecionar:
  ```bash
  docker exec -it <redis-container> redis-cli KEYS "sess:*"
  ```

## Testes

Vitest com `app.inject()` (sem porta TCP).

```bash
# rodar tudo
pnpm test

# watch
pnpm test:watch

# coverage
pnpm test:cov
```

Banco de teste isolado via `.env.test` (`app_test` + Redis DB index 1).

Estrutura:
```
tests/
├── setup.ts
├── helpers/
│   ├── build.ts        # cria instância Fastify
│   └── db.ts           # cliente Prisma + clearDb
├── auth.test.ts        # integração (HTTP)
└── auth.service.test.ts # unit (mock repo)
```

## Documentação da API

Em desenvolvimento, Swagger UI fica em `http://localhost:3000/docs`.

Schemas Zod das rotas são convertidos automaticamente em OpenAPI 3.1 via `fastify-type-provider-zod`.

## Adicionando um módulo novo

1. Criar pasta `src/modules/<nome>/`
2. Arquivos:
   - `<nome>.schema.ts` — Zod schemas + types
   - `<nome>.repository.ts` — queries Prisma
   - `<nome>.service.ts` — regras de negócio
   - `<nome>.errors.ts` — erros de domínio (opcional)
   - `<nome>.controller.ts` — handlers HTTP
   - `<nome>.routes.ts` — registro de rotas + DI
3. Registrar rotas em `src/app.ts`

## Roadmap

- [ ] Rate limit no login (`@fastify/rate-limit`)
- [ ] CORS configurável (`@fastify/cors`)
- [ ] Refresh de sessão (rolling cookies)
- [ ] Email verification
- [ ] Reset de senha
- [ ] Audit log
- [ ] Métricas Prometheus

## Licença

MIT
