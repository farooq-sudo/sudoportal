# SUDO Portal Backend — Architecture

This document is the design rationale. Read it once before changing anything
non-trivial; it captures the *why* behind the *what* in the code.

## High-level shape

```
                      ┌──────────────────────────────────────┐
                      │      Browser (HTML portals)          │
                      │  HR · PM · TL · Employee · Admin     │
                      └────────────────┬─────────────────────┘
                                       │ HTTPS + Bearer JWT
                                       ▼
                      ┌──────────────────────────────────────┐
                      │   Fastify API (this repo)            │
                      │   /api/v1/*  — all REST + JSON       │
                      └─┬──────────────┬────────────┬────────┘
                        │              │            │
              ┌─────────▼──────┐ ┌─────▼──────┐ ┌───▼─────────────┐
              │  PostgreSQL    │ │ Microsoft  │ │ Future:         │
              │  (own data)    │ │ Graph /    │ │ - ODOO ERP      │
              │                │ │ Entra ID   │ │ - Outbound      │
              └────────────────┘ └────────────┘ │   webhooks      │
                                                │ - Slack / SES   │
                                                └─────────────────┘
```

The HTML portals stay unchanged in this drop. They still load `shared/db.js`
as their data source. Wiring them to call the API instead of reading the
in-memory mock is a focused follow-up.

## Why these choices

### Database: PostgreSQL

- **JSONB** for flexible metadata (notification meta, profileJson, etc.)
  without giving up SQL queryability.
- **Row-level security** is available if we need tenant isolation later
  (single-tenant for now; SUDO is one company).
- **Audit log** is a regular append-only table — fast inserts, indexed by
  `createdAt` and `actorId` for the typical filter patterns. No triggers
  needed because every mutation goes through the API and the API calls
  `audit()`.
- Foreign keys + `ON DELETE CASCADE` on Employee → owned rows mean an
  off-boarded employee's notifications, KPI assignments, etc. all clean
  up automatically.

### API: Fastify + TypeScript

Faster than Express, schema-validating, async-first. The `@fastify/jwt` and
`@fastify/cors` plugins give us auth and CORS as one-liners. Pino logging is
fast and structured.

We don't use GraphQL because:
- Most queries are simple list-by-resource;
- The frontend doesn't need cross-cutting nested fetches; a per-resource REST
  endpoint maps cleanly to each portal page;
- REST means we can test endpoints with `curl` and `fetch()` without a
  schema-aware client.

### ORM: Prisma

Migrations + Studio + a fully-typed client are worth the cost of a heavier
runtime. Prisma queries are slightly slower than raw SQL but the difference
is irrelevant at our scale (89 employees, low write volume).

### Auth: Entra ID OIDC + JWT

Login flow:

1. Browser → `GET /api/v1/auth/login`
2. We build a Microsoft `authorize` URL with scope, state, nonce.
3. Browser redirects to login.microsoftonline.com.
4. Microsoft sends them back to `/api/v1/auth/callback?code=...&state=...`.
5. We exchange the code for an access token via MSAL.
6. We call `POST /me/getMemberGroups` on Graph to read group memberships.
7. We map Entra group IDs (configured via `ENTRA_GROUP_*` env vars) to SUDO
   roles. Multi-group membership = multi-role (HR + Employee, etc.).
8. We upsert the `Employee` row keyed on email, cache the Entra identity,
   audit the login.
9. We mint a 8-hour SUDO JWT and send it back to the browser.
10. Subsequent API calls present `Authorization: Bearer <jwt>` and we validate
    via `@fastify/jwt`.

Why not pass the Entra access token directly? Because:
- The Entra token expires every hour and is large.
- Re-validating it on every API call (network round-trip to Microsoft) is
  expensive.
- Our JWT carries only what we need (sub, email, name, roles), so authz
  decisions don't require a network call.

The trade-off: if you revoke a user's role in Entra, the change takes effect
on next login or after 8 hours, whichever is sooner. Acceptable for an HR
system; not for high-risk systems.

