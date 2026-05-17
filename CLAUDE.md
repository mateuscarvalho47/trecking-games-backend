# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

pnpm workspaces monorepo. Each package has its own `CLAUDE.md` with deeper guidance.

```
apps/
  backend/   # Fastify 5 + Prisma 7 + PostgreSQL 17 + Redis 7  → apps/backend/CLAUDE.md
  frontend/  # React 19 + Vite + TanStack Router/Query          → apps/frontend/CLAUDE.md
packages/
  shared/    # @tracking-games/shared — Zod schemas + types shared by both apps
```

## Root commands

```bash
pnpm dev:backend    # backend watch mode (tsx)
pnpm dev:frontend   # Vite dev server (http://localhost:5173)
pnpm build          # compile all packages
pnpm lint           # Biome lint across all packages
```

## Local setup

```bash
pnpm install

# 1. Start infrastructure (Postgres 17 + Redis 7)
cd apps/backend && docker compose up -d

# 2. Configure env (see apps/backend/.env.exemple)
cp apps/backend/.env.exemple apps/backend/.env
# Required: DATABASE_URL, REDIS_URL, SESSION_SECRET (≥32 chars), COOKIE_SECRET (≥32 chars),
#            CORS_ORIGIN=http://localhost:5173, IGDB_CLIENT_ID, IGDB_CLIENT_SECRET

# 3. Database
cd apps/backend
pnpm prisma:migrate && pnpm prisma:generate
pnpm db:seed   # seed users: alice@example.com, bob@example.com / password123
```

Swagger UI (dev only): http://localhost:3000/docs

## Tech decisions that span both apps

- **Zod 4** for validation everywhere — schemas shared via `@tracking-games/shared` when consumed by both apps, otherwise defined locally in each package.
- **Biome** (not ESLint/Prettier) for linting and formatting in all packages. 100-char line width, single quotes, trailing commas.
- **Session-based auth** (not JWT) — `req.session.userId` set after login, stored in Redis.
- **ESM + NodeNext** in the backend — always use `.js` extensions in imports even for `.ts` source files.
- **Path alias `@`** maps to `src/` in both apps.
- The backend API is the single source of truth for types; the frontend imports shared types from `@tracking-games/shared` or defines local ones in `src/types/api.ts`.
