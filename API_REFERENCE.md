# API Reference

All endpoints live under `/api/v1`. Auth: Bearer JWT in `Authorization: Bearer <token>` header. Get a token from `/api/v1/auth/login` (Entra OIDC) or `/api/v1/auth/dev-login` (dev only).

## Coverage

**25 route groups · 66 models** — every model in the schema is reachable through the API.

## Endpoint inventory

### Auth
- `GET  /auth/login` — redirect to Microsoft
- `GET  /auth/callback` — OAuth callback (exchanges code → JWT)
- `GET  /auth/me` — current user + roles
- `POST /auth/logout`
- `POST /auth/dev-login` — dev only, requires `{email}`

### Employees (`/employees`)
- `GET    /` — list employees (scoped by role)
- `GET    /:id` — get one
- `POST   /` — create (HR/Admin)
- `PATCH  /:id` — update (HR/Admin)
- `DELETE /:id` — soft delete (Admin)
- `PATCH  /:id/photo` — upload profile picture (self or HR)
- `DELETE /:id/photo` — clear photo

### Employee Profile / PII (`/profiles`)
- `GET   /:empId` — get profile (self or HR)
- `PATCH /:empId` — update (self for non-sensitive fields, HR for everything)

### Organisation (`/org`)
- `GET  /departments`, `POST /departments`
- `GET  /positions`, `POST /positions`
- `GET  /employment-history/:empId`
- `POST /employment-history/:empId` — promotion / transfer / change (HR)

### Teams (`/teams`)
- `GET  /` — list teams
- `GET  /:id` — get one with members
- `POST /` — create (HR/Admin)
- `PATCH /:id` — update

### KPI (`/kpi`)
- `GET  /cycles`, `POST /cycles`, `PATCH /cycles/:id`, `POST /cycles/:id/close`
- `GET  /sections`, `POST /sections`, `PATCH /sections/:id`
- `GET  /templates`, `POST /templates`, `PATCH /templates/:krn`
- `GET  /assignments`, `POST /assignments` (HR draft or TL draft)
- `POST /assignments/:id/approve` — TL approves HR draft (or vice versa)
- `POST /assignments/:id/reject`
- `POST /assignments/:id/progress` — employee submits actuals
- `POST /assignments/:id/validate` — TL/PM validates submission
- `POST /acknowledgements` — employee acknowledges cycle
- `GET  /history/:empId` — past closed cycles

### Leave (`/leave`)  **NEW**
- `GET   /policies`, `POST /policies`, `PATCH /policies/:id`
- `GET   /balances/:empId`
- `PATCH /balances/:empId/:leaveType` — HR manual correction
- `GET   /requests` — filter by `empId`, `status`, `pendingMine`
- `POST  /requests` — create draft
- `POST  /requests/:id/submit` — submit for approval
- `POST  /requests/:id/decide` — approve or reject
- `POST  /requests/:id/withdraw`

### Training (`/training`)
- `GET  /catalogue`, `POST /catalogue`, `PATCH /catalogue/:id`
- `GET  /assignments`, `POST /assignments` (mass-assign supported)
- `POST /assignments/:id/start`, `/complete`, `/verify`, `/reject`
- `GET  /certifications/:empId`, `POST /certifications`

### Onboarding (`/onboarding`)
- `GET  /steps/:empId`, `POST /steps`, `PATCH /steps/:id`, `POST /steps/:id/complete`

### Probation (`/probation`)
- `GET  /cases`, `GET /cases/:empId`
- `POST /cases/:empId/endorse-pm`, `/endorse-tl`, `/decide`

### Project Ratings (`/project-ratings`)
- `GET  /`, `POST /`
- `POST /:id/endorse-tl`, `/finalise-hr`, `/dispute`

### Projects (`/projects`)  **NEW**
- `GET  /` — list with filters
- `GET  /:id` — with assignments + milestones
- `POST /` — create / sync (PM/HR)
- `POST /:projectId/assignments` — assign employee to project
- `DELETE /:projectId/assignments/:empId`
- `POST /:projectId/milestones`, `PATCH /milestones/:id`
- `GET  /timesheets` — list (scoped)
- `POST /timesheets` — log hours
- `POST /timesheets/:id/approve`

### Documents (`/documents`)  **NEW**
- `GET  /` — list (scoped)
- `GET  /:id` — get with signatures
- `POST /` — upload metadata (HR can upload for others)
- `POST /:id/sign` — e-sign (any signer)
- `POST /:id/revoke` — HR
- `DELETE /:id` — soft delete (HR)

### Requests (unified) (`/requests`)  **NEW**
- `GET  /` — filter by `type`, `status`, `pendingMine`
- `GET  /:id`
- `POST /` — create (any employee)
- `POST /:id/submit` — submit for approval
- `POST /:id/decide` — current approver decides
- `POST /:id/cancel`

### Data Exports (`/exports`)  **NEW**
- `GET  /` — list (mine or all if Admin)
- `GET  /:id` — get status
- `POST /` — request export (scope + format, role-gated)
- `POST /:id/downloaded` — mark downloaded
- `POST /:id/_complete` — worker callback (internal)

