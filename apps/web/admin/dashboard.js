/* =========================================================
   SUDO Employee Portal — Super Admin Portal
   Single-file SPA with hash router
========================================================= */

// =========================================================
// NAV
// =========================================================
const NAV_ITEMS = [
  { id: "dashboard",     label: "Platform Dashboard", iconKey: "grid",     title: "Platform Dashboard" },
  { id: "roles",         label: "Roles & Permissions", iconKey: "shield",  title: "Roles & Permissions" },
  { id: "users",         label: "Portal Users",       iconKey: "users",    count: 152, title: "Portal Users" },
  { id: "integrations",  label: "Integrations",       iconKey: "plug",     count: 8,   title: "Integrations" },
  { id: "webhooks",      label: "Webhooks",           iconKey: "broadcast", count: 3, countStyle: "danger", title: "Webhooks" },
  { id: "audit",         label: "Audit Log",          iconKey: "list",     title: "Audit Log" },
  { id: "sessions",      label: "Sessions & Sign-ins", iconKey: "key",     title: "Sessions & Sign-ins" },
  { id: "config",        label: "System Config",      iconKey: "gear",     title: "System Configuration" },
  { id: "templates",     label: "Notification Templates", iconKey: "mail", title: "Notification Templates" },
  { id: "backups",       label: "Backups & Data",     iconKey: "database", title: "Backups & Data" },
  { id: "health",        label: "System Health",      iconKey: "pulse",    title: "System Health" },
];

