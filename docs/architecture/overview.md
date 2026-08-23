# Architecture Overview — hello-word-7

## 1. Scope

This project is fullstack: Next.js frontend, Go backend, PostgreSQL database. It proves end-to-end delivery by storing one greeting in the database, serving it through HTTP, and rendering it centered on one page.

Product feature work is intentionally not implemented in scaffold. Scaffold only proves each layer can build, lint, start, connect to its dependency, and accept later story code.

## 2. Stack

| Layer | Choice | Version | Reason |
|---|---|---:|---|
| Frontend | Next.js App Router + TypeScript | 15.x | Default stack; server components by default; small one-page app |
| Styling | Tailwind CSS | 3.x | Default styling stack; tokenized CSS in `app/globals.css` |
| Backend | Go HTTP server | 1.22 | Default backend stack; small binary; stdlib server |
| Database | PostgreSQL | 16 via compose | Required by SRS for persisted greeting row |
| Driver | `github.com/jackc/pgx/v5/stdlib` | pinned by `go.mod` | PostgreSQL access through `database/sql` with maintained driver |
| Local run | Docker Compose | existing repo convention | Boots database, backend, frontend together |
| CI | `.github/workflows/ci.yml` | committed | Runs Go build/vet/test, frontend install/lint/build/test, CSS token checks |

## 3. Repository layout

```text
docs/
  architecture/
    overview.md
    erd.md
    services.md
  general/
    SRS.md
code/
  backend/
    cmd/api/main.go
    internal/migrations/migrations.go
    internal/migrations/*.sql
    go.mod
    go.sum
    .env.example
    Dockerfile
  frontend/
    app/layout.tsx
    app/page.tsx
    app/globals.css
    package.json
    package-lock.json
    next.config.js
    tailwind.config.ts
    postcss.config.js
    tsconfig.json
    .eslintrc.json
    .env.example
    Dockerfile
```

## 4. Runtime data flow

1. Browser loads Next.js page.
2. Story component calls backend endpoint through `NEXT_PUBLIC_API_URL`.
3. Backend queries PostgreSQL with `DATABASE_URL`.
4. Backend returns JSON response.
5. Frontend renders returned text, centered by component CSS using global tokens.

No browser write path exists. No auth exists. No caching of greeting exists because SRS requires storage failures to return errors, not stale data.

## 5. Backend conventions

- One Go module lives at `code/backend`.
- One `main` package lives at `code/backend/cmd/api`.
- HTTP handlers stay close to `cmd/api` until project grows beyond one resource.
- Shared backend code goes under `internal/`.
- Database access uses `database/sql` with parameterized queries.
- Server reads `DATABASE_URL`, then applies migrations, then starts listening.
- Port selection order: `PORT`, `APP_PORT`, then `8080`.
- `/healthz` returns 200 only after migrations succeed and `SELECT 1` succeeds.
- External errors return generic JSON; logs keep internal detail.
- Requests use context timeouts for database work.

## 6. Migration conventions

- Migrations live in `code/backend/internal/migrations` beside embed declaration.
- Filenames sort lexicographically and use paired `.up.sql` / `.down.sql` files.
- Boot applies every pending `.up.sql` migration in filename order.
- Applied versions are stored in `schema_migrations(version text primary key, applied_at timestamptz not null default now())`.
- Re-running the server is no-op after migrations are applied.
- Down migrations are tracked for rollback documentation, not run automatically.

## 7. Frontend conventions

- Next.js App Router lives at `code/frontend/app`.
- `app/page.tsx` is composition root only. Later stories add imports and child elements there.
- Components use `export default function ComponentName()`.
- Server components stay default. Any component using state, effects, event handlers, refs, or browser APIs must begin with literal first line `"use client"`.
- Shared design tokens live only in `app/globals.css` and cover colour, spacing, typography, radius, shadow, and motion.
- CSS modules may use only tokens from `globals.css`; no hardcoded colors, large pixel lengths, or token fallbacks.
- Frontend feature mocks, if any, live under `code/frontend/lib/mock` and are deleted when API integration lands.

## 8. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Go package | lowercase, short | `migrations` |
| Migration version | timestamp + slug | `20250214000000_create_greetings.up.sql` |
| Endpoint path | versioned, no `/api` prefix | `/v1/greeting` |
| JSON fields | camelCase | `displayText` |
| React component file | PascalCase | `GreetingDisplay.tsx` |
| CSS token | semantic kebab-case | `--color-bg` |
| Env var | upper snake case | `DATABASE_URL` |

## 9. Environment variables

### Root compose `.env`

| Key | Used by | Required | Notes |
|---|---|---|---|
| `POSTGRES_USER` | db | yes | Local compose database user |
| `POSTGRES_PASSWORD` | db | yes | Local compose password; never commit real value |
| `POSTGRES_DB` | db | yes | Local compose database name |
| `DATABASE_URL` | backend | yes | Runtime injects in deployed environment; compose sets service URL |
| `PORT` | backend | yes | Backend listen port, usually `8080` |
| `NEXT_PUBLIC_API_URL` | frontend | yes | Browser-visible backend base URL |

### Backend `.env.example`

| Key | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `PORT` | yes | HTTP listen port |
| `APP_PORT` | no | Backward-compatible port fallback |

### Frontend `.env.example`

| Key | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | Browser-visible backend base URL |

## 10. Local run

1. Copy `.env.example` to `.env`.
2. Run `docker compose up --build` from repo root.
3. Open frontend at `http://localhost:3000`.
4. Backend health is `http://localhost:8080/healthz`.

## 11. Local checks

Backend:

```bash
cd code/backend
go build ./...
go vet ./...
go test ./...
```

Frontend:

```bash
cd code/frontend
npm ci
npm run lint
npm run build
npm test --if-present
```

## 12. Decisions

| Decision | Rejected alternative | Tradeoff |
|---|---|---|
| Use fullstack shape | Static page with hardcoded text | More moving parts, but SRS explicitly requires database-backed API |
| Backend self-applies migrations on boot | Manual migration command | Slight startup work, but runtime starts from empty database |
| Use `database/sql` with pgx stdlib | ORM or query builder | Less abstraction and fewer dependencies, enough for one table |
| Keep `page.tsx` empty composition root | Build finished greeting UI in scaffold | Avoids story merge conflicts and keeps scaffold non-feature |
| Use `/v1/...` paths without `/api` | Mount routes under `/api` | Matches deploy proxy and review convention |
| Use tokenized global CSS | Inline hardcoded values | Slight upfront token work, prevents CI token failures |
| No frontend test framework yet | Add Jest/Vitest scaffold | `npm test --if-present` passes; add tests when story has logic to test |

## 13. Risks and constraints

| Risk | Mitigation |
|---|---|
| Empty database at first boot | Self-migrations create schema and seed canonical row |
| Database outage | Health check fails; API returns error envelope instead of cached data |
| Story authors editing shared CSS | `globals.css` is frozen after scaffold; stories use tokens only |
| Wrong public API URL in browser | `NEXT_PUBLIC_API_URL` documented in root and frontend env examples |
| CI mismatch with scaffold | Scaffold follows committed CI commands and Dockerfile expectations |

## 14. Unknowns

- Exact frontend error message awaits story implementation and stakeholder decision from SRS open question.
- No auth, admin edit path, localization, analytics, or caching exists unless future scope adds it.