### Role model

5 roles, plus the multi-role observation:

- **ADMIN** — full system, integrations, audit log
- **HR** — all employees, KPI templates, training catalogue, probation decisions
- **PM** — their projects' team members; rate them on projects
- **TL** — their direct reports; approve/validate KPIs
- **EMPLOYEE** — self only

**Most users have multiple roles.** Real example: HR person Justine is also
herself an Employee with her own KPIs and trainings. The role-switcher in
the frontend lets her hop between portals. The backend just sees her JWT
roles array `["HR", "EMPLOYEE"]` and lets each endpoint check what it needs.

Privileged paths (`requireRole("ADMIN", "HR")`) check if ANY of the user's
roles match. Self-scoped paths (read your own KPIs) check `session.sub ===
target.empId`. Team-scoped paths (TL reading their team) query the DB for
the TL's teamId and filter.

### KPI workflow

The most complex piece. Two directions:

**HR_TO_TL** (top-down): HR drafts a KPI for an employee → TL approves it →
employee acknowledges → progress submissions → TL validates.

**TL_TO_HR** (bottom-up): TL drafts an operational KPI → HR acknowledges →
employee acknowledges → as above.

State machine:

```
       (HR drafts)                        (TL drafts)
   ┌───────────────────┐               ┌───────────────────┐
   │ PENDING_VALIDATION│               │ PENDING_VALIDATION│
   └─────────┬─────────┘               └─────────┬─────────┘
             │ TL approves                       │ HR acks
             ▼                                   ▼
   ┌─────────────────────────────────────────────────────┐
   │                       ACTIVE                        │
   │   - waiting for empAcknowledgedAt                   │
   │   - and for current value to flow in                │
   └─────────────┬───────────────────────────────────────┘
                 │ employee submits progress
                 │ (auto KPIs skip this and write currentValue directly)
                 ▼
       ┌─────────────────────────────┐
       │ PROGRESS_PENDING_VALIDATION │
       └─────────────┬───────────────┘
                     │ TL / PM / HR validates
                     ▼
                   ACTIVE  (currentValue updated)
                   ...
                   (cycle close → snapshot to KpiCycleHistory, status → CLOSED)
```

`compositeScore()` (in `kpi.service.ts`) is the single source of truth for
the composite math, mirroring the prototype.

### Audit log

Every mutation calls `audit(prisma, { actorId, actorName, action, target,
metadata, note })`. The Admin Portal's audit page reads from this. We
denormalize `actorName` because the audit list is a hot read and joining to
Employee on every row would slow it down.

### Notifications

Two channels for now:

- **In-portal** — Notification table; the bell badge in each portal reads
  unread count.
- **Slack webhook** — optional, fire-and-forget. Failures here MUST NOT
  block the originating mutation. They're logged at WARN.

Email is sketched (interfaces exist) but not implemented — pick a provider
(SES, SendGrid) and wire nodemailer when you're ready.

### Integrations as named services

`Integration` table holds metadata about each external system (M365, ODOO,
Slack, etc.). Admin Portal flips them on/off. The actual service modules
(`entra.service.ts`, `graph.service.ts`, `odoo.service.ts`,
`webhook.service.ts`) check the relevant env vars to decide if they're
"configured enough" to actually call out. If not, they throw
`ServiceUnavailableError` with a clear message.

### Webhooks

**Outbound** — `WebhookEndpoint` table holds subscribers, `WebhookDelivery`
holds the per-event log. `dispatchWebhook()` enqueues deliveries; a worker
loop (not yet wired) will POST them with HMAC signing + retries. This means
adding a new event type is one line in the producer; subscribers can register
via Admin Portal.

**Inbound** — `/webhooks/inbound/:source` verifies HMAC signature using
`WEBHOOK_SIGNING_SECRET`, then routes to a per-source handler. Today it just
audits and ACKs; real handlers (e.g. ODOO project sync) plug in here.

### What's intentionally not in this drop

