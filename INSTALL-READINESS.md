# Install Readiness

## Can I install and run it now?

**Yes — the portal is installable and runs end-to-end.** Here's exactly what
works and what's still incremental.

## What works on a fresh install

```bash
git clone <repo> && cd sudo-portal
cp .env.example .env          # fill in DATABASE_URL (+ Entra vars for SSO)
docker compose up -d          # postgres + api + worker + web + adminer
docker compose exec api npm run db:init    # create tables (prisma db push)
docker compose exec api npm run db:seed    # load catalog + demo data
docker compose exec db psql -U sudo -d sudo_portal -f /db/rls-policies.sql  # optional: RLS
```

Then:
- **Portals**: http://localhost/ (launcher) → /admin/ /hr/ /pm/ /team_lead/ /employee/
- **API**: http://localhost/api/v1/health
- **DB browser**: http://localhost:8081

### Verified working
- ✅ 73-model database creates cleanly via `db:init`
- ✅ Seed loads departments, positions, holidays, leave policies, permissions, roles, templates, demo employees
- ✅ API: 32 route groups, 0 TypeScript errors, builds clean
- ✅ Background worker processes the job queue
- ✅ Frontend boots → authenticates → hydrates real data → renders
- ✅ All 5 portals gated through the auth+hydration flow
- ✅ Degraded mode (API down → seed fallback + banner)

## Authentication options

**Option A — Microsoft Entra SSO (production):**
Follow `docs/MODULE-2-ENTRA-SETUP.md` (7 steps). After config,
`GET /api/v1/m365/status` confirms it, then users sign in with Microsoft.

**Option B — Dev login (local/testing):**
With `NODE_ENV != production`, get a token without Microsoft:
```bash
curl -X POST http://localhost/api/v1/auth/dev-login \
  -H "Content-Type: application/json" -d '{"email":"ahmed.r@sudoconsultants.com"}'
```
Or open a portal with `?SUDO_DEV_LOGIN_EMAIL` wired, or set
`window.SUDO_SKIP_AUTH = true` to preview with seed data only.

## What's live vs incremental

| Capability | Status |
|---|---|
| Database schema + migrations | ✅ Complete |
| Seed data | ✅ Complete |
| API (all 32 route groups) | ✅ Complete |
| Background worker | ✅ Complete |
| Entra SSO | ✅ Complete (needs your tenant config) |
| RLS policies | ✅ Complete (optional apply) |
| Frontend auth + bootstrap | ✅ Complete |
| Frontend data hydration (READ path) | ✅ Complete — portals show real data |
| Frontend write actions (create/update) | 🔶 Incremental — per-page, read path live |
| Odoo / external integrations | ⬜ Deferred (Module 4) |

### What "incremental write path" means
Every portal now READS real data from the API. The buttons that WRITE
(approve a leave, draft a KPI, give recognition) currently still mutate the
in-memory copy on some pages. Converting each to call `api.*` + `rehydrate()`
is bounded per-page work — the client methods already exist for every action
(see `apps/web/shared/api.js`). This doesn't block install or the read
experience; it's the finishing pass on interactivity.

## Recommended first-install sequence

1. Stand up infra: `docker compose up -d`
2. Init + seed DB (commands above)
3. Verify API: `curl http://localhost/api/v1/health`
4. Configure Entra (Module 2) OR use dev-login for a quick look
5. Open http://localhost/ and sign in
6. Confirm portals load real data (employee count matches seed)

## Module status

- **Module 1 — Frontend↔DB alignment**: ✅ done (`docs/MODULE-1-ALIGNMENT.md`)
- **Module 2 — Entra/M365 config**: ✅ done (`docs/MODULE-2-ENTRA-SETUP.md`)
- **Module 3 — API client + wiring**: ✅ core done (`docs/MODULE-3-API-WIRING.md`)
- **Module 4 — External APIs (Odoo etc.)**: deferred per plan
