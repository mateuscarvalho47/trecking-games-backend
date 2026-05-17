# Zerado

Monorepo para rastreamento de jogos — backend Fastify + frontend React.

## Stack

### Monorepo

- **pnpm workspaces** — gerenciador de pacotes e workspaces
- **`packages/shared`** — tipos e schemas Zod compartilhados

### Backend (`apps/backend`)

- **Node 22 LTS** + TypeScript (ESM, `NodeNext`)
- **Fastify 5** — servidor HTTP
- **Prisma 7** — ORM com driver adapter `pg`
- **PostgreSQL 17** — banco principal
- **Redis 7** — store de sessão
- **@fastify/session** + **connect-redis** — sessões server-side
- **argon2** — hash de senha
- **zod 4** — validação de schemas
- **croner** — agendamento de jobs
- **Swagger / OpenAPI 3.1** — documentação automática
- **Biome** — lint e formatação
- **Vitest** — testes unitários
- **IGDB API** — busca de jogos

### Frontend (`apps/frontend`)

- **React 19** + TypeScript
- **Vite 8** — bundler
- **TanStack Router** — roteamento type-safe
- **TanStack Query** — data fetching e cache
- **Tailwind CSS 4** — estilos
- **shadcn/ui** — componentes (via `class-variance-authority`)

## Estrutura do monorepo

```
zerado/
├── apps/
│   ├── backend/             # API Fastify
│   │   ├── prisma/          # schema, migrations, seed
│   │   ├── scripts/         # create-module, gen-bruno
│   │   ├── bruno/           # coleção Bruno API
│   │   └── src/
│   │       ├── config/      # env loader (zod)
│   │       ├── lib/         # helpers (hash, errors, validate, igdb, requireAuth)
│   │       ├── plugins/     # prisma, redis, session, swagger, cron, cors, igdb, errorHandler
│   │       ├── modules/
│   │       │   ├── auth/    # register, login, logout, me
│   │       │   ├── user/    # repositório e service de usuário
│   │       │   ├── game/    # busca de jogos via IGDB
│   │       │   └── library/ # biblioteca pessoal de jogos
│   │       ├── app.ts       # build da instância Fastify
│   │       └── server.ts    # bootstrap
│   └── frontend/            # SPA React
│       └── src/
│           ├── lib/         # cliente HTTP (api.ts), utilitários
│           └── routes/      # rotas TanStack Router
└── packages/
    └── shared/              # tipos e schemas cross-cutting (@tracking-games/shared)
```

### Camadas (backend)

| Camada     | Responsabilidade                | Pode tocar                  |
| ---------- | ------------------------------- | --------------------------- |
| Controller | parse HTTP, validação, response | service                     |
| Service    | regras de negócio, orquestração | repository, outros services |
| Repository | queries no banco                | Prisma                      |

### Modelo de dados

```
User
  id, email, passwordHash, createdAt, updatedAt
  └── LibraryEntry (1:N)

LibraryEntry
  id, userId, igdbId, name, coverUrl, genres[], platforms[]
  status (WISHLIST | BACKLOG | PLAYING | PAUSED | COMPLETED | DROPPED)
  userPlatform?, rating?, hoursPlayed?, notes?, completedAt?
```

## Pré-requisitos

- Node 22+
- pnpm
- Docker (Postgres + Redis via compose)
- Conta IGDB (Twitch Developer) — para busca de jogos

## Setup

```bash
# 1. instalar dependências
pnpm install

# 2. subir banco e cache
cd apps/backend && docker compose up -d

# 3. variáveis de ambiente
cp apps/backend/.env.exemple apps/backend/.env
# preencher DATABASE_URL, REDIS_URL, SESSION_SECRET, COOKIE_SECRET, CORS_ORIGIN
# e credenciais IGDB: IGDB_CLIENT_ID, IGDB_CLIENT_SECRET

# 4. rodar migrations
pnpm --filter backend prisma:migrate

# 5. gerar Prisma Client
pnpm --filter backend prisma:generate

# 6. rodar backend em dev
pnpm --filter backend dev

# 7. rodar frontend em dev
pnpm --filter frontend dev
```

Backend: `http://localhost:3000` | Frontend: `http://localhost:5173`

## Variáveis de ambiente (backend)

```
DATABASE_URL=postgresql://app:app@localhost:5432/app
REDIS_URL=redis://localhost:6379
SESSION_SECRET=<min 32 chars>
COOKIE_SECRET=<min 32 chars>
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=3000

# IGDB (Twitch Developer Console)
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
```