### Compensation (`/compensation`)  **NEW**
- `GET  /salary/:empId` — salary history (HR/Finance)
- `POST /salary/:empId` — append new salary record
- `GET  /adjustments/:empId`, `POST /adjustments`
- `GET  /bank/:empId` — list bank accounts (self or HR/Finance)
- `POST /bank/:empId` — add bank account
- `POST /bank/:id/verify`

### Family & Insurance (`/family`)  **NEW**
- `GET  /members/:empId`, `POST /members/:empId`
- `PATCH /members/:id`, `DELETE /members/:id`
- `GET  /insurance/:empId` — policies + dependents
- `POST /insurance/:empId` — HR adds policy

### People (Recognition / Feedback / Badges) (`/people`)  **NEW**
- `GET  /recognitions`, `POST /recognitions` — wall
- `GET  /feedback-sessions`, `POST /feedback-sessions`
- `PATCH /feedback-sessions/:id`
- `GET  /notes/:subjectEmpId`, `POST /notes`
- `GET  /badges`, `POST /badges` (HR/Admin)
- `POST /badges/:badgeId/award`
- `GET  /badges/awards/:empId`

### Lifecycle (`/lifecycle`)  **NEW**
- `GET  /air-tickets/:empId`, `PUT /air-tickets/:empId/allowance`
- `POST /air-tickets/:empId/usage`
- `GET  /offboarding/:empId`, `POST /offboarding`, `PATCH /offboarding/:empId`
- `GET  /bg-checks/:empId`, `POST /bg-checks`, `PATCH /bg-checks/:id`

### Permissions (`/permissions`)  **NEW**
- `GET  /permissions`, `POST /permissions`
- `GET  /roles` — with their permissions
- `POST /roles` — create / update role definition
- `POST /roles/:roleKey/permissions` — grant
- `DELETE /roles/:roleKey/permissions/:permKey` — revoke

### Audit (`/audit`)
- `GET  /` — filter by actor, action, target, severity, date range

### Notifications (`/notifications`)
- `GET  /` — my notifications
- `POST /:id/read`, `POST /mark-all-read`
- `POST /broadcast` — admin announcement

### Admin (`/admin`)
- `GET  /users`, `GET /sessions`, `GET /backups`
- `GET  /integrations`, `PATCH /integrations/:id`
- `GET  /config`, `PATCH /config/:key`
- `POST /sessions/:id/revoke`

### Microsoft 365 (`/m365`)
- `GET  /users` — Graph directory sync (stub)
- `POST /events` — create calendar event (stub)
- `POST /mail/send` — send via Graph (stub)
- `POST /sync` — pull groups + photos for one user

### Webhooks (`/webhooks`)
- `GET  /endpoints`, `POST /endpoints`, `DELETE /endpoints/:id`
- `GET  /deliveries`
- `POST /inbound/:source` — receive webhooks from external systems (HMAC-verified)

## Permissions matrix

| Resource | Read | Create | Update | Delete |
|---|---|---|---|---|
| Employees | ALL (scoped) | HR, Admin | HR, Admin, self (limited) | Admin |
| Employee.profile | self, HR, Admin | — | self (non-PII), HR, Admin | — |
| Salary | HR, Finance, Admin | HR, Admin | (append-only) | — |
| Leave requests | self + approvers + HR | self | self + approvers | self (withdraw) |
| Documents | self + HR | any signed-in | HR | HR (soft) |
| KPIs | self + TL + HR | HR or TL | by stage | — |
| Data exports | self (own) | per-scope | system | — |
| Permissions / Roles | Admin, Auditor | Admin | Admin | Admin |
| Audit log | Admin, Auditor | (write only by system) | — | — |

## Workflow examples

### Leave request end-to-end

```
POST /leave/requests       → request DRAFT created
POST /leave/requests/:id/submit
   → status = PENDING_PM, first approver notified
POST /leave/requests/:id/decide  (PM approves)
   → status = PENDING_HR, HR notified
POST /leave/requests/:id/decide  (HR approves)
   → status = APPROVED, balance.used += days, employee notified
```

### Document e-signature

```
POST /documents { requireSignature:true, empId:E008, ... }
   → status = AWAITING_SIGNATURE
   → notify E008
POST /documents/:id/sign  (called by E008)
   → DocumentSignature row with sha256 hash + IP + user agent
   → status = SIGNED
```

### Data export (audit-friendly)

```
POST /exports { scope:"KPIS", format:"XLSX" }
   → status = REQUESTED
   → ScheduledJob "data.export" queued
   → audit log "data.export.request"
(worker processes job, then:)
POST /exports/:id/_complete { fileUrl, rowCount }
   → status = READY
   → notify requester
GET /exports/:id → user downloads
POST /exports/:id/downloaded → status = DOWNLOADED, audit logged
```

## Standard responses

- `200` — success with body
- `400` — validation_failed (Zod errors in `details`)
- `401` — unauthorized
- `403` — forbidden
- `404` — not_found
- `409` — conflict
- `500` — internal_error (logged with stack)

All errors return:
```json
{ "error": "code", "message": "human-readable", "details": { ... } }
```
