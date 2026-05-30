# Changelog

## v1.6.0 — CI typecheck fixes (2026-05-29)

GitHub CI (which generates the real Prisma client) caught 20 type errors that
the local sandbox could not, because the route code had been written against an
older KPI/onboarding/probation schema than the one in the repo. All fixed and
verified against a schema-faithful Prisma client type stub (CI-parity):

- **kpi.service.ts** — `KpiDirection` now includes `BOOLEAN_DONE`; `TemplateLike.direction` non-null
- **kpi.routes.ts** — field names aligned to schema: `approvedBy`/`approvedAt`,
  `validatorEmpId`, `currentValue`/`lastProgressAt`/`lastProgressBy`,
  `progressNote`; status `PROGRESS_PENDING_VALIDATION`; reject → `DRAFT` +
  `rejectedBy`/`rejectionReason`; `sectionsJson`; dropped non-existent
  `empAcknowledgedAt`/`hrNote`/`tlNote`; new drafts start `PENDING_APPROVAL`
- **employees.routes.ts** — `EmployeeStatus` enum corrected (`CONFIRMED` + full
  set), `teamRole` adds `HR_BUSINESS_PARTNER`, roles add FINANCE/RECRUITER/AUDITOR,
  dropped non-field `profileJson`, explicit data mapping (fixes `teamId` null type)
- **admin.routes.ts** — `config` → `configJson`
- **onboarding.routes.ts** — create adds required `category` + `status`;
  `note` → `notes`; status enum corrected (no `PENDING`)
- **probation.routes.ts** — `outcome`/`decidedBy`/`decidedAt`; outcome `FAIL` (not `TERMINATE`)
- **project-ratings.routes.ts** — `hrFinalisedAt`, `FINALISED` (British spelling per schema)
- **training.routes.ts** — `scorePct`, `evidenceUrl`
- **leave.routes.ts** — Decimal `days` wrapped with `Number()` for atomic increments
- **package.json** — added missing deps: `@fastify/swagger`, `@fastify/swagger-ui`,
  `nodemailer`, `@types/nodemailer`


## v1.5.0 — Write actions wired (2026-05-29)

Connected the high-value workflow buttons across all portals to their real API
endpoints (previously they showed toast messages only). Each calls the API,
then re-hydrates the affected dataset and re-renders.

**Wired actions:**
- **Employee** — "Request leave" now creates + submits a real LeaveRequest via
  `api.leave.createRequest()` + `submitRequest()`
- **HR** — approve/deny leave (`api.leave.decide`), approve/reject KPI assignment
  (`api.kpi.approve/reject`), verify/reject certificate (`api.training.verify/reject`),
  start background check (`api.lifecycle.requestBgCheck`)
- **Team Lead** — approve HR-drafted KPI (`api.kpi.approve`), confirm/validate
  progress (`api.kpi.validate`)
- **PM** — confirm/validate KPI progress (`api.kpi.validate`)
- **Admin** — run backup (`api.system.triggerBackup`), manual export
  (`api.exports.request`) [from v1.4]

**Supporting changes:**
- Added `data-leave-id` to HR leave approve/deny buttons
- Added `refreshAndRerender()` + `fadeRow()` helpers to HR dashboard
- Enriched `serializeRole()` with color/entraGroup/members so the admin roles
  matrix renders correctly from API data
- All write handlers degrade gracefully: if `window.api` is absent they fall
  back to the original optimistic local update

**Verified:** headless-browser tests confirm `api.leave.createRequest`,
`submitRequest`, and `api.leave.decide` all fire correctly with zero page errors.
Backend builds at 0 TypeScript errors.

---


## v1.3.0 — Pending tasks knocked off (2026-05-28)

### Database

- **`seed.ts` rewritten** for the 73-model schema. Now seeds:
  - 5 departments (Executive, Cloud Engineering, Advisory, People Ops, Finance & Admin)
  - 19 positions (CEO → Junior Cloud Engineer, all job families)
  - 12 holidays for 2026 (UAE + KSA, including Eid Al Fitr/Adha, Saudi National Day, UAE National Day)
  - 9 leave policies (Annual, Sick, Maternity, Paternity, Compassionate, Hajj, Study, WFH, Comp Off)
  - 32 permissions across 8 categories
  - 8 role definitions (ADMIN, HR, PM, TL, EMPLOYEE, FINANCE, RECRUITER, AUDITOR)
  - ~80 permission grants distributed across roles
  - 8 notification templates (mustache-style)
  - 7 system config defaults (KPI weighting, leave year, probation duration, session TTL, etc.)
  - 5 integration registry entries (M365 connected, others disconnected)
  - 6 default badges
  - Plus all sample data from JSON fixtures

### Background worker

- **New `worker.ts`** — processes the `ScheduledJob` queue with 6 handlers:
  - `data.export` — generates export files (placeholder URL for now; row counting works)
  - `db.backup` — marks backups complete (real `pg_dump` deferred to deploy)
  - `integration.sync` — dispatches per-integration sync logic
  - `kpi.cycle.close` — freezes assignments into KpiCycleHistory at cycle end
  - `notification.retry` — retries stuck out-of-app deliveries
  - `webhook.retry` — retries failed WebhookDelivery rows with exponential backoff

- **Retry semantics:** exponential backoff capped at 5 min, max attempts configurable per job
- **Concurrency:** single process by default; scale with `docker compose up -d --scale worker=3`
- **Race-safe:** atomic claim via `updateMany WHERE status='pending'` (no two workers run the same job)
- **Graceful shutdown:** SIGINT/SIGTERM finish in-flight jobs before exit

### Infrastructure

- **`docker-compose.yml`** adds the `worker` service alongside `api`
- **`package.json`** new scripts: `worker`, `worker:dev`, `db:init` (uses `prisma db push` for first-time setup without migration files)
- **RLS policies** added at `db/rls-policies.sql` — 14 policies covering EmployeeProfile (PII), SalaryRecord, BankAccount, FamilyMember, Document, AuditLog, LeaveRequest, Notification, UserSession, ApiKey, MfaDevice, LoginAttempt, BackgroundCheck, OneOnOneNote
  - Helper functions: `app_current_user()`, `app_has_role(role)`, `app_is_admin()`, `app_is_hr()`
  - Read by `current_setting('app.current_user_id')` set per-request by Fastify auth plugin
  - Defence-in-depth: route handlers also enforce equivalent checks

## v1.2.0 — More routes, gap fixes (2026-05-28)

[unchanged — see previous]

## v1.1.0 — Complete production schema (2026-05-27)

[unchanged — see previous]

## v1.0.0 — Initial release (2026-05-26)

[unchanged — see previous]
