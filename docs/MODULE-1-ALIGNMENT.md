# Module 1 — Frontend ↔ Database Alignment

Status: **in progress**

This document maps every data shape the frontend portals consume to the
database schema, and records how the API serializes between them. When every
row in the tables below is ✅, Module 1 is complete and we can safely wire the
frontend to the API (Module 3).

## Approach

The frontend prototype uses **denormalized, display-friendly** fields
(`employee.dept = "Cloud Engineering"`, `employee.status = "Confirmed"`).
The database uses **normalized FKs + enums** (`departmentId = "DEPT-CE"`,
`status = CONFIRMED`).

Rather than rewrite 18K lines of frontend to understand FKs, the API
**serializes** DB rows into the shape the frontend already expects. All
serializers live in one file: `apps/api/src/utils/serializers.ts`. This keeps
the contract explicit and in one place.

## Entity: Employee

Frontend shape (`SUDO_DB.employees[]`):
```js
{ id, name, email, dept, title, lm, pm, status, joined, progress, teamId, teamRole }
```

| Frontend field | DB column | Transform | Status |
|---|---|---|---|
| `id` | `Employee.id` | direct | ✅ |
| `name` | `Employee.name` | direct | ✅ |
| `email` | `Employee.email` | direct | ✅ |
| `dept` | `Employee.departmentId` → `Department.name` | FK join → name | ✅ serializer |
| `title` | `Employee.title` | direct | ✅ |
| `lm` (line manager) | `Employee.managerEmpId` → `Employee.name` | self-join → name | ✅ serializer |
| `pm` | `Employee.pmEmpId` → `Employee.name` | self-join → name | ✅ serializer |
| `status` | `Employee.status` (enum) | `CONFIRMED` → `"Confirmed"` | ✅ serializer |
| `joined` | `Employee.joinedAt` | Date → ISO date string | ✅ serializer |
| `progress` | (computed) | onboarding % from OnboardingPlan.progressPct | ⚠️ derive in onboarding endpoint |
| `teamId` | `Employee.teamId` | direct | ✅ |
| `teamRole` | `Employee.teamRole` (enum) | `MEMBER` → `"member"` | ✅ serializer |
| — | `Employee.workEmail` | new field, exposed | ✅ |
| — | `Employee.photoUrl` | exposed for avatars | ✅ |
| — | `Employee.roles[]` | exposed for role-aware UI | ✅ |

**Resolution:** `serializeEmployee()` handles all transforms. `progress` is
derived in the onboarding endpoint (not on the base employee object) since it
requires joining OnboardingPlan.

## Entity: Team

Frontend shape (`SUDO_DB.teams[]`): `{ id, name, short, color, lead, members }`

| Frontend field | DB column | Transform | Status |
|---|---|---|---|
| `id` | `Team.id` | direct | ✅ |
| `name` | `Team.name` | direct | ✅ |
| `short` | `Team.short` | direct | ✅ |
| `color` | `Team.color` | direct | ✅ |
| `lead` | `Team.leadEmpId` | exposed as id (frontend resolves name) | ✅ serializer |
| `members` (count) | `_count.employees` | aggregate | ✅ serializer |

## Entity: KPI Assignment

Frontend shape (`SUDO_DB.kpiAssignments[]` / `kpiCards`):
`{ id, krn, empId, title, target, weight, status, currentValue }`

| Frontend field | DB column | Transform | Status |
|---|---|---|---|
| `id` | `KpiAssignment.id` | direct | ✅ |
| `krn` | `KpiAssignment.templateKrn` | direct | ✅ |
| `empId` | `KpiAssignment.empId` | direct | ✅ |
| `title` | `KpiTemplate.title` | FK join | ✅ serializer |
| `target` | `KpiTemplate.target` | FK join | ✅ serializer |
| `unit` | `KpiTemplate.unit` | FK join | ✅ serializer |
| `weight` | `KpiAssignment.weight` | direct | ✅ |
| `status` | `KpiAssignment.status` (enum) | direct (frontend handles enum) | ✅ |
| `currentValue` | `KpiAssignment.currentValue` | direct | ✅ |
| `approvalDirection` | `KpiAssignment.approvalDirection` | direct | ✅ serializer |

## Entity: Leave Request

Frontend shape (`SUDO_DB.requests[]` on Employee timeoff):
`{ id, type, from, to, days, status, reason }`

| Frontend field | DB column | Transform | Status |
|---|---|---|---|
| `id` | `LeaveRequest.id` | direct | ✅ |
| `type` | `LeaveRequest.leaveType` (enum) | `ANNUAL` → `"Annual Paid Leave"` | ✅ serializer |
| `from` | `LeaveRequest.startDate` | Date → ISO | ✅ serializer |
| `to` | `LeaveRequest.endDate` | Date → ISO | ✅ serializer |
| `days` | `LeaveRequest.days` (Decimal) | Decimal → number | ✅ serializer |
| `status` | `LeaveRequest.status` (enum) | `PENDING_PM` → `"Pending PM"` | ✅ serializer |
| `reason` | `LeaveRequest.reason` | direct | ✅ serializer |

## Entity: Notification

Frontend shape (`SUDO_DB.notifications[]`):
`{ id, title, body, icon, color, unread, url }`

| Frontend field | DB column | Transform | Status |
|---|---|---|---|
| all fields | `Notification.*` | direct | ✅ serializer |
| `category` | `Notification.category` | exposed (new) | ✅ |

## Remaining entities to map

These are consumed by specific pages. Serializers will be added as we wire
each page in Module 3 (the DB columns already exist — only the
display-shaping is pending):

| Entity | Frontend page(s) | DB model | Serializer |
|---|---|---|---|
| Training | Trainings, Catalogue, Verifications | TrainingCatalogue + TrainingAssignment | ⬜ pending |
| Onboarding | Onboarding, OnboardingV | OnboardingPlan + OnboardingStep | ⬜ pending |
| Probation | Probation, ProbationHr | ProbationCase | ⬜ pending |
| Project rating | ProjectRatings, TaskQuality | ProjectRating | ⬜ pending |
| Document | Documents, TeamDocuments | Document + DocumentSignature | ⬜ pending |
| Recognition | Recognition | Recognition + BadgeAward | ⬜ pending |
| Audit | Audit | AuditLog | ⬜ pending |
| Session | Sessions | UserSession | ⬜ pending |

## What "aligned" guarantees

For every ✅ row above:
1. The data the frontend renders has a definite home in the schema.
2. The API returns it in exactly the shape the frontend expects.
3. No frontend rendering code needs to change to understand FKs/enums.

This means Module 3 (API wiring) becomes: replace `SUDO_DB.x` with
`await api.get('/x')` — the returned shape already matches.