- **Frontend ↔ API wiring** — the existing HTML still uses `SUDO_DB` in
  memory. Replacing those reads with `fetch('/api/v1/...')` calls is a
  separate session.
- **Real Microsoft Graph calls** — auth flow is real, ongoing calls
  (calendar create, send mail, list users) are stubs.
- **ODOO** — typed interface only.
- **Outbound webhook delivery worker** — entries are written to
  `WebhookDelivery` but nothing dispatches them yet.
- **Production deployment** — Docker Compose works for dev/staging. For prod
  on AWS, add: RDS PostgreSQL, ECS or Fargate for API, ALB, ACM cert.
- **Background job runner** — the `ScheduledJob` table exists; a worker
  process to pick from it would handle nightly Entra sync, KPI reminders,
  cycle-close triggers.

## File layout

```
sudo-portal-backend/
├── README.md                ← user-facing setup guide
├── ARCHITECTURE.md          ← you are here
├── .env.example             ← every env var with comments
├── package.json             ← npm workspace root
├── docker-compose.yml       ← dev: db + api + adminer
├── docker-compose.staging.yml ← staging: also seeds dummy data
├── scripts/
│   ├── setup.sh             ← first-time install on a server
│   └── seed-staging.sh      ← drop+recreate+seed for staging
└── apps/api/
    ├── package.json
    ├── tsconfig.json
    ├── Dockerfile
    ├── prisma/
    │   ├── schema.prisma    ← every model in one file
    │   ├── seed.ts          ← reads JSON, upserts, idempotent
    │   └── seed-data/       ← JSON fixtures (89 emps, 7 teams, etc.)
    ├── src/
    │   ├── server.ts        ← Fastify entry point
    │   ├── config.ts        ← typed env loader (Zod-validated)
    │   ├── plugins/
    │   │   ├── prisma.ts    ← decorates app.prisma
    │   │   ├── auth.ts      ← @fastify/jwt + requireAuth/requireRole
    │   │   └── cors.ts
    │   ├── services/        ← reusable business logic
    │   │   ├── entra.service.ts       ← MSAL OIDC
    │   │   ├── graph.service.ts       ← Microsoft Graph wrapper (stubs)
    │   │   ├── kpi.service.ts         ← composite + status math
    │   │   ├── audit.service.ts
    │   │   ├── notification.service.ts
    │   │   ├── odoo.service.ts        ← STUB
    │   │   └── webhook.service.ts
    │   ├── routes/          ← REST handlers, one file per resource
    │   │   ├── auth.routes.ts
    │   │   ├── employees.routes.ts
    │   │   ├── teams.routes.ts
    │   │   ├── kpi.routes.ts
    │   │   ├── training.routes.ts
    │   │   ├── onboarding.routes.ts
    │   │   ├── probation.routes.ts
    │   │   ├── project-ratings.routes.ts
    │   │   ├── audit.routes.ts
    │   │   ├── notifications.routes.ts
    │   │   ├── admin.routes.ts
    │   │   ├── m365.routes.ts
    │   │   └── webhooks.routes.ts
    │   └── utils/
    │       ├── errors.ts    ← AppError + typed subclasses
    │       └── logger.ts
    └── tests/
        └── smoke.test.ts    ← inject-based end-to-end checks
```

## How to add a new feature

A worked example: "Add an /api/v1/expenses module."

1. Add the Expense model to `prisma/schema.prisma`. Run `npm run
   db:migrate:dev -- --name add_expenses`.
2. Create `src/routes/expenses.routes.ts` following the pattern from
   `training.routes.ts`: list, single, create, update, with role guards.
3. Register it in `server.ts`:
   `await app.register(expensesRoutes, { prefix: "/api/v1/expenses" });`
4. Add a JSON fixture under `prisma/seed-data/expenses.json` and a `seedExpenses()` 
   call in `prisma/seed.ts`.
5. (Optional) Add a smoke test.
6. Done — `docker compose restart api` picks it up.