// =========================================================
// ICONS
// =========================================================
const ICONS = {
  // sidebar
  grid:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>',
  shield:     '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  users:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7M16 11a4 4 0 100-8M22 21c0-3-2-5.5-5-6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  plug:       '<svg viewBox="0 0 24 24" fill="none"><path d="M9 2v6m6-6v6M5 8h14v3a7 7 0 01-14 0V8zm7 10v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  broadcast:  '<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 12a7.5 7.5 0 0115 0M8 12a4 4 0 018 0M12 12v9M2 12a10 10 0 0120 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  list:       '<svg viewBox="0 0 24 24" fill="none"><path d="M8 6h12M8 12h12M8 18h12M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  key:        '<svg viewBox="0 0 24 24" fill="none"><path d="M15 7a4 4 0 11-3.9 5l-1.1 1.1H8v2H6v2H2v-3l6.1-6.1A4 4 0 0115 7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15.5" cy="7.5" r=".8" fill="currentColor"/></svg>',
  gear:       '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mail:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.8"/></svg>',
  database:   '<svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" stroke="currentColor" stroke-width="1.8"/></svg>',
  pulse:      '<svg viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  // dashboard / status icons
  check:      '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  alert:      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.3 3.6L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowUp:    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 19V5m0 0l-7 7m7-7l7 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowDown:  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  flat:       '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  search:     '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  download:   '<svg viewBox="0 0 24 24" fill="none"><path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  upload:     '<svg viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  filter:     '<svg viewBox="0 0 24 24" fill="none"><path d="M3 4h18l-7 9v6l-4 2v-8L3 4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus:       '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  edit:       '<svg viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trash:      '<svg viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  copy:       '<svg viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3" stroke="currentColor" stroke-width="1.8"/></svg>',
  link:       '<svg viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  unlink:     '<svg viewBox="0 0 24 24" fill="none"><path d="M18.8 11l1.7-1.7a5 5 0 00-7-7L11.8 4M9 13a5 5 0 007 0M5.2 13l-1.7 1.7a5 5 0 007 7l1.7-1.7M2 2l20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  refresh:    '<svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-3.3-7M21 3v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  eye:        '<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>',
  globe:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" stroke-width="1.8"/></svg>',
  clock:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  bell:       '<svg viewBox="0 0 24 24" fill="none"><path d="M18 16h2l-1.4-1.4A2 2 0 0118 13.2V10a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 16h2m12 0H6m12 0a3 3 0 11-6 0m-6 0a3 3 0 006 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  zap:        '<svg viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cpu:        '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" stroke-width="1.8"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  hardDrive:  '<svg viewBox="0 0 24 24" fill="none"><path d="M22 12H2M5.5 5h13l3.5 7v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5l3.5-7zM6 16h.01M10 16h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  activity:   '<svg viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  user:       '<svg viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  send:       '<svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  history:    '<svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.3 2.4L3 8m0 0V3m0 5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

// =========================================================
// DATA
// =========================================================
const DATA = {
  user: { name: "M. Farooq", role: "Super Admin", email: "farooq@sudoconsultants.com" },

  // Dashboard KPI cards (12 cards in 2 rows of 6)
  kpiCards: [
    { id: "users",            title: "Portal Users",         value: 152, delta: { dir: "up", text: "+5 this month" }, icon: "users", iconStyle: "navy", meta: "147 employees · 5 service" },
    { id: "signins",          title: "Sign-ins Today",       value: 94,  delta: { dir: "up", text: "+12% vs avg" }, icon: "key", iconStyle: "bright", meta: "Peak 09:30 · 67 unique" },
    { id: "mfa",              title: "MFA Compliance",       value: 100, valueSub: "%", bar: { pct: 100, style: "ok" }, barLabel: "Enforced by Conditional Access", icon: "shield", iconStyle: "ok" },
    { id: "sessions",         title: "Active Sessions",      value: 41,  icon: "activity", iconStyle: "bright", meta: "Avg 2.3 hrs · longest 5h 12m" },
    { id: "integrations",     title: "Integration Health",   value: "8/8", icon: "plug", iconStyle: "ok", meta: "All connected · last sync 4m ago" },
    { id: "webhook-success",  title: "Webhook Success (24h)", value: 99.4, valueSub: "%", bar: { pct: 99, style: "ok" }, barLabel: "4,317 delivered · 22 retried", icon: "broadcast", iconStyle: "ok" },

    { id: "webhook-failed",   title: "Failed Webhooks",      value: 3, icon: "alert", iconStyle: "danger", meta: "Action needed · view delivery log" },
    { id: "audit-today",      title: "Audit Log (today)",    value: 2148, delta: { dir: "flat", text: "Normal volume" }, icon: "list", iconStyle: "navy", meta: "Across 11 modules" },
    { id: "storage",          title: "Storage Used",         value: 47, valueSub: "GB", bar: { pct: 47, style: "" }, barLabel: "47 / 100 GB · 53% remaining", icon: "hardDrive", iconStyle: "info" },
    { id: "api-calls",        title: "API Calls (24h)",      value: "18.2k", delta: { dir: "up", text: "+8%" }, icon: "globe", iconStyle: "bright", meta: "Avg 12 req/s · peak 47 req/s" },
    { id: "errors",           title: "System Errors (24h)",  value: 7, delta: { dir: "down", text: "−4 vs yesterday" }, icon: "alert", iconStyle: "warn", meta: "All non-blocking · 0 critical" },
    { id: "impersonations",   title: "Active Impersonations", value: 0, icon: "eye", iconStyle: "ok", meta: "All audit-logged when used" },
  ],

  // Recent audit log (dashboard preview)
  auditPreview: [
    { actor: "Justine (HR)", icon: "check", style: "ok", action: "Verified training certificate", target: "T005 (AWS Cloud Economics) · Reem Al Otaibi", time: "2m ago" },
    { actor: "Reem Al Otaibi (Emp)", icon: "upload", style: "info", action: "Uploaded training certificate (locked)", target: "T005 · aws-cloud-economics-cert.pdf", time: "5m ago" },
    { actor: "Justine (HR)", icon: "clock", style: "info", action: "Extended training deadline by +7 days", target: "T002 (AWS SA Associate) · employee:E008", time: "7m ago" },
    { actor: "Justine (HR)", icon: "user", style: "info", action: "Assigned 'KnowBe4 Security Awareness' to 12 employees", target: "training:T009", time: "8m ago" },
    { actor: "System", icon: "send", style: "ok", action: "Webhook delivered", target: "n8n.sudo.dev/onboarding · 200 OK", time: "12m ago" },
    { actor: "Khalid Mansour (PM)", icon: "edit", style: "info", action: "Endorsed probation outcome", target: "employee:E011 (Marcus Wright)", time: "32m ago" },
    { actor: "Justine (HR)", icon: "send", style: "info", action: "Sent notification 'Visa Renewal Alert' to 3 recipients", target: "channels:email,slack,in-app", time: "1h ago" },
    { actor: "System", icon: "alert", style: "danger", action: "Webhook delivery failed (retry 3/3)", target: "legacy-sharepoint.sudo.dev · 502", time: "1h ago" },
  ],

  // System alerts (notif dropdown)
  alerts: [
    { title: "3 webhook deliveries failing", desc: "legacy-sharepoint.sudo.dev · 502 Bad Gateway", time: "1h ago", unread: true, icon: "alert", color: "danger" },
    { title: "Credly API key expires in 14 days", desc: "Rotate before 2026-05-26", time: "2h ago", unread: true, icon: "key", color: "warn" },
    { title: "Storage at 47% of quota", desc: "Document storage growing 4 GB/week", time: "6h ago", unread: true, icon: "hardDrive", color: "info" },
    { title: "ODOO sync recovered", desc: "Backfill completed for 12 records", time: "8h ago", unread: true, icon: "check", color: "ok" },
  ],

  // Roles
  roles: [
    { name: "Super Admin", entraGroup: "sudoconsultants-portal-superadmin", members: 2, color: "admin", desc: "Platform-wide governance: roles, integrations, webhooks, audit log, system configuration." },
    { name: "HR",          entraGroup: "sudoconsultants-portal-hr",         members: 4, color: "hr",   desc: "Full employee lifecycle. Sees private fields (IBAN, CNIC, salary). Owns onboarding, KPIs, documents." },
    { name: "Project Manager", entraGroup: "sudoconsultants-portal-pm",    members: 18, color: "pm",   desc: "Manages assigned team only. Sensitive fields hidden. Endorses probation, rates ODOO tasks." },
    { name: "Employee",    entraGroup: "sudoconsultants-portal-user",       members: 147, color: "employee", desc: "Own onboarding, training, profile, KPIs, certifications, documents. Default for every active user." },
  ],

  // Permission matrix
  permissions: [
    { action: "Manage portal roles & permissions", sa: "✓", hr: "✗", pm: "✗", emp: "✗" },
    { action: "Manage HR / PM accounts",          sa: "✓", hr: "✗", pm: "✗", emp: "✗" },
    { action: "Manage integrations & API keys",   sa: "✓", hr: "✗", pm: "✗", emp: "✗" },
    { action: "Manage webhook endpoints",         sa: "✓", hr: "✗", pm: "✗", emp: "✗" },
    { action: "View full audit log",              sa: "✓", hr: "✗", pm: "✗", emp: "✗" },
    { action: "Backup / export tenant data",      sa: "✓", hr: "✗", pm: "✗", emp: "✗" },
    { action: "Create / edit employee records",   sa: "✓", hr: "✓", pm: "✗", emp: "✗" },
    { action: "View private fields (IBAN, CNIC)", sa: "✓", hr: "✓", pm: "✗", emp: "Own" },
    { action: "Manage training catalogue",        sa: "✓", hr: "✓", pm: "✗", emp: "✗" },
    { action: "Assign / extend training deadlines", sa: "✓", hr: "✓", pm: "✗", emp: "✗" },
    { action: "Verify uploaded training certificates", sa: "✓", hr: "✓", pm: "✗", emp: "✗" },
    { action: "Allow re-upload of locked file",   sa: "✓", hr: "✓", pm: "✗", emp: "✗" },
    { action: "Upload own training certificates", sa: "✗", hr: "✗", pm: "✗", emp: "✓" },
    { action: "Create / edit KPIs",               sa: "✓", hr: "✓", pm: "LM only", emp: "✗" },
    { action: "Rate ODOO task quality",           sa: "✗", hr: "✗", pm: "✓", emp: "✗" },
    { action: "Endorse probation outcome",        sa: "✗", hr: "✗", pm: "✓", emp: "✗" },
    { action: "Final probation decision",         sa: "✗", hr: "✓", pm: "LM only", emp: "✗" },
    { action: "Complete own onboarding",          sa: "✗", hr: "✗", pm: "✗", emp: "✓" },
  ],

  // Portal users (admin view — all roles)
  portalUsers: [
    { id: "U001", name: "M. Farooq",          email: "farooq@sudoconsultants.com",    roles: ["admin"], mfa: true, lastSignin: "12 May, 14:08", status: "Active" },
    { id: "U002", name: "Justine",            email: "justine@sudoconsultants.com",   roles: ["hr"], mfa: true, lastSignin: "12 May, 13:54", status: "Active" },
    { id: "U003", name: "Layla Ibrahim",      email: "layla.i@sudoconsultants.com",   roles: ["hr"], mfa: true, lastSignin: "12 May, 11:32", status: "Active" },
    { id: "U004", name: "Khalid Mansour",     email: "khalid.m@sudoconsultants.com",  roles: ["pm", "employee"], mfa: true, lastSignin: "12 May, 09:14", status: "Active" },
    { id: "U005", name: "Fatima Al Zaabi",    email: "fatima.z@sudoconsultants.com",  roles: ["pm", "employee"], mfa: true, lastSignin: "12 May, 08:47", status: "Active" },
    { id: "U006", name: "Sara Mitchell",      email: "sara.m@sudoconsultants.com",    roles: ["pm", "employee"], mfa: true, lastSignin: "11 May, 18:22", status: "Active" },
    { id: "U007", name: "Ahmed Al Rashid",    email: "ahmed.r@sudoconsultants.com",   roles: ["employee"], mfa: true, lastSignin: "12 May, 13:01", status: "Active" },
    { id: "U008", name: "Priya Sharma",       email: "priya.s@sudoconsultants.com",   roles: ["employee"], mfa: true, lastSignin: "12 May, 12:18", status: "Active" },
    { id: "U009", name: "Daniel Chen",        email: "daniel.c@sudoconsultants.com",  roles: ["employee"], mfa: true, lastSignin: "12 May, 10:43", status: "Active" },
    { id: "U010", name: "Reem Al Otaibi",     email: "reem.o@sudoconsultants.com",    roles: ["employee"], mfa: true, lastSignin: "12 May, 09:55", status: "Active" },
    { id: "U011", name: "Marcus Wright",      email: "marcus.w@sudoconsultants.com",  roles: ["employee"], mfa: true, lastSignin: "12 May, 11:07", status: "Active" },
    { id: "U012", name: "Noor Faisal",        email: "noor.f@sudoconsultants.com",    roles: ["employee"], mfa: true, lastSignin: "11 May, 17:30", status: "Active" },
    { id: "U013", name: "svc-odoo-sync",      email: "svc-odoo@sudoconsultants.com",  roles: ["admin"], mfa: false, lastSignin: "12 May, 14:00", status: "Service" },
    { id: "U014", name: "James Patel",        email: "james.p@sudoconsultants.com",   roles: ["employee"], mfa: true, lastSignin: "10 May, 16:12", status: "Offboarding" },
    { id: "U015", name: "Hala Salim",         email: "hala.s@sudoconsultants.com",    roles: ["employee"], mfa: true, lastSignin: "12 May, 09:42", status: "Active" },
  ],

  // Integrations
  integrations: [
    { id: "odoo",       name: "ODOO ERP",         logo: "odoo",       category: "HR Master Data", status: "Connected", lastSync: "4 min ago", scope: "Employees, salary, leave, IBAN, CNIC" },
    { id: "entra",      name: "Microsoft Entra ID", logo: "entra",     category: "Identity (SSO)", status: "Connected", lastSync: "Live", scope: "Authentication, group membership, manager attribute" },
    { id: "m365",       name: "Microsoft 365",    logo: "m365",       category: "Productivity", status: "Connected", lastSync: "2 min ago", scope: "Email send, calendar, Teams" },
    { id: "sharepoint", name: "SharePoint",       logo: "sharepoint", category: "Document Storage", status: "Connected", lastSync: "12 min ago", scope: "Training materials, document vault" },
    { id: "aws",        name: "AWS Partner Central", logo: "aws",     category: "Partner Tier", status: "Connected", lastSync: "1 hr ago", scope: "Certification matrix, tier alignment" },
    { id: "credly",     name: "Credly",           logo: "credly",     category: "Digital Badges", status: "Warning",   lastSync: "Failed 2h ago", scope: "Badge verification, expiry tracking" },
    { id: "knowbe4",    name: "KnowBe4",          logo: "knowbe4",    category: "Security Training", status: "Connected", lastSync: "Daily 02:00", scope: "Training completion, phishing simulations" },
    { id: "docusign",   name: "DocuSign",         logo: "docusign",   category: "E-Signature", status: "Connected", lastSync: "Webhook", scope: "Document signing flow, signed-doc storage" },
  ],

  // Webhook endpoints
  webhookEndpoints: [
    { id: "wh-1", url: "https://n8n.sudo.dev/webhook/onboarding", events: ["employee.created", "onboarding.step.completed", "probation.passed"], success: 100, delivered: 1284, active: true },
    { id: "wh-2", url: "https://hooks.slack.com/services/.../sudo-hr-bot", events: ["kpi.acknowledged", "training.completed", "document.signed"], success: 99.8, delivered: 2156, active: true },
    { id: "wh-3", url: "https://legacy-sharepoint.sudo.dev/webhook", events: ["document.signed", "certification.added"], success: 73.2, delivered: 412, active: true, failing: true },
    { id: "wh-4", url: "https://analytics.sudo.dev/events/portal", events: ["*"], success: 99.5, delivered: 18934, active: true },
    { id: "wh-5", url: "https://aws-partner-sync.sudo.dev/hook", events: ["certification.added", "certification.expiring"], success: 100, delivered: 87, active: false },
  ],

  // Webhook delivery log (last 24h)
  webhookLog: [
    { time: "14:32:18", method: "POST", event: "kpi.acknowledged", endpoint: "n8n.sudo.dev", status: 200, latency: "142ms" },
    { time: "14:31:09", method: "POST", event: "training.completed", endpoint: "hooks.slack.com", status: 200, latency: "89ms" },
    { time: "14:28:44", method: "POST", event: "document.signed", endpoint: "legacy-sharepoint", status: 502, latency: "30s" },
    { time: "14:28:42", method: "POST", event: "document.signed", endpoint: "n8n.sudo.dev", status: 200, latency: "127ms" },
    { time: "14:25:11", method: "POST", event: "onboarding.step.completed", endpoint: "n8n.sudo.dev", status: 200, latency: "98ms" },
    { time: "14:24:55", method: "POST", event: "kpi.created", endpoint: "analytics.sudo.dev", status: 200, latency: "156ms" },
    { time: "14:22:01", method: "POST", event: "employee.created", endpoint: "n8n.sudo.dev", status: 200, latency: "108ms" },
    { time: "14:20:34", method: "POST", event: "certification.added", endpoint: "aws-partner-sync", status: 200, latency: "201ms" },
    { time: "14:18:22", method: "POST", event: "document.signed", endpoint: "legacy-sharepoint", status: 502, latency: "30s" },
    { time: "14:15:08", method: "POST", event: "notification.sent", endpoint: "analytics.sudo.dev", status: 200, latency: "67ms" },
    { time: "14:12:44", method: "POST", event: "training.assigned", endpoint: "hooks.slack.com", status: 200, latency: "94ms" },
    { time: "14:10:19", method: "POST", event: "probation.endorsed", endpoint: "n8n.sudo.dev", status: 200, latency: "118ms" },
    { time: "14:08:01", method: "POST", event: "document.signed", endpoint: "legacy-sharepoint", status: 404, latency: "76ms" },
    { time: "14:05:33", method: "POST", event: "session.started", endpoint: "analytics.sudo.dev", status: 200, latency: "52ms" },
    { time: "14:02:14", method: "POST", event: "kpi.acknowledged", endpoint: "n8n.sudo.dev", status: 200, latency: "131ms" },
  ],

  // Full audit log
  audit: [
    { time: "14:38:51", actor: "Justine (HR)", action: "training.certificate.verified", target: "T005 (AWS Cloud Economics) · employee:E008 (Reem Al Otaibi)", ip: "10.0.4.32", result: "Success" },
    { time: "14:36:22", actor: "Reem Al Otaibi (Emp)", action: "training.certificate.uploaded", target: "T005 · file:aws-cloud-economics-cert.pdf (locked)", ip: "10.0.4.78", result: "Success" },
    { time: "14:34:09", actor: "Justine (HR)", action: "training.deadline.extended", target: "T002 (AWS SA Associate) · employee:E008 · +7 days", ip: "10.0.4.32", result: "Success" },
    { time: "14:32:18", actor: "Justine (HR)", action: "kpi.assigned", target: "employee:E008 (Reem Al Otaibi)", ip: "10.0.4.32", result: "Success" },
    { time: "14:31:09", actor: "Marcus Wright (Emp)", action: "training.started", target: "T009 (KnowBe4 Security Awareness)", ip: "94.203.x.x", result: "Success" },
    { time: "14:30:02", actor: "Justine (HR)", action: "training.reupload.allowed", target: "T006 · employee:E007 (Priya Sharma) · file unlocked once", ip: "10.0.4.32", result: "Success" },
    { time: "14:28:44", actor: "System (webhook)", action: "webhook.delivery.failed", target: "legacy-sharepoint.sudo.dev", ip: "—", result: "502 retry 3/3" },
    { time: "14:25:11", actor: "Khalid Mansour (PM)", action: "probation.endorsed", target: "employee:E011 (Marcus Wright)", ip: "10.0.4.18", result: "Success" },
    { time: "14:22:01", actor: "Justine (HR)", action: "employee.created", target: "employee:E016 (new)", ip: "10.0.4.32", result: "Success" },
    { time: "14:20:34", actor: "Priya Sharma (Emp)", action: "certification.added", target: "AWS DevOps Pro", ip: "212.45.x.x", result: "Success" },
    { time: "14:18:22", actor: "System (webhook)", action: "webhook.delivery.failed", target: "legacy-sharepoint.sudo.dev", ip: "—", result: "502 retry 2/3" },
    { time: "14:15:08", actor: "Justine (HR)", action: "notification.sent", target: "audience:3, channels:email,slack,in-app", ip: "10.0.4.32", result: "Success" },
    { time: "14:12:44", actor: "Justine (HR)", action: "training.assigned", target: "training:T009 → 12 employees", ip: "10.0.4.32", result: "Success" },
    { time: "14:10:19", actor: "Fatima Al Zaabi (PM)", action: "feedback.session.recorded", target: "employee:E014 (Sara Mitchell)", ip: "10.0.4.21", result: "Success" },
    { time: "14:08:01", actor: "System (webhook)", action: "webhook.delivery.failed", target: "legacy-sharepoint.sudo.dev", ip: "—", result: "404" },
    { time: "14:02:14", actor: "Layla Ibrahim (HR)", action: "kpi.acknowledged (on behalf)", target: "kpi:K-2026-Q2-04", ip: "10.0.4.40", result: "Success" },
    { time: "13:58:43", actor: "M. Farooq (Admin)", action: "integration.key.rotated", target: "integration:docusign", ip: "10.0.4.5", result: "Success" },
    { time: "13:52:11", actor: "Daniel Chen (Emp)", action: "document.signed", target: "document:contract-DC", ip: "94.203.x.x", result: "Success" },
    { time: "13:45:02", actor: "System (sync)", action: "odoo.sync.completed", target: "147 records · 0 conflicts", ip: "—", result: "Success" },
  ],

  // Active sessions
  sessions: [
    { name: "M. Farooq",         role: "admin", device: "Chrome 124 · macOS 15", ip: "10.0.4.5",    location: "Dubai, AE",  loggedAt: "12 May 14:08", duration: "0h 24m", risk: "Low" },
    { name: "Justine",           role: "hr",    device: "Edge 124 · Windows 11", ip: "10.0.4.32",   location: "Dubai, AE",  loggedAt: "12 May 13:54", duration: "0h 38m", risk: "Low" },
    { name: "Layla Ibrahim",     role: "hr",    device: "Chrome 124 · Windows 11", ip: "10.0.4.40", location: "Dubai, AE",  loggedAt: "12 May 11:32", duration: "3h 00m", risk: "Low" },
    { name: "Khalid Mansour",    role: "pm",    device: "Safari 17 · iOS 18", ip: "94.203.x.x", location: "Riyadh, SA", loggedAt: "12 May 09:14", duration: "5h 18m", risk: "Low" },
    { name: "Fatima Al Zaabi",   role: "pm",    device: "Chrome 124 · macOS 15", ip: "10.0.4.21",  location: "Dubai, AE", loggedAt: "12 May 08:47", duration: "5h 45m", risk: "Low" },
    { name: "Ahmed Al Rashid",   role: "emp",   device: "Chrome 124 · Windows 11", ip: "10.0.4.78", location: "Dubai, AE", loggedAt: "12 May 13:01", duration: "1h 31m", risk: "Low" },
    { name: "Priya Sharma",      role: "emp",   device: "Firefox 124 · Linux", ip: "212.45.x.x", location: "Bangalore, IN", loggedAt: "12 May 12:18", duration: "2h 14m", risk: "Medium" },
    { name: "Marcus Wright",     role: "emp",   device: "Chrome 124 · iOS 18", ip: "94.203.x.x", location: "Abu Dhabi, AE", loggedAt: "12 May 11:07", duration: "3h 25m", risk: "Low" },
  ],

  // Notification templates
  templates: [
    { id: "t-welcome",   name: "Welcome — Onboarding Started", category: "Onboarding", channels: ["email", "slack"], lastEdited: "Justine · 12 days ago" },
    { id: "t-neo",       name: "NEO Session Invitation",       category: "Onboarding", channels: ["email", "in-app"], lastEdited: "Justine · 18 days ago" },
    { id: "t-train-rem", name: "Training Reminder",             category: "Training",   channels: ["email", "slack", "in-app"], lastEdited: "Justine · 5 days ago" },
    { id: "t-cert-exp",  name: "Certification Expiring Soon",   category: "Compliance", channels: ["email", "slack"], lastEdited: "M. Farooq · 2 months ago" },
    { id: "t-visa",      name: "Visa / ID Expiry Alert",        category: "Compliance", channels: ["email", "slack", "in-app"], lastEdited: "Justine · 7 days ago" },
    { id: "t-kpi-ack",   name: "KPI Acknowledgement Nudge",     category: "Performance", channels: ["in-app", "email"], lastEdited: "Justine · 1 month ago" },
    { id: "t-doc-sign",  name: "Document Signature Reminder",   category: "Documents",  channels: ["email", "in-app"], lastEdited: "Justine · 3 days ago" },
    { id: "t-prob-pass", name: "Probation Passed — Confirmation", category: "Onboarding", channels: ["email"], lastEdited: "Justine · 1 month ago" },
    { id: "t-broadcast", name: "All-Hands Broadcast",            category: "General",    channels: ["email", "slack"], lastEdited: "M. Farooq · 14 days ago" },
  ],

  // Backups
  backups: [
    { time: "12 May 2026, 02:00", type: "Automated daily", size: "8.4 GB", status: "Complete", retention: "30 days" },
    { time: "11 May 2026, 02:00", type: "Automated daily", size: "8.3 GB", status: "Complete", retention: "30 days" },
    { time: "10 May 2026, 02:00", type: "Automated daily", size: "8.3 GB", status: "Complete", retention: "30 days" },
    { time: "9 May 2026, 02:00",  type: "Automated daily", size: "8.2 GB", status: "Complete", retention: "30 days" },
    { time: "8 May 2026, 14:22",  type: "Manual export (M. Farooq)", size: "8.2 GB", status: "Complete", retention: "Indefinite" },
    { time: "1 May 2026, 02:00",  type: "Automated monthly", size: "8.0 GB", status: "Complete", retention: "12 months" },
    { time: "1 Apr 2026, 02:00",  type: "Automated monthly", size: "7.6 GB", status: "Complete", retention: "12 months" },
  ],

  // Onboarding step weights (for system config)
  stepWeights: [
    { step: 1, name: "Mandatory Training", pct: 10 },
    { step: 2, name: "Joiner Info Submission", pct: 10 },
    { step: 3, name: "NEO + CPD", pct: 12 },
    { step: 4, name: "Performance Tracking", pct: 14 },
    { step: 5, name: "Monthly Feedback", pct: 22 },
    { step: 6, name: "Probation Completion", pct: 32 },
  ],
};

// =========================================================
// HELPERS
// =========================================================
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function initials(name) {
  return name.split(/\s+/).filter(Boolean).map(p => p[0]).slice(0, 2).join("").toUpperCase();
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("open");
  setTimeout(() => t.classList.remove("open"), 2400);
}
function roleBadges(roles) {
  const map = { admin: "Admin", hr: "HR", pm: "PM", employee: "Employee" };
  return roles.map(r => `<span class="role-badge role-badge--${r}">${map[r] || r}</span>`).join("");
}

// =========================================================
// SIDEBAR
// =========================================================
function renderNav(activeId) {
  const nav = $("#nav .nav__group");
  nav.innerHTML = `<div class="nav__heading">Platform</div>` + NAV_ITEMS.map(item => `
    <a class="nav__item ${item.id === activeId ? "nav__item--active" : ""}" data-route="${item.id}" href="#${item.id}">
      ${ICONS[item.iconKey] || ""}
      ${item.label}
      ${item.count !== undefined ? `<span class="nav__count ${item.countStyle ? "nav__count--" + item.countStyle : ""}">${item.count}</span>` : ""}
    </a>
  `).join("");
}

// =========================================================
// SLIDE-OVER
// =========================================================
function openSlideover({ title, body, list }) {
  $("#slideover-title").textContent = title;
  let html = "";
  if (body) html = body;
  if (list) {
    html += list.map(item => `
      <div class="so-item">
        <div class="so-item__avatar">${initials(item.name)}</div>
        <div class="so-item__main">
          <div class="so-item__name">${item.name}</div>
          <div class="so-item__desc">${item.desc || ""}</div>
        </div>
        <div class="so-item__meta">${item.meta || ""}</div>
      </div>
    `).join("");
  }
  $("#slideover-body").innerHTML = html;
  $("#overlay").classList.add("open");
  $("#slideover").classList.add("open");
}
function closeSlideover() {
  $("#overlay").classList.remove("open");
  $("#slideover").classList.remove("open");
}

// =========================================================
// PAGE: Dashboard
// =========================================================
// =========================================================
// ADMIN DASHBOARD — sections are reorderable + hideable.
// =========================================================

const ADMIN_DASHBOARD_SECTIONS = [
  { id: "welcome",       label: "Welcome banner",                 hint: "Greeting + quick-action buttons", alwaysVisible: true },
  { id: "metric-cards",  label: "Platform metric cards",          hint: "Tenant status, integration counts, sessions, etc." },
  { id: "audit-integrations", label: "Audit & Integration Health", hint: "Two-column row: recent audit entries + integration status" },
];
const ADMIN_DASHBOARD_DEFAULT_ORDER = ADMIN_DASHBOARD_SECTIONS.map(s => s.id);

function adminDashSectionWelcome() {
  return `
    <section class="welcome">
      <div class="welcome__text">
        <div class="welcome__eyebrow">SUPER ADMIN · M. FAROOQ</div>
        <h2 class="welcome__h">Platform is healthy · 4 items need attention</h2>
        <p class="welcome__p">3 webhook deliveries are failing to a legacy SharePoint endpoint. Credly API key expires in 14 days. All other integrations are green.</p>
      </div>
      <div class="welcome__quick">
        <button class="quick-action" data-quick="webhooks">
          <div class="quick-action__icon">${ICONS.broadcast}</div>
          <span>Webhooks</span>
        </button>
        <button class="quick-action" data-quick="audit">
          <div class="quick-action__icon">${ICONS.list}</div>
          <span>Audit Log</span>
        </button>
        <button class="quick-action" data-quick="integrations">
          <div class="quick-action__icon">${ICONS.plug}</div>
          <span>Integrations</span>
        </button>
        <button class="quick-action quick-action--ghost" data-action="admin-customize-dashboard" title="Reorder or hide dashboard sections">
          <div class="quick-action__icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1m17.5-7.5l-4.2 4.2M9.7 14.3l-4.2 4.2m13-0l-4.2-4.2M9.7 9.7L5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>
          <span>Customize</span>
        </button>
      </div>
    </section>`;
}

function adminDashSectionMetricCards() {
  return `
    <section class="cards" id="kpi-cards">
      ${DATA.kpiCards.map(card => {
        let deltaHtml = "";
        if (card.delta) {
          const arrow = card.delta.dir === "up" ? ICONS.arrowUp : card.delta.dir === "down" ? ICONS.arrowDown : ICONS.flat;
          deltaHtml = `<span class="card__delta card__delta--${card.delta.dir}">${arrow}${card.delta.text}</span>`;
        }
        const valueHtml = `<div class="card__value">${card.value}${card.valueSub ? `<span class="card__value-sub">${card.valueSub}</span>` : ""}</div>`;
        let bottomHtml = "";
        if (card.bar) {
          bottomHtml = `
            <div class="card__bar"><div class="card__bar-fill ${card.bar.style ? "card__bar-fill--" + card.bar.style : ""}" style="width:${card.bar.pct}%"></div></div>
            <div class="card__meta">${card.barLabel || ""}</div>`;
        } else if (card.meta) {
          bottomHtml = `<div class="card__meta">${card.meta}</div>`;
        }
        return `
          <div class="card" data-card-id="${card.id}">
            <div class="card__head">
              <div class="card__icon card__icon--${card.iconStyle}">${ICONS[card.icon] || ""}</div>
              ${deltaHtml}
            </div>
            <div class="card__title">${card.title}</div>
            ${valueHtml}
            ${bottomHtml}
          </div>`;
      }).join("")}
    </section>`;
}

function adminDashSectionAuditIntegrations() {
  return `
    <section class="grid-two">
      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Recent Audit Activity</h3>
            <p class="panel__sub">Last hour · across all modules</p>
          </div>
          <a class="panel__link" data-nav="audit">View full log →</a>
        </header>
        <div class="panel__body">
          <div class="activity-feed">
            ${DATA.auditPreview.map(a => `
              <div class="act">
                <div class="act__dot act__dot--${a.style}">${ICONS[a.icon] || ""}</div>
                <div class="act__main"><strong>${a.actor}</strong> <span>${a.action}</span><br><code>${a.target}</code></div>
                <div class="act__time">${a.time}</div>
              </div>`).join("")}
          </div>
        </div>
      </article>

      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Integration Health</h3>
            <p class="panel__sub">8 connected · 7 healthy · 1 warning</p>
          </div>
          <a class="panel__link" data-nav="integrations">Manage →</a>
        </header>
        <div class="panel__body" style="padding:8px 16px 16px">
          ${DATA.integrations.map(i => {
            const st = i.status === "Connected" ? "ok" : i.status === "Warning" ? "warn" : "danger";
            return `
              <div style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid var(--ink-100)">
                <div class="icard__logo icard__logo--${i.logo}" style="width:32px;height:32px;font-size:10.5px;border-radius:7px">${i.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:600;color:var(--ink-900)">${i.name}</div>
                  <div style="font-size:11px;color:var(--ink-500)">${i.category}</div>
                </div>
                <div style="text-align:right">
                  <span class="status status--${st}">${i.status}</span>
                  <div style="font-size:10.5px;color:var(--ink-400);font-family:var(--font-mono);margin-top:2px">${i.lastSync}</div>
                </div>
              </div>`;
          }).join("")}
        </div>
      </article>
    </section>`;
}

const ADMIN_DASHBOARD_SECTION_RENDERERS = {
  "welcome":             adminDashSectionWelcome,
  "metric-cards":        adminDashSectionMetricCards,
  "audit-integrations":  adminDashSectionAuditIntegrations,
};

function pageDashboard() {
  const prefs = window.SUDO_LAYOUT
    ? SUDO_LAYOUT.getPrefs("admin-dashboard", ADMIN_DASHBOARD_DEFAULT_ORDER)
    : { order: ADMIN_DASHBOARD_DEFAULT_ORDER, hidden: [] };

  return prefs.order
    .filter(id => !prefs.hidden.includes(id))
    .map(id => (ADMIN_DASHBOARD_SECTION_RENDERERS[id] || (() => ""))())
    .join("\n");
}

// =========================================================
// PAGE: Roles & Permissions
// =========================================================
function pageRoles() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Roles & Permissions</h2>
        <div class="page-header__sub">Four portal roles mapped to Microsoft Entra security groups. Group membership in Entra is the source of truth.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Export Matrix</button>
        <button class="btn btn--primary">${ICONS.plus} Create Custom Role</button>
      </div>
    </div>

    <section class="cards" style="grid-template-columns:repeat(4,1fr);margin-bottom:22px">
      ${DATA.roles.map(r => `
        <div class="card" data-role="${r.color}" style="min-height:auto">
          <div class="card__head">
            <span class="role-badge role-badge--${r.color}" style="font-size:11px;padding:3px 8px">${r.name}</span>
          </div>
          <div class="card__value" style="font-size:24px;font-family:var(--font-display)">${r.members}</div>
          <div class="card__title" style="margin-bottom:8px">members</div>
          <div class="card__meta" style="font-family:var(--font-mono);font-size:10.5px;color:var(--ink-700);background:var(--ink-100);padding:4px 8px;border-radius:5px;display:inline-flex">${r.entraGroup}</div>
        </div>`).join("")}
    </section>

    <article class="panel" style="margin-bottom:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Permission Matrix</h3>
          <p class="panel__sub">What each role can and cannot do · authoritative reference</p>
        </div>
      </header>
      <div class="panel__body" style="padding:0">
        <div class="permissions-matrix">
          <div class="perm-row perm-row--head">
            <div>Action</div>
            <div class="perm-row__cell">Super Admin</div>
            <div class="perm-row__cell">HR</div>
            <div class="perm-row__cell">PM</div>
            <div class="perm-row__cell">Employee</div>
          </div>
          ${DATA.permissions.map(p => `
            <div class="perm-row">
              <div>${p.action}</div>
              ${[p.sa, p.hr, p.pm, p.emp].map(v => {
                if (v === "✓") return `<div class="perm-row__cell perm-row__cell--y">✓</div>`;
                if (v === "✗") return `<div class="perm-row__cell perm-row__cell--n">✗</div>`;
                return `<div class="perm-row__cell perm-row__cell--p">◐ ${v}</div>`;
              }).join("")}
            </div>`).join("")}
        </div>
      </div>
    </article>

    <article class="panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Entra Group Mapping</h3>
          <p class="panel__sub">How Microsoft Entra groups map to portal roles</p>
        </div>
      </header>
      <div class="panel__body" style="padding:0">
        <table class="table">
          <thead><tr><th>Portal Role</th><th>Entra Security Group</th><th>Members</th><th>Multi-role behaviour</th><th></th></tr></thead>
          <tbody>
            ${DATA.roles.map(r => `
              <tr class="row-clickable">
                <td><span class="role-badge role-badge--${r.color}">${r.name}</span></td>
                <td class="table__mono">${r.entraGroup}</td>
                <td>${r.members}</td>
                <td style="color:var(--ink-500);font-size:12px">${r.color === 'employee' ? 'Default for every active user' : 'Always combined with sudoconsultants-portal-user'}</td>
                <td><button class="btn btn--ghost btn--sm">${ICONS.edit}</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </article>`;
}

// =========================================================
// PAGE: Portal Users
// =========================================================
function pageUsers() {
  // Compute effective roles for every employee (overrides + derived)
  const rows = SUDO_DB.employees.map(e => {
    const roles = (window.SUDO_DB_OVERRIDES ? SUDO_DB_OVERRIDES.getRoles(e.id) : ["employee"]);
    const team = e.teamId ? SUDO_DB_HELPERS.findTeam(e.teamId) : null;
    return { emp: e, roles, team };
  });

  function roleChips(roles) {
    if (!roles || roles.length === 0) return '<span class="status status--muted">—</span>';
    const map = {
      admin:    '<span class="status status--info" style="background:#FEF3C7;color:#92400E">Admin</span>',
      hr:       '<span class="status status--info" style="background:#DBEAFE;color:#1E40AF">HR</span>',
      pm:       '<span class="status status--info" style="background:#E0E7FF;color:#3730A3">PM</span>',
      tl:       '<span class="status status--info" style="background:#D1FAE5;color:#065F46">TL</span>',
      employee: '<span class="status status--muted">Employee</span>',
    };
    return roles.map(r => map[r] || `<span class="status status--muted">${r}</span>`).join(" ");
  }

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Portal Users · Role & Team Assignment</h2>
        <div class="page-header__sub">${rows.length} accounts · synced from Microsoft Entra · click any row to edit roles, team, and team-role</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary" data-action="admin-reset-overrides">${ICONS.refresh || ICONS.lock} Reset overrides</button>
        <button class="btn btn--secondary">${ICONS.refresh} Sync Entra</button>
        <button class="btn btn--secondary">${ICONS.download} Export</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:14px">${ICONS.shield || ICONS.lock}
      <div><strong>Role assignments are live.</strong> Changing someone's roles or team here propagates to HR / TL / PM / Employee portals on next page load. All changes are audit-logged.</div>
    </div>

    <div id="fb-admin-users"></div>

    <div class="table-wrap" id="admin-users-results">
      <table class="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Team</th>
            <th>Team role</th>
            <th>Portal roles</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(({ emp, roles, team }) => {
            const tags = ["all", (emp.status || "").toLowerCase()];
            roles.forEach(r => tags.push(r));
            if (team) tags.push("team-" + team.id);
            const search = `${emp.name} ${emp.email} ${emp.title || ''} ${(team || {}).name || ''} ${emp.teamRole || ''} ${roles.join(' ')}`.toLowerCase();
            return `
              <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${search}" data-action="admin-edit-user" data-emp-id="${emp.id}">
                <td>
                  <div class="table__cell-name">
                    <div class="table__avatar">${initials(emp.name)}</div>
                    <div>
                      <div class="table__name">${emp.name}</div>
                      <div class="table__sub">${emp.email}</div>
                    </div>
                  </div>
                </td>
                <td>${team ? `<span class="status" style="background:${team.color}20;color:${team.color};border-color:${team.color}40">${team.short}</span> <span class="table__sub" style="font-size:11px">${team.name}</span>` : '<span class="status status--muted">—</span>'}</td>
                <td>${emp.teamRole ? `<strong style="text-transform:capitalize">${emp.teamRole}</strong>` : '—'}</td>
                <td>${roleChips(roles)}</td>
                <td>${
                  emp.status === "Confirmed" ? '<span class="status status--ok">Active</span>'
                  : emp.status === "Onboarding" ? '<span class="status status--info">Onboarding</span>'
                  : emp.status === "Probation" ? '<span class="status status--warn">Probation</span>'
                  : `<span class="status status--muted">${emp.status || '—'}</span>`}</td>
                <td><button class="btn btn--ghost btn--sm">${ICONS.pen || ICONS.arrowRight} Edit</button></td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No users match these filters</div>
      </div>
    </div>
    <div id="pg-admin-users"></div>`;
}

// =========================================================
// PAGE: Integrations
// =========================================================
function pageIntegrations() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Integrations</h2>
        <div class="page-header__sub">8 connected · API keys, OAuth tokens, and webhook configuration. Rotate credentials quarterly.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.refresh} Test All Connections</button>
        <button class="btn btn--primary">${ICONS.plus} Add Integration</button>
      </div>
    </div>

    <div class="integrations-grid">
      ${DATA.integrations.map(i => {
        const st = i.status === "Connected" ? "ok" : i.status === "Warning" ? "warn" : "danger";
        return `
          <div class="icard" data-integration-id="${i.id}">
            <div class="icard__head">
              <div class="icard__logo icard__logo--${i.logo}">${i.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
              <div style="flex:1;min-width:0">
                <div class="icard__name">${i.name}</div>
                <div class="icard__sub">${i.category}</div>
              </div>
              <span class="status status--${st}">${i.status}</span>
            </div>
            <div class="icard__sub" style="font-size:12px">${i.scope}</div>
            <div class="icard__meta">
              <div><strong>Last sync:</strong> ${i.lastSync}</div>
            </div>
            <div class="icard__foot">
              <button class="btn btn--ghost btn--sm">${ICONS.refresh} Test</button>
              <button class="btn btn--ghost btn--sm">${ICONS.key} Rotate Key</button>
              <button class="btn btn--ghost btn--sm" style="margin-left:auto">${ICONS.edit} Configure</button>
            </div>
          </div>`;
      }).join("")}
    </div>`;
}

// =========================================================
// PAGE: Webhooks
// =========================================================
function pageWebhooks() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Webhooks</h2>
        <div class="page-header__sub">Outbound HTTPS webhooks · HMAC-SHA256 signed · retry with exponential backoff (3 attempts)</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.history} Delivery Log</button>
        <button class="btn btn--primary">${ICONS.plus} New Endpoint</button>
      </div>
    </div>

    <div id="fb-admin-webhooks"></div>

    <article class="panel" style="margin-bottom:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Registered Endpoints</h3>
          <p class="panel__sub">${DATA.webhookEndpoints.length} endpoints · ${DATA.webhookEndpoints.filter(e=>e.failing).length} failing</p>
        </div>
      </header>
      <div class="panel__body" style="padding:0" id="admin-webhooks-results">
        <table class="table">
          <thead><tr><th>Endpoint URL</th><th>Events</th><th>Success Rate (24h)</th><th>Delivered (24h)</th><th>State</th><th></th></tr></thead>
          <tbody>
            ${DATA.webhookEndpoints.map(e => {
              const successStyle = e.success >= 99 ? "ok" : e.success >= 90 ? "warn" : "danger";
              const tags = ["all"];
              if (e.failing)         tags.push("failing");
              else if (e.active)     tags.push("active");
              else                    tags.push("paused");
              // Event-group tag
              (e.events || []).forEach(ev => {
                const prefix = (ev || "").split(".")[0];
                if (prefix) tags.push(prefix + "-event");
              });
              const searchText = `${e.url} ${(e.events||[]).join(" ")}`.toLowerCase();
              return `
                <tr class="row-clickable" data-webhook-id="${e.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
                  <td class="table__mono" style="max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.url}</td>
                  <td>${e.events.length > 1 ? `${e.events.length} events` : e.events[0]}</td>
                  <td>
                    <div class="progress-mini" style="min-width:140px">
                      <div class="progress-mini__bar"><div class="progress-mini__fill progress-mini__fill--${successStyle}" style="width:${e.success}%"></div></div>
                      <div class="progress-mini__text">${e.success}%</div>
                    </div>
                  </td>
                  <td class="table__mono">${e.delivered.toLocaleString()}</td>
                  <td>${e.active ? '<span class="status status--ok">Active</span>' : '<span class="status status--muted">Paused</span>'}</td>
                  <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button></td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
        <div class="fb-empty" style="display:none">
          <div style="text-align:center;padding:30px;color:var(--ink-500)">No webhook endpoints match these filters</div>
        </div>
      </div>
    </article>
    <div id="pg-admin-webhooks"></div>

    <article class="panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Recent Delivery Log</h3>
          <p class="panel__sub">Last 15 deliveries · across all endpoints</p>
        </div>
        <div class="panel__filters">
          <button class="chip chip--active">All</button>
          <button class="chip">Failed only</button>
        </div>
      </header>
      <div class="panel__body" style="padding:0">
        ${DATA.webhookLog.map(l => {
          const codeClass = l.status >= 200 && l.status < 300 ? "2xx" : l.status < 500 ? "4xx" : "5xx";
          return `
            <div class="log-row">
              <div class="log-row__time">${l.time}</div>
              <div><span class="log-row__method">${l.method}</span></div>
              <div class="log-row__event">${l.event} <span style="color:var(--ink-400)">→</span> ${l.endpoint}</div>
              <div><span class="log-row__code log-row__code--${codeClass}">${l.status}</span></div>
              <div class="log-row__latency">${l.latency}</div>
            </div>`;
        }).join("")}
      </div>
    </article>`;
}

// =========================================================
// PAGE: Audit Log
// =========================================================
function pageAudit() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Audit Log</h2>
        <div class="page-header__sub">Every state-changing action across the platform · immutable · 7 year retention (UAE/KSA PDPL)</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Export CSV</button>
        <button class="btn btn--secondary">${ICONS.download} Export JSON</button>
      </div>
    </div>

    <div id="fb-admin-audit"></div>

    <div class="table-wrap" id="admin-audit-results">
      <table class="table">
        <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>IP</th><th>Result</th></tr></thead>
        <tbody>
          ${DATA.audit.map(a => {
            const tags = ["all"];
            const resultSlug = a.result === "Success" ? "success" : "failure";
            tags.push(resultSlug);
            // Categorise action verbs
            const actionLower = (a.action || "").toLowerCase();
            if (/auth|login|signin|signout|mfa/.test(actionLower)) tags.push("auth");
            else if (/config|setting|integration|webhook|tenant/.test(actionLower)) tags.push("config");
            else                                                                     tags.push("data");
            // Actor role bucket
            const actorLower = (a.actor || "").toLowerCase();
            if      (actorLower.includes("admin"))    tags.push("super-admin");
            else if (actorLower.includes("hr"))       tags.push("hr");
            else if (actorLower.includes("pm"))       tags.push("pm");
            else if (actorLower.includes("tl"))       tags.push("tl");
            else if (actorLower.includes("system"))   tags.push("system");
            else                                       tags.push("employee");
            const searchText = `${a.actor} ${a.action} ${a.target} ${a.ip}`.toLowerCase();
            return `
            <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
              <td class="table__mono">${a.time}</td>
              <td><strong>${a.actor}</strong></td>
              <td class="table__mono">${a.action}</td>
              <td style="font-size:12px;color:var(--ink-500)">${a.target}</td>
              <td class="table__mono" style="font-size:11.5px">${a.ip}</td>
              <td>${a.result === "Success" ? '<span class="status status--ok">Success</span>' : `<span class="status status--danger">${a.result}</span>`}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No audit entries match these filters</div>
      </div>
    </div>
    <div id="pg-admin-audit"></div>`;
}

// =========================================================
// PAGE: Sessions & Sign-ins
// =========================================================
function pageSessions() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Sessions & Sign-ins</h2>
        <div class="page-header__sub">${DATA.sessions.length} active sessions · session timeout 8h absolute, 30min idle for Super Admin</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.history} Sign-in History</button>
        <button class="btn btn--danger">${ICONS.unlink} Revoke All</button>
      </div>
    </div>

    <section class="cards" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px">
      <div class="card" style="cursor:default;min-height:auto">
        <div class="card__head"><div class="card__icon card__icon--ok">${ICONS.activity}</div></div>
        <div class="card__value">${DATA.sessions.length}</div>
        <div class="card__title">Active sessions now</div>
      </div>
      <div class="card" style="cursor:default;min-height:auto">
        <div class="card__head"><div class="card__icon card__icon--bright">${ICONS.key}</div></div>
        <div class="card__value">94</div>
        <div class="card__title">Sign-ins today</div>
      </div>
      <div class="card" style="cursor:default;min-height:auto">
        <div class="card__head"><div class="card__icon card__icon--ok">${ICONS.shield}</div></div>
        <div class="card__value">100<span class="card__value-sub">%</span></div>
        <div class="card__title">MFA compliance</div>
      </div>
      <div class="card" style="cursor:default;min-height:auto">
        <div class="card__head"><div class="card__icon card__icon--warn">${ICONS.alert}</div></div>
        <div class="card__value">2</div>
        <div class="card__title">Sign-ins flagged (medium risk)</div>
      </div>
    </section>

    <article class="panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Active Sessions</h3>
          <p class="panel__sub">Live · auto-refreshes every 30 seconds</p>
        </div>
        <div class="panel__filters">
          <button class="chip chip--active">All</button>
          <button class="chip">Risky only</button>
        </div>
      </header>
      <div class="panel__body" style="padding:0">
        <table class="table">
          <thead><tr><th>User</th><th>Device</th><th>IP / Location</th><th>Logged in</th><th>Duration</th><th>Risk</th><th></th></tr></thead>
          <tbody>
            ${DATA.sessions.map(s => `
              <tr class="row-clickable">
                <td>
                  <div class="table__cell-name">
                    <span class="live-dot"></span>
                    <div class="table__avatar">${initials(s.name)}</div>
                    <div>
                      <div class="table__name">${s.name}</div>
                      <div class="table__sub">${roleBadges([s.role === 'emp' ? 'employee' : s.role])}</div>
                    </div>
                  </div>
                </td>
                <td style="font-size:12px;color:var(--ink-500)">${s.device}</td>
                <td><div class="table__mono" style="font-size:11.5px">${s.ip}</div><div style="font-size:11.5px;color:var(--ink-500)">${s.location}</div></td>
                <td class="table__mono">${s.loggedAt}</td>
                <td class="table__mono">${s.duration}</td>
                <td>${s.risk === "Low" ? '<span class="status status--ok">Low</span>' : s.risk === "Medium" ? '<span class="status status--warn">Medium</span>' : '<span class="status status--danger">High</span>'}</td>
                <td><button class="btn btn--ghost btn--sm">${ICONS.unlink}</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </article>`;
}

// =========================================================
// PAGE: System Configuration
// =========================================================
function pageConfig() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">System Configuration</h2>
        <div class="page-header__sub">Platform-wide settings · every change is audit-logged with old and new values.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--primary">${ICONS.check} Save All Changes</button>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section__title">Workspace identity</div>
      <div class="config-section__desc">Workspace name, logo, and the short label that appears in every portal sidebar. Changes propagate to all 5 portals on save.</div>

      <div class="workspace-form">
        <div class="workspace-form__preview">
          <div class="workspace-form__preview-label">Live preview</div>
          <div class="workspace-form__preview-tile">
            <div class="workspace-form__preview-logo" id="ws-preview-logo">
              <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
                <rect x="2" y="2" width="28" height="28" rx="6" fill="#189CD9"/>
                <path d="M11 9c0 6 10 4 10 10 0 4-4 6-7 6h-3" stroke="white" stroke-width="2.4" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
            <div class="workspace-form__preview-text">
              <div class="workspace-form__preview-name" id="ws-preview-name">SUDO</div>
              <div class="workspace-form__preview-sub" id="ws-preview-sub">Employee Portal</div>
            </div>
          </div>
        </div>

        <div class="workspace-form__fields">
          <div class="field">
            <label class="field__label">Workspace name</label>
            <input class="input" id="ws-name" value="SUDO" maxlength="32" oninput="document.getElementById('ws-preview-name').textContent = this.value || 'SUDO'" />
            <div class="field__hint">Shown in the sidebar header of every portal. Keep it short — 3 to 8 characters works best.</div>
          </div>
          <div class="field">
            <label class="field__label">Sidebar tagline</label>
            <input class="input" id="ws-tag" value="Employee Portal" maxlength="32" oninput="document.getElementById('ws-preview-sub').textContent = this.value || 'Employee Portal'" />
            <div class="field__hint">Optional sub-label shown below the workspace name.</div>
          </div>
          <div class="field field--full">
            <label class="field__label">Workspace logo</label>
            <div class="logo-upload">
              <button class="btn btn--secondary btn--sm" data-action="upload-logo">${ICONS.upload || ICONS.send} Upload SVG / PNG</button>
              <span style="font-size:11.5px;color:var(--ink-500)">Current: <code>sudo-mark.svg</code> · 2.1 KB · uploaded 14 Apr 2026</span>
              <button class="btn btn--ghost btn--sm" data-action="reset-logo" style="margin-left:auto">${ICONS.refresh || ""} Reset to default</button>
            </div>
            <div class="field__hint">Recommended: square SVG, 64×64 minimum. Logos are auto-rendered in white on the dark navy sidebar.</div>
          </div>
          <div class="field field--full">
            <label class="field__label">Tenant domain</label>
            <input class="input" value="sudoconsultants.onmicrosoft.com" disabled />
            <div class="field__hint">Tenant is set at provisioning time and cannot be changed here. Contact Anthropic/Azure to migrate.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section__title">Onboarding Step Weights</div>
      <div class="config-section__desc">How the 6-step onboarding plan contributes to overall completion. Total must equal 100%.</div>
      <div class="step-rows">
        ${DATA.stepWeights.map(s => {
          const inside = s.pct >= 25;
          const label = inside
            ? `<div class="step-row__label step-row__label--inside">${s.name}</div>`
            : `<div class="step-row__label step-row__label--outside" style="left:calc(${s.pct}% + 12px)">${s.name}</div>`;
          return `
          <div class="step-row">
            <div class="step-row__num">${s.step}</div>
            <div class="step-row__bar">
              <div class="step-row__bar-fill" style="width:${s.pct}%"></div>
              ${label}
            </div>
            <div class="step-row__pct">${s.pct}%</div>
          </div>`;
        }).join("")}
      </div>
      <div style="margin-top:14px;display:flex;justify-content:flex-end;font-size:12px;color:var(--ok);font-weight:600">Total: 100% ✓</div>
    </div>

    <div class="config-section">
      <div class="config-section__title">Branding</div>
      <div class="config-section__desc">Logo, colors, and email templates applied across all role modules.</div>
      <div class="form-grid">
        <div class="field"><label class="field__label">Primary brand color</label><input class="input" value="#204D9B" /></div>
        <div class="field"><label class="field__label">Accent color</label><input class="input" value="#189CD9" /></div>
        <div class="field"><label class="field__label">Display font</label><input class="input" value="Plus Jakarta Sans" /></div>
        <div class="field"><label class="field__label">Body font</label><input class="input" value="Lora" /></div>
        <div class="field field--full"><label class="field__label">Email from address</label><input class="input" value="hr@sudoconsultants.com" /></div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section__title">Feature Flags</div>
      <div class="config-section__desc">Toggle modules and experimental features per environment.</div>
      <div class="config-row">
        <div class="config-row__main"><strong>Letter requests (optional self-service)</strong><span>Allow employees to request salary certificates, NOC, employment letters</span></div>
        <div class="toggle toggle--on"><div class="toggle__track"></div></div>
      </div>
      <div class="config-row">
        <div class="config-row__main"><strong>Read-only leave balances</strong><span>Show ODOO leave summary in employee module (leave applications stay in ODOO)</span></div>
        <div class="toggle toggle--on"><div class="toggle__track"></div></div>
      </div>
      <div class="config-row">
        <div class="config-row__main"><strong>Auto-generated SUDO resume</strong><span>Employees can preview and download auto-built resume</span></div>
        <div class="toggle toggle--on"><div class="toggle__track"></div></div>
      </div>
      <div class="config-row">
        <div class="config-row__main"><strong>Slack channel notifications</strong><span>Send notifications to Slack channels in addition to DMs</span></div>
        <div class="toggle toggle--on"><div class="toggle__track"></div></div>
      </div>
      <div class="config-row">
        <div class="config-row__main"><strong>Beta: AI-assisted KPI suggestions</strong><span>Suggest KPIs based on role and project history</span></div>
        <div class="toggle"><div class="toggle__track"></div></div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section__title">Session & Security Policies</div>
      <div class="config-section__desc">Inherited from Microsoft Entra Conditional Access where applicable.</div>
      <div class="form-grid">
        <div class="field"><label class="field__label">Session idle timeout (Employees/HR/PM)</label><select class="select"><option>8 hours</option><option>4 hours</option><option>2 hours</option></select></div>
        <div class="field"><label class="field__label">Session idle timeout (Super Admin)</label><select class="select"><option>30 minutes</option><option>15 minutes</option><option>1 hour</option></select></div>
        <div class="field"><label class="field__label">Absolute session timeout</label><select class="select"><option>8 hours</option><option>12 hours</option><option>24 hours</option></select></div>
        <div class="field"><label class="field__label">MFA enforcement</label><select class="select"><option>Required for all (via Entra)</option><option>Required for Admin only</option></select></div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section__title">Data Retention</div>
      <div class="config-section__desc">Compliance with UAE PDPL and KSA PDPL.</div>
      <div class="form-grid">
        <div class="field"><label class="field__label">Audit log retention</label><select class="select"><option>7 years</option><option>5 years</option><option>3 years</option></select></div>
        <div class="field"><label class="field__label">Inactive user retention</label><select class="select"><option>2 years</option><option>1 year</option><option>5 years</option></select></div>
        <div class="field"><label class="field__label">Document retention</label><select class="select"><option>10 years</option><option>7 years</option><option>5 years</option></select></div>
        <div class="field"><label class="field__label">Backup retention</label><select class="select"><option>30 days daily + 12 months monthly</option><option>90 days daily</option></select></div>
      </div>
    </div>`;
}

// =========================================================
// PAGE: Notification Templates
// =========================================================
function pageTemplates() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Notification Templates</h2>
        <div class="page-header__sub">Reusable templates HR uses to send notifications. Edit here, applied everywhere.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Export</button>
        <button class="btn btn--primary">${ICONS.plus} New Template</button>
      </div>
    </div>

    <div id="fb-admin-templates"></div>

    <div class="table-wrap" id="admin-templates-results">
      <table class="table">
        <thead><tr><th>Template</th><th>Category</th><th>Channels</th><th>Last edited</th><th></th></tr></thead>
        <tbody>
          ${DATA.templates.map(t => {
            const catSlug = (t.category || "").toLowerCase();
            const tags = ["all", catSlug];
            // Status — default to active unless we have data saying otherwise
            const statusSlug = (t.status || "active").toLowerCase();
            tags.push(statusSlug);
            (t.channels || []).forEach(c => tags.push(c.toLowerCase().replace(/[^\w]+/g, "-")));
            const searchText = `${t.id} ${t.name} ${t.category}`.toLowerCase();
            return `
            <tr class="row-clickable" data-template-id="${t.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
              <td><div class="table__name">${t.name}</div><div class="table__sub">${t.id}</div></td>
              <td><span class="status status--info">${t.category}</span></td>
              <td>${t.channels.map(c => `<span class="role-badge role-badge--pm" style="margin-right:3px">${c}</span>`).join("")}</td>
              <td style="font-size:12px;color:var(--ink-500)">${t.lastEdited}</td>
              <td style="text-align:right">
                <button class="btn btn--ghost btn--sm">${ICONS.copy}</button>
                <button class="btn btn--ghost btn--sm">${ICONS.edit}</button>
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No templates match these filters</div>
      </div>
    </div>
    <div id="pg-admin-templates"></div>`;
}

// =========================================================
// PAGE: Backups & Data
// =========================================================
function pageBackups() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Backups & Data</h2>
        <div class="page-header__sub">Automated daily and monthly tenant backups · manual exports for compliance review</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary" data-action="run-backup">${ICONS.refresh} Run Backup Now</button>
        <button class="btn btn--primary" data-action="manual-export">${ICONS.download} Manual Export</button>
      </div>
    </div>

    <section class="cards" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px">
      <div class="card" style="cursor:default;min-height:auto">
        <div class="card__head"><div class="card__icon card__icon--ok">${ICONS.database}</div></div>
        <div class="card__value">8.4<span class="card__value-sub">GB</span></div>
        <div class="card__title">Latest backup size</div>
      </div>
      <div class="card" style="cursor:default;min-height:auto">
        <div class="card__head"><div class="card__icon card__icon--bright">${ICONS.clock}</div></div>
        <div class="card__value">02:00</div>
        <div class="card__title">Daily backup time (UTC+4)</div>
      </div>
      <div class="card" style="cursor:default;min-height:auto">
        <div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check}</div></div>
        <div class="card__value">100<span class="card__value-sub">%</span></div>
        <div class="card__title">Backup success rate (30 days)</div>
      </div>
      <div class="card" style="cursor:default;min-height:auto">
        <div class="card__head"><div class="card__icon card__icon--info">${ICONS.hardDrive}</div></div>
        <div class="card__value">252<span class="card__value-sub">GB</span></div>
        <div class="card__title">Total backup storage used</div>
      </div>
    </section>

    <article class="panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Backup History</h3>
          <p class="panel__sub">Last ${DATA.backups.length} backups</p>
        </div>
      </header>
      <div class="panel__body" style="padding:0">
        <table class="table">
          <thead><tr><th>Time</th><th>Type</th><th>Size</th><th>Status</th><th>Retention</th><th></th></tr></thead>
          <tbody>
            ${DATA.backups.map(b => `
              <tr class="row-clickable">
                <td class="table__mono">${b.time}</td>
                <td>${b.type}</td>
                <td class="table__mono">${b.size}</td>
                <td><span class="status status--ok">${b.status}</span></td>
                <td>${b.retention}</td>
                <td style="text-align:right">
                  <button class="btn btn--ghost btn--sm">${ICONS.download}</button>
                  <button class="btn btn--ghost btn--sm">${ICONS.refresh} Restore</button>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </article>`;
}

// =========================================================
// PAGE: System Health
// =========================================================
function pageHealth() {
  // build sparkline points
  function sparkPoints(values, w = 280, h = 60) {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const step = w / (values.length - 1);
    return values.map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * (h - 8) - 4).toFixed(1)}`).join(" ");
  }
  const apiCalls = [820, 940, 1020, 870, 1100, 1240, 980, 1080, 1320, 1150, 1280, 1410, 1370, 1480, 1520, 1390, 1450, 1620, 1580, 1490, 1620, 1750, 1830, 1820];
  const errors = [4, 2, 3, 1, 5, 2, 1, 3, 2, 4, 3, 1, 2, 1, 0, 2, 3, 1, 2, 1, 2, 3, 1, 0];
  const sessions = [12, 18, 22, 28, 31, 35, 38, 41, 43, 42, 40, 41, 38, 36, 33, 30, 28, 31, 35, 39, 42, 41, 39, 41];
  const latency = [82, 78, 92, 88, 96, 102, 89, 95, 110, 108, 102, 98, 95, 92, 88, 90, 95, 102, 108, 112, 105, 98, 95, 92];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">System Health</h2>
        <div class="page-header__sub">Real-time performance metrics · ${new Date().toLocaleString()} · last 24h windows</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.refresh} Refresh</button>
      </div>
    </div>

    <div class="health-grid">
      <div class="health-card">
        <div class="health-card__head">
          <div>
            <div class="health-card__title">API Calls / hour</div>
            <div class="health-card__value">1,820</div>
            <div class="health-card__sub">Last hour · peak today 1,830</div>
          </div>
          <div class="card__icon card__icon--bright">${ICONS.globe}</div>
        </div>
        <svg class="sparkline" viewBox="0 0 280 60" preserveAspectRatio="none">
          <polyline points="${sparkPoints(apiCalls)}" fill="none" stroke="#189CD9" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="health-card">
        <div class="health-card__head">
          <div>
            <div class="health-card__title">Errors / hour</div>
            <div class="health-card__value">0</div>
            <div class="health-card__sub">Last hour · 24h total: 7 (all non-blocking)</div>
          </div>
          <div class="card__icon card__icon--warn">${ICONS.alert}</div>
        </div>
        <svg class="sparkline" viewBox="0 0 280 60" preserveAspectRatio="none">
          <polyline points="${sparkPoints(errors)}" fill="none" stroke="#C77A00" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="health-card">
        <div class="health-card__head">
          <div>
            <div class="health-card__title">Active Sessions</div>
            <div class="health-card__value">41</div>
            <div class="health-card__sub">Last hour · peak today 43</div>
          </div>
          <div class="card__icon card__icon--ok">${ICONS.activity}</div>
        </div>
        <svg class="sparkline" viewBox="0 0 280 60" preserveAspectRatio="none">
          <polyline points="${sparkPoints(sessions)}" fill="none" stroke="#1F8A4C" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="health-card">
        <div class="health-card__head">
          <div>
            <div class="health-card__title">Avg API Latency</div>
            <div class="health-card__value">92<span style="font-size:16px;color:var(--ink-400)">ms</span></div>
            <div class="health-card__sub">Last hour · p95: 184ms · p99: 312ms</div>
          </div>
          <div class="card__icon card__icon--navy">${ICONS.zap}</div>
        </div>
        <svg class="sparkline" viewBox="0 0 280 60" preserveAspectRatio="none">
          <polyline points="${sparkPoints(latency)}" fill="none" stroke="#204D9B" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <article class="panel" style="margin-top:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Subsystem Status</h3>
          <p class="panel__sub">Live health checks · every 60 seconds</p>
        </div>
      </header>
      <div class="panel__body" style="padding:0">
        <table class="table">
          <thead><tr><th>Subsystem</th><th>Status</th><th>Last check</th><th>Latency</th><th>Error rate (24h)</th></tr></thead>
          <tbody>
            <tr><td><strong>Web Application</strong></td><td><span class="status status--ok">Healthy</span></td><td class="table__mono">12 May 14:32</td><td class="table__mono">38ms</td><td class="table__mono">0.04%</td></tr>
            <tr><td><strong>API Gateway</strong></td><td><span class="status status--ok">Healthy</span></td><td class="table__mono">12 May 14:32</td><td class="table__mono">92ms</td><td class="table__mono">0.02%</td></tr>
            <tr><td><strong>Database (Postgres)</strong></td><td><span class="status status--ok">Healthy</span></td><td class="table__mono">12 May 14:32</td><td class="table__mono">11ms</td><td class="table__mono">0.00%</td></tr>
            <tr><td><strong>Object Storage</strong></td><td><span class="status status--ok">Healthy</span></td><td class="table__mono">12 May 14:31</td><td class="table__mono">68ms</td><td class="table__mono">0.01%</td></tr>
            <tr><td><strong>Background Workers</strong></td><td><span class="status status--ok">Healthy</span></td><td class="table__mono">12 May 14:32</td><td class="table__mono">—</td><td class="table__mono">0.08%</td></tr>
            <tr><td><strong>Notification Queue</strong></td><td><span class="status status--ok">Healthy</span></td><td class="table__mono">12 May 14:32</td><td class="table__mono">4ms enqueue</td><td class="table__mono">0.00%</td></tr>
            <tr><td><strong>Webhook Publisher</strong></td><td><span class="status status--warn">Degraded</span></td><td class="table__mono">12 May 14:32</td><td class="table__mono">142ms avg</td><td class="table__mono">0.6% (1 failing endpoint)</td></tr>
            <tr><td><strong>ODOO Connector</strong></td><td><span class="status status--ok">Healthy</span></td><td class="table__mono">12 May 14:28</td><td class="table__mono">540ms (last sync)</td><td class="table__mono">0.00%</td></tr>
            <tr><td><strong>Entra Sync</strong></td><td><span class="status status--ok">Healthy</span></td><td class="table__mono">Live (SSO)</td><td class="table__mono">—</td><td class="table__mono">0.00%</td></tr>
          </tbody>
        </table>
      </div>
    </article>`;
}

// =========================================================
// ROUTER
// =========================================================
const ROUTES = {
  "dashboard":    pageDashboard,
  "roles":        pageRoles,
  "users":        pageUsers,
  "integrations": pageIntegrations,
  "webhooks":     pageWebhooks,
  "audit":        pageAudit,
  "sessions":     pageSessions,
  "config":       pageConfig,
  "templates":    pageTemplates,
  "backups":      pageBackups,
  "health":       pageHealth,
};

function route() {
  const hash = location.hash.replace(/^#/, "") || "dashboard";
  const id = ROUTES[hash] ? hash : "dashboard";
  const meta = NAV_ITEMS.find(n => n.id === id);

  $("#page-title").textContent = meta.title;
  $("#page-breadcrumb").innerHTML = id === "dashboard"
    ? `<span>Tuesday, 12 May 2026</span><span class="dot-sep">•</span><span>Tenant healthy</span>`
    : `<span>Super Admin</span><span class="dot-sep">›</span><span>${meta.label}</span>`;
  $("#page-content").innerHTML = ROUTES[id]();

  renderNav(id);
  bindPageEvents(id);
  closeSlideover();
  window.scrollTo(0, 0);
}

// =========================================================
// PAGE-SPECIFIC EVENT BINDINGS
// =========================================================
function bindPageEvents(pageId) {
  // Admin dashboard customize button
  $$('[data-action="admin-customize-dashboard"]').forEach(b => b.addEventListener("click", () => {
    if (!window.SUDO_LAYOUT) { toast("Layout helper not loaded"); return; }
    SUDO_LAYOUT.openCustomizer({
      pageKey: "admin-dashboard",
      label: "Admin Dashboard",
      sections: ADMIN_DASHBOARD_SECTIONS,
      defaultOrder: ADMIN_DASHBOARD_DEFAULT_ORDER,
      onSave: () => {
        toast("Layout saved · reloading");
        setTimeout(() => location.reload(), 500);
      },
    });
  }));

  // KPI cards → drill-down
  $$("[data-card-id]").forEach(el => el.addEventListener("click", () => {
    const id = el.dataset.cardId;
    openSlideover(drilldownFor(id));
  }));

  // Quick actions
  $$("[data-quick]").forEach(b => b.addEventListener("click", () => {
    location.hash = "#" + b.dataset.quick;
  }));

  // Cross-nav links
  $$("[data-nav]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    location.hash = "#" + a.dataset.nav;
  }));

  // Toggles
  $$(".toggle").forEach(t => t.addEventListener("click", () => t.classList.toggle("toggle--on")));

  // Checkboxes
  $$(".checkbox").forEach(cb => cb.addEventListener("click", e => {
    e.preventDefault();
    cb.classList.toggle("checkbox--checked");
  }));

  // User row click → detail slide-over
  $$(".row-clickable[data-user-id]").forEach(tr => tr.addEventListener("click", () => {
    const u = DATA.portalUsers.find(x => x.id === tr.dataset.userId);
    if (!u) return;
    openSlideover({
      title: u.name,
      body: `
        <div style="display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--ink-100);margin-bottom:14px">
          <div class="so-item__avatar" style="width:54px;height:54px;font-size:16px">${initials(u.name)}</div>
          <div>
            <div style="font-size:17px;font-weight:700;color:var(--ink-900)">${u.name}</div>
            <div style="font-size:12.5px;color:var(--ink-500)">${u.email}</div>
            <div style="margin-top:6px">${roleBadges(u.roles)}</div>
          </div>
        </div>
        <div class="form-grid form-grid--single">
          <div class="field"><label class="field__label">User ID</label><div class="table__mono" style="font-size:12px;color:var(--ink-700)">${u.id}</div></div>
          <div class="field"><label class="field__label">MFA</label><div>${u.mfa ? '<span class="status status--ok">Enabled</span>' : '<span class="status status--muted">Service account</span>'}</div></div>
          <div class="field"><label class="field__label">Last sign-in</label><div class="table__mono" style="font-size:12px;color:var(--ink-700)">${u.lastSignin}</div></div>
          <div class="field"><label class="field__label">Status</label><div><span class="status status--${u.status === 'Active' ? 'ok' : u.status === 'Service' ? 'info' : 'warn'}">${u.status}</span></div></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary">${ICONS.unlink} Revoke Sessions</button>
          <button class="btn btn--secondary">${ICONS.edit} Edit Roles</button>
          <button class="btn btn--danger">${ICONS.trash} Suspend</button>
        </div>`,
    });
  }));

  // Integration card click
  $$("[data-integration-id]").forEach(c => c.addEventListener("click", e => {
    if (e.target.closest("button")) return;
    const i = DATA.integrations.find(x => x.id === c.dataset.integrationId);
    if (!i) return;
    openSlideover({
      title: i.name,
      body: `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
          <div class="icard__logo icard__logo--${i.logo}">${i.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
          <div>
            <div style="font-size:16px;font-weight:700;color:var(--ink-900)">${i.name}</div>
            <div style="font-size:12px;color:var(--ink-500)">${i.category}</div>
          </div>
        </div>
        <div class="form-grid form-grid--single">
          <div class="field"><label class="field__label">Status</label><div><span class="status status--${i.status === 'Connected' ? 'ok' : 'warn'}">${i.status}</span></div></div>
          <div class="field"><label class="field__label">Scope</label><div style="font-size:13px;color:var(--ink-700)">${i.scope}</div></div>
          <div class="field"><label class="field__label">Last sync</label><div class="table__mono" style="font-size:12px;color:var(--ink-700)">${i.lastSync}</div></div>
          <div class="field"><label class="field__label">API endpoint</label><div class="table__mono" style="font-size:11.5px;color:var(--ink-700);background:var(--ink-100);padding:8px 10px;border-radius:6px">https://api.${i.id}.com/v2/...</div></div>
          <div class="field"><label class="field__label">Credentials</label><div class="table__mono" style="font-size:11.5px;color:var(--ink-700);background:var(--ink-100);padding:8px 10px;border-radius:6px">●●●●●●●●●●●● Last rotated 23 days ago</div></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary">${ICONS.refresh} Test Connection</button>
          <button class="btn btn--secondary">${ICONS.key} Rotate Key</button>
          <button class="btn btn--primary">${ICONS.edit} Configure</button>
        </div>`,
    });
  }));

  // Webhook row click
  $$("[data-webhook-id]").forEach(tr => tr.addEventListener("click", () => {
    const w = DATA.webhookEndpoints.find(x => x.id === tr.dataset.webhookId);
    if (!w) return;
    openSlideover({
      title: "Webhook Endpoint",
      body: `
        <div style="margin-bottom:18px">
          <div class="table__mono" style="font-size:12.5px;color:var(--ink-900);background:var(--ink-100);padding:10px 12px;border-radius:8px;word-break:break-all">${w.url}</div>
        </div>
        <div class="form-grid form-grid--single">
          <div class="field"><label class="field__label">Status</label><div>${w.active ? '<span class="status status--ok">Active</span>' : '<span class="status status--muted">Paused</span>'}${w.failing ? ' <span class="status status--danger">Failing</span>' : ''}</div></div>
          <div class="field"><label class="field__label">Events subscribed</label><div style="display:flex;gap:5px;flex-wrap:wrap">${w.events.map(ev => `<span class="role-badge role-badge--pm">${ev}</span>`).join("")}</div></div>
          <div class="field"><label class="field__label">Success rate (24h)</label><div style="font-size:18px;font-weight:700;color:${w.success >= 99 ? 'var(--ok)' : w.success >= 90 ? 'var(--warn)' : 'var(--danger)'};font-family:var(--font-mono)">${w.success}%</div></div>
          <div class="field"><label class="field__label">Total delivered (24h)</label><div class="table__mono" style="font-size:13px;color:var(--ink-700)">${w.delivered.toLocaleString()}</div></div>
          <div class="field"><label class="field__label">HMAC secret</label><div class="table__mono" style="font-size:11.5px;color:var(--ink-700);background:var(--ink-100);padding:8px 10px;border-radius:6px">whsec_●●●●●●●●●●●●●●●●●●●●●●●●●●</div></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary">${ICONS.send} Send Test Event</button>
          <button class="btn btn--secondary">${ICONS.history} View Deliveries</button>
          <button class="btn btn--warn">${ICONS.unlink} Pause</button>
          <button class="btn btn--danger">${ICONS.trash} Delete</button>
        </div>`,
    });
  }));

  // Template click
  $$("[data-template-id]").forEach(tr => tr.addEventListener("click", () => {
    const t = DATA.templates.find(x => x.id === tr.dataset.templateId);
    if (!t) return;
    openSlideover({
      title: t.name,
      body: `
        <div style="margin-bottom:18px">
          <span class="status status--info">${t.category}</span>
          <div class="table__mono" style="font-size:11.5px;color:var(--ink-500);margin-top:6px">${t.id}</div>
        </div>
        <div class="form-grid form-grid--single">
          <div class="field"><label class="field__label">Subject</label><input class="input" value="Action required: complete your training" /></div>
          <div class="field"><label class="field__label">Body (supports {{variables}})</label><textarea class="textarea textarea--prose" rows="6">Hi {{employee_name}},\n\nYou have an outstanding training assignment: {{training_name}}.\n\nDue date: {{due_date}}\n\nPlease complete it via the Employee Portal.\n\n— SUDO HR</textarea></div>
          <div class="field"><label class="field__label">Channels</label><div style="display:flex;gap:5px;flex-wrap:wrap">${t.channels.map(c => `<span class="role-badge role-badge--pm">${c}</span>`).join("")}</div></div>
          <div class="field"><label class="field__label">Last edited</label><div style="font-size:12px;color:var(--ink-500)">${t.lastEdited}</div></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary">${ICONS.copy} Duplicate</button>
          <button class="btn btn--secondary">${ICONS.eye} Preview</button>
          <button class="btn btn--primary">${ICONS.check} Save</button>
        </div>`,
    });
  }));

  // ── Admin: Edit User dialog (role / team / team-role) ─────────────
  document.addEventListener("click", function adminUserHandler(ev) {
    const editBtn = ev.target.closest('[data-action="admin-edit-user"]');
    const resetBtn = ev.target.closest('[data-action="admin-reset-overrides"]');

    if (resetBtn) {
      if (!confirm("Reset all role/team overrides? This restores every employee to the seeded org structure. Active KPI assignments are preserved.")) return;
      try {
        localStorage.removeItem("sudo:overrides:roles");
        localStorage.removeItem("sudo:overrides:teams");
      } catch(e){}
      toast("Overrides cleared · reloading", "info");
      setTimeout(() => location.reload(), 600);
      return;
    }

    if (editBtn) {
      const empId = editBtn.dataset.empId;
      const emp = SUDO_DB_HELPERS.findEmployee(empId);
      if (!emp) return;
      const currentRoles = SUDO_DB_OVERRIDES.getRoles(empId);
      const currentTeam  = emp.teamId || "";
      const currentTeamRole = emp.teamRole || "member";
      const teams = SUDO_DB.teams || [];

      openSlideover({
        title: `Edit · ${emp.name}`,
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.shield || ICONS.lock || ""}
            <div>Changes apply immediately on save. The audit log records who changed what. Other portals reflect the new role/team on next page load.</div>
          </div>
          <div style="margin-bottom:18px">
            <div style="font-size:11px;color:var(--ink-500);text-transform:uppercase;letter-spacing:0.5px;font-weight:700;margin-bottom:6px">Identity</div>
            <div style="font-size:13px"><strong>${emp.name}</strong> · ${emp.title || ''}</div>
            <div style="font-size:12px;color:var(--ink-700)">${emp.email}</div>
            <div style="font-size:11px;color:var(--ink-500);margin-top:4px">Employee ID · ${emp.id} · Status ${emp.status}</div>
          </div>

          <div class="form-grid">
            <div class="field field--full">
              <label class="field__label">Portal roles · which portals can this user open?</label>
              <div style="display:flex;gap:14px;flex-wrap:wrap;padding:10px 12px;background:var(--ink-50);border-radius:6px">
                ${["admin","hr","pm","tl","employee"].map(r => `
                  <label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer">
                    <input type="checkbox" data-role="${r}" ${currentRoles.includes(r) ? 'checked' : ''}>
                    <span style="text-transform:capitalize">${r}</span>
                  </label>`).join("")}
              </div>
              <div style="font-size:11px;color:var(--ink-500);margin-top:6px">Multiple roles = role switcher appears for this user (e.g. PM + TL dual)</div>
            </div>

            <div class="field">
              <label class="field__label">Team</label>
              <select class="select" id="admin-edit-team">
                <option value="" ${currentTeam === '' ? 'selected' : ''}>— No team (HR / Admin role) —</option>
                ${teams.map(t => `<option value="${t.id}" ${currentTeam === t.id ? 'selected' : ''}>${t.short} · ${t.name}</option>`).join("")}
              </select>
            </div>

            <div class="field">
              <label class="field__label">Team role</label>
              <select class="select" id="admin-edit-team-role">
                <option value="member"  ${currentTeamRole === 'member'  ? 'selected' : ''}>Member</option>
                <option value="lead"    ${currentTeamRole === 'lead'    ? 'selected' : ''}>Team Lead</option>
                <option value="manager" ${currentTeamRole === 'manager' ? 'selected' : ''}>Manager</option>
                <option value="hr"      ${currentTeamRole === 'hr'      ? 'selected' : ''}>HR (no team)</option>
                <option value="admin"   ${currentTeamRole === 'admin'   ? 'selected' : ''}>Admin (no team)</option>
              </select>
            </div>

            <div class="field field--full">
              <label class="field__label">Reason for change (audit-logged)</label>
              <input class="input" id="admin-edit-reason" placeholder="e.g. 'Promoted to TL for IT Ops · effective immediately'">
            </div>
          </div>

          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" id="admin-edit-save">${ICONS.check} Save changes</button>
          </div>`,
      });

      setTimeout(() => {
        const saveBtn = document.getElementById("admin-edit-save");
        if (!saveBtn) return;
        saveBtn.addEventListener("click", () => {
          const checked = Array.from(document.querySelectorAll('input[data-role]:checked')).map(c => c.dataset.role);
          const newTeam = document.getElementById("admin-edit-team").value;
          const newTeamRole = document.getElementById("admin-edit-team-role").value;
          const reason = (document.getElementById("admin-edit-reason").value || "").trim();

          const changes = [];
          if (JSON.stringify(checked.sort()) !== JSON.stringify(currentRoles.slice().sort())) {
            SUDO_DB_OVERRIDES.setRoles(empId, checked);
            changes.push(`roles: [${currentRoles.join(',')}] → [${checked.join(',')}]`);
          }
          if (newTeam !== currentTeam || newTeamRole !== currentTeamRole) {
            SUDO_DB_OVERRIDES.setTeam(empId, newTeam || null, newTeamRole);
            changes.push(`team: ${currentTeam || '—'}/${currentTeamRole} → ${newTeam || '—'}/${newTeamRole}`);
          }

          if (changes.length === 0) {
            toast("No changes to save", "info");
            closeSlideover();
            return;
          }

          SUDO_DB_OVERRIDES.audit("M. Farooq (Admin)", "user.role_team_changed", emp.id, changes.join(' · ') + (reason ? ` · ${reason}` : ''));
          SUDO_DB_OVERRIDES.notify({
            title: `Roles updated for ${emp.name}`,
            desc: changes.join(' · '),
            icon: "shield", color: "info", kind: "admin_change",
          });
          closeSlideover();
          toast(`Saved · ${changes.length} change${changes.length === 1 ? '' : 's'} applied`, "success");
          setTimeout(() => location.reload(), 700);
        });
      }, 60);
      return;
    }
  });

  // Page action buttons
  $$("[data-action]:not([data-action='admin-edit-user']):not([data-action='admin-reset-overrides'])").forEach(b => b.addEventListener("click", async () => {
    const a = b.dataset.action;

    // ── Real API-backed actions ──────────────────────────────
    if (a === "run-backup") {
      if (!window.api) { toast("API not available"); return; }
      b.disabled = true;
      try {
        await api.system.triggerBackup({ type: "MANUAL", retentionDays: 30 });
        toast("Backup queued · the worker will process it shortly");
        if (window.SUDO_HYDRATE) {
          await SUDO_HYDRATE.rehydrate("backups");
          if (typeof route === "function") route();   // re-render current page
        }
      } catch (e) {
        toast("Backup failed: " + (e.message || "unknown error"));
      } finally {
        b.disabled = false;
      }
      return;
    }
    if (a === "manual-export") {
      if (!window.api) { toast("API not available"); return; }
      b.disabled = true;
      try {
        await api.exports.request({ scope: "FULL_TENANT", format: "XLSX" });
        toast("Export requested · you'll be notified when it's ready to download");
        if (window.SUDO_HYDRATE) {
          await SUDO_HYDRATE.rehydrate("exports");
          if (typeof route === "function") route();
        }
      } catch (e) {
        toast("Export failed: " + (e.message || "unknown error"));
      } finally {
        b.disabled = false;
      }
      return;
    }

    const messages = {
      "save": "Configuration saved · Audit entry created",
      "upload-logo": "File picker would open here · upload triggers re-render across all 5 portals",
      "reset-logo": "Logo reset to default SUDO mark · all portals updated",
    };
    toast(messages[a] || "Action completed");
  }));

  // ── FilterBar mounts (Admin pages) ──────────────────────
  if (window.FilterBar) {
    const fb = (id, opts) => document.getElementById(id) && FilterBar.mount(id, opts);

    function uCount(tag) {
      return document.querySelectorAll(`#admin-users-results tbody tr[data-tag~="${tag}"]`).length;
    }

    const pg = (id, opts) => window.Pagination && document.getElementById(id) && Pagination.mount(id, opts);

    fb("fb-admin-users", {
      targetContainer: "admin-users-results",
      tabs: [
        { id: "all",         label: "All",         count: uCount("all")         },
        { id: "admin",       label: "Admin",       count: uCount("admin")       },
        { id: "hr",          label: "HR",          count: uCount("hr")          },
        { id: "pm",          label: "PM",          count: uCount("pm")          },
        { id: "tl",          label: "TL",          count: uCount("tl")          },
        { id: "employee",    label: "Employee",    count: uCount("employee")    },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "role",   label: "Role",   options: ["All roles", "Super Admin", "HR", "PM", "TL", "Employee"] },
        { id: "mfa",    label: "MFA",    options: ["Any", "Enrolled", "Not enrolled"] },
        { id: "status", label: "Status", options: ["All status", "Active", "Service", "Offboarding", "Suspended"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-admin-users", { targetContainer: "admin-users-results", itemSelector: "tbody tr[data-tag]", pageSize: 10 });

    function aCount(tag) {
      return document.querySelectorAll(`#admin-audit-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-admin-audit", {
      targetContainer: "admin-audit-results",
      tabs: [
        { id: "all",      label: "All",         count: aCount("all") },
        { id: "failure",  label: "Failures",    count: aCount("failure") },
        { id: "auth",     label: "Auth",        count: aCount("auth") },
        { id: "config",   label: "Config",      count: aCount("config") },
        { id: "data",     label: "Data",        count: aCount("data") },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "actor",  label: "Actor",  options: ["All actors", "Super Admin", "HR", "PM", "TL", "Employee", "System"] },
        { id: "result", label: "Result", options: ["All results", "Success", "Failure"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-admin-audit", { targetContainer: "admin-audit-results", itemSelector: "tbody tr[data-tag]", pageSize: 10 });

    function tCount(tag) {
      return document.querySelectorAll(`#admin-templates-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-admin-templates", {
      targetContainer: "admin-templates-results",
      tabs: [
        { id: "all",      label: "All",      count: tCount("all") },
        { id: "active",   label: "Active",   count: tCount("active") },
        { id: "draft",    label: "Draft",    count: tCount("draft") },
        { id: "archived", label: "Archived", count: tCount("archived") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "category", label: "Category", options: ["All categories", "Onboarding", "Training", "Compliance", "Performance", "Documents", "General"] },
        { id: "channel",  label: "Channel",  options: ["All channels", "Email", "In-app", "Slack", "Teams"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-admin-templates", { targetContainer: "admin-templates-results", itemSelector: "tbody tr[data-tag]", pageSize: 8 });

    function wCount(tag) {
      return document.querySelectorAll(`#admin-webhooks-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-admin-webhooks", {
      targetContainer: "admin-webhooks-results",
      tabs: [
        { id: "all",     label: "All endpoints", count: wCount("all") },
        { id: "active",  label: "Active",        count: wCount("active") },
        { id: "failing", label: "Failing",       count: wCount("failing") },
        { id: "paused",  label: "Paused",        count: wCount("paused") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "event",   label: "Event type", options: ["All events", "employee.*", "kpi.*", "training.*", "leave.*", "payroll.*"] },
        { id: "health",  label: "Health",     options: ["All health", "Healthy (99%+)", "Warning (90-99%)", "Failing (<90%)"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-admin-webhooks", { targetContainer: "admin-webhooks-results", itemSelector: "tbody tr[data-tag]", pageSize: 8 });
  }
}

// Drill-down lists for KPI cards
function drilldownFor(cardId) {
  switch (cardId) {
    case "users":
      return { title: "Portal Users · 152", list: DATA.portalUsers.slice(0, 10).map(u => ({ name: u.name, desc: `${u.email} · ${u.roles.map(r => r.toUpperCase()).join(", ")}`, meta: u.lastSignin })) };
    case "signins":
      return { title: "Sign-ins Today · 94", list: DATA.sessions.map(s => ({ name: s.name, desc: `${s.device}`, meta: s.loggedAt })) };
    case "mfa":
      return { title: "MFA Compliance · 100%", list: [{ name: "All 152 users", desc: "MFA enforced via Microsoft Entra Conditional Access policy", meta: "100%" }] };
    case "sessions":
      return { title: "Active Sessions · 41", list: DATA.sessions.map(s => ({ name: s.name, desc: `${s.device} · ${s.location}`, meta: s.duration })) };
    case "integrations":
      return { title: "Integration Health · 8/8 connected", list: DATA.integrations.map(i => ({ name: i.name, desc: `${i.category} · ${i.status}`, meta: i.lastSync })) };
    case "webhook-success":
      return { title: "Webhook Success · 99.4%", list: DATA.webhookEndpoints.map(w => ({ name: w.url.replace("https://", ""), desc: `${w.events.length} events subscribed`, meta: `${w.success}%` })) };
    case "webhook-failed":
      return { title: "Failed Webhook Deliveries · 3", list: DATA.webhookLog.filter(l => l.status >= 400).map(l => ({ name: `${l.event} → ${l.endpoint}`, desc: `${l.method} · ${l.latency}`, meta: `${l.status}` })) };
    case "audit-today":
      return { title: "Audit Log Entries Today · 2,148", list: DATA.audit.slice(0, 8).map(a => ({ name: a.actor, desc: `${a.action} → ${a.target}`, meta: a.time })) };
    case "storage":
      return { title: "Storage · 47 GB used / 100 GB", list: [
        { name: "Documents (signed)", desc: "Contracts, NDAs, confirmation letters, evaluations", meta: "28 GB" },
        { name: "Training certificates", desc: "Employee-uploaded PDFs and Credly badges", meta: "9 GB" },
        { name: "Profile pictures & resumes", desc: "Generated resumes (PDF + DOCX) auto-refreshed", meta: "5 GB" },
        { name: "Audit log archive", desc: "Compressed JSONL files for retention compliance", meta: "3 GB" },
        { name: "Backups (current month)", desc: "Daily snapshots kept for 30 days", meta: "2 GB" },
      ] };
    case "api-calls":
      return { title: "API Calls (24h) · 18,200", list: [
        { name: "ODOO connector", desc: "Employee, leave, salary read calls", meta: "4,820" },
        { name: "Microsoft Graph", desc: "Entra group reads, manager attribute, profile photo", meta: "3,940" },
        { name: "DocuSign", desc: "Envelope status polling, webhook acks", meta: "2,180" },
        { name: "Internal portal API", desc: "From web UI and mobile apps", meta: "5,640" },
        { name: "AWS Partner sync", desc: "Certification matrix and tier alignment", meta: "740" },
      ] };
    case "errors":
      return { title: "System Errors (24h) · 7", list: [
        { name: "Webhook 502 to legacy-sharepoint", desc: "3 occurrences · all auto-retried", meta: "Non-blocking" },
        { name: "Credly API timeout", desc: "2 occurrences · circuit breaker tripped briefly", meta: "Non-blocking" },
        { name: "Image upload failed", desc: "Single user, retried successfully", meta: "Non-blocking" },
        { name: "Background worker timeout", desc: "Long-running report generation", meta: "Non-blocking" },
      ] };
    case "impersonations":
      return { title: "Active Impersonation Sessions · 0", list: [{ name: "No active impersonations", desc: "All impersonation sessions are start- and end-logged with full audit trail.", meta: "—" }] };
    default:
      return { title: "Detail", list: [] };
  }
}

// =========================================================
// GLOBAL EVENTS
// =========================================================
function renderNotifDropdown() {
  $("#notif-body").innerHTML = DATA.alerts.map(n => `
    <div class="notif ${n.unread ? "notif--unread" : ""}">
      <div class="notif__icon card__icon--${n.color}">${ICONS[n.icon] || ""}</div>
      <div class="notif__main">
        <div class="notif__title">${n.title}</div>
        <div class="notif__desc">${n.desc}</div>
        <div class="notif__time">${n.time}</div>
      </div>
    </div>`).join("");
}

function bindGlobalEvents() {
  $("#slideover-close").addEventListener("click", closeSlideover);
  $("#overlay").addEventListener("click", closeSlideover);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeSlideover();
      $("#notif-dropdown").classList.remove("open");
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      $("#global-search").focus();
    }
  });

  $("#notif-btn").addEventListener("click", e => {
    e.stopPropagation();
    $("#notif-dropdown").classList.toggle("open");
  });
  document.addEventListener("click", e => {
    const dd = $("#notif-dropdown");
    if (!dd.contains(e.target) && !$("#notif-btn").contains(e.target)) dd.classList.remove("open");
  });

  $("#new-action-btn").addEventListener("click", () => {
    openSlideover({
      title: "New …",
      list: [
        { name: "New User", desc: "Add a portal user (manual override of Entra sync)", meta: "→" },
        { name: "New Integration", desc: "Connect ODOO, M365, or a custom HTTPS service", meta: "→" },
        { name: "New Webhook Endpoint", desc: "Register an HTTPS receiver and subscribe to events", meta: "→" },
        { name: "New Notification Template", desc: "Create a reusable template HR can send", meta: "→" },
        { name: "Manual Backup Export", desc: "Run a tenant export now (for compliance review)", meta: "→" },
      ],
    });
  });

  $("#role-switch-btn").addEventListener("click", () => {
    window.location.href = "../index.html";
  });


  // Mobile hamburger menu — slide sidebar in/out on small screens
  const menuToggle = document.getElementById("menu-toggle");
  const sidebarEl = document.querySelector(".sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (menuToggle && sidebarEl && backdrop) {
    const openMenu = () => { sidebarEl.classList.add("open"); backdrop.classList.add("open"); };
    const closeMenu = () => { sidebarEl.classList.remove("open"); backdrop.classList.remove("open"); };
    menuToggle.addEventListener("click", openMenu);
    backdrop.addEventListener("click", closeMenu);
    // close the menu after any nav click (so it doesn't stay open over the new page)
    sidebarEl.addEventListener("click", (e) => {
      if (e.target.closest("a[data-route]")) closeMenu();
    });
  }

  window.addEventListener("hashchange", route);
}

// =========================================================
// INIT
// =========================================================
SUDO_INIT("admin", () => {
  renderNotifDropdown();
  bindGlobalEvents();
  route();
});

// ── Role switcher — Admin always sees it (has access to every role by definition) ──
if (window.RoleSwitcher) {
  RoleSwitcher.mount({
    currentRole: "admin",
    basePath: "..",
    hasMultipleRoles: true,    // Admin can preview HR / PM / TL / Employee
  });
}
