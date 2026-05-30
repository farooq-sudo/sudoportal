# Project State — Honest Status

## What works end-to-end (you can use today)

**Backend API — 100% type-safe, builds clean, 25 route files, 66 models**

Verified: `npx tsc --noEmit` → 0 errors. `npx tsc -p tsconfig.json` → clean `dist/`.

### Route inventory (25 files)

| Route | Models touched | Status |
|---|---|---|
| auth | Employee, EntraIdentity, UserSession | Production-ready (MSAL Node + Graph) |
| employees | Employee | Full CRUD + photo upload |
| profiles | EmployeeProfile | Full PII read/update with field-level locking |
| teams | Team | Full CRUD |
| org | Department, Position, EmploymentRecord | Full CRUD + promotion/transfer workflow |
| kpi | KpiCycle, Section, Template, Assignment, Acknowledgement, History | Full bidirectional approval workflow |
| leave | LeavePolicy, LeaveBalance, LeaveRequest, LeaveApproval | Full multi-step approval workflow |
| training | TrainingCatalogue, TrainingAssignment | Assign, complete, verify |
| onboarding | OnboardingPlan, OnboardingStep | Step-by-step tracking |
| probation | ProbationCase | PM/TL endorse → HR decide |
| project-ratings | ProjectRating | PM rate → TL endorse → HR finalise |
| projects | Project, ProjectAssignment, ProjectMilestone, Timesheet | Full CRUD |
| documents | Document, DocumentSignature | Upload, sign with sha256 hash, revoke |
| requests | Request, RequestApproval | Unified workflow w/ approval chains |
| exports | DataExport | Request, status, download, worker callback |
| compensation | SalaryRecord, AllowanceItem, PayrollAdjustment, BankAccount | Append-only salary history |
| family | FamilyMember, InsurancePolicy, InsuranceDependent | Self + HR management |
| people | Recognition, FeedbackSession, OneOnOneNote, Badge, BadgeAward | Wall, 1:1 notes w/ visibility |
| lifecycle | AirTicketAllowance, AirTicketUsage, OffboardingCase, BackgroundCheck | Full lifecycle |
| permissions | Permission, RoleDefinition, RolePermission | Admin-only |
| audit | AuditLog | Filterable read |
| notifications | Notification | Read, mark-read, broadcast |
| admin | UserSession, SystemConfig, Integration, BackupRecord | Admin dashboard data |
| m365 | EntraIdentity | Graph stubs (sync works; calendar/mail TODO) |
| webhooks | WebhookEndpoint, WebhookDelivery | Outbound delivery |

### What runs on `docker compose up -d`

1. Postgres 16 starts on :5432
2. API container runs `npx prisma migrate deploy` then `npm start`
3. Nginx serves the frontend on :80 + proxies `/api/*` → api:3000
4. Adminer optional on :8080 for DB inspection

### Where actual data lives today

- **Backend**: Postgres tables — all 66 models reachable via API
- **Frontend**: Still uses `apps/web/shared/db.js` (the in-memory `SUDO_DB` object) for everything except auth

## What is NOT done — frontend rewiring

The 5 HTML portals (Admin, HR, PM, TL, Employee — 66 pages, ~18K lines of JS) still call `SUDO_DB.something` instead of `fetch('/api/v1/...')`. The backend is ready to receive those calls; the frontend hasn't been updated to make them.

**This is the work that remains for a true "complete working project".** I cannot complete it in this session because:

- ~18,000 lines of frontend JS reference `SUDO_DB.<table>` throughout
- Each page has its own render + filter + edit handlers tied to that shape
- The API response shapes don't always match the in-memory shape (e.g. flat `employees` vs nested includes)
- Optimistic UI, error handling, loading states need to be added per call site
- Auth tokens need to be passed in every request

Realistic estimate: 5-8 sessions to wire all 66 pages properly. I'd rather be honest about that than push a half-wired mess.

## What you can do right now

1. **Deploy backend + DB** — `docker compose up -d` then test with curl/Postman against the 25 route groups
2. **Use the frontend as a demo** — it works against the in-memory data exactly as it did before
3. **Wire pages one at a time** — replace `SUDO_DB.x` calls with `fetch('/api/v1/x')` per page, gradually

## Known gaps (besides frontend wiring)

- `seed.ts` needs update for the new 66-model schema (old JSON uses 24-model shape)
- ODOO integration is stubbed (`OdooClient` interface defined, methods throw "not implemented")
- Webhook outbound delivery loop is partial (DB row created, no HTTP retry worker)
- Graph endpoints for calendar/mail are TODO (auth + photo backfill work)
- Background job runner (the actual worker that consumes ScheduledJob) is not started
- RLS policies are documented but no SQL migration writes them
