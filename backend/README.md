# Backend (Express + Prisma + SQLite)

This backend replaces the external API currently used by the frontend and matches the existing frontend contract.

## Stack

- Node.js + Express
- Prisma ORM + SQLite
- Zod validation
- JWT Bearer auth
- Vitest + Supertest smoke tests

## Setup

1. Install dependencies:

```bash
corepack pnpm --dir backend install
```

2. Create env file:

```bash
cp backend/.env.example backend/.env
```

3. Generate Prisma client + run migration:

```bash
corepack pnpm --dir backend prisma:generate
corepack pnpm --dir backend prisma:migrate
```

4. Seed demo data:

```bash
corepack pnpm --dir backend prisma:seed
```

The default seed now creates 4 demo lists and 15 tasks so the UI is populated immediately after startup.

Demo login:

- `login` (field `email`): `admin`
- `password`: `admin`

## Run in dev (nodemon)

```bash
corepack pnpm --dir backend dev
```

Backend runs on `http://127.0.0.1:3001` by default.
Host/port are controlled by `HOST` and `PORT` in `backend/.env`.

## Run tests

```bash
corepack pnpm --dir backend test:run
```

## Frontend integration

Frontend should call `/api` and use Vite proxy:

- root `.env`: `VITE_API_URL=/api`
- `vite.config.ts` proxy target: `http://localhost:3001`

Then run in two terminals:

```bash
corepack pnpm backend:dev
corepack pnpm dev
```

## Security notes

- `DELETE /api/auth/login` revokes the current JWT by rotating the user token version.
- Every response includes `X-Request-Id`; send your own header to trace a request end-to-end.
- `FRONTEND_ORIGIN` accepts a comma-separated allowlist.
- `TRUST_PROXY=true` is interpreted as trusting one proxy hop by default.
- `REQUEST_BODY_LIMIT` defines the maximum accepted JSON body size.

## API surface implemented

- `POST /api/auth/login`
- `DELETE /api/auth/login`
- `GET /api/auth/me`
- `GET /api/todo-lists`
- `POST /api/todo-lists`
- `DELETE /api/todo-lists/:id`
- `PUT /api/todo-lists/:id`
- `GET /api/health`
- `GET /api/todo-lists/:todolistId/tasks`
- `POST /api/todo-lists/:todolistId/tasks`
- `PUT /api/todo-lists/:todolistId/tasks/:taskId`
- `DELETE /api/todo-lists/:todolistId/tasks/:taskId`
