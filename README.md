# SUDO Consultants Employee Portal

Full-stack employee portal for SUDO Consultants (UAE / KSA, AWS Advanced Tier Partner). Five role-based portals (Admin, HR, PM, Team Lead, Employee) backed by a PostgreSQL database, a Fastify REST API, and Microsoft Entra ID single sign-on.

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Browser  ──HTTPS──►  nginx ──┬──►  static HTML portals (apps/web) │
│                                │                                    │
│                                └──►  /api/v1/* → Fastify (apps/api) │
│                                                        │            │
│                                                        ▼            │
│                                                    PostgreSQL       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## What's in this repo

| Path                   | What it is                                                |
| ---------------------- | --------------------------------------------------------- |
| `apps/web/`            | The 5 HTML portals + shared JS/CSS (Admin, HR, PM, Employee, TL) |
| `apps/api/`            | Fastify backend, Prisma schema, seed data                 |
| `nginx/`               | Reverse-proxy + static-host config                        |
| `docker-compose.yml`   | One-command stack: postgres + api + nginx                 |
| `scripts/`             | Setup + staging helpers                                   |
| `.github/workflows/`   | CI: typecheck + tests on every PR                         |

## Stack at a glance

| Concern        | Choice                                         |
| -------------- | ---------------------------------------------- |
| Database       | PostgreSQL 16                                  |
| API            | Node 20 + TypeScript + Fastify 4               |
| ORM            | Prisma 5                                       |
| Auth           | Microsoft Entra ID OIDC (MSAL Node) + JWT      |
| M365           | Microsoft Graph SDK                            |
| Frontend       | Static HTML / vanilla JS / no build step       |
| Reverse proxy  | Nginx                                          |
| Container      | Docker Compose                                 |

## Install on a fresh server (Ubuntu 22.04+, 4GB RAM, Docker)

```bash
# 1. Install Docker if not present
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# log out / back in for group change

# 2. Clone (private repo — use SSH key or personal access token)
git clone git@github.com:sudoconsultants/sudo-portal.git
cd sudo-portal

# 3. Configure environment
cp .env.example .env
nano .env       # fill in DATABASE_URL, JWT_SECRET, ENTRA_*

# 4. First install — bootstraps DB + creates initial migration + seeds demo data
./scripts/first-install.sh

# 5. After first install creates the migration files, commit them so future
#    deploys don't have to regenerate:
git add apps/api/prisma/migrations/
git commit -m "Add initial database migration"
git push

# 6. Start everything
docker compose up -d

# 7. Verify
curl http://localhost/api/v1/health
# → { "status": "ok", "db": "connected", "version": "0.1.0" }
#
# Then open http://<server-ip>/ in a browser to see the portal launcher.
```

## Day-to-day commands

```bash
# Start / stop the whole stack
docker compose up -d
docker compose down

# Tail API logs
docker compose logs -f api

# Run a one-off DB command (e.g. open Prisma Studio at :5555)
docker compose exec api npm run db:studio

# Apply pending migrations after pulling new commits
docker compose exec api npm run db:migrate

# Reset the entire DB (DESTRUCTIVE — drops every table, re-runs migrations, re-seeds)
docker compose exec api npm run db:reset

# Re-seed staging data (preserves existing rows, only adds missing ones)
docker compose exec api npm run db:seed

# Wipe and re-seed everything (DESTRUCTIVE — only works if ALLOW_DESTRUCTIVE_SEED=true)
docker compose exec api npm run db:seed:reset

# Run smoke tests
docker compose exec api npm test
```

## Microsoft 365 / Entra ID setup

The portal uses Microsoft Entra ID OIDC for single sign-on. Every user signs in with their @sudoconsultants.com (or tenant) account. Group memberships map to SUDO roles.

### 1. Register an app in Azure

1. Azure portal → **Entra ID** → **App registrations** → **New registration**
2. Name: `SUDO Portal` (or similar)
3. Supported account types: **Accounts in this organizational directory only**
4. Redirect URI: **Web** → `https://your-domain.com/api/v1/auth/callback` (for local dev, `http://localhost/api/v1/auth/callback`)
5. Register

### 2. Add a client secret

**Certificates & secrets** → **New client secret** → 24 months → copy the **value** (you only see it once) → paste into `.env` as `ENTRA_CLIENT_SECRET`.

### 3. Grant API permissions

**API permissions** → **Add a permission** → **Microsoft Graph** → **Delegated**:

| Permission              | Why                                              |
| ----------------------- | ------------------------------------------------ |
| `User.Read`             | Sign-in basics                                   |
| `User.Read.All`         | Directory sync (admin consent required)          |
| `Group.Read.All`        | Role group mapping (admin consent required)      |
| `Calendars.ReadWrite`   | 1:1 scheduling, training reminders               |
| `OnlineMeetings.ReadWrite` | Create Teams meetings                          |
| `Mail.Send`             | Notification emails                              |

Then **Grant admin consent for <tenant>**.

### 4. Create role groups in Entra

In **Entra ID** → **Groups**, create five security groups and copy each Object ID into `.env`:

| Group name               | Env var               |
| ------------------------ | --------------------- |
| `SUDO Portal — Admin`    | `ENTRA_GROUP_ADMIN`   |
| `SUDO Portal — HR`       | `ENTRA_GROUP_HR`      |
| `SUDO Portal — PM`       | `ENTRA_GROUP_PM`      |
| `SUDO Portal — Team Lead`| `ENTRA_GROUP_TL`      |
| `SUDO Portal — Employee` | `ENTRA_GROUP_EMPLOYEE`|

Add users to the appropriate groups. A user can belong to multiple — Justine (HR) is also in the Employee group; Fatima (PM) is in PM, TL, and Employee.

### 5. Sign-in flow

1. User clicks **Sign in with Microsoft** at the launcher
2. Browser → `GET /api/v1/auth/login` → redirects to Microsoft
3. User authenticates against `login.microsoftonline.com`
4. Microsoft redirects to `ENTRA_REDIRECT_URI?code=...`
5. API exchanges code via MSAL, fetches the user's group IDs via Graph
6. API maps groups to SUDO roles, upserts the Employee row, **fetches the user's M365 profile photo** (first login only), issues a SUDO JWT
7. Frontend receives the JWT and uses it for subsequent API calls

## Configuration reference

Critical environment variables (see `.env.example` for the full list):

| Variable                  | Purpose                                            |
| ------------------------- | -------------------------------------------------- |
| `DATABASE_URL`            | Postgres connection string                         |
| `JWT_SECRET`              | 64+ random hex chars (`openssl rand -hex 64`)      |
| `ENTRA_TENANT_ID`         | Your Microsoft tenant GUID                         |
| `ENTRA_CLIENT_ID`         | App registration client ID                         |
| `ENTRA_CLIENT_SECRET`     | App registration secret value                      |
| `ENTRA_REDIRECT_URI`      | OAuth callback URL                                 |
| `ENTRA_GROUP_*`           | Object IDs of role groups                          |
| `M365_GRAPH_SCOPES`       | Space-separated Graph scopes                       |
| `WEBHOOK_SIGNING_SECRET`  | HMAC secret for inbound/outbound webhooks          |
| `CORS_ORIGINS`            | Comma-separated allowed origins                    |
| `ALLOW_DESTRUCTIVE_SEED`  | Set to `true` only on dev/staging                  |

## Staging vs production

| Concern              | Dev / Staging                          | Production                               |
| -------------------- | -------------------------------------- | ---------------------------------------- |
| TLS                  | none (http://localhost)                | terminate at front load balancer         |
| Database             | local Docker postgres                  | AWS RDS / Aurora (with backups)          |
| Seed data            | demo dataset (89 employees)            | empty — created via Entra sync           |
| `ALLOW_DESTRUCTIVE_SEED` | `true`                             | **`false`** — never reset prod          |
| `NODE_ENV`           | `development`                          | `production`                             |
| Secrets              | `.env` file                            | AWS Secrets Manager / Vault              |
| Backups              | none                                   | RDS automated, daily snapshot            |

## Demo accounts (seeded)

After `db:seed`, the prototype's demo personas are loaded:

| Name              | Email                            | Roles                  |
| ----------------- | -------------------------------- | ---------------------- |
| M. Farooq         | m.farooq@sudoconsultants.com     | Admin                  |
| Justine           | justine@sudoconsultants.com      | HR + Employee          |
| Khalid Mansour    | khalid.m@sudoconsultants.com     | TL (PS) + Employee     |
| Fatima Al Zaabi   | fatima.z@sudoconsultants.com     | PM + TL + Employee     |
| Reem Al Otaibi    | reem.o@sudoconsultants.com       | Employee               |

In `NODE_ENV=development`, you can sign in as any of these via `POST /api/v1/auth/dev-login` with `{ "email": "..." }` — useful before Entra is wired.

## What's complete

- ✅ Full Prisma schema (~25 models, RLS-compatible, JSONB columns)
- ✅ REST API: auth, employees, teams, KPI (full bidirectional flow), training, onboarding, probation, project ratings, audit, notifications, admin, m365 proxy, webhooks
- ✅ Microsoft Entra ID OIDC login flow (MSAL Node) + JWT bearer auth
- ✅ Microsoft Graph SDK wired for group fetching + profile photo backfill
- ✅ Profile photo upload (data URI, 2MB cap, audit-logged, self-or-Admin/HR permission)
- ✅ All 5 HTML portals (Admin, HR, PM, TL, Employee) with role switching
- ✅ Charts, drill-downs, layout customization, role switcher across all portals
- ✅ Seed mechanism with `--reset` flag gated by `ALLOW_DESTRUCTIVE_SEED=true`
- ✅ Audit logging on every mutation
- ✅ Docker Compose for one-command up/down
- ✅ CI workflow (typecheck + tests on every PR)

## What's deferred (clearly marked stubs)

- ⏳ ODOO integration — typed interface, methods throw "not yet implemented"
- ⏳ Outbound webhook dispatcher — DB row created on send, HTTP delivery loop not wired
- ⏳ Microsoft Graph calendar/mail/listUsers — auth flow real, these specific endpoints have TODO stubs
- ⏳ Frontend ↔ API wiring — portals still use the in-memory `SUDO_DB`; swap `shared/db.js` references for `fetch('/api/v1/...')` calls. The API contracts are stable and tested.
- ⏳ Background job runner for nightly Entra sync + scheduled reminders

## Project structure

```
sudo-portal/
├── apps/
│   ├── api/                  # Fastify backend
│   │   ├── src/
│   │   │   ├── server.ts     # Entry point
│   │   │   ├── config.ts     # Zod-validated env
│   │   │   ├── plugins/      # cors, prisma, auth
│   │   │   ├── routes/       # 13 REST resources
│   │   │   ├── services/     # entra, graph, kpi, audit, notification, webhook, odoo
│   │   │   └── utils/        # logger, errors
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── seed-data/    # 10 JSON files
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── web/                  # HTML portals
│       ├── index.html        # Launcher
│       ├── shared/           # Shared JS/CSS
│       ├── admin/
│       ├── hr/
│       ├── pm/
│       ├── employee/
│       └── team_lead/
├── nginx/
│   └── default.conf          # Reverse proxy + static config
├── scripts/
│   ├── first-install.sh      # Bootstrap a fresh server
│   ├── setup.sh              # Routine install (migrations already in git)
│   └── seed-staging.sh       # Wipe + reseed staging
├── .github/workflows/ci.yml
├── docker-compose.yml
├── docker-compose.staging.yml
├── .env.example
├── ARCHITECTURE.md
└── README.md
```

## License

Proprietary — SUDO Consultants internal use only. See `LICENSE`.