Gerar secrets (PowerShell):

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Max 256 }) -as [byte[]])
```

## Scripts

### Raiz

| Comando                           | Descrição                |
| --------------------------------- | ------------------------ |
| `pnpm --filter backend <script>`  | rodar script no backend  |
| `pnpm --filter frontend <script>` | rodar script no frontend |

### Backend

| Comando                       | Descrição                      |
| ----------------------------- | ------------------------------ |
| `pnpm dev`                    | servidor em modo watch         |
| `pnpm build`                  | compila TypeScript pra `dist/` |
| `pnpm start`                  | roda build de produção         |
| `pnpm prisma:generate`        | gera Prisma Client             |
| `pnpm prisma:migrate`         | aplica migrations (dev)        |
| `pnpm db:seed`                | insere usuários de teste       |
| `pnpm db:clean`               | limpa todas as tabelas         |
| `pnpm db:reset`               | recria banco do zero           |
| `pnpm test`                   | roda testes                    |
| `pnpm test:watch`             | testes em watch                |
| `pnpm test:cov`               | testes com coverage            |
| `pnpm lint` / `pnpm lint:fix` | Biome lint                     |
| `pnpm gen:module <name>`      | scaffold de novo módulo        |
| `pnpm gen:bruno`              | gera coleção Bruno             |

### Frontend

| Comando        | Descrição            |
| -------------- | -------------------- |
| `pnpm dev`     | servidor Vite em dev |
| `pnpm build`   | build de produção    |
| `pnpm preview` | preview do build     |

## Endpoints

### Auth

| Método | Rota             | Descrição               | Auth |
| ------ | ---------------- | ----------------------- | ---- |
| POST   | `/auth/register` | cria usuário            | não  |
| POST   | `/auth/login`    | autentica e cria sessão | não  |
| POST   | `/auth/logout`   | encerra sessão          | sim  |
| GET    | `/auth/me`       | retorna usuário atual   | sim  |

### Games (IGDB)

| Método | Rota                     | Descrição              | Auth |
| ------ | ------------------------ | ---------------------- | ---- |
| GET    | `/games/search?q=<nome>` | busca jogos por nome   | sim  |
| GET    | `/games/:igdbId`         | busca jogo por ID IGDB | sim  |

### Library

| Método | Rota               | Descrição                   | Auth |
| ------ | ------------------ | --------------------------- | ---- |
| GET    | `/library`         | lista biblioteca do usuário | sim  |
| POST   | `/library`         | adiciona jogo à biblioteca  | sim  |
| GET    | `/library/stats`   | estatísticas da biblioteca  | sim  |
| GET    | `/library/:igdbId` | busca entrada por igdbId    | sim  |
| PATCH  | `/library/:igdbId` | atualiza entrada            | sim  |
| DELETE | `/library/:igdbId` | remove jogo da biblioteca   | sim  |

### Utilitários

| Método | Rota      | Descrição               | Auth |
| ------ | --------- | ----------------------- | ---- |
| GET    | `/health` | healthcheck             | não  |
| GET    | `/docs`   | Swagger UI (apenas dev) | não  |

## Tratamento de erros

```json
{
  "error": {
    "code": "EMAIL_TAKEN",
    "message": "Email já cadastrado",
    "details": null
  }
}
```

| Code               | Status |
| ------------------ | ------ |
| `VALIDATION_ERROR` | 400    |
| `UNAUTHORIZED`     | 401    |
| `FORBIDDEN`        | 403    |
| `NOT_FOUND`        | 404    |
| `CONFLICT`         | 409    |
| `INTERNAL`         | 500    |

## Sessões

- Persistidas no Redis (prefix `sess:`)
- TTL padrão: 7 dias, rolling
- Cookie `httpOnly`, `sameSite: lax`, `secure` em produção

## Testes

Vitest com mocks de repositório (`vi.fn()`), sem dependências externas.

```bash
pnpm test          # tudo
pnpm test:watch    # watch
pnpm test:cov      # coverage
```

```
tests/
├── auth.service.test.ts
├── game.service.test.ts
├── igdb.client.test.ts
├── library.service.test.ts
├── library.stats.service.test.ts
└── user.service.test.ts
```

## Adicionando um módulo (backend)

```bash
pnpm gen:module <name>   # ex: pnpm gen:module product
```

Gera `src/modules/<name>/` com todos os arquivos. Depois:

1. Adicionar modelo em `prisma/schema.prisma`
2. `pnpm prisma:migrate && pnpm prisma:generate`
3. Registrar rotas em `src/app.ts`

## Licença

MIT
