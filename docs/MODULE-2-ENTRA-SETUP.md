# Module 2 — Microsoft Entra ID / M365 Configuration

Status: **ready to configure**

This guide makes the portal connectable to your Microsoft Entra (Azure AD)
tenant. After following it, employees sign in with their Microsoft work
accounts and their roles are derived automatically from Entra group
membership.

## What's already built

- **OIDC auth code flow** via MSAL Node (`entra.service.ts`)
- **Login**: `GET /api/v1/auth/login` → Microsoft → `GET /api/v1/auth/callback`
- **Group → role mapping**: 8 roles (ADMIN, HR, PM, TL, EMPLOYEE, FINANCE, RECRUITER, AUDITOR)
- **Auto-provisioning**: first sign-in creates the Employee record
- **Photo backfill**: profile photo pulled from Graph on first login
- **Diagnostics**: `GET /api/v1/m365/status` (Admin) verifies config without a full login

## Step 1 — Register the application in Entra

1. Go to **portal.azure.com → Microsoft Entra ID → App registrations → New registration**
2. Name: `SUDO Portal`
3. Supported account types: **Single tenant** (Accounts in this org directory only)
4. Redirect URI: **Web** → `https://YOUR_DOMAIN/api/v1/auth/callback`
   (for local dev: `http://localhost:3000/api/v1/auth/callback`)
5. Click **Register**
6. Copy the **Application (client) ID** and **Directory (tenant) ID** from the Overview page

## Step 2 — Create a client secret

1. In the app registration → **Certificates & secrets → New client secret**
2. Description: `SUDO Portal API`, expiry: 24 months
3. Copy the secret **Value** (not the ID) immediately — it's only shown once

## Step 3 — Grant Graph API permissions

1. App registration → **API permissions → Add a permission → Microsoft Graph → Delegated**
2. Add: `User.Read`, `User.Read.All`, `Group.Read.All`, `profile`, `openid`, `email`
3. (For calendar/mail features later: `Calendars.ReadWrite`, `Mail.Send`)
4. Click **Grant admin consent for <tenant>** — required for `*.All` scopes

## Step 4 — Create role groups in Entra

Create one security group per role you want to use:

1. **Entra ID → Groups → New group** (type: Security)
2. Suggested names: `SUDO-Admins`, `SUDO-HR`, `SUDO-PM`, `SUDO-TL`, `SUDO-Finance`, `SUDO-Recruiters`, `SUDO-Auditors`
3. For each group, copy its **Object ID** from the group's Overview page
4. Add the relevant employees as members

You don't need an EMPLOYEE group — every authenticated tenant user is
implicitly an Employee.

## Step 5 — Fill in `.env`

```bash
# Core Entra connection
ENTRA_TENANT_ID=<Directory (tenant) ID from Step 1>
ENTRA_CLIENT_ID=<Application (client) ID from Step 1>
ENTRA_CLIENT_SECRET=<secret Value from Step 2>
ENTRA_REDIRECT_URI=https://YOUR_DOMAIN/api/v1/auth/callback
ENTRA_POST_LOGOUT_REDIRECT_URI=https://YOUR_DOMAIN/

# Role group Object IDs from Step 4 (leave blank for roles you don't use)
ENTRA_GROUP_ADMIN=<object id of SUDO-Admins>
ENTRA_GROUP_HR=<object id of SUDO-HR>
ENTRA_GROUP_PM=<object id of SUDO-PM>
ENTRA_GROUP_TL=<object id of SUDO-TL>
ENTRA_GROUP_FINANCE=<object id of SUDO-Finance>
ENTRA_GROUP_RECRUITER=<object id of SUDO-Recruiters>
ENTRA_GROUP_AUDITOR=<object id of SUDO-Auditors>

M365_GRAPH_SCOPES=User.Read User.Read.All Group.Read.All
```

## Step 6 — Verify the configuration

After restarting the API with the new `.env`:

```bash
# As an admin (use the dev token in non-prod, or sign in once manually):
curl -H "Authorization: Bearer <admin-jwt>" https://YOUR_DOMAIN/api/v1/m365/status
```

Expected response:
```json
{
  "entraConfigured": true,
  "checks": {
    "tenantId": true, "clientId": true, "clientSecret": true,
    "redirectUri": "https://YOUR_DOMAIN/api/v1/auth/callback",
    "graphScopes": "User.Read User.Read.All Group.Read.All"
  },
  "roleGroupsMapped": {
    "ADMIN": true, "HR": true, "PM": true, "TL": true,
    "EMPLOYEE": true, "FINANCE": true, "RECRUITER": true, "AUDITOR": true
  },
  "hint": "Entra is configured. Test a full login at /api/v1/auth/login"
}
```

If `entraConfigured` is false, the three core vars aren't set. If a role shows
`false`, that group's Object ID isn't in `.env` (fine if you don't use that role).

## Step 7 — Test a full sign-in

1. Open `https://YOUR_DOMAIN/api/v1/auth/login` in a browser
2. Sign in with a Microsoft work account that's a member of one of your groups
3. You should be redirected back and receive a SUDO JWT
4. Check `GET /api/v1/auth/me` returns your profile with the expected roles

## How role derivation works

On every sign-in (`entra.service.ts → deriveRolesFromGroups`):
1. We fetch the user's group memberships from Graph (`/me/memberOf`)
2. For each configured `ENTRA_GROUP_*`, if the user is in that group, they get that role
3. `EMPLOYEE` is always added (baseline access)
4. Roles are stored on the `Employee.roles[]` array and embedded in the JWT

Changing someone's role = add/remove them from the Entra group. Takes effect
on their next sign-in (or token refresh).

## Dev mode (no Entra)

For local development without a tenant, the API exposes a dev-login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sudoconsultants.com"}'
```
This is **disabled when `NODE_ENV=production`**. It issues a JWT for any
seeded employee so you can exercise the portal without Microsoft.

## Token lifetime note

The Graph access token cached at login expires ~1 hour later. Calendar/mail
proxy calls that fail with 401 will ask the user to re-sign-in. Full silent
refresh (storing the refresh token) is a future enhancement; core auth and
role derivation don't need it.

## Checklist

- [ ] App registered, client ID + tenant ID copied
- [ ] Client secret created and copied
- [ ] Graph delegated permissions granted with admin consent
- [ ] Role security groups created, Object IDs copied, members added
- [ ] `.env` filled in
- [ ] `GET /m365/status` returns `entraConfigured: true`
- [ ] Full sign-in tested, `/auth/me` shows correct roles
