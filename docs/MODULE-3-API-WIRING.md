# Module 3 — API Client Layer & Frontend↔API↔DB Communication

Status: **core wiring done + verified**

This module connects the frontend portals to the backend API. Before this,
the portals read from an in-memory `window.SUDO_DB` and never called the
server. Now they bootstrap auth, fetch real data, and render from it.

## The three new shared scripts

Loaded in this order in every portal's `index.html` (before `dashboard.js`):

```html
<script src="../shared/api.js"></script>      <!-- 1. API client -->
<script src="../shared/auth.js"></script>     <!-- 2. Auth bootstrap -->
<script src="../shared/db.js"></script>       <!-- 3. Seed fallback data -->
<script src="../shared/hydrate.js"></script>  <!-- 4. Hydration + init gate -->
<script src="dashboard.js"></script>          <!-- 5. Portal page logic -->
```

### 1. `api.js` — the API client
- `window.SUDO_API` (alias `window.api`)
- One method per endpoint across all 32 route groups
  (`api.employees.list()`, `api.leave.decide(id, 'APPROVED')`, etc.)
- JWT stored in `sessionStorage`, sent as `Bearer` on every request
- On `401` → redirects to the Entra login flow
- Throws `ApiError {status, code, message, details}` on failure

### 2. `auth.js` — auth bootstrap
- `window.SUDO_AUTH`
- `bootstrap()`:
  1. Captures the JWT from `?token=` after the login redirect, stores it,
     strips it from the URL
  2. Loads the current user via `/auth/me` → `window.SUDO_USER`
  3. Guards the page — no token ⇒ redirect to login
- Helpers: `hasRole('HR')`, `hasAnyRole('HR','ADMIN')`, `logout()`

### 3. `hydrate.js` — data hydration + init gate
- `window.SUDO_HYDRATE` + `window.SUDO_INIT`
- **The bridge strategy:** rather than rewrite 18K lines of page code,
  hydration fetches real data and **populates `SUDO_DB`** with it. Pages
  keep reading `DATA.employees` — but the array now came from Postgres.
- `SUDO_INIT(portal, startFn)` is the single entry point each dashboard calls:
  ```
  DOM ready → auth.bootstrap() → hydrateFor(portal) → startFn()
  ```
- **Degraded mode:** if the API is unreachable, the portal still renders from
  whatever seed data `db.js` provided, and shows a warning banner. No blank
  screens.
- **Prototype mode:** set `window.SUDO_SKIP_AUTH = true` to view the static
  prototype with seed data only (no backend needed).

## How each portal was gated

Every dashboard's original init was wrapped:

```js
// Before:
document.addEventListener("DOMContentLoaded", () => {
  renderNotifDropdown(); bindGlobalEvents(); route();
});

// After:
SUDO_INIT("hr", () => {
  renderNotifDropdown(); bindGlobalEvents(); route();
});
```

Portals gated: `admin`, `employee`, `hr`, `pm`, `team_lead`.

## Per-portal hydration sets

`hydrate.js` only fetches what each portal needs (keeps load fast):

| Portal | Datasets hydrated |
|---|---|
| admin | employees, teams, notifications, audit, announcements |
| hr | employees, teams, notifications, KPI (cycles/sections/templates/assignments), trainings, leave, documents, announcements |
| pm | employees, teams, notifications, KPI assignments |
| team_lead | employees, teams, notifications, KPI assignments + templates |
| employee | notifications, KPI assignments, trainings, leave, holidays, announcements |

## Read path vs write path

- **Reads** flow through hydration: API → `SUDO_DB` → existing render code.
  This is done for the datasets above.
- **Writes** (approve leave, draft KPI, give recognition) should call
  `api.*` directly, then `SUDO_HYDRATE.rehydrate('<key>')` to refresh.
  Wiring writes is per-page work that continues incrementally — the read
  path being live means each page already shows real data; converting its
  buttons to real mutations is the remaining per-page task.

## Verified

A headless-browser test (served over HTTP, API mocked) confirmed:
- Token captured from redirect, stored, stripped from URL ✓
- Current user bootstrapped from `/auth/me` ✓
- `SUDO_DB.employees` replaced with API data (seed count → API count) ✓
- HR portal rendered from hydrated data ✓
- Degraded mode falls back to seed data when API is down ✓

## What remains (incremental, per-page)

1. **Convert write actions** on each page from in-memory mutation to `api.*`
   calls + `rehydrate()`. Read path is already live.
2. **Wire remaining detail pages** that need datasets not in the default
   hydration set (e.g. a specific employee's salary history) — call
   `api.compensation.salary(empId)` on demand when the page opens.
3. **Replace the role-switcher demo IDs** (e.g. team_lead's hardcoded
   `E003`) with `SUDO_USER.id`.

These are bounded, page-by-page tasks — the integration foundation
(client, auth, hydration) is complete and proven.
