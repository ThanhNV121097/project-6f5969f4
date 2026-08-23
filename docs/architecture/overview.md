# Architecture Overview — hello-word-7

## Scope

Fullstack proof app. One public page reads one stored greeting through backend API and renders it centered. Scaffold must build, lint, start with `docker compose up`, and leave feature code to later stories.

## Stack

| Layer | Choice | Reason | Rejected alternative |
|---|---|---|---|
| Frontend | Next.js 15 App Router, TypeScript, Tailwind v3 | Default stack, SSR-capable, CI-supported | Plain HTML would not prove frontend build or API integration path |
| Backend | Go 1.22 HTTP service | Small binary, stdlib routing enough, CI-supported | Node API would add second runtime pattern without benefit |
| Database | PostgreSQL 16 | Required persistent row storage | In-memory or frontend hardcode violates SRS |
| Containers | Existing Dockerfiles and `docker-compose.yml` conventions | Deployer and CI expect `code/frontend` and `code/backend` | Custom layout breaks committed build pipeline |
| CI | Existing `.github/workflows/ci.yml` | Runs build, vet/test, lint, frontend build, token checks | New workflow unnecessary and `.github` is read-only |

## Repository layout

```text
code/
  backend/
    cmd/api/main.go
    migrations/
    go.mod
    .env.example
    Dockerfile
  frontend/
    app/layout.tsx
    app/page.tsx
    app/globals.css
    package.json
    next.config.js
    tailwind.config.ts
    postcss.config.js
    .env.example
docs/
  architecture/
    overview.md
    erd.md
    services.md
```

## Runtime flow

1. PostgreSQL starts from compose with named volume `pg_data`.
2. Backend reads `DATABASE_URL`, opens Postgres, applies pending SQL migrations from embedded files, then listens on `PORT`, fallback `APP_PORT`, fallback `8080`.
3. `/healthz` returns `200` only after migrations succeeded and `SELECT 1` works.
4. Frontend builds with `NEXT_PUBLIC_API_URL`; story components later call backend endpoint and render returned text.

## Backend conventions

- One Go module under `code/backend`.
- One `main` package only: `cmd/api`.
- Use `net/http` routing; no framework until endpoint count or middleware needs justify it.
- Use parameterized SQL through `database/sql` and `github.com/lib/pq`.
- Migrations are timestamped `.up.sql` and `.down.sql`, sorted by filename, tracked in `schema_migrations`.
- Startup fails fast when `DATABASE_URL` missing or migrations fail.
- Health checks include database ping, not process-only checks.
- JSON errors follow service contract in `docs/architecture/services.md`.

## Frontend conventions

- App Router lives under `code/frontend/app`.
- `app/page.tsx` stays composition root. Stories add one import and one element.
- Components use `export default function ComponentName()`.
- Client components start with literal first line `"use client"` when using hooks, events, browser APIs, or function props.
- Shared tokens live only in `app/globals.css`; stories must not add shared tokens.
- CSS modules may use only defined tokens, no hardcoded colors/lengths beyond CI exemptions.

## Environment variables

### Root compose

| Key | Required | Purpose |
|---|---:|---|
| `POSTGRES_USER` | no | Local database user; default `app` |
| `POSTGRES_PASSWORD` | no | Local database password; default `app_secret` |
| `POSTGRES_DB` | no | Local database name; default `app` |
| `BACKEND_PORT` | no | Host port for backend; default `8080` |
| `FRONTEND_PORT` | no | Host port for frontend; default `3000` |
| `NEXT_PUBLIC_API_URL` | no | Browser API base URL for local frontend; default `http://localhost:8080` |

### Backend

| Key | Required | Purpose |
|---|---:|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `PORT` | no | HTTP listen port; runtime injects it |
| `APP_PORT` | no | Legacy fallback when `PORT` absent |

### Frontend

| Key | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_API_URL` | yes | Public API base URL used by browser code |

## Naming

| Thing | Convention |
|---|---|
| API paths | `/v1/...`, no `/api` prefix |
| JSON fields | `camelCase` |
| SQL tables | `snake_case`, plural only when entity is plural by nature |
| Migrations | `YYYYMMDDHHMMSS_description.up.sql` and `.down.sql` |
| React files | PascalCase component files for story components |

## Run

```bash
cp .env.example .env
cp code/backend/.env.example code/backend/.env
cp code/frontend/.env.example code/frontend/.env.local
docker compose --profile local up --build
```

Backend health: `http://localhost:8080/healthz`.
Frontend page: `http://localhost:3000`.

## Local checks

```bash
cd code/backend && go build ./... && go vet ./... && go test ./...
cd code/frontend && npm ci && npm run lint && npm run build && npm test --if-present
```

## Decisions and tradeoffs

| Decision | Kept | Rejected | Tradeoff |
|---|---|---|---|
| Self-migrate on boot | Backend applies migrations before listen | Manual migration step | Slight startup code, but deploy works with empty DB |
| No backend framework | `net/http` | Gin/Echo/Chi | Less dependency surface; add router only when stdlib gets awkward |
| One canonical greeting row | Single row seeded by migration | Seed file or admin write path | Fits SRS; changing copy needs migration or future admin scope |
| Server Component page | Thin App Router composition root | Client page with data state now | Avoids premature client code; story owns fetch UI |
| Tailwind present but minimal | Tokens in globals, Tailwind available | Pure CSS only | Matches project standard while keeping page plain |

## Risks and unknowns

| Risk | Mitigation |
|---|---|
| Stakeholder has not decided exact error copy | Service contract defines stable error envelope; frontend story can choose simple visible error state if needed |
| API base URL differs between local and deployed proxy | Use env var and paths without `/api` prefix in backend contract |
| Greeting row missing or duplicated | Backend story must return error, not blank or ambiguous value |

## Compatibility constraints

- Do not edit committed workflow files.
- Keep frontend `output: "standalone"`; Docker runtime depends on `.next/standalone/server.js`.
- Keep backend buildable with `go build ./...` and one binary build from `./cmd/api`.
- Compose local DB uses profile `local`; deployment injects external `DATABASE_URL`.
