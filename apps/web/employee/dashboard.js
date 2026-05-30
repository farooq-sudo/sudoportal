/* =========================================================
   SUDO Employee Portal — Employee Portal
   Single-file SPA with hash router
   User: Reem Al Otaibi (Cloud Engineer, in onboarding 32%)
========================================================= */

// =========================================================
// NAV
// =========================================================
const NAV_ITEMS = [
  { id: "dashboard",     label: "My Dashboard",      iconKey: "grid",     title: "My Dashboard" },
  { id: "onboarding",    label: "My Onboarding",     iconKey: "rocket",   count: 32, countStyle: "accent", countSuffix: "%", title: "My Onboarding" },
  { id: "profile",       label: "My Profile",        iconKey: "user",     title: "My Profile" },
  { id: "trainings",     label: "My Trainings",      iconKey: "book",     count: 4, countStyle: "accent", title: "My Trainings" },
  { id: "certifications",label: "My Certifications", iconKey: "award",    count: 3, title: "My Certifications" },
  { id: "badges",        label: "My Badges",         iconKey: "star",     count: 14, title: "My Badges" },
  { id: "recognition",   label: "Recognition Wall",  iconKey: "award",    title: "Recognition · Top Performers" },
  { id: "kpis",          label: "My KPIs",           iconKey: "chart",    count: 1, countStyle: "warn", title: "My KPIs" },
  { id: "timeoff",       label: "Time Off",          iconKey: "calendar", title: "Time Off & Leaves" },
  { id: "documents",     label: "My Documents",      iconKey: "doc",      count: 2, countStyle: "warn", title: "My Documents" },
  { id: "resume",        label: "My Resume",         iconKey: "fileText", title: "My Resume" },
  { id: "requests",      label: "My Requests",       iconKey: "inbox",    count: 1, title: "My Requests" },
  { id: "team",          label: "My Team",           iconKey: "users",    title: "My Team" },
  { id: "my-projects",   label: "My Projects",       iconKey: "briefcase",title: "My Projects" },
  { id: "notifications", label: "Notifications",     iconKey: "bell",     count: 5, countStyle: "danger", title: "Notifications" },
];

// =========================================================
// ICONS
// =========================================================
const ICONS = {
  // sidebar
  grid:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>',
  rocket:     '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2v6m0 0l-3-3m3 3l3-3M4 13h16M4 13v7a2 2 0 002 2h12a2 2 0 002-2v-7M4 13l2-4h12l2 4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  user:       '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" stroke-width="1.8"/></svg>',
  book:       '<svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.8"/><path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  award:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M8 13l-2 8 6-3 6 3-2-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chart:      '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  doc:        '<svg viewBox="0 0 24 24" fill="none"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v6h6M9 15h6M9 12h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  fileText:   '<svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  inbox:      '<svg viewBox="0 0 24 24" fill="none"><path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3.5 7v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7L5.5 5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  users:      '<svg viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  bell:       '<svg viewBox="0 0 24 24" fill="none"><path d="M18 16h2l-1.4-1.4A2 2 0 0118 13.2V10a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 16h2m12 0H6m12 0a3 3 0 11-6 0m-6 0a3 3 0 006 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  // dashboard/status
  check:      '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  alert:      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.3 3.6L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trending:   '<svg viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8M14 7h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pen:        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9M17 3l4 4-13 13H4v-4L17 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  send:       '<svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  upload:     '<svg viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plane:      '<svg viewBox="0 0 24 24" fill="none"><path d="M17.8 19.2L16 11l3.5-3.5C20.9 6 21 4 20 3s-3 .1-4.5 1.5L12 8 3.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 6.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  download:   '<svg viewBox="0 0 24 24" fill="none"><path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowUp:    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 19V5m0 0l-7 7m7-7l7 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowDown:  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  flat:       '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  search:     '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  plus:       '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  edit:       '<svg viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  refresh:    '<svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-3.3-7M21 3v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  eye:        '<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>',
  eyeOff:     '<svg viewBox="0 0 24 24" fill="none"><path d="M1 1l22 22M9.88 5.09A10.94 10.94 0 0112 5c7 0 11 7 11 7a13.16 13.16 0 01-1.67 2.68m-3.13 3.13A10.94 10.94 0 0112 19c-7 0-11-7-11-7a13.16 13.16 0 013.42-4.42m4.74-1.46a3 3 0 013.79 3.79" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.8"/></svg>',
  unlock:     '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 019.9-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  play:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8V4z"/></svg>',
  external:   '<svg viewBox="0 0 24 24" fill="none"><path d="M14 3h7v7M10 14L21 3M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lightbulb:  '<svg viewBox="0 0 24 24" fill="none"><path d="M9 18h6m-5 3h4M12 3a6 6 0 00-4 10.5c.5.5 1 1.5 1 2.5h6c0-1 .5-2 1-2.5A6 6 0 0012 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  videoCam:   '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M22 8l-6 4 6 4V8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  teams:      '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M22 8l-6 4 6 4V8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shield:     '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  mail:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.8"/></svg>',
  phone:      '<svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  briefcase:  '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="1.8"/></svg>',
  pin:        '<svg viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.8"/></svg>',
  calendar:   '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  star:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7l3-7z"/></svg>',
  heart:      '<svg viewBox="0 0 24 24" fill="none"><path d="M20.84 4.6a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
};

// =========================================================
// DATA — Reem Al Otaibi, Cloud Engineer, onboarding 32%
// =========================================================
const DATA = {
  user: {
    name: "Reem Al Otaibi",
    initials: "RO",
    title: "Cloud Engineer",
    dept: "Cloud Engineering",

    // Editable directly by employee (no approval needed)
    personalEmail: "reem.k.otaibi@gmail.com",
    phone: "+971 50 ●●● 4218",
    address: "Marina Heights, Dubai Marina, Dubai",

    // Read-only fields — employee must request HR/Admin to edit
    workEmail: "reem.o@sudoconsultants.com",
    employeeId: "E008",
    joined: "2026-04-01",
    dob: "12 March 1996",
    nationality: "UAE",
    maritalStatus: "Single",

    lm: "Khalid Mansour",
    // Multiple PMs — one per project assignment
    pms: [
      { name: "Fatima Al Zaabi", initials: "FZ", project: "Internal · Delivery Track", isPrimary: true },
      { name: "Sara Mitchell", initials: "SM", project: "Client-Alpha · AWS Migration", isPrimary: false },
    ],

    // Special tag granted by HR, Admin or PM
    tag: {
      label: "Rising Star",
      grantedBy: "Fatima Al Zaabi (PM)",
      grantedOn: "Yesterday",
      reason: "Outstanding documentation contributions in first 6 weeks",
    },

    onboarding: { pct: 32, step: 3 },
  },

  // Family details — managed by HR/Admin, employee can request additions
  family: {
    spouse: null,  // not married in Reem's case
    children: [],
    note: "No dependents on file. To add family members for insurance coverage, raise a request via HR.",
  },

  // Insurance (employee's own + family). HR/Admin add family coverage.
  insurance: {
    employee: {
      provider: "Daman Premium",
      policyNo: "DPS-2026-●●●●●-4218",
      tier: "Tier 2 · Comprehensive",
      validFrom: "2026-04-01",
      validUntil: "2027-03-31",
      coverage: "Inpatient + Outpatient + Maternity + Dental (limited)",
    },
    family: [],  // empty for single employees; populated when HR adds dependents
  },

  // Air ticket entitlement (UAE benefit). Managed by HR/Admin.
  // Reem is a UAE national — entitlement still applies to her family-of-record home city.
  airTickets: {
    entitlement: {
      cycle: "Annual",
      ticketsPerCycle: 1,
      class: "Economy",
      route: "Dubai (DXB) ↔ Riyadh (RUH)",
      coversFamily: false,  // family tickets are configured per-employee by HR
      lastUpdatedBy: "HR (Justine)",
      lastUpdatedOn: "2026-04-01",
      notes: "Round-trip economy ticket to declared home destination, once per calendar year. Submit boarding pass for reimbursement.",
    },
    used: 0,
    pending: 0,
    remaining: 1,
    history: [
      { id: "AT-2025-008", date: "2025-08-12", route: "DXB → RUH → DXB", class: "Economy", airline: "Emirates", amount: 1820, currency: "AED", status: "Reimbursed", processedBy: "HR (Justine)" },
      { id: "AT-2024-008", date: "2024-09-04", route: "DXB → RUH → DXB", class: "Economy", airline: "flydubai", amount: 1240, currency: "AED", status: "Reimbursed", processedBy: "HR (Justine)" },
    ],
  },

  // Salary slips (synced nightly from ODOO — Portal is read-only for these)
  // ODOO is the system of record for payroll.
  salarySlips: {
    syncedAt: "Last night at 02:00",
    syncSource: "ODOO Payroll",
    available: [
      { period: "April 2026",    issueDate: "2026-04-28", net: 17850, currency: "AED", odooId: "PAY-2026-04-E008", url: "#" },
      { period: "March 2026",    issueDate: "2026-03-28", net: 17850, currency: "AED", odooId: "PAY-2026-03-E008", url: "#" },
      { period: "February 2026", issueDate: "2026-02-26", net: 17850, currency: "AED", odooId: "PAY-2026-02-E008", url: "#" },
      { period: "January 2026",  issueDate: "2026-01-28", net: 17850, currency: "AED", odooId: "PAY-2026-01-E008", url: "#" },
    ],
  },

  // ODOO badges (synced nightly from ODOO)
  badges: {
    total: 14,
    syncedAt: "2 hours ago",
    monthly: [
      { month: "May 2026",   count: 3 },
      { month: "April 2026", count: 4 },
      { month: "March 2026", count: 2 },
      { month: "February 2026", count: 3 },
      { month: "January 2026", count: 1 },
      { month: "December 2025", count: 1 },
    ],
    recent: [
      { name: "Good Job", icon: "🎯", from: "Fatima Al Zaabi (PM)", reason: "Excellent runbook on the AWS Well-Architected review", received: "3 days ago" },
      { name: "Team Player", icon: "🤝", from: "Ahmed Al Rashid", reason: "Stepped in to help unblock the auth migration", received: "1 week ago" },
      { name: "Above & Beyond", icon: "🚀", from: "Justine (HR)", reason: "Completed AWS Cloud Economics 5 days ahead of deadline", received: "2 weeks ago" },
    ],
  },

  // Pending field-edit requests (employee submitted to HR, awaiting approval)
  pendingFieldEdits: [
    // example: { field: "maritalStatus", newValue: "Married", reason: "...", status: "Pending HR approval", submittedOn: "..." }
  ],

  // Dashboard KPI cards
  kpiCards: [
    { id: "onboarding", title: "Onboarding Progress", value: 32, valueSub: "%", bar: { pct: 32 }, barLabel: "Step 3 of 5 · NEO + CPD", icon: "rocket", iconStyle: "bright" },
    { id: "trainings", title: "Trainings In Progress", value: 4, icon: "book", iconStyle: "navy", meta: "1 awaiting HR sign-off · 1 due in 7 days" },
    { id: "kpis", title: "KPIs to Acknowledge", value: 1, icon: "trending", iconStyle: "warn", meta: "Q2 Goals · due in 14 days" },
    { id: "certs", title: "My Certifications", value: 3, icon: "award", iconStyle: "ok", meta: "All current · 1 expiring in 60 days" },
  ],

  // Onboarding steps for Reem (currently on Step 3)
  onbSteps: [
    { num: 1, name: "Mandatory Training", desc: "AWS Sales, Cybersecurity, AWS Cloud Economics", status: "done", completed: "10 Apr 2026" },
    { num: 2, name: "Joiner Info Submission", desc: "Personal info, IBAN, emergency contact, documents", status: "done", completed: "15 Apr 2026" },
    {
      num: 3, name: "NEO + CPD",
      desc: "New Employee Orientation + Continuous Professional Development plan",
      status: "current",
      desc2: "NEO session scheduled · CPD plan needs your input",
      meeting: {
        title: "New Employee Orientation (NEO)",
        date: "Thursday, 15 May 2026",
        time: "14:00 — 16:00 GST",
        with: "Layla Ibrahim · HR",
        joinUrl: "#teams-join",
        calendarUrl: "#calendar-add",
      },
    },
    { num: 4, name: "Performance Tracking", desc: "First KPIs assigned · 30/60/90 check-ins", status: "todo" },
    { num: 5, name: "Monthly Feedback Sessions", desc: "3 sessions with Line Manager before probation review", status: "todo" },
  ],

  // Tasks needing attention on dashboard
  tasks: [
    { icon: "trending", style: "warn", name: "Q2 KPIs need your acknowledgement", desc: "5 KPIs assigned by Justine · due 26 May 2026", action: "Review" },
    { icon: "videoCam", style: "bright", name: "NEO session on Microsoft Teams — Thursday", desc: "14:00 — 16:00 GST · with Layla Ibrahim · join from My Onboarding", action: "Add to calendar" },
    { icon: "pen", style: "warn", name: "Probation evaluation form awaiting signature", desc: "Pending your e-signature in DocuSign", action: "Sign now" },
    { icon: "book", style: "warn", name: "AWS Solutions Architect Associate — deadline in 7 days", desc: "On AWS Skill Builder · upload certificate when done", action: "Open" },
    { icon: "upload", style: "navy", name: "AWS Cloud Economics — awaiting HR verification", desc: "You submitted yesterday · Justine will verify within 1 business day", action: "View" },
  ],

  // Recent activity for this employee
  activity: [
    { icon: "upload", style: "info", title: "You submitted AWS Cloud Economics certificate", desc: "File locked · awaiting HR verification", time: "Yesterday" },
    { icon: "shield", style: "info", title: "Justine extended your AWS SA Associate deadline by 7 days", desc: "Reason: exam slot availability", time: "1 week ago" },
    { icon: "send", style: "info", title: "Justine assigned 'KnowBe4 Security Awareness' to you", desc: "Deadline 19 May 2026", time: "1 week ago" },
    { icon: "check", style: "ok", title: "You signed your updated contract", desc: "Forwarded to HR for countersignature", time: "2 days ago" },
    { icon: "calendar", style: "info", title: "NEO session booked for Thursday on Microsoft Teams", desc: "Calendar invite sent · with Layla Ibrahim", time: "5 days ago" },
  ],

  // Notifications (inbox)
  notifications: [
    { title: "Reminder: NEO session on Thursday", desc: "Conference Room A · 14:00 GST · with Layla Ibrahim", time: "2h ago", unread: true, icon: "calendar", color: "bright" },
    { title: "5 new Q2 KPIs need acknowledgement", desc: "Assigned by Justine · due in 14 days", time: "5h ago", unread: true, icon: "trending", color: "warn" },
    { title: "Document awaiting your signature", desc: "Probation evaluation form · DocuSign", time: "1d ago", unread: true, icon: "pen", color: "warn" },
    { title: "Training assigned: KnowBe4 Security Awareness", desc: "Required · due in 7 days", time: "1d ago", unread: true, icon: "book", color: "navy" },
    { title: "Welcome to SUDO! Your onboarding has started", desc: "Justine has set up your portal access", time: "6w ago", unread: true, icon: "heart", color: "ok" },
    { title: "AWS Cloud Economics completed ✓", desc: "Certificate added to your profile", time: "Yesterday", unread: false, icon: "check", color: "ok" },
    { title: "Contract signed", desc: "Updated contract forwarded to HR", time: "2 days ago", unread: false, icon: "check", color: "ok" },
    { title: "Layla Ibrahim shared a document with you", desc: "SUDO Employee Handbook v2026", time: "1 week ago", unread: false, icon: "doc", color: "navy" },
  ],

  // My trainings — third-party platforms (AWS Skill Builder, Udemy, KnowBe4).
  // We don't track progress here — that lives on the external platform.
  // Instead we track lifecycle states: assigned → in_progress (countdown) → awaiting_verification → verified.
  // Overdue is a derived state (deadline passed, not verified yet).
  myTrainings: [
    {
      id: "T010", title: "SUDO Profile Training", provider: "Internal", platform: "SUDO Portal",
      required: true, state: "assigned",
      assignedOn: "2026-05-08", assignedBy: "Justine",
      dueDate: "2026-05-26", externalUrl: "#",
    },
    {
      id: "T009", title: "Security Awareness Training", provider: "KnowBe4", platform: "KnowBe4 LMS",
      required: true, state: "in_progress",
      assignedOn: "2026-05-05", assignedBy: "Justine",
      startedOn: "2026-05-06", dueDate: "2026-05-19", externalUrl: "https://training.knowbe4.com",
    },
    {
      id: "T002", title: "AWS Solutions Architect Associate", provider: "AWS", platform: "AWS Skill Builder",
      required: true, state: "in_progress",
      assignedOn: "2026-04-10", assignedBy: "Justine",
      startedOn: "2026-04-12", dueDate: "2026-05-19", externalUrl: "https://skillbuilder.aws",
      extendedBy: { hr: "Justine", days: 7, on: "2026-05-05", reason: "Exam slot availability" },
    },
    {
      id: "T006", title: "AWS Well-Architected Framework", provider: "AWS", platform: "AWS Skill Builder",
      required: false, state: "in_progress",
      assignedOn: "2026-04-20", assignedBy: "Self-enrolled",
      startedOn: "2026-04-22", dueDate: null, externalUrl: "https://skillbuilder.aws",
    },
    {
      id: "T007", title: "AWS Generative AI Essentials", provider: "AWS", platform: "AWS Skill Builder",
      required: false, state: "in_progress",
      assignedOn: "2026-04-28", assignedBy: "Self-enrolled",
      startedOn: "2026-04-30", dueDate: null, externalUrl: "https://skillbuilder.aws",
    },
    {
      id: "T005", title: "AWS Cloud Economics", provider: "AWS", platform: "AWS Skill Builder",
      required: true, state: "awaiting_verification",
      assignedOn: "2026-04-05", assignedBy: "Justine",
      startedOn: "2026-04-06", dueDate: "2026-04-26",
      certificate: { filename: "aws-cloud-economics-cert.pdf", uploadedOn: "Yesterday", size: "342 KB", locked: true },
    },
    {
      id: "T001", title: "AWS Cloud Practitioner Essentials", provider: "AWS", platform: "AWS Skill Builder",
      required: true, state: "verified",
      assignedOn: "2026-04-01", assignedBy: "Justine",
      completedOn: "8 Apr 2026",
      certificate: { filename: "aws-cp-essentials.pdf", uploadedOn: "8 Apr 2026", size: "312 KB", locked: true },
      verifiedBy: "Justine", verifiedOn: "9 Apr 2026",
    },
    {
      id: "T004", title: "AWS Sales Accreditation", provider: "AWS", platform: "AWS Partner Central",
      required: true, state: "verified",
      assignedOn: "2026-04-01", assignedBy: "Justine",
      completedOn: "12 Apr 2026",
      certificate: { filename: "aws-sales-accreditation.pdf", uploadedOn: "12 Apr 2026", size: "289 KB", locked: true },
      verifiedBy: "Justine", verifiedOn: "12 Apr 2026",
    },
    {
      id: "T008", title: "AWS Cybersecurity Awareness", provider: "AWS", platform: "AWS Skill Builder",
      required: true, state: "verified",
      assignedOn: "2026-04-01", assignedBy: "Justine",
      completedOn: "16 Apr 2026",
      certificate: { filename: "aws-cyber-awareness.pdf", uploadedOn: "16 Apr 2026", size: "298 KB", locked: true },
      verifiedBy: "Justine", verifiedOn: "16 Apr 2026",
    },
  ],

  // My certifications
  myCerts: [
    { name: "AWS Cloud Practitioner", provider: "AWS", badge: "aws", issued: "2025-09-14", expires: "2028-09-14", status: "ok" },
    { name: "AWS Sales Accreditation 2026", provider: "AWS", badge: "aws", issued: "2026-04-12", expires: "2027-04-12", status: "ok" },
    { name: "Security Awareness Cert 2025", provider: "KnowBe4", badge: "knowbe4", issued: "2025-11-08", expires: "2026-07-08", status: "warn" },
  ],

  // My KPIs (Reem has 1 to acknowledge + a few in progress)
  myKpis: {
    "Pending Ack": [
      { id: "K-2026-Q2-06", title: "Q2 Goals — Cloud Engineering", target: "5 KPIs", assigned: "Justine", due: "14 days", cycle: "Q2 2026" },
    ],
    "In Progress": [
      { id: "K-2026-Q1-12", title: "Complete AWS Solutions Architect Associate", target: "Pass exam by 31 May", progress: 67, cycle: "Onboarding KPI" },
      { id: "K-2026-Q1-13", title: "Contribute to 2 client engagements", target: "2 engagements", progress: 50, cycle: "Onboarding KPI" },
      { id: "K-2026-Q1-14", title: "Internal documentation contributions", target: "≥3 PRs to docs repo", progress: 33, cycle: "Onboarding KPI" },
    ],
    "Achieved": [],
  },

  // My documents
  myDocuments: [
    { name: "Offer Letter", type: "Offer", status: "Signed", date: "2026-03-18", size: "187 KB" },
    { name: "Employment Contract", type: "Contract", status: "Signed", date: "2026-03-25", size: "212 KB" },
    { name: "Non-Disclosure Agreement", type: "NDA", status: "Signed", date: "2026-03-25", size: "76 KB" },
    { name: "Probation Evaluation Form (Step 3)", type: "Evaluation", status: "Pending Your Signature", date: "2026-05-10", size: "94 KB" },
    { name: "CPD Plan Template", type: "Form", status: "Pending Your Upload", date: "—", size: "—" },
    { name: "SUDO Employee Handbook v2026", type: "Reference", status: "Read", date: "2026-04-02", size: "1.2 MB" },
    { name: "Emirates ID — Front & Back", type: "Government", status: "Verified", date: "2026-04-05", size: "340 KB" },
    { name: "Passport copy", type: "Government", status: "Verified", date: "2026-04-05", size: "412 KB" },
    { name: "Educational Certificates", type: "Government", status: "Verified", date: "2026-04-05", size: "1.8 MB" },
  ],

  // My requests
  myRequests: [
    { id: "R-1042", type: "Salary Certificate", purpose: "Apartment lease", status: "Approved", date: "2 days ago" },
    { id: "R-1031", type: "NOC", purpose: "Driving license application", status: "Approved", date: "3 weeks ago" },
    { id: "R-1058", type: "HR Query", purpose: "Insurance dependent coverage question", status: "In Progress", date: "Yesterday" },
  ],

  // My team
  myTeam: [
    { name: "Fatima Al Zaabi", role: "Project Manager · Delivery", badge: "pm", initials: "FZ" },
    { name: "Khalid Mansour", role: "Senior Consultant · Advisory", badge: "lm", initials: "KM" },
    { name: "Ahmed Al Rashid", role: "Solutions Architect", badge: "peer", initials: "AR" },
    { name: "Priya Sharma", role: "DevOps Engineer", badge: "peer", initials: "PS" },
    { name: "Tariq Hassan", role: "Cloud Engineer", badge: "peer", initials: "TH" },
    { name: "Daniel Chen", role: "Solutions Architect (Onboarding)", badge: "peer", initials: "DC" },
    { name: "Bilal Anwar", role: "Cloud Engineer (Onboarding)", badge: "peer", initials: "BA" },
    { name: "Marcus Wright", role: "DevOps Engineer (Onboarding)", badge: "peer", initials: "MW" },
  ],

  // Leave balances (resets annually on 1 Jan)
  leaves: {
    asOf: "12 May 2026",
    cycle: "2026",
    balances: [
      { type: "Annual Paid Leave",   entitled: 30, used: 5, pending: 2, remaining: 23, color: "ok", desc: "30 working days per year (UAE Labour Law)" },
      { type: "Sick Leave",          entitled: 15, used: 0, pending: 0, remaining: 15, color: "info", desc: "15 days · medical certificate required after 2 consecutive days" },
      { type: "Unpaid Leave",        entitled: null, used: 0, pending: 0, remaining: null, color: "muted", desc: "Granted at HR discretion · subject to LM/PM endorsement" },
      { type: "Compassionate Leave", entitled: 5,  used: 0, pending: 0, remaining: 5,  color: "muted", desc: "5 days for bereavement of immediate family" },
      { type: "Hajj Leave",          entitled: 30, used: 0, pending: 0, remaining: 30, color: "muted", desc: "Once during employment, after 1 year of service" },
      { type: "Maternity / Paternity", entitled: null, used: 0, pending: 0, remaining: null, color: "muted", desc: "60 days maternity · 5 days paternity (per UAE Labour Law)" },
    ],
    requests: [
      { id: "LV-2026-008", type: "Annual Paid Leave", from: "2026-05-26", to: "2026-05-28", days: 3, status: "Pending PM", submittedOn: "2 days ago", reason: "Family wedding in Abu Dhabi", endorsement: null },
      { id: "LV-2026-007", type: "Annual Paid Leave", from: "2026-04-21", to: "2026-04-22", days: 2, status: "Approved",   submittedOn: "3 weeks ago", reason: "Personal", endorsement: "PM endorsed · HR approved 20 Apr" },
      { id: "LV-2026-006", type: "Annual Paid Leave", from: "2026-04-09", to: "2026-04-11", days: 3, status: "Approved",   submittedOn: "5 weeks ago", reason: "Eid Al Fitr extension", endorsement: "PM endorsed · HR approved 5 Apr" },
    ],
  },
};

// Document IDs that come from ODOO (signed pre-hire) — used to show a source pill on docs
const ODOO_DOC_TYPES = new Set(["Offer", "Contract", "NDA"]);

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

// Today's date is 12 May 2026 (the demo date). Used to compute deadline countdowns.
const TODAY = new Date("2026-05-12");

// Days remaining until a YYYY-MM-DD due date (negative = overdue)
function daysUntil(dueDateStr) {
  if (!dueDateStr) return null;
  const due = new Date(dueDateStr);
  const diffMs = due - TODAY;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Returns the *effective* state for a training row. A training in `in_progress` whose
// due date has passed becomes `overdue` (a UI state, not a stored field) so the rest of
// the code doesn't have to keep re-checking.
function trainingState(t) {
  if (t.state === "in_progress" && t.dueDate) {
    const d = daysUntil(t.dueDate);
    if (d !== null && d < 0) return "overdue";
  }
  return t.state;
}

// Human-readable deadline label for a training row
function deadlineLabel(t) {
  if (!t.dueDate) return "No deadline · self-paced";
  const d = daysUntil(t.dueDate);
  if (d < 0) return `Overdue by ${Math.abs(d)} day${Math.abs(d) === 1 ? "" : "s"}`;
  if (d === 0) return "Due today";
  if (d === 1) return "Due tomorrow";
  return `${d} days remaining`;
}

// Visual style key for the countdown urgency
function deadlineStyle(t) {
  if (!t.dueDate) return "muted";
  const d = daysUntil(t.dueDate);
  if (d < 0) return "danger";
  if (d <= 3) return "danger";
  if (d <= 7) return "warn";
  return "ok";
}

// =========================================================
// SIDEBAR
// =========================================================
function renderNav(activeId) {
  const nav = $("#nav .nav__group");
  nav.innerHTML = `<div class="nav__heading">My Portal</div>` + NAV_ITEMS.map(item => {
    const countDisplay = item.count !== undefined ? `${item.count}${item.countSuffix || ""}` : "";
    return `
      <a class="nav__item ${item.id === activeId ? "nav__item--active" : ""}" data-route="${item.id}" href="#${item.id}">
        ${ICONS[item.iconKey] || ""}
        ${item.label}
        ${item.count !== undefined ? `<span class="nav__count ${item.countStyle ? "nav__count--" + item.countStyle : ""}">${countDisplay}</span>` : ""}
      </a>`;
  }).join("");
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
// EMPLOYEE DASHBOARD — sections are reorderable.
// Same pattern as HR Dashboard: each section is a function, page
// assembles them in user-preferred order from SUDO_LAYOUT.
// =========================================================

const EMP_DASHBOARD_SECTIONS = [
  { id: "kpi-cards",        label: "KPI Cards",              hint: "Onboarding progress, training, KPI count, certs (the top metric cards)" },
  { id: "tasks-onboarding", label: "Tasks & Onboarding",     hint: "Two-column row: tasks needing your attention + your onboarding steps" },
  { id: "recent-activity",  label: "My Recent Activity",     hint: "Audit feed of recent things that happened to you" },
];
const EMP_DASHBOARD_DEFAULT_ORDER = EMP_DASHBOARD_SECTIONS.map(s => s.id);

function empDashSectionKpiCards() {
  return `
    <section class="cards">
      ${DATA.kpiCards.map(card => {
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
            </div>
            <div class="card__title">${card.title}</div>
            ${valueHtml}
            ${bottomHtml}
          </div>`;
      }).join("")}
    </section>`;
}

function empDashSectionTasksOnboarding() {
  return `
    <section class="grid-two grid-two--asym">
      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Needs Your Attention</h3>
            <p class="panel__sub">${DATA.tasks.length} items today</p>
          </div>
          <a class="panel__link" data-nav="notifications">View all →</a>
        </header>
        <div class="panel__body">
          <div class="task-list">
            ${DATA.tasks.map(t => `
              <div class="task">
                <div class="task__icon task__icon--${t.style}">${ICONS[t.icon] || ""}</div>
                <div class="task__main">
                  <div class="task__name">${t.name}</div>
                  <div class="task__desc">${t.desc}</div>
                </div>
                <div class="task__action">${t.action} →</div>
              </div>`).join("")}
          </div>
        </div>
      </article>

      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">My Onboarding</h3>
            <p class="panel__sub">Step 3 of 5</p>
          </div>
          <a class="panel__link" data-nav="onboarding">Details →</a>
        </header>
        <div class="panel__body">
          <div class="onb-tracker">
            ${DATA.onbSteps.map(s => `
              <div class="onb-step ${s.status === 'done' ? 'onb-step--done' : ''}">
                <div class="onb-step__circle onb-step__circle--${s.status}">
                  ${s.status === 'done' ? ICONS.check : s.num}
                </div>
                <div class="onb-step__main">
                  <div class="onb-step__name ${s.status === 'current' ? 'onb-step__name--current' : ''}">${s.name}</div>
                  <div class="onb-step__desc">${s.status === 'done' ? `Completed ${s.completed}` : s.status === 'current' ? (s.desc2 || s.desc) : s.desc}</div>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </article>
    </section>`;
}

function empDashSectionRecentActivity() {
  return `
    <article class="panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">My Recent Activity</h3>
          <p class="panel__sub">Last 7 days</p>
        </div>
      </header>
      <div class="panel__body">
        <div class="activity-feed">
          ${DATA.activity.map(a => `
            <div class="act">
              <div class="act__dot act__dot--${a.style}">${ICONS[a.icon] || ""}</div>
              <div class="act__main"><strong>${a.title}</strong><br><span>${a.desc}</span></div>
              <div class="act__time">${a.time}</div>
            </div>`).join("")}
        </div>
      </div>
    </article>`;
}

const EMP_DASHBOARD_SECTION_RENDERERS = {
  "kpi-cards":        empDashSectionKpiCards,
  "tasks-onboarding": empDashSectionTasksOnboarding,
  "recent-activity":  empDashSectionRecentActivity,
};

function pageDashboard() {
  const prefs = window.SUDO_LAYOUT
    ? SUDO_LAYOUT.getPrefs("emp-dashboard", EMP_DASHBOARD_DEFAULT_ORDER)
    : { order: EMP_DASHBOARD_DEFAULT_ORDER, hidden: [] };

  const sectionsHtml = prefs.order
    .filter(id => !prefs.hidden.includes(id))
    .map(id => (EMP_DASHBOARD_SECTION_RENDERERS[id] || (() => ""))())
    .join("\n");

  return `
    <section class="welcome">
      <div class="welcome__text">
        <div class="welcome__eyebrow">WELCOME BACK, REEM</div>
        <h2 class="welcome__h">You're 32% through onboarding · keep it up!</h2>
        <p class="welcome__p">5 items need your attention today, including your Q2 KPI acknowledgements and Thursday's NEO session.</p>
      </div>
      <div class="welcome__quick">
        <button class="quick-action" data-quick="onboarding">
          <div class="quick-action__icon">${ICONS.rocket}</div>
          <span>Onboarding</span>
        </button>
        <button class="quick-action" data-quick="kpis">
          <div class="quick-action__icon">${ICONS.trending}</div>
          <span>My KPIs</span>
        </button>
        <button class="quick-action" data-quick="requests">
          <div class="quick-action__icon">${ICONS.inbox}</div>
          <span>Submit request</span>
        </button>
        <button class="quick-action quick-action--ghost" data-action="emp-customize-dashboard" title="Reorder dashboard sections">
          <div class="quick-action__icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1m17.5-7.5l-4.2 4.2M9.7 14.3l-4.2 4.2m13-0l-4.2-4.2M9.7 9.7L5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>
          <span>Customize</span>
        </button>
      </div>
    </section>

    ${sectionsHtml}`;
}

// =========================================================
// PAGE: Onboarding
// =========================================================
function pageOnboarding() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Onboarding</h2>
        <div class="page-header__sub">Joined 1 April 2026 · Day 41 of probation · 32% complete · expected confirmation 1 July 2026</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Download summary</button>
      </div>
    </div>

    <section class="cards" style="grid-template-columns:repeat(5,1fr);margin-bottom:22px">
      ${DATA.onbSteps.map(s => `
        <div class="card" style="cursor:default;min-height:auto">
          <div class="card__head">
            <div class="card__icon card__icon--${s.status === 'done' ? 'ok' : s.status === 'current' ? 'bright' : 'info'}">
              ${s.status === 'done' ? ICONS.check : `<div style="font-size:13px;font-weight:700">${s.num}</div>`}
            </div>
            ${s.status === 'current' ? '<span class="status status--info">In progress</span>' : s.status === 'done' ? '<span class="status status--ok">Done</span>' : ''}
          </div>
          <div class="card__title">${s.name}</div>
          <div class="card__meta" style="margin-top:10px">${s.status === 'done' ? `Completed ${s.completed}` : s.status === 'current' ? 'In progress now' : 'Coming up'}</div>
        </div>`).join("")}
    </section>

    <article class="panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Step-by-Step Plan</h3>
          <p class="panel__sub">What's done, what's now, what's next</p>
        </div>
      </header>
      <div class="panel__body">
        <div class="onb-tracker">
          ${DATA.onbSteps.map(s => `
            <div class="onb-step ${s.status === 'done' ? 'onb-step--done' : ''}">
              <div class="onb-step__circle onb-step__circle--${s.status}">
                ${s.status === 'done' ? ICONS.check : s.num}
              </div>
              <div class="onb-step__main">
                <div class="onb-step__name ${s.status === 'current' ? 'onb-step__name--current' : ''}" style="font-size:15px">${s.name}</div>
                <div class="onb-step__desc" style="font-size:13px;margin-top:4px">${s.status === 'done' ? `Completed ${s.completed}` : s.desc}</div>
                ${s.status === 'current' && s.desc2 ? `<div style="font-size:12.5px;color:var(--bright);font-weight:600;margin-top:6px">→ ${s.desc2}</div>` : ''}
                ${s.meeting ? `
                  <div class="teams-meeting">
                    <div class="teams-meeting__icon">${ICONS.videoCam}</div>
                    <div class="teams-meeting__main">
                      <div class="teams-meeting__label">Microsoft Teams meeting</div>
                      <div class="teams-meeting__title">${s.meeting.title}</div>
                      <div class="teams-meeting__time">${s.meeting.date} · ${s.meeting.time} · with ${s.meeting.with}</div>
                    </div>
                    <div class="teams-meeting__actions">
                      <a class="teams-meeting__btn teams-meeting__btn--secondary" href="${s.meeting.calendarUrl}">${ICONS.calendar} Add to calendar</a>
                      <a class="teams-meeting__btn" href="${s.meeting.joinUrl}">${ICONS.videoCam} Join Teams meeting</a>
                    </div>
                  </div>` : ''}
              </div>
              <div class="onb-step__action">
                ${s.status === 'current' ? '<button class="btn btn--primary btn--sm">Continue</button>' : s.status === 'done' ? '<button class="btn btn--ghost btn--sm">View</button>' : ''}
              </div>
            </div>`).join("")}
        </div>
      </div>
    </article>`;
}

// =========================================================
// PAGE: Profile
// =========================================================
function pageProfile() {
  const u = DATA.user;
  // Helper: editable field row (employee can change directly)
  const editable = (label, val, fieldKey, mono = false) => `
    <div class="info-row info-row--editable">
      <span class="info-row__label">${label}</span>
      <div class="info-row__edit-wrap">
        <span class="info-row__value ${mono ? 'info-row__value--mono' : ''}">${val}</span>
        <button class="info-row__edit-btn" data-action="edit-field" data-field="${fieldKey}" title="Edit ${label.toLowerCase()}">
          ${ICONS.edit}
        </button>
      </div>
    </div>`;
  // Helper: locked field row (employee must request HR/Admin to edit)
  const locked = (label, val, fieldKey, mono = false) => `
    <div class="info-row info-row--locked">
      <span class="info-row__label">${ICONS.lock} ${label}</span>
      <div class="info-row__edit-wrap">
        <span class="info-row__value ${mono ? 'info-row__value--mono' : ''}">${val}</span>
        <button class="info-row__request-btn" data-action="request-edit" data-field="${fieldKey}" title="Request edit (HR/Admin approval)">
          Request edit
        </button>
      </div>
    </div>`;
  // Helper: synced-from-Entra field (cannot be edited via portal at all — source of truth is Entra)
  const synced = (label, val, mono = false) => `
    <div class="info-row info-row--synced">
      <span class="info-row__label">${ICONS.shield} ${label}</span>
      <div class="info-row__edit-wrap">
        <span class="info-row__value ${mono ? 'info-row__value--mono' : ''}">${val}</span>
        <span class="info-row__synced-tag" title="Synced from Microsoft Entra ID · cannot be changed here">Entra</span>
      </div>
    </div>`;

  // Read user's photo from localStorage (prototype storage; in production this
  // comes from the Employee.photoUrl field returned by /auth/me).
  const photoKey = `sudo:profile:photo:${u.employeeId || 'E008'}`;
  let photoUrl = null;
  try { photoUrl = localStorage.getItem(photoKey); } catch (e) { /* ignore */ }

  return `
    <section class="profile-hero">
      <div class="profile-hero__avatar profile-hero__avatar--has-action" id="profile-avatar">
        ${photoUrl
          ? `<img src="${photoUrl}" alt="${u.name}" class="profile-hero__avatar-img">`
          : `<span class="profile-hero__avatar-initials">${u.initials}</span>`}
        <button class="profile-hero__avatar-btn" data-action="change-photo" title="Change profile photo" aria-label="Change profile photo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
        <input type="file" id="profile-photo-input" accept="image/png,image/jpeg,image/webp,image/gif" style="display:none">
      </div>
      <div class="profile-hero__main">
        <div class="profile-hero__name">${u.name}
          ${u.tag ? `<span class="profile-hero__tag" title="Granted by ${u.tag.grantedBy} · ${u.tag.grantedOn}">${ICONS.award || '★'} ${u.tag.label}</span>` : ''}
        </div>
        <div class="profile-hero__title">${u.title} · ${u.dept}</div>
        <div class="profile-hero__meta">
          <span>${ICONS.briefcase} <strong>${u.employeeId}</strong></span>
          <span>${ICONS.mail} <strong>${u.workEmail}</strong></span>
          <span>${ICONS.calendar} Joined <strong>1 April 2026</strong></span>
        </div>
      </div>
      <div class="profile-hero__actions">
        <button class="btn btn--secondary" data-action="show-tag-info">${ICONS.eye} About tag</button>
      </div>
    </section>

    <div class="info-banner">
      ${ICONS.lock}
      <div>
        <strong>Editable vs locked fields.</strong> Personal email, phone, and address you can change directly — no approval needed. Other fields are locked. Click <strong>Request edit</strong> to ask HR or a Super Admin to allow a change. They'll review and approve or decline.
      </div>
    </div>

    <div class="info-grid">

      <div class="info-card">
        <div class="info-card__title">${ICONS.user} Personal Information</div>
        ${locked("Full Name", "Reem Khalid Al Otaibi", "fullName")}
        ${locked("Date of Birth", u.dob, "dob")}
        ${locked("Nationality", u.nationality, "nationality")}
        ${locked("Marital Status", u.maritalStatus, "maritalStatus")}
        <div class="info-row"><span class="info-row__label">Languages</span><span class="info-row__value">Arabic, English</span></div>
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.mail} Contact <span class="info-card__title-hint">— you can edit these directly</span></div>
        ${synced("Work Email", u.workEmail, true)}
        ${editable("Personal Email", u.personalEmail, "personalEmail", true)}
        ${editable("Mobile", u.phone, "phone", true)}
        ${editable("Address", u.address, "address")}
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.briefcase} Employment</div>
        ${synced("Employee ID", u.employeeId, true)}
        <div class="info-row"><span class="info-row__label">Department</span><span class="info-row__value">${u.dept}</span></div>
        <div class="info-row"><span class="info-row__label">Job Title</span><span class="info-row__value">${u.title}</span></div>
        <div class="info-row"><span class="info-row__label">Line Manager</span><span class="info-row__value">${u.lm}</span></div>
        <div class="info-row info-row--block">
          <span class="info-row__label">Project Managers · ${u.pms.length}</span>
          <div class="pm-list">
            ${u.pms.map(p => `
              <div class="pm-list__item">
                <div class="pm-list__avatar">${p.initials}</div>
                <div class="pm-list__main">
                  <div class="pm-list__name">${p.name}${p.isPrimary ? '<span class="pm-list__primary">Primary</span>' : ''}</div>
                  <div class="pm-list__project">${p.project}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
        <div class="info-row"><span class="info-row__label">Joined</span><span class="info-row__value">1 April 2026</span></div>
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.heart || ICONS.user} Family <span class="info-card__title-hint">— managed by HR/Admin</span></div>
        ${DATA.family.spouse || DATA.family.children.length > 0 ? `
          ${DATA.family.spouse ? `
            <div class="family-member">
              <div class="family-member__head">
                <div class="family-member__avatar">${initials(DATA.family.spouse.name)}</div>
                <div>
                  <div class="family-member__name">${DATA.family.spouse.name}</div>
                  <div class="family-member__rel">Spouse</div>
                </div>
              </div>
              <div class="family-member__detail">Visa: ${DATA.family.spouse.visa}</div>
            </div>` : ''}
          ${DATA.family.children.map(c => `
            <div class="family-member">
              <div class="family-member__head">
                <div class="family-member__avatar family-member__avatar--child">${initials(c.name)}</div>
                <div>
                  <div class="family-member__name">${c.name}</div>
                  <div class="family-member__rel">Child · age ${c.age}</div>
                </div>
              </div>
              <div class="family-member__detail">Visa: ${c.visa}</div>
            </div>`).join('')}
        ` : `
          <div class="empty-inline">
            <span>${DATA.family.note}</span>
          </div>
          <button class="btn btn--secondary btn--sm" data-action="request-family">${ICONS.plus} Request to add family member</button>
        `}
      </div>

      <div class="info-card info-card--wide">
        <div class="info-card__title">${ICONS.shield} Insurance <span class="info-card__title-hint">— company-provided coverage</span></div>
        <div class="insurance-block">
          <div class="insurance-block__head">
            <div class="insurance-block__role">EMPLOYEE COVERAGE</div>
            <span class="status status--ok">Active</span>
          </div>
          <div class="insurance-block__title">${DATA.insurance.employee.provider} · ${DATA.insurance.employee.tier}</div>
          <div class="insurance-row"><span>Policy</span><span class="info-row__value--mono">${DATA.insurance.employee.policyNo}</span></div>
          <div class="insurance-row"><span>Coverage</span><span>${DATA.insurance.employee.coverage}</span></div>
          <div class="insurance-row"><span>Valid until</span><span>${DATA.insurance.employee.validUntil}</span></div>
        </div>
        ${DATA.insurance.family.length > 0 ? `
          <div class="insurance-block insurance-block--family">
            <div class="insurance-block__head">
              <div class="insurance-block__role">FAMILY COVERAGE · ${DATA.insurance.family.length} dependent${DATA.insurance.family.length > 1 ? 's' : ''}</div>
              <span class="status status--ok">Active</span>
            </div>
            ${DATA.insurance.family.map(f => `
              <div class="insurance-row"><span>${f.dependent}</span><span>${f.provider} · ${f.tier}</span></div>`).join('')}
          </div>
        ` : `
          <div class="insurance-block insurance-block--empty">
            <div class="insurance-block__role">FAMILY COVERAGE</div>
            <div class="empty-inline" style="padding:8px 0">No dependents on file. When HR adds spouse or children, their company-provided coverage shows here.</div>
          </div>
        `}
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.heart || ICONS.user} Emergency Contact</div>
        ${locked("Name", "Khalid Al Otaibi", "ec_name")}
        ${locked("Relationship", "Father", "ec_rel")}
        ${locked("Phone", "+971 50 ●●● 7741", "ec_phone", true)}
        ${locked("Email", "k.alotaibi@gmail.com", "ec_email", true)}
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.lock} Identity Documents</div>
        <div class="private-notice">
          ${ICONS.shield}
          <span>These fields are visible only to you, your HR team, and Super Admins.</span>
        </div>
        ${locked("Emirates ID", "784-●●●●-●●●●●●●-1", "eid", true)}
        ${locked("Passport", "P●●●●●●5 · UAE", "passport", true)}
        ${locked("Visa Status", "Employment Residence · valid until Mar 2028", "visa")}
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.briefcase} Banking</div>
        <div class="private-notice">
          ${ICONS.shield}
          <span>Bank information is private. Changes require HR approval.</span>
        </div>
        ${locked("Bank", "Emirates NBD", "bank_name")}
        ${locked("IBAN", "AE07 ●●●● ●●●● ●●●● ●●41 8", "iban", true)}
        ${locked("Account Holder", "Reem Al Otaibi", "bank_holder")}
      </div>

      <div class="info-card info-card--wide">
        <div class="info-card__title">${ICONS.chart} Salary & Compensation <span class="info-card__title-hint">— only you, HR, and Super Admin can see this</span>
          <button class="salary-reveal-btn" data-action="toggle-salary-mask" title="Reveal amounts" aria-pressed="false">
            ${ICONS.eye || '<svg viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>'}
            <span class="salary-reveal-btn__label">Reveal</span>
          </button>
        </div>
        <div class="private-notice">
          ${ICONS.shield}
          <span>Salary details are confidential. They are not visible to your PM or Line Manager. Changes follow HR's compensation review cycle.</span>
        </div>
        <div class="salary-grid" data-salary-grid data-masked="true">
          <div class="salary-block">
            <div class="salary-block__label">BASIC SALARY (MONTHLY)</div>
            <div class="salary-block__amount">AED <span class="salary-block__amount-num" data-secret="12,500">●●●,●●●</span></div>
            <div class="salary-block__sub">Effective from 1 April 2026</div>
          </div>
          <div class="salary-block">
            <div class="salary-block__label">HOUSING ALLOWANCE</div>
            <div class="salary-block__amount">AED <span class="salary-block__amount-num" data-secret="5,000">●●,●●●</span></div>
            <div class="salary-block__sub">Monthly</div>
          </div>
          <div class="salary-block">
            <div class="salary-block__label">TRANSPORT ALLOWANCE</div>
            <div class="salary-block__amount">AED <span class="salary-block__amount-num" data-secret="1,500">●,●●●</span></div>
            <div class="salary-block__sub">Monthly</div>
          </div>
          <div class="salary-block salary-block--total">
            <div class="salary-block__label">GROSS MONTHLY</div>
            <div class="salary-block__amount">AED <span class="salary-block__amount-num" data-secret="19,000">●●,●●●</span></div>
            <div class="salary-block__sub">Annual: AED <span data-secret="228,000">●●●,●●●</span></div>
          </div>
        </div>
        <div class="salary-meta-row">
          <div class="info-row" style="padding:6px 0"><span class="info-row__label">Payment Cycle</span><span class="info-row__value">Monthly · last working day</span></div>
          <div class="info-row" style="padding:6px 0"><span class="info-row__label">Currency</span><span class="info-row__value">AED (UAE Dirham)</span></div>
          <div class="info-row" style="padding:6px 0"><span class="info-row__label">Next Review</span><span class="info-row__value">1 April 2027 · annual cycle</span></div>
          <div class="info-row" style="padding:6px 0"><span class="info-row__label">End of Service Gratuity</span><span class="info-row__value">Accruing per UAE Labour Law</span></div>
        </div>
        <div style="display:flex;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid var(--ink-100);align-items:center;flex-wrap:wrap">
          <span class="odoo-source-pill">${ICONS.external} Payslips synced from ODOO</span>
          <span style="flex:1"></span>
          <button class="btn btn--secondary btn--sm" data-action="view-payslips">${ICONS.download} View payslips</button>
          <button class="btn btn--ghost btn--sm" data-action="submit-request">${ICONS.send} Request salary certificate</button>
        </div>
      </div>

      <div class="info-card info-card--wide">
        <div class="info-card__title">${ICONS.plane || ICONS.briefcase} Air Ticket Entitlement <span class="info-card__title-hint">— managed by HR / Admin</span></div>
        <div class="ticket-summary">
          <div class="ticket-summary__main">
            <div class="ticket-summary__title">${DATA.airTickets.entitlement.cycle} · ${DATA.airTickets.entitlement.ticketsPerCycle} round-trip · ${DATA.airTickets.entitlement.class}</div>
            <div class="ticket-summary__route">${DATA.airTickets.entitlement.route}</div>
            <div class="ticket-summary__notes">${DATA.airTickets.entitlement.notes}</div>
          </div>
          <div class="ticket-summary__counters">
            <div class="ticket-counter">
              <div class="ticket-counter__value" style="color:var(--ok)">${DATA.airTickets.remaining}</div>
              <div class="ticket-counter__label">Remaining</div>
            </div>
            <div class="ticket-counter">
              <div class="ticket-counter__value">${DATA.airTickets.used}</div>
              <div class="ticket-counter__label">Used</div>
            </div>
            <div class="ticket-counter">
              <div class="ticket-counter__value">${DATA.airTickets.pending}</div>
              <div class="ticket-counter__label">Pending</div>
            </div>
          </div>
        </div>
        <div class="ticket-meta">Last updated by ${DATA.airTickets.entitlement.lastUpdatedBy} on ${DATA.airTickets.entitlement.lastUpdatedOn}</div>
        ${DATA.airTickets.history.length > 0 ? `
          <div class="section-header" style="margin:14px 0 8px;font-size:11px">Travel History</div>
          <div class="ticket-history">
            ${DATA.airTickets.history.map(t => `
              <div class="ticket-history__row">
                <div class="ticket-history__date">${t.date}</div>
                <div class="ticket-history__main">
                  <div class="ticket-history__route">${t.route}</div>
                  <div class="ticket-history__detail">${t.airline} · ${t.class} · ${t.currency} ${t.amount.toLocaleString()}</div>
                </div>
                <span class="status status--ok">${t.status}</span>
              </div>`).join("")}
          </div>
        ` : ""}
        <div style="display:flex;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid var(--ink-100);flex-wrap:wrap">
          <button class="btn btn--primary btn--sm" data-action="request-ticket">${ICONS.send} Request ticket booking</button>
          <button class="btn btn--secondary btn--sm" data-action="upload-boarding-pass">${ICONS.upload} Upload boarding pass</button>
          <span style="flex:1"></span>
          <button class="btn btn--ghost btn--sm" data-action="view-ticket-policy">Policy</button>
        </div>
      </div>

    </div>`;
}

// =========================================================
// PAGE: Trainings
// =========================================================
function pageTrainings() {
  // Compute effective states (overdue is derived from in_progress + dueDate)
  const rows = DATA.myTrainings.map(t => ({ ...t, _state: trainingState(t) }));
  const assigned = rows.filter(t => t._state === "assigned");
  const inProgress = rows.filter(t => t._state === "in_progress");
  const overdue = rows.filter(t => t._state === "overdue");
  const awaiting = rows.filter(t => t._state === "awaiting_verification");
  const verified = rows.filter(t => t._state === "verified");

  // Card renderer — state-aware
  function trainingCard(t) {
    const s = t._state;
    const requiredPill = t.required
      ? '<span class="status status--info">Required</span>'
      : '<span class="status status--muted">Optional</span>';

    // Pick the state pill
    const statePillMap = {
      assigned:              '<span class="status status--muted">Not started</span>',
      in_progress:           '<span class="status status--info">In progress</span>',
      overdue:               '<span class="status status--danger">Overdue</span>',
      awaiting_verification: '<span class="status status--warn">Awaiting verification</span>',
      verified:              '<span class="status status--ok">Verified</span>',
    };

    // Deadline display
    let deadlineHtml = "";
    if (s === "verified") {
      deadlineHtml = `<div class="tcard-deadline tcard-deadline--ok">${ICONS.check}<span>Completed ${t.completedOn} · verified by ${t.verifiedBy}</span></div>`;
    } else if (s === "awaiting_verification") {
      deadlineHtml = `<div class="tcard-deadline tcard-deadline--warn">${ICONS.clock}<span>Submitted ${t.certificate.uploadedOn} · awaiting HR sign-off</span></div>`;
    } else if (s === "assigned") {
      deadlineHtml = `<div class="tcard-deadline tcard-deadline--muted">${ICONS.clock}<span>${t.dueDate ? `${daysUntil(t.dueDate)} days remaining · countdown started when HR assigned this` : "Countdown started when HR assigned this"}</span></div>`;
    } else {
      const styleKey = deadlineStyle(t);
      deadlineHtml = `<div class="tcard-deadline tcard-deadline--${styleKey}">${ICONS.clock}<span>${deadlineLabel(t)}</span></div>`;
    }

    // Extended-by-HR pill
    const extendedHtml = t.extendedBy
      ? `<div class="tcard-ext">${ICONS.shield} Deadline extended by ${t.extendedBy.hr} <strong>(+${t.extendedBy.days} days)</strong> · ${t.extendedBy.reason}</div>`
      : "";

    // Primary action by state
    let actionsHtml = "";
    if (s === "assigned") {
      // Trainings are auto-accepted on HR assignment — no "Start" gate.
      actionsHtml = `
        <button class="btn btn--secondary btn--sm" data-action="open-external" data-training-id="${t.id}">${ICONS.external} Open in ${t.platform}</button>
        <button class="btn btn--primary btn--sm" data-action="upload-cert" data-training-id="${t.id}">${ICONS.upload} Upload certificate</button>
        <button class="btn btn--ghost btn--sm" data-action="open-detail" data-training-id="${t.id}">Details</button>`;
    } else if (s === "in_progress" || s === "overdue") {
      const uploadStyle = s === "overdue" ? "btn--danger" : "btn--primary";
      actionsHtml = `
        <button class="btn btn--secondary btn--sm" data-action="open-external" data-training-id="${t.id}">${ICONS.external} Open in ${t.platform}</button>
        <button class="btn ${uploadStyle} btn--sm" data-action="upload-cert" data-training-id="${t.id}">${ICONS.upload} Upload certificate</button>
        ${s === "overdue" ? `<button class="btn btn--ghost btn--sm" data-action="request-extension" data-training-id="${t.id}">Request extension</button>` : ""}`;
    } else if (s === "awaiting_verification") {
      actionsHtml = `
        <div class="locked-file">
          ${ICONS.lock}
          <div class="locked-file__main">
            <div class="locked-file__name">${t.certificate.filename}</div>
            <div class="locked-file__meta">${t.certificate.size} · uploaded ${t.certificate.uploadedOn} · locked</div>
          </div>
          <button class="btn btn--ghost btn--sm" data-action="request-reupload" data-training-id="${t.id}">Request re-upload</button>
        </div>`;
    } else if (s === "verified") {
      actionsHtml = `
        <button class="btn btn--secondary btn--sm" data-action="download-cert" data-training-id="${t.id}">${ICONS.download} Certificate</button>
        <button class="btn btn--ghost btn--sm" data-action="open-detail" data-training-id="${t.id}">Details</button>`;
    }

    // Build a tag list for FilterBar filtering
    const tagMap = {
      assigned:              "active newly-assigned",
      in_progress:           "active in-progress",
      overdue:               "active overdue",
      awaiting_verification: "awaiting",
      verified:              "verified",
    };
    const stateTag = tagMap[s] || "";
    const priorityTag = t.required ? "required" : "optional";
    const providerTag = (t.provider || "").toLowerCase().replace(/\s+/g, "-");
    const tags = ["all", stateTag, priorityTag, providerTag].filter(Boolean).join(" ");
    const searchText = `${t.title || ""} ${t.provider || ""} ${t.platform || ""}`.toLowerCase();

    return `
      <div class="tcard tcard--${s}" data-tag="${tags}" data-search="${searchText}">
        <div class="tcard__head">
          <div>
            <div class="tcard__provider">${t.provider} · ${t.platform}</div>
            <div class="tcard__title" style="margin-top:4px">${t.title}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">
            ${statePillMap[s]}
            ${requiredPill}
          </div>
        </div>
        ${deadlineHtml}
        ${extendedHtml}
        <div class="tcard__actions">${actionsHtml}</div>
      </div>`;
  }

  function sectionTitle(label, count) {
    return `<h3 class="t-section">${label}<span class="t-section__count">${count}</span></h3>`;
  }

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Trainings</h2>
        <div class="page-header__sub">
          ${rows.length} trainings · ${verified.length} verified · ${awaiting.length} awaiting HR · ${inProgress.length + overdue.length} in progress · ${assigned.length} not started
        </div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.search} Browse Catalogue</button>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.lightbulb}
      <div>
        <strong>How trainings work at SUDO.</strong> Trainings happen on external platforms (AWS Skill Builder, KnowBe4, Udemy). When HR assigns you a training, the deadline countdown <strong>starts immediately</strong> — no acceptance needed. When you finish, upload your certificate here. HR verifies and the training closes.
        <br><span class="info-banner__sub">Upload is one-shot — once you submit, the file locks. To re-upload, ask HR to allow it.</span>
      </div>
    </div>

    <div id="fb-trainings"></div>

    <div id="trainings-results">
      ${overdue.length ? `
        <section data-tag="all overdue active" data-search="overdue">
          ${sectionTitle("Overdue", overdue.length)}
          <div class="tcards" style="margin-bottom:24px">
            ${overdue.map(trainingCard).join("")}
          </div>
        </section>` : ""}

      ${assigned.length ? `
        <section data-tag="all newly-assigned active" data-search="newly assigned">
          ${sectionTitle("Newly Assigned", assigned.length)}
          <div class="tcards" style="margin-bottom:24px">
            ${assigned.map(trainingCard).join("")}
          </div>
        </section>` : ""}

      ${inProgress.length ? `
        <section data-tag="all in-progress active" data-search="in progress">
          ${sectionTitle("In Progress", inProgress.length)}
          <div class="tcards" style="margin-bottom:24px">
            ${inProgress.map(trainingCard).join("")}
          </div>
        </section>` : ""}

      ${awaiting.length ? `
        <section data-tag="all awaiting" data-search="awaiting verification">
          ${sectionTitle("Awaiting HR Verification", awaiting.length)}
          <div class="tcards" style="margin-bottom:24px">
            ${awaiting.map(trainingCard).join("")}
          </div>
        </section>` : ""}

      ${verified.length ? `
        <section data-tag="all verified" data-search="verified">
          ${sectionTitle("Verified", verified.length)}
          <div class="tcards">
            ${verified.map(trainingCard).join("")}
          </div>
        </section>` : ""}

      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:40px 20px;color:var(--ink-500)">
          <div style="font-size:32px;margin-bottom:8px">📚</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px">No trainings match these filters</div>
          <div style="font-size:12px">Try clearing the search or selecting a different tab.</div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// PAGE: Certifications
// =========================================================
function pageCertifications() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Certifications</h2>
        <div class="page-header__sub">${DATA.myCerts.length} active certifications · auto-synced from Credly + manual uploads</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.refresh} Sync Credly</button>
        <button class="btn btn--primary">${ICONS.upload} Upload Certificate</button>
      </div>
    </div>

    <div id="fb-certs"></div>

    <div class="ccards" id="certs-results">
      ${DATA.myCerts.map(c => {
        const providerSlug = (c.provider || "").toLowerCase().replace(/\s+/g, "-");
        const statusTag = c.status === 'ok' ? 'current' : 'expiring';
        const tags = ["all", statusTag, providerSlug];
        const searchText = `${c.name} ${c.provider} ${c.issued} ${c.expires}`.toLowerCase();
        return `
        <div class="ccard" data-tag="${tags.join(" ")}" data-search="${searchText}">
          <div class="ccard__badge ccard__badge--${c.badge}">${c.provider === 'AWS' ? 'AWS' : c.provider === 'KnowBe4' ? 'KB4' : 'CRT'}</div>
          <div class="ccard__main">
            <div class="ccard__title">${c.name}</div>
            <div class="ccard__provider">${c.provider}</div>
            <div style="margin-bottom:8px">${c.status === 'ok' ? '<span class="status status--ok">Current</span>' : '<span class="status status--warn">Expiring Soon</span>'}</div>
            <div class="ccard__dates">
              <div>Issued <strong>${c.issued}</strong></div>
              <div>Expires <strong>${c.expires}</strong></div>
            </div>
          </div>
        </div>`;
      }).join("")}
      <div class="fb-empty" style="display:none;grid-column:1/-1">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No certifications match these filters</div>
      </div>
    </div>

    <article class="panel" style="margin-top:22px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Recommended Certifications</h3>
          <p class="panel__sub">Synced from HR · based on your role, team progression path, and HR's recommended tracks. Updates whenever HR adds a new track or you change roles.</p>
        </div>
      </header>
      <div class="panel__body">
        <div class="task-list">
          <div class="task">
            <div class="task__icon task__icon--bright">${ICONS.award}</div>
            <div class="task__main">
              <div class="task__name">AWS Solutions Architect Associate</div>
              <div class="task__desc">Next milestone on your track · enrollment open · training assigned</div>
            </div>
            <div class="task__action">View training →</div>
          </div>
          <div class="task">
            <div class="task__icon task__icon--navy">${ICONS.award}</div>
            <div class="task__main">
              <div class="task__name">AWS Solutions Architect Professional</div>
              <div class="task__desc">Recommended within 18 months · contributes to AWS Premier Partner tier</div>
            </div>
            <div class="task__action">Learn more →</div>
          </div>
          <div class="task">
            <div class="task__icon task__icon--navy">${ICONS.award}</div>
            <div class="task__main">
              <div class="task__name">AWS Security Specialty</div>
              <div class="task__desc">Optional specialty · gives you advisory engagement eligibility</div>
            </div>
            <div class="task__action">Learn more →</div>
          </div>
        </div>
      </div>
    </article>`;
}

// =========================================================
// PAGE: KPIs
// =========================================================
function pageKpis() {
  // Current employee (Reem Al Otaibi in the prototype)
  const meId = "E008";
  const me = SUDO_DB_HELPERS.findEmployee(meId);
  const myAssigns = SUDO_DB_HELPERS.assignmentsForEmployee(meId, "q2-2026");

  // Bucket assignments
  const needsAck    = myAssigns.filter(a => a.status === "active" && !a.empAcknowledgedAt);
  const pendingVal  = myAssigns.filter(a => a.status === "progress_pending_validation");
  const inProgress  = myAssigns.filter(a => a.status === "active" && a.empAcknowledgedAt);
  const achieved    = inProgress.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "green" && a.met);
  const redKpis     = inProgress.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "red");
  const composite   = SUDO_DB_HELPERS.compositeScore(meId, "q2-2026");
  const ack = SUDO_DB.kpiAcknowledgements.find(a => a.empId === meId && a.cycleId === "q2-2026");

  // Status badge helper
  function statusBadge(color) {
    const map = {
      green: '<span class="status status--ok">● On target</span>',
      amber: '<span class="status status--warn">● At risk</span>',
      red:   '<span class="status status--danger">● Below target</span>',
      grey:  '<span class="status status--muted">● No data</span>',
    };
    return map[color] || map.grey;
  }

  function kpiCard(a) {
    const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
    if (!tpl) return "";
    const color = SUDO_DB_HELPERS.kpiStatusColor(a);
    const value = a.validatedValue ?? a.empSubmittedValue;
    const valueDisplay = value !== null && value !== undefined ? value : "—";
    const isAuto = tpl.autoComputed;
    const validatorLabel = ({ tl: "Team Lead", pm: "Project Manager", hr: "HR", auto: "Auto-computed" })[tpl.validatorRole] || "Validator";

    // Progress percent — clamp to 0-120 for display
    let progress = 0;
    if (value !== null && tpl.targetValue > 0) {
      if (tpl.targetOperator === "lt" || tpl.targetOperator === "lte") {
        progress = value <= 0 ? 100 : Math.min(120, (tpl.targetValue / value) * 100);
      } else {
        progress = Math.min(120, (value / tpl.targetValue) * 100);
      }
    }

    const borderColor = color === "red" ? "var(--danger)" : color === "amber" ? "var(--warn)" : color === "green" ? "var(--ok)" : "var(--ink-200)";
    const tags = ["all", `status-${color}`, `freq-${tpl.frequency || "monthly"}`, isAuto ? "auto-computed" : "manual-update"];
    const searchText = `${tpl.krn} ${tpl.label} ${tpl.metric} ${a.statusRemarks || ""}`.toLowerCase();

    return `
      <div class="kpi-card-row" data-tag="${tags.join(" ")}" data-search="${searchText}" style="border-left:4px solid ${borderColor};display:flex;gap:14px;padding:14px 16px;align-items:flex-start">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
            <span class="table__mono" style="font-size:10.5px;color:var(--ink-500);font-weight:700">${tpl.krn}</span>
            ${statusBadge(color)}
            ${isAuto ? '<span class="status status--info" style="font-size:10.5px">⚡ Auto</span>' : ''}
            <span class="status status--muted" style="font-size:10.5px">${tpl.frequency}</span>
          </div>
          <div class="kpi-card-row__title" style="font-size:14px;font-weight:600;color:var(--ink-900);margin-bottom:4px">${tpl.label}</div>
          <div style="font-size:11.5px;color:var(--ink-500);margin-bottom:8px">${tpl.metric}</div>
          <div style="display:flex;gap:18px;font-size:11.5px;flex-wrap:wrap">
            <span><strong style="color:var(--ink-900)">Target:</strong> ${tpl.target}</span>
            <span><strong style="color:var(--ink-900)">Current:</strong> ${a.accomplishmentText || valueDisplay}</span>
            <span><strong style="color:var(--ink-900)">Weight:</strong> ${a.weight}%</span>
            <span><strong style="color:var(--ink-900)">Validator:</strong> ${validatorLabel}</span>
          </div>
          ${a.statusRemarks ? `<div style="margin-top:8px;padding:8px 10px;background:var(--ink-50);border-radius:6px;font-size:11.5px;color:var(--ink-700);font-style:italic">"${a.statusRemarks}"</div>` : ''}
          ${value !== null ? `
            <div style="margin-top:10px">
              <div style="height:6px;background:var(--ink-100);border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${Math.min(100,progress)}%;background:${color==='green'?'var(--ok)':color==='amber'?'var(--warn)':color==='red'?'var(--danger)':'var(--ink-300)'}"></div>
              </div>
              <div style="margin-top:4px;font-size:10.5px;color:var(--ink-500)">${progress.toFixed(0)}% of target</div>
            </div>
          ` : ''}
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
          ${isAuto
            ? '<span style="font-size:10.5px;color:var(--ink-500);font-style:italic">Updates automatically</span>'
            : a.status === "progress_pending_validation"
              ? `<span class="status status--warn">Pending ${validatorLabel} validation</span>`
              : `<button class="btn btn--primary btn--sm" data-action="emp-update-kpi" data-assign-id="${a.id}">${ICONS.pen} Update progress</button>`
          }
          <button class="btn btn--ghost btn--sm" data-action="emp-kpi-detail" data-assign-id="${a.id}">View details</button>
        </div>
      </div>`;
  }

  // Composite score pill
  let compositePill = '';
  if (composite !== null) {
    const ccolor = composite >= 95 ? "ok" : composite >= 80 ? "warn" : "danger";
    compositePill = `<span class="status status--${ccolor}" style="font-size:13px;font-weight:700">Composite: ${composite.toFixed(0)}%</span>`;
  }

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My KPIs</h2>
        <div class="page-header__sub">Q2 2026 cycle · ${myAssigns.length} total · ${needsAck.length} awaiting acknowledgement · ${inProgress.length} active · ${redKpis.length} below target</div>
      </div>
      <div class="page-actions" style="display:flex;gap:8px;align-items:center">
        ${compositePill}
        ${ack ? `<span class="status status--ok">${ICONS.check} Scorecard signed ${ack.signedAt}</span>` : ''}
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.calendar}
      <div>
        <strong>How KPIs work:</strong> You update your accomplishment values. Your validator (Team Lead / PM / HR) reviews and confirms. Auto-computed KPIs (⚡) update from operational data — you don't need to enter anything.
        ${redKpis.length > 0 ? ` <strong style="color:var(--danger)">${redKpis.length} of your KPIs are currently below target.</strong> Your TL and HR have been notified.` : ''}
      </div>
    </div>

    ${myAssigns.length > 0 ? `
      <div style="display:grid;grid-template-columns:240px 1fr;gap:14px;margin:18px 0">
        <article class="panel">
          <header class="panel__head">
            <div>
              <h3 class="panel__title">Composite</h3>
              <p class="panel__sub">Q2 2026 score</p>
            </div>
          </header>
          <div class="panel__body" id="emp-kpi-gauge" style="display:flex;justify-content:center;align-items:center;min-height:140px"></div>
        </article>
        <article class="panel">
          <header class="panel__head">
            <div>
              <h3 class="panel__title">KPI status</h3>
              <p class="panel__sub">Where your performance lands across all active KPIs</p>
            </div>
          </header>
          <div class="panel__body" id="emp-kpi-status-donut" style="min-height:140px;display:flex;align-items:center;justify-content:center"></div>
        </article>
      </div>
    ` : ''}

    ${needsAck.length > 0 ? `
      <div style="margin:18px 0;padding:14px;background:var(--warn-bg);border:1px solid var(--warn);border-radius:8px">
        <div style="display:flex;align-items:center;gap:10px">
          <strong style="color:var(--warn)">⚠ ${needsAck.length} KPI${needsAck.length===1?'':'s'} awaiting your acknowledgement</strong>
          <button class="btn btn--primary btn--sm" data-action="emp-ack-all">${ICONS.check} Acknowledge all and sign scorecard</button>
        </div>
        <div style="margin-top:8px;font-size:11.5px;color:var(--ink-700)">You cannot update progress until you acknowledge the assigned KPIs.</div>
      </div>
    ` : ''}

    <div id="fb-kpis"></div>

    <div id="kpis-results">
      ${pendingVal.length > 0 ? `
        <h3 class="section-header" style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin:18px 0 10px">Awaiting Validation · ${pendingVal.length}</h3>
        ${pendingVal.map(kpiCard).join("")}
      ` : ''}

      ${redKpis.length > 0 ? `
        <h3 class="section-header" style="font-size:13px;color:var(--danger);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin:18px 0 10px">🚨 Below Target · ${redKpis.length}</h3>
        ${redKpis.map(kpiCard).join("")}
      ` : ''}

      ${inProgress.length > 0 ? `
        <h3 class="section-header" style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin:18px 0 10px">Active · ${inProgress.length - redKpis.length}</h3>
        ${inProgress.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) !== "red").map(kpiCard).join("")}
      ` : ''}

      ${needsAck.length > 0 ? `
        <h3 class="section-header" style="font-size:13px;color:var(--warn);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin:18px 0 10px">Pending Acknowledgement · ${needsAck.length}</h3>
        ${needsAck.map(kpiCard).join("")}
      ` : ''}

      ${myAssigns.length === 0 ? `
        <article class="panel">
          <div class="panel__body" style="padding:30px;text-align:center;color:var(--ink-500)">
            <div style="font-size:34px;margin-bottom:8px">🎯</div>
            <div style="font-size:14px;font-weight:600;color:var(--ink-700);margin-bottom:4px">No KPIs assigned yet</div>
            <div style="font-size:12px">Your Team Lead or HR will assign Q2 2026 KPIs soon.</div>
          </div>
        </article>
      ` : ''}
    </div>

    ${ack ? `
      <article class="panel" style="margin-top:22px">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Scorecard Acknowledgement</h3>
            <p class="panel__sub">Signed ${ack.signedAt} via ${ack.signedVia}</p>
          </div>
        </header>
        <div class="panel__body">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
            <div><div style="font-size:10.5px;color:var(--ink-500);text-transform:uppercase">Prepared by</div><div style="font-weight:600">${(SUDO_DB_HELPERS.findEmployee(ack.preparedBy)||{}).name || ack.preparedBy}</div></div>
            <div><div style="font-size:10.5px;color:var(--ink-500);text-transform:uppercase">Reviewed by</div><div style="font-weight:600">${(SUDO_DB_HELPERS.findEmployee(ack.reviewedBy)||{}).name || ack.reviewedBy}</div></div>
            <div><div style="font-size:10.5px;color:var(--ink-500);text-transform:uppercase">Approved by (HR)</div><div style="font-weight:600">${(SUDO_DB_HELPERS.findEmployee(ack.approvedBy)||{}).name || ack.approvedBy}</div></div>
          </div>
          <div style="margin-top:14px;padding:12px 14px;background:var(--ok-bg);border-radius:6px;font-size:12.5px">
            <strong>Your signature:</strong> ${ack.signature} · <strong>Date:</strong> ${ack.signedAt}
            <div style="margin-top:6px;font-size:11.5px;color:var(--ink-700)">"I acknowledge, agree, and confirm with the ${ack.kpiCount} KPI targets reflected above."</div>
          </div>
        </div>
      </article>
    ` : ''}

    ${(function(){
      const history = SUDO_DB_HELPERS.cycleHistoryForEmployee(meId);
      if (history.length === 0) return '';
      return `
        <article class="panel" style="margin-top:22px">
          <header class="panel__head">
            <div>
              <h3 class="panel__title">Past Cycles · trend</h3>
              <p class="panel__sub">${history.length} closed cycle${history.length===1?'':'s'} · your performance over time</p>
            </div>
          </header>
          <div class="panel__body">
            <div style="display:grid;grid-template-columns:1fr 200px;gap:18px;align-items:center">
              <div id="emp-cycle-trend"></div>
              <div style="font-size:12px;color:var(--ink-700);line-height:1.7">
                ${history.map(h => {
                  const deltaIcon = h.delta > 0 ? '<span style="color:var(--ok)">▲</span>' : h.delta < 0 ? '<span style="color:var(--danger)">▼</span>' : '·';
                  const ccolor = h.composite >= 95 ? 'var(--ok)' : h.composite >= 80 ? 'var(--warn)' : 'var(--danger)';
                  return `<div style="padding:6px 0;border-bottom:1px dashed var(--ink-200)">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span><strong>${h.cycle ? h.cycle.label : h.cycleId}</strong></span>
                      <span style="font-weight:700;color:${ccolor}">${h.composite}%</span>
                    </div>
                    <div style="font-size:10.5px;color:var(--ink-500);margin-top:2px">${h.green} on target · ${h.amber} at risk · ${h.red} below ${h.delta ? '· ' + deltaIcon + ' ' + Math.abs(h.delta) + ' pts' : ''}</div>
                  </div>`;
                }).join("")}
                <div style="padding:6px 0;display:flex;justify-content:space-between;align-items:center">
                  <span><strong>Q2 2026 · current</strong></span>
                  <span style="font-weight:700;color:${composite !== null ? (composite >= 95 ? 'var(--ok)' : composite >= 80 ? 'var(--warn)' : 'var(--danger)') : 'var(--ink-500)'}">${composite !== null ? composite.toFixed(0) + '%' : '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </article>`;
    })()}
  `;
}

// =========================================================
// PAGE: Documents
// =========================================================
function pageDocuments() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Documents</h2>
        <div class="page-header__sub">${DATA.myDocuments.length} documents · 2 need your action</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--primary">${ICONS.upload} Upload Document</button>
      </div>
    </div>

    <div id="fb-documents"></div>

    <div class="table-wrap" id="documents-results">
      <table class="table">
        <thead><tr><th>Document</th><th>Type</th><th>Date</th><th>Size</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${DATA.myDocuments.map(d => {
            const st = d.status === "Signed" || d.status === "Verified" || d.status === "Read"
              ? "ok"
              : d.status.includes("Pending") ? "warn" : "muted";

            // Tag categorization for FilterBar
            const cat = ["Offer Letter", "Contract", "NDA"].includes(d.type) ? "contracts"
                      : ["Emirates ID", "Visa", "Passport"].includes(d.type) ? "government"
                      : ["Joiner Info", "Bank Details", "Emergency Contact"].includes(d.type) ? "forms"
                      : "reference";
            const needsAction = d.status.includes("Pending Your") ? "needs-action" : "";
            const tags = ["all", cat, needsAction].filter(Boolean).join(" ");
            const searchText = `${d.name} ${d.type} ${d.status}`.toLowerCase();

            return `
              <tr class="row-clickable" data-tag="${tags}" data-search="${searchText}">
                <td>
                  <div class="table__name">${d.name}</div>
                  ${ODOO_DOC_TYPES.has(d.type) ? '<span class="odoo-source-pill">' + ICONS.external + ' Source: ODOO · read-only</span>' : ''}
                </td>
                <td>${d.type}</td>
                <td>${d.date}</td>
                <td class="table__mono">${d.size}</td>
                <td><span class="status status--${st}">${d.status}</span></td>
                <td style="text-align:right">
                  ${d.status.includes("Pending Your Signature")
                    ? '<button class="btn btn--primary btn--sm">' + ICONS.pen + ' Sign now</button>'
                    : d.status.includes("Pending Your Upload")
                      ? '<button class="btn btn--primary btn--sm">' + ICONS.upload + ' Upload</button>'
                      : '<button class="btn btn--ghost btn--sm">' + ICONS.download + '</button>'}
                </td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:40px 20px;color:var(--ink-500)">
          <div style="font-size:32px;margin-bottom:8px">📁</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px">No documents match these filters</div>
          <div style="font-size:12px">Try clearing the search or selecting a different tab.</div>
        </div>
      </div>
    </div>`;
}

// =========================================================
// PAGE: Resume
// =========================================================
function pageResume() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Resume</h2>
        <div class="page-header__sub">Auto-generated from your profile, certifications, and project history · refreshed nightly</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.refresh} Refresh now</button>
        <button class="btn btn--secondary">${ICONS.download} Download DOCX</button>
        <button class="btn btn--primary">${ICONS.download} Download PDF</button>
      </div>
    </div>

    <div class="resume-wrap">
      <div class="resume-controls">
        <div class="resume-controls__title">Customize what's included</div>
        <div class="resume-controls__sub">These toggles control which sections appear in your SUDO resume.</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:500;color:var(--ink-700)">Personal info</span><div class="toggle toggle--on"><div class="toggle__track"></div></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:500;color:var(--ink-700)">Professional summary</span><div class="toggle toggle--on"><div class="toggle__track"></div></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:500;color:var(--ink-700)">Skills & technologies</span><div class="toggle toggle--on"><div class="toggle__track"></div></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:500;color:var(--ink-700)">Certifications</span><div class="toggle toggle--on"><div class="toggle__track"></div></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:500;color:var(--ink-700)">Client projects</span><div class="toggle toggle--on"><div class="toggle__track"></div></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:500;color:var(--ink-700)">Internal contributions</span><div class="toggle"><div class="toggle__track"></div></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:500;color:var(--ink-700)">Education</span><div class="toggle toggle--on"><div class="toggle__track"></div></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:500;color:var(--ink-700)">Languages</span><div class="toggle toggle--on"><div class="toggle__track"></div></div></div>
        </div>
        <div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--ink-100)">
          <div style="font-size:11.5px;color:var(--ink-500);font-weight:600;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px">Template</div>
          <select class="select"><option>SUDO Standard (recommended)</option><option>SUDO Modern</option><option>SUDO Minimal</option></select>
        </div>
      </div>

      <div class="resume-preview">
        <div class="resume-preview__head">
          <div class="resume-preview__name">Reem Al Otaibi</div>
          <div class="resume-preview__title">Cloud Engineer · SUDO Consultants</div>
          <div class="resume-preview__contact">
            <span>${DATA.user.workEmail}</span>
            <span>${DATA.user.phone}</span>
            <span>Dubai, UAE</span>
          </div>
        </div>

        <div class="resume-preview__section">
          <div class="resume-preview__section-title">Professional Summary</div>
          <div style="font-size:13px;color:var(--ink-700);line-height:1.55">Cloud Engineer at SUDO Consultants — an AWS Advanced Tier Services Partner. Focused on cloud infrastructure design, DevOps automation, and AWS Well-Architected reviews. Currently building out advanced AWS certifications and contributing to internal documentation initiatives.</div>
        </div>

        <div class="resume-preview__section">
          <div class="resume-preview__section-title">Certifications</div>
          <div class="resume-preview__bullet">AWS Cloud Practitioner (issued Sep 2025 · valid until Sep 2028)</div>
          <div class="resume-preview__bullet">AWS Sales Accreditation 2026 (issued Apr 2026)</div>
          <div class="resume-preview__bullet">KnowBe4 Security Awareness 2025 (issued Nov 2025)</div>
        </div>

        <div class="resume-preview__section">
          <div class="resume-preview__section-title">Skills</div>
          <div style="font-size:13px;color:var(--ink-700);line-height:1.7">AWS (EC2, S3, VPC, IAM, Lambda) · Terraform · Python · Linux administration · CI/CD (GitHub Actions) · Networking fundamentals</div>
        </div>

        <div class="resume-preview__section">
          <div class="resume-preview__section-title">Experience</div>
          <div class="resume-preview__entry">
            <div class="resume-preview__entry-h">
              <div class="resume-preview__entry-name">Cloud Engineer</div>
              <div class="resume-preview__entry-date">Apr 2026 — Present</div>
            </div>
            <div class="resume-preview__entry-sub">SUDO Consultants · Dubai, UAE</div>
            <div class="resume-preview__bullet">Currently in onboarding · Step 3 of 5 (NEO + CPD)</div>
            <div class="resume-preview__bullet">Contributing to internal AWS Well-Architected review templates</div>
          </div>
        </div>

        <div class="resume-preview__section">
          <div class="resume-preview__section-title">Education</div>
          <div class="resume-preview__entry">
            <div class="resume-preview__entry-h">
              <div class="resume-preview__entry-name">B.Sc. Computer Science</div>
              <div class="resume-preview__entry-date">2014 — 2018</div>
            </div>
            <div class="resume-preview__entry-sub">United Arab Emirates University · Al Ain</div>
          </div>
        </div>

        <div class="resume-preview__section">
          <div class="resume-preview__section-title">Languages</div>
          <div style="font-size:13px;color:var(--ink-700)">Arabic (Native) · English (Fluent)</div>
        </div>
      </div>
    </div>`;
}

// =========================================================
// PAGE: Requests
// =========================================================
function pageRequests() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Requests</h2>
        <div class="page-header__sub">Submit letter requests, HR queries, and track their status here</div>
      </div>
    </div>

    <div class="split">
      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">New Request</h3>
            <p class="panel__sub">Most letters are issued within 1–2 business days</p>
          </div>
        </header>
        <div class="panel__body">
          <div class="form-grid form-grid--single">
            <div class="field">
              <label class="field__label">Request Type</label>
              <select class="select">
                <option>Salary Certificate</option>
                <option>No Objection Certificate (NOC)</option>
                <option>Employment Letter</option>
                <option>Experience Letter</option>
                <option>Bank Letter</option>
                <option>Visa Stamping Letter</option>
                <option>HR Query (general)</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label">Purpose / Addressed To</label>
              <input class="input" placeholder="e.g. Emirates NBD — for credit card application" />
            </div>
            <div class="field">
              <label class="field__label">Language</label>
              <select class="select"><option>English</option><option>Arabic</option><option>English + Arabic (bilingual)</option></select>
            </div>
            <div class="field">
              <label class="field__label">Urgency</label>
              <select class="select"><option>Standard (1–2 business days)</option><option>Urgent (same day) — requires HR approval</option></select>
            </div>
            <div class="field">
              <label class="field__label">Notes (optional)</label>
              <textarea class="textarea" placeholder="Anything HR should know about this request"></textarea>
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary">Cancel</button>
            <button class="btn btn--primary" data-action="submit-request">${ICONS.send} Submit Request</button>
          </div>
        </div>
      </article>

      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Request History</h3>
            <p class="panel__sub">${DATA.myRequests.length} requests · last 90 days</p>
          </div>
        </header>
        <div class="panel__body" style="padding:14px">
          <div id="fb-requests"></div>
          <div id="requests-results">
          <table class="table">
            <thead><tr><th>ID</th><th>Type</th><th>Purpose</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              ${DATA.myRequests.map(r => {
                const statusKey = r.status === "Approved" ? "completed" : r.status === "In Progress" ? "open" : r.status === "Rejected" ? "rejected" : "open";
                const tags = ["all", statusKey].join(" ");
                const searchText = `${r.id} ${r.type} ${r.purpose} ${r.status}`.toLowerCase();
                return `
                <tr class="row-clickable" data-tag="${tags}" data-search="${searchText}">
                  <td class="table__mono" style="font-size:11.5px;color:var(--ink-500)">${r.id}</td>
                  <td><div class="table__name">${r.type}</div></td>
                  <td style="font-size:12px;color:var(--ink-500)">${r.purpose}</td>
                  <td>${r.status === 'Approved' ? '<span class="status status--ok">Approved</span>' : r.status === 'In Progress' ? '<span class="status status--info">In Progress</span>' : '<span class="status status--warn">Pending</span>'}</td>
                  <td style="font-size:12px;color:var(--ink-500)">${r.date}</td>
                  <td style="text-align:right">
                    ${r.status === 'Approved' ? '<button class="btn btn--ghost btn--sm">' + ICONS.download + '</button>' : '<button class="btn btn--ghost btn--sm">' + ICONS.arrowRight + '</button>'}
                  </td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
          <div class="fb-empty" style="display:none">
            <div style="text-align:center;padding:30px;color:var(--ink-500)">No requests match these filters</div>
          </div>
          </div>
        </div>
      </article>
    </div>`;
}

// =========================================================
// PAGE: My Team
// =========================================================
function pageTeam() {
  const pm = DATA.myTeam.find(t => t.badge === "pm");
  const lm = DATA.myTeam.find(t => t.badge === "lm");
  const peers = DATA.myTeam.filter(t => t.badge === "peer");

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Team</h2>
        <div class="page-header__sub">${DATA.myTeam.length} people · your Project Manager, Line Manager, and current team members</div>
      </div>
    </div>

    <div id="fb-team"></div>

    <h3 style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px">My Managers</h3>
    <div class="team-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:24px">
      <div class="team-card">
        <div class="team-card__avatar">${pm.initials}</div>
        <div class="team-card__main">
          <div class="team-card__name">${pm.name}</div>
          <div class="team-card__role">${pm.role}</div>
          <span class="team-card__badge team-card__badge--pm">Project Manager</span>
        </div>
        <button class="btn btn--ghost btn--sm">${ICONS.mail}</button>
      </div>
      <div class="team-card">
        <div class="team-card__avatar">${lm.initials}</div>
        <div class="team-card__main">
          <div class="team-card__name">${lm.name}</div>
          <div class="team-card__role">${lm.role}</div>
          <span class="team-card__badge team-card__badge--lm">Line Manager</span>
        </div>
        <button class="btn btn--ghost btn--sm">${ICONS.mail}</button>
      </div>
    </div>

    <h3 style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px">My Peers (Cloud Engineering)</h3>
    <div class="team-grid">
      ${peers.map(p => `
        <div class="team-card">
          <div class="team-card__avatar">${p.initials}</div>
          <div class="team-card__main">
            <div class="team-card__name">${p.name}</div>
            <div class="team-card__role">${p.role}</div>
            <span class="team-card__badge team-card__badge--peer">Peer</span>
          </div>
          <button class="btn btn--ghost btn--sm">${ICONS.mail}</button>
        </div>`).join("")}
    </div>`;
}

// =========================================================
// PAGE: My Projects (from ODOO — only current PMs shown; past PM names removed when project closed)
// =========================================================
function pageMyProjects() {
  const PROJECTS = [
    { id:"P-AWSM-001", name:"Client-Alpha · AWS Migration", client:"Client-Alpha",       stage:"Execution",       health:"green", role:"Cloud Engineer",   started:"2025-11-15", endsExp:"2026-08-15", currentPm:"Fatima Al Zaabi", phase:"Phase 2 · Workload migration", myRatingAvg: 4.3, latestRatingDate:"2 days ago" },
    { id:"P-BNKS-002", name:"Bank-of-Sky · Lift & Shift",   client:"Bank-of-Sky",        stage:"Execution",       health:"amber", role:"Cloud Engineer",   started:"2026-01-08", endsExp:"2026-07-08", currentPm:"Sara Mitchell",    phase:"Phase 1 · Foundation",         myRatingAvg: null, latestRatingDate:null },
    { id:"P-PLOG-006", name:"PowerLogis · Data lake",       client:"PowerLogis",         stage:"Discovery",       health:"green", role:"Cloud Engineer",   started:"2026-04-22", endsExp:"2026-10-22", currentPm:"Fatima Al Zaabi", phase:"Discovery & scoping",          myRatingAvg: null, latestRatingDate:null },
    // Past projects — PM name intentionally not shown
    { id:"P-RETC-004", name:"Retail-Co · Migration",        client:"Retail-Co",          stage:"Closed",          health:"green", role:"Junior Cloud Eng.",started:"2025-08-12", endsExp:"2026-04-30", currentPm:null,                phase:"Completed",                    myRatingAvg: 4.7, latestRatingDate:"3 weeks ago", endedAt:"2026-04-28" },
    { id:"P-MEDX-003", name:"MedX · Foundation",            client:"MedX",               stage:"Closed",          health:"green", role:"Junior Cloud Eng.",started:"2025-05-01", endsExp:"2025-12-15", currentPm:null,                phase:"Completed",                    myRatingAvg: 4.2, latestRatingDate:"5 months ago", endedAt:"2025-12-10" },
  ];

  const active = PROJECTS.filter(p => p.stage !== "Closed");
  const closed = PROJECTS.filter(p => p.stage === "Closed");

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Projects</h2>
        <div class="page-header__sub">${active.length} active · ${closed.length} completed · synced from ODOO</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.external} Open in ODOO</button>
      </div>
    </div>

    <div id="fb-projects"></div>

    <div class="info-banner">
      ${ICONS.briefcase}
      <div><strong>About this page.</strong> Projects you've worked on come from ODOO. Active projects show your current PM; completed projects don't — the PM relationship ended with the project. PM ratings are visible per project and feed into your KPI composite score.</div>
    </div>

    <div id="myprojects-results">
      ${active.length ? `
        <h3 style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin:20px 0 12px">Active Projects</h3>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Project</th><th>Client</th><th>Stage</th><th>Health</th><th>My role</th><th>Current PM</th><th>Latest rating</th><th></th></tr></thead>
            <tbody>
              ${active.map(p => `
                <tr class="row-clickable">
                  <td><strong>${p.name}</strong><div class="table__mono table__mono--dim">${p.id} · ${p.phase}</div></td>
                  <td>${p.client}</td>
                  <td><span class="status status--${p.stage === 'Execution' ? 'ok' : 'info'}">${p.stage}</span></td>
                  <td><span class="health-dot health-dot--${p.health}"></span> ${p.health}</td>
                  <td>${p.role}</td>
                  <td>${p.currentPm}</td>
                  <td>${p.myRatingAvg ? `★ ${p.myRatingAvg} · <span style="color:var(--ink-500);font-size:11px">${p.latestRatingDate}</span>` : '<span style="color:var(--ink-400);font-size:11.5px">Not yet rated</span>'}</td>
                  <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>` : ""}

      ${closed.length ? `
        <h3 style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin:24px 0 12px">Past Projects</h3>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Project</th><th>Client</th><th>Stage</th><th>My role</th><th>Ended</th><th>Final rating</th><th></th></tr></thead>
            <tbody>
              ${closed.map(p => `
                <tr class="row-clickable">
                  <td><strong>${p.name}</strong><div class="table__mono table__mono--dim">${p.id}</div></td>
                  <td>${p.client}</td>
                  <td><span class="status status--muted">Closed</span></td>
                  <td>${p.role}</td>
                  <td class="table__mono table__mono--dim">${p.endedAt}</td>
                  <td>${p.myRatingAvg ? `★ ${p.myRatingAvg}` : "—"}</td>
                  <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>` : ""}
    </div>
  `;
}

// =========================================================
// PAGE: Notifications inbox
// =========================================================
function pageNotifications() {
  const unread = DATA.notifications.filter(n => n.unread).length;
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Notifications</h2>
        <div class="page-header__sub">${DATA.notifications.length} notifications · ${unread} unread</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.check} Mark all read</button>
      </div>
    </div>

    <div id="fb-notifs"></div>

    <div id="notifs-results">

    <div class="inbox">
      ${DATA.notifications.map(n => {
        const tags = ["all"];
        if (n.unread) tags.push("unread");
        if (n.actionRequired || n.title.toLowerCase().includes("required") || n.title.toLowerCase().includes("action")) tags.push("actions");
        if (n.mention) tags.push("mentions");
        // Category inference for the filter
        if ((n.title + n.desc).toLowerCase().includes("training") || n.icon === "book") tags.push("training");
        if ((n.title + n.desc).toLowerCase().includes("leave")) tags.push("leave");
        if ((n.title + n.desc).toLowerCase().includes("kpi")) tags.push("kpi");
        if ((n.title + n.desc).toLowerCase().includes("badge") || (n.title + n.desc).toLowerCase().includes("recognition")) tags.push("recognition");
        if ((n.title + n.desc).toLowerCase().includes("document") || (n.title + n.desc).toLowerCase().includes("signature")) tags.push("documents");
        const searchText = `${n.title} ${n.desc}`.toLowerCase();
        return `
        <div class="inbox__item ${n.unread ? 'inbox__item--unread' : ''}" data-tag="${tags.join(" ")}" data-search="${searchText}">
          <div class="inbox__icon card__icon--${n.color}">${ICONS[n.icon] || ""}</div>
          <div class="inbox__main">
            <div class="inbox__title">${n.title}</div>
            <div class="inbox__desc">${n.desc}</div>
          </div>
          <div class="inbox__time">${n.time}</div>
        </div>`;
      }).join("")}
    </div>
    <div class="fb-empty" style="display:none">
      <div style="text-align:center;padding:40px 20px;color:var(--ink-500)">
        <div style="font-size:32px;margin-bottom:8px">🔔</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:4px">No notifications match</div>
        <div style="font-size:12px">Try clearing the search or selecting a different tab.</div>
      </div>
    </div>
    </div>`;
}

// =========================================================
// PAGE: Badges (ODOO-synced)
// =========================================================
function pageBadges() {
  const b = DATA.badges;
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Badges</h2>
        <div class="page-header__sub">${b.total} badges earned · ${b.total * 25} total points · synced from ODOO ${b.syncedAt}</div>
      </div>
    </div>

    <div id="fb-badges"></div>

    <div class="info-banner">
      ${ICONS.star}
      <div>
        <strong>Recognition from your team.</strong> Badges are awarded in ODOO by your colleagues, PMs, and HR. They reflect collaboration, delivery, and going-above-and-beyond moments. Syncs nightly to your portal.
      </div>
    </div>

    <div class="cards" style="grid-template-columns:repeat(4,1fr);margin-bottom:22px">
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--warn">${ICONS.star}</div></div>
        <div class="card__title">Total Badges</div>
        <div class="card__value">${b.total}</div>
        <div class="card__meta">Since you joined</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--warn">${ICONS.award || ICONS.star}</div></div>
        <div class="card__title">Total Points</div>
        <div class="card__value">${b.total * 25}<span style="font-size:13px;color:var(--ink-500);font-weight:500"> pts</span></div>
        <div class="card__meta">Rank #${Math.max(1, 12 - b.total)} of 147</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check}</div></div>
        <div class="card__title">This Month</div>
        <div class="card__value">${b.monthly[0].count}</div>
        <div class="card__meta">${b.monthly[0].month}</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--info">${ICONS.refresh}</div></div>
        <div class="card__title">Last Sync</div>
        <div class="card__value" style="font-size:18px">${b.syncedAt}</div>
        <div class="card__meta">ODOO badges API</div>
      </div>
    </div>

    <div class="grid-two grid-two--asym">
      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Recent Badges</h3>
            <p class="panel__sub">Most recently received</p>
          </div>
        </header>
        <div class="panel__body">
          ${b.recent.map(r => `
            <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--ink-100);align-items:flex-start">
              <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#FDF1DF,#FFE49A);display:grid;place-items:center;font-size:22px;flex-shrink:0">${r.icon}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13.5px;font-weight:700;color:var(--ink-900);margin-bottom:3px">${r.name}</div>
                <div style="font-size:12px;color:var(--ink-700);line-height:1.45;margin-bottom:4px">${r.reason}</div>
                <div style="font-size:11px;color:var(--ink-500)">From <strong>${r.from}</strong> · ${r.received}</div>
              </div>
            </div>`).join("")}
        </div>
      </article>

      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Monthly Breakdown</h3>
            <p class="panel__sub">Last 6 months</p>
          </div>
          <select class="select" style="width:auto;font-size:12px;height:32px;padding-right:28px">
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>All time</option>
          </select>
        </header>
        <div class="panel__body">
          ${b.monthly.map(m => {
            const maxCount = Math.max(...b.monthly.map(x => x.count));
            const pct = (m.count / maxCount) * 100;
            return `
              <div style="display:grid;grid-template-columns:120px 1fr 30px;gap:10px;align-items:center;padding:6px 0">
                <div style="font-size:12px;color:var(--ink-700);font-weight:500">${m.month}</div>
                <div style="height:18px;background:var(--ink-100);border-radius:9px;overflow:hidden;position:relative">
                  <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#FFE49A,#E89A1E);border-radius:9px"></div>
                </div>
                <div style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:var(--ink-900);text-align:right">${m.count}</div>
              </div>`;
          }).join("")}
        </div>
      </article>
    </div>`;
}

// =========================================================
// PAGE: Recognition Wall (visible to all employees · transparent)
// =========================================================
function pageRecognition() {
  const LEADERBOARD = [
    { rank:1, name:"Karim Salah",       title:"Lead Engineer",      points:840, badges:12, medal:"gold"   },
    { rank:2, name:"Ananya Sharma",     title:"Senior Cloud Eng.",  points:765, badges:9,  medal:"silver" },
    { rank:3, name:"Yan Zhang",         title:"Senior Cloud Eng.",  points:710, badges:8,  medal:"bronze" },
    { rank:4, name:"Khalid Mansour",    title:"Engineering Manager",points:680, badges:11 },
    { rank:5, name:"Lina Haddad",       title:"Senior Cloud Eng.",  points:640, badges:7  },
    { rank:6, name:"Daniyal Habib",     title:"Cloud Engineer",     points:580, badges:5  },
    { rank:7, name:"Priya Iyer",        title:"Cloud Engineer",     points:520, badges:4  },
    { rank:8, name:"Sami Berkani",      title:"Cloud Engineer",     points:495, badges:3  },
    { rank:9, name:"Marcus Wright",     title:"DevOps Engineer",    points:430, badges:3  },
    { rank:10,name:"Hamza Al Mahmoud",  title:"Cloud Engineer",     points:380, badges:2  },
  ];

  const initials = name => name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Recognition · Top Performers</h2>
        <div class="page-header__sub">Transparent · everyone at SUDO can see this page · HR controls visibility in admin</div>
      </div>
      <div class="page-actions">
        <div class="recog-period">
          <span class="recog-period__label">Showing</span>
          <select class="select recog-period__sel" id="recog-year">
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>
          <select class="select recog-period__sel" id="recog-month">
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option selected>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:18px">
      ${ICONS.star}
      <div><strong>Top 3 are highlighted as Employee of the Month.</strong> Points roll up from badges granted by peers, PMs, TLs, and HR. Everyone can see this — it's intentionally transparent. If you'd like to recognise a teammate, grant them a badge from your My Badges page.</div>
    </div>

    <div class="recognition-hero" style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px">
      ${LEADERBOARD.slice(0,3).map(p => `
        <div class="podium podium--${p.medal}">
          <div class="podium__rank">${p.medal === 'gold' ? '🥇' : p.medal === 'silver' ? '🥈' : '🥉'}</div>
          <div class="podium__avatar">${initials(p.name)}</div>
          <div class="podium__name">${p.name}</div>
          <div class="podium__title">${p.title}</div>
          <div class="podium__stats">
            <div><span>${p.points}</span><label>POINTS</label></div>
            <div><span>${p.badges}</span><label>BADGES</label></div>
            <div><span>★</span><label>${p.medal.toUpperCase()}</label></div>
          </div>
        </div>
      `).join("")}
    </div>

    <article class="panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Full Leaderboard</h3>
          <p class="panel__sub">Top 10 across SUDO · all roles · ranked by points this period</p>
        </div>
      </header>
      <div class="panel__body">
        <div class="leaderboard">
          ${LEADERBOARD.map(p => `
            <div class="lb-row ${p.medal ? 'lb-row--top' : ''}">
              <div class="lb-row__rank">#${p.rank}</div>
              <div class="lb-row__avatar">${initials(p.name)}</div>
              <div class="lb-row__main">
                <div class="lb-row__name">${p.name}</div>
                <div class="lb-row__title">${p.title}</div>
              </div>
              <div class="lb-row__stat"><strong>${p.points}</strong><span>points</span></div>
              <div class="lb-row__stat"><strong>${p.badges}</strong><span>badges</span></div>
            </div>
          `).join("")}
        </div>
      </div>
    </article>
  `;
}

// =========================================================
// PAGE: Time Off (Leaves)
// =========================================================
function pageTimeoff() {
  const L = DATA.leaves;
  // Real leaves from shared DB — find the "logged-in" employee. For prototyping
  // we look at Reem (E008) as the default employee viewer.
  const empId = (window.SUDO_DB && SUDO_DB.user && SUDO_DB.user.empId) || "E008";
  const realLeaves = (window.SUDO_DB && SUDO_DB.leaveApprovals || [])
    .filter(l => l.empId === empId)
    .sort((a, b) => (b.from || "").localeCompare(a.from || ""));

  function statusPill(s) {
    // Normalise mixed status strings
    const k = (s || "").toLowerCase().replace(/\s+/g, "_");
    if (k === "approved")          return '<span class="status status--ok">Approved</span>';
    if (k === "denied")            return '<span class="status status--danger">Denied</span>';
    if (k === "pending_pm")        return '<span class="status status--warn">Pending PM</span>';
    if (k === "pending_hr")        return '<span class="status status--info">Pending HR</span>';
    return '<span class="status status--muted">' + s + '</span>';
  }

  // Map shared-DB row to a stable shape
  const rows = realLeaves.map(r => ({
    id: r.id,
    type: r.type,
    from: r.from,
    to: r.to,
    days: r.days,
    reason: r.reason,
    status: r.status,            // raw — used for slug filtering
    statusLabel: r.status === "pending_pm" ? "Pending PM"
              : r.status === "pending_hr" ? "Pending HR"
              : r.status === "approved" ? "Approved"
              : r.status === "denied" ? "Denied" : r.status,
    submittedOn: r.decidedAt || "—",
    year: (r.from || "").slice(0, 4),
  }));

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Time Off &amp; Leaves</h2>
        <div class="page-header__sub">Balances as of ${L.asOf} · Cycle ${L.cycle} · ${rows.length} requests in your history</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--primary" data-action="open-leave-request">${ICONS.plus} Request leave</button>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.calendar}
      <div>
        <strong>Approval flow.</strong> Submit your leave request here → your <strong>PM endorses</strong> (within 1 business day) → <strong>HR gives final approval</strong> (1–2 business days). You'll be notified at each step. Sick leave over 2 days requires a medical certificate.
      </div>
    </div>

    <h3 class="section-header" style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px">Leave Balances · This Year</h3>
    <div class="cards" style="grid-template-columns:repeat(3,1fr);margin-bottom:22px">
      ${L.balances.map(bal => `
        <div class="card" style="cursor:default;min-height:auto">
          <div class="card__head">
            <div class="card__icon card__icon--${bal.color}">${ICONS.calendar}</div>
          </div>
          <div class="card__title" style="font-size:13px;font-weight:600;color:var(--ink-900);margin-bottom:8px">${bal.type}</div>
          ${bal.entitled !== null ? `
            <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:6px">
              <div style="font-size:28px;font-weight:700;color:var(--ink-900);letter-spacing:-0.5px">${bal.remaining}</div>
              <div style="font-size:13px;color:var(--ink-500)">of ${bal.entitled} days</div>
            </div>
            <div style="height:6px;background:var(--ink-100);border-radius:3px;overflow:hidden;margin-bottom:8px">
              <div style="height:100%;width:${(bal.used / bal.entitled) * 100}%;background:var(--ink-300);border-radius:3px"></div>
            </div>
            <div style="font-size:11px;color:var(--ink-500);display:flex;gap:10px">
              <span>${bal.used} used</span>
              ${bal.pending ? `<span>${bal.pending} pending</span>` : ''}
            </div>
          ` : `
            <div style="font-size:22px;font-weight:700;color:var(--ink-900);margin-bottom:6px">—</div>
            <div style="font-size:11.5px;color:var(--ink-500);line-height:1.45">${bal.desc}</div>
          `}
        </div>`).join("")}
    </div>

    <h3 class="section-header" style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px">Request History · all years</h3>

    <div id="fb-timeoff"></div>

    <div class="table-wrap" id="timeoff-results">
      <table class="table">
        <thead>
          <tr><th>ID</th><th>Year</th><th>Type</th><th>From → To</th><th>Days</th><th>Reason</th><th>Status</th><th>Decided</th></tr>
        </thead>
        <tbody>
          ${rows.length === 0 ? `<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--ink-500)">No leave history yet. Click <strong>Request leave</strong> to submit your first.</td></tr>` :
            rows.map(r => {
              const typeSlug = r.type.toLowerCase().replace(/[^\w]+/g, "-");
              const tags = ["all", r.year, r.status, typeSlug];
              const searchText = `${r.id} ${r.type} ${r.reason} ${r.from} ${r.year}`.toLowerCase();
              return `
                <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
                  <td class="table__mono" style="font-size:11px;color:var(--ink-500)">${r.id}</td>
                  <td class="table__mono"><strong>${r.year}</strong></td>
                  <td><div class="table__name" style="font-size:12.5px">${r.type}</div></td>
                  <td class="table__mono" style="font-size:11.5px">${r.from} → ${r.to}</td>
                  <td style="font-weight:600">${r.days}</td>
                  <td style="font-size:12px;color:var(--ink-500);max-width:220px">${r.reason}</td>
                  <td>${statusPill(r.status)}</td>
                  <td style="font-size:11.5px;color:var(--ink-500)">${r.submittedOn}</td>
                </tr>`;
            }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No leaves match these filters</div>
      </div>
    </div>
    <div id="pg-timeoff"></div>
  `;
}

// =========================================================
// ROUTER
// =========================================================
const ROUTES = {
  "dashboard":      pageDashboard,
  "onboarding":     pageOnboarding,
  "profile":        pageProfile,
  "trainings":      pageTrainings,
  "certifications": pageCertifications,
  "badges":         pageBadges,
  "recognition":    pageRecognition,
  "kpis":           pageKpis,
  "timeoff":        pageTimeoff,
  "documents":      pageDocuments,
  "resume":         pageResume,
  "requests":       pageRequests,
  "team":           pageTeam,
  "my-projects":    pageMyProjects,
  "notifications":  pageNotifications,
};

function route() {
  const hash = location.hash.replace(/^#/, "") || "dashboard";
  const id = ROUTES[hash] ? hash : "dashboard";
  const meta = NAV_ITEMS.find(n => n.id === id);

  $("#page-title").textContent = meta.title;
  $("#page-breadcrumb").innerHTML = id === "dashboard"
    ? `<span>Tuesday, 12 May 2026</span><span class="dot-sep">•</span><span>Onboarding · Day 41</span>`
    : `<span>My Portal</span><span class="dot-sep">›</span><span>${meta.label}</span>`;
  $("#page-content").innerHTML = ROUTES[id]();

  renderNav(id);
  bindPageEvents(id);
  closeSlideover();
  window.scrollTo(0, 0);
}

// =========================================================
// PAGE EVENTS
// =========================================================
function bindPageEvents(pageId) {
  // Wire dashboard customize button
  $$('[data-action="emp-customize-dashboard"]').forEach(b => b.addEventListener("click", () => {
    if (!window.SUDO_LAYOUT) { toast("Layout helper not loaded"); return; }
    SUDO_LAYOUT.openCustomizer({
      pageKey: "emp-dashboard",
      label: "My Dashboard",
      sections: EMP_DASHBOARD_SECTIONS,
      defaultOrder: EMP_DASHBOARD_DEFAULT_ORDER,
      onSave: () => {
        toast("Layout saved — reloading");
        setTimeout(() => location.reload(), 500);
      },
    });
  }));

  // Render KPI charts when My KPIs page is active, with click-to-drill
  if (pageId === "kpis" && window.SUDO_CHARTS && window.SUDO_DB_HELPERS) {
    setTimeout(() => {
      const meId = "E008";
      const composite = SUDO_DB_HELPERS.compositeScore(meId, "q2-2026");
      const assigns = SUDO_DB_HELPERS.assignmentsForEmployee(meId, "q2-2026");
      const bucketed = {
        green: assigns.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "green"),
        amber: assigns.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "amber"),
        red:   assigns.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "red"),
        grey:  assigns.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "grey"),
      };

      // ── Composite gauge — clicking shows the calculation breakdown
      SUDO_CHARTS.gauge("emp-kpi-gauge", composite || 0, {
        label: "Composite score",
        onClick: () => {
          openSlideover({
            title: "How your composite score is calculated",
            body: `
              <div class="info-banner" style="margin-bottom:14px">
                <div>Your composite is a weighted average of your KPI accomplishment vs target. Each KPI's contribution depends on its weight (set by HR when the KPI was drafted).</div>
              </div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>KPI</th><th>Weight</th><th>Current</th><th>Target</th><th>Score</th><th>Contribution</th></tr></thead>
                  <tbody>
                    ${assigns.map(a => {
                      const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn) || {};
                      const numericTarget = parseFloat(String(tpl.target || '').replace(/[^0-9.]/g, '')) || 0;
                      const numericCurrent = parseFloat(String(a.currentValue || '').replace(/[^0-9.]/g, '')) || 0;
                      const pct = numericTarget > 0 ? Math.min(120, Math.round((numericCurrent / numericTarget) * 100)) : 0;
                      const contribution = Math.round((pct * a.weight) / 100 * 10) / 10;
                      const tone = pct >= 95 ? 'ok' : pct >= 80 ? 'warn' : 'danger';
                      return `
                        <tr>
                          <td><code style="font-size:11px">${a.templateKrn}</code><br><span class="table__sub" style="font-size:11px">${tpl.title || ''}</span></td>
                          <td>${a.weight}%</td>
                          <td>${a.currentValue || '—'}</td>
                          <td>${tpl.target || '—'}</td>
                          <td><span class="status status--${tone}">${pct}%</span></td>
                          <td><strong>${contribution}</strong></td>
                        </tr>`;
                    }).join("")}
                  </tbody>
                  <tfoot>
                    <tr><td colspan="5" style="text-align:right;font-weight:700">Composite (sum of contributions / total weight)</td><td><strong style="font-size:14px">${composite !== null ? composite.toFixed(1) : '—'}%</strong></td></tr>
                  </tfoot>
                </table>
              </div>
              <div class="form-foot"><button class="btn btn--secondary" onclick="closeSlideover()">Close</button></div>`,
          });
        },
      });

      // ── Status donut — click a segment to filter the KPI list
      SUDO_CHARTS.donut("emp-kpi-status-donut", [
        { label: "On target",    value: bucketed.green.length, color: SUDO_CHARTS.COLORS.green, tone: 'green', assigns: bucketed.green },
        { label: "At risk",      value: bucketed.amber.length, color: SUDO_CHARTS.COLORS.amber, tone: 'amber', assigns: bucketed.amber },
        { label: "Below target", value: bucketed.red.length,   color: SUDO_CHARTS.COLORS.red,   tone: 'red',   assigns: bucketed.red   },
        { label: "No data",      value: bucketed.grey.length,  color: SUDO_CHARTS.COLORS.grey,  tone: 'grey',  assigns: bucketed.grey  },
      ], {
        centerTop: assigns.length.toString(), centerBottom: "KPIs", size: 130, thickness: 22,
        onClick: (seg) => {
          if (!seg.assigns || seg.assigns.length === 0) return;
          openSlideover({
            title: `Your ${seg.label} KPIs · ${seg.assigns.length}`,
            body: `
              <div class="info-banner" style="margin-bottom:14px;background:${seg.tone === 'red' ? '#FEF2F2' : seg.tone === 'amber' ? '#FFFBEB' : seg.tone === 'green' ? '#F0FDF4' : '#F9FAFB'};border-color:${seg.color}">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${seg.color};margin-right:6px"></span>
                <div>Your KPIs currently in <strong>${seg.label}</strong> status. ${seg.tone === 'red' ? 'Your Team Lead has been notified about each of these.' : seg.tone === 'amber' ? 'You may need to act on these soon.' : ''}</div>
              </div>
              ${seg.assigns.map(a => {
                const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn) || {};
                return `
                  <div style="padding:12px 14px;border:1px solid var(--ink-200);border-radius:8px;margin-bottom:8px">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                      <strong>${tpl.title || a.templateKrn}</strong>
                      <code style="font-size:11px;color:var(--ink-500)">${a.templateKrn}</code>
                    </div>
                    <div style="font-size:12.5px;color:var(--ink-700);margin-bottom:6px">${tpl.description || ''}</div>
                    <div style="font-size:12px"><strong>Target:</strong> ${tpl.target || '—'} · <strong>Current:</strong> ${a.currentValue || '—'} · <strong>Weight:</strong> ${a.weight}%</div>
                  </div>`;
              }).join("")}
              <div class="form-foot">
                <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
                <button class="btn btn--primary" onclick="closeSlideover()">Go to my KPIs</button>
              </div>`,
          });
        },
      });

      // ── Trend chart — click a cycle to see that scorecard
      const history = SUDO_DB_HELPERS.cycleHistoryForEmployee(meId);
      if (history.length > 0 && document.getElementById("emp-cycle-trend")) {
        const rows = history.map(h => ({
          label: h.cycle ? h.cycle.label : h.cycleId,
          value: h.composite,
          color: h.composite >= 95 ? SUDO_CHARTS.COLORS.green : h.composite >= 80 ? SUDO_CHARTS.COLORS.amber : SUDO_CHARTS.COLORS.red,
          history: h,
        }));
        // Append current cycle
        if (composite !== null) {
          rows.push({
            label: "Q2 2026",
            value: Math.round(composite),
            color: composite >= 95 ? SUDO_CHARTS.COLORS.green : composite >= 80 ? SUDO_CHARTS.COLORS.amber : SUDO_CHARTS.COLORS.red,
            current: true,
          });
        }
        SUDO_CHARTS.vbar("emp-cycle-trend", rows, {
          max: 100, unit: "%", height: 140, barWidth: 50,
          onClick: (row) => {
            if (row.current) {
              toast("This is your current cycle — see the KPI cards below");
              return;
            }
            const h = row.history;
            openSlideover({
              title: `${row.label} scorecard · composite ${h.composite}%`,
              body: `
                <div class="info-banner" style="margin-bottom:14px">
                  <div>Frozen scorecard from the close of <strong>${row.label}</strong>. Closed on ${h.closedAt}, signed by you on ${h.signedAt}.</div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px">
                  <div style="padding:10px;background:#F0FDF4;border-radius:6px;text-align:center"><div style="font-size:11px;color:#15803D;text-transform:uppercase;font-weight:700">On target</div><div style="font-size:18px;font-weight:700;color:#15803D">${h.green}</div></div>
                  <div style="padding:10px;background:#FFFBEB;border-radius:6px;text-align:center"><div style="font-size:11px;color:#92400E;text-transform:uppercase;font-weight:700">At risk</div><div style="font-size:18px;font-weight:700;color:#92400E">${h.amber}</div></div>
                  <div style="padding:10px;background:#FEF2F2;border-radius:6px;text-align:center"><div style="font-size:11px;color:#B91C1C;text-transform:uppercase;font-weight:700">Below</div><div style="font-size:18px;font-weight:700;color:#B91C1C">${h.red}</div></div>
                  <div style="padding:10px;background:#EFF6FF;border-radius:6px;text-align:center"><div style="font-size:11px;color:#1D4ED8;text-transform:uppercase;font-weight:700">Total</div><div style="font-size:18px;font-weight:700;color:#1D4ED8">${h.kpiCount}</div></div>
                </div>
                <h4 style="font-size:12px;color:var(--ink-500);text-transform:uppercase;letter-spacing:.5px;margin:0 0 8px">Section breakdown</h4>
                ${(h.sections || []).map(s => `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid var(--ink-100);font-size:13px">
                    <span>${s.id}</span>
                    <strong style="color:${s.score >= 95 ? 'var(--ok)' : s.score >= 80 ? 'var(--warn)' : 'var(--danger)'}">${s.score}%</strong>
                  </div>`).join("")}
                <div class="form-foot"><button class="btn btn--secondary" onclick="closeSlideover()">Close</button></div>`,
            });
          },
        });
      }
    }, 60);
  }

  // KPI cards → drill-down or nav
  $$("[data-card-id]").forEach(el => el.addEventListener("click", () => {
    const id = el.dataset.cardId;
    const navMap = { "onboarding": "onboarding", "trainings": "trainings", "kpis": "kpis", "certs": "certifications" };
    if (navMap[id]) location.hash = "#" + navMap[id];
  }));

  // Quick actions
  $$("[data-quick]").forEach(b => b.addEventListener("click", () => {
    location.hash = "#" + b.dataset.quick;
  }));

  // Cross-nav
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

  // Doc categories
  $$(".doc-cat").forEach(c => c.addEventListener("click", () => {
    $$(".doc-cat").forEach(x => x.classList.remove("doc-cat--active"));
    c.classList.add("doc-cat--active");
  }));

  // Tabs
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    const parent = t.parentElement;
    $$(".tab", parent).forEach(x => x.classList.remove("tab--active"));
    t.classList.add("tab--active");
  }));

  // Task list items → open detail
  $$(".task").forEach(t => t.addEventListener("click", () => {
    openSlideover({
      title: "Task Detail",
      body: `<p style="font-size:13.5px;color:var(--ink-700);line-height:1.6;margin:0 0 14px"><strong>${t.querySelector('.task__name').textContent}</strong></p>
        <p style="font-size:13px;color:var(--ink-500);margin:0 0 18px;line-height:1.6">${t.querySelector('.task__desc').textContent}</p>
        <div class="form-foot"><button class="btn btn--secondary">Dismiss</button><button class="btn btn--primary">Take action ${ICONS.arrowRight}</button></div>`,
    });
  }));

  // Training action buttons (start, upload, download, etc.) — must fire before the card-level handler
  $$(".tcard [data-action][data-training-id]").forEach(btn => btn.addEventListener("click", e => {
    e.stopPropagation();
    const action = btn.dataset.action;
    const t = DATA.myTrainings.find(x => x.id === btn.dataset.trainingId);
    if (!t) return;
    handleTrainingAction(action, t);
  }));

  // Training card body click → open detail slide-over
  $$(".tcard").forEach(tc => tc.addEventListener("click", e => {
    // ignore clicks that landed on a button — those have their own handler
    if (e.target.closest("[data-action]")) return;
    const id = tc.querySelector("[data-training-id]")?.dataset.trainingId;
    if (!id) return;
    const t = DATA.myTrainings.find(x => x.id === id);
    if (!t) return;
    openTrainingDetail(t);
  }));

  // Action toasts (non-training generic actions)
  $$("[data-action]:not([data-training-id])").forEach(b => b.addEventListener("click", () => {
    const action = b.dataset.action;
    const field = b.dataset.field;
    const u = DATA.user;

    if (action === "toggle-salary-mask") {
      const grid = document.querySelector("[data-salary-grid]");
      if (!grid) return;
      const isMasked = grid.dataset.masked === "true";
      const willReveal = isMasked;
      grid.dataset.masked = willReveal ? "false" : "true";
      grid.querySelectorAll("[data-secret]").forEach(span => {
        const real = span.dataset.secret;
        if (willReveal) {
          span.dataset.hidden = span.textContent;  // remember the masked form
          span.textContent = real;
        } else {
          span.textContent = span.dataset.hidden || span.textContent;
        }
      });
      // Swap the button icon + label + aria
      b.setAttribute("aria-pressed", willReveal ? "true" : "false");
      const labelEl = b.querySelector(".salary-reveal-btn__label");
      if (labelEl) labelEl.textContent = willReveal ? "Hide" : "Reveal";
      const svg = b.querySelector("svg");
      if (svg) {
        const replacement = willReveal ? ICONS.eyeOff : ICONS.eye;
        svg.outerHTML = replacement;
      }
      // Auto re-mask after 20 seconds for safety
      if (willReveal) {
        if (window.__salaryMaskTimer) clearTimeout(window.__salaryMaskTimer);
        window.__salaryMaskTimer = setTimeout(() => {
          if (grid.dataset.masked === "false") b.click();
        }, 20000);
      }
      return;
    }

    if (action === "view-payslips") {
      const s = DATA.salarySlips;
      openSlideover({
        title: "Payslips · Synced from ODOO",
        body: `
          <div style="margin-bottom:14px;font-size:13px;color:var(--ink-500);line-height:1.55">
            ODOO is the system of record for SUDO payroll. Payslips are synced nightly to your portal. To request a correction, contact HR — corrections are made in ODOO and reflected here on the next sync.
          </div>
          <div style="background:var(--ink-100);border-radius:8px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;font-size:12px">
            <span class="odoo-source-pill">${ICONS.external} ${s.syncSource}</span>
            <span style="color:var(--ink-500)">Last sync: <strong style="color:var(--ink-900)">${s.syncedAt}</strong></span>
          </div>
          <div class="payslip-list">
            ${s.available.map(p => `
              <div class="payslip-row">
                <div class="payslip-row__icon">${ICONS.fileText || ICONS.doc}</div>
                <div class="payslip-row__main">
                  <div class="payslip-row__period">${p.period}</div>
                  <div class="payslip-row__meta">Issued ${p.issueDate} · Net <strong>${p.currency} ${p.net.toLocaleString()}</strong> · <span class="payslip-row__odoo-id">${p.odooId}</span></div>
                </div>
                <button class="btn btn--secondary btn--sm">${ICONS.download} PDF</button>
              </div>`).join("")}
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
            <button class="btn btn--ghost" data-action="refresh-payslips" onclick="window.__toast('Sync triggered · refreshing from ODOO now (may take up to 60 seconds)')">${ICONS.refresh} Force resync</button>
          </div>`,
      });
      return;
    }

    if (action === "request-ticket") {
      const e = DATA.airTickets.entitlement;
      openSlideover({
        title: "Request ticket booking",
        body: `
          <div style="margin-bottom:14px;font-size:13px;color:var(--ink-500);line-height:1.55">
            Submit your preferred travel dates. HR books through SUDO's travel partner. You can also self-book and submit the boarding pass for reimbursement.
          </div>
          <div style="background:var(--tint-3);border:1px solid var(--tint-2);border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--ink-700)">
            <strong>Your entitlement:</strong> ${e.cycle} · ${e.ticketsPerCycle} ${e.class} round-trip · ${e.route}
          </div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Preferred outbound date</label><input class="input" type="date" /></div>
            <div class="field"><label class="field__label">Preferred return date</label><input class="input" type="date" /></div>
            <div class="field field--full"><label class="field__label">Preferred airline / time of day (optional)</label><input class="input" placeholder="e.g. Emirates · morning flights" /></div>
            <div class="field field--full"><label class="field__label">Booking method</label><select class="select"><option>HR books via travel partner</option><option>I'll book myself and submit boarding pass for reimbursement</option></select></div>
            <div class="field field--full"><label class="field__label">Notes for HR (optional)</label><textarea class="textarea" placeholder="Any special considerations"></textarea></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Ticket request sent to HR · expect a response within 2 business days')">${ICONS.send} Submit request</button>
          </div>`,
      });
      return;
    }

    if (action === "upload-boarding-pass") {
      window.__toast("Boarding pass upload — drag & drop a PDF/JPG in the dialog (wired in Phase 2)", "info");
      return;
    }

    if (action === "view-ticket-policy") {
      const e = DATA.airTickets.entitlement;
      openSlideover({
        title: "Air Ticket Policy",
        body: `
          <div style="font-size:13px;color:var(--ink-700);line-height:1.6">
            <h4 style="font-size:13px;font-weight:700;margin:0 0 8px;color:var(--ink-900)">Your current entitlement</h4>
            <ul style="padding-left:20px;margin:0 0 16px;color:var(--ink-700)">
              <li><strong>${e.cycle}</strong> · ${e.ticketsPerCycle} round-trip ticket per cycle</li>
              <li>Class: <strong>${e.class}</strong></li>
              <li>Route: <strong>${e.route}</strong></li>
              <li>Family included: <strong>${e.coversFamily ? "Yes" : "No"}</strong></li>
            </ul>
            <h4 style="font-size:13px;font-weight:700;margin:16px 0 8px;color:var(--ink-900)">How to use it</h4>
            <ol style="padding-left:20px;margin:0;color:var(--ink-700)">
              <li>Submit a request via the portal at least 14 days before travel.</li>
              <li>HR books through SUDO's preferred travel partner, or approves self-booking for reimbursement.</li>
              <li>Submit your boarding pass within 30 days of travel completion.</li>
              <li>Unused entitlements <strong>do not roll over</strong> to the next cycle.</li>
            </ol>
            <div style="margin-top:14px;padding:10px 12px;background:var(--ink-100);border-radius:8px;font-size:11.5px;color:var(--ink-500)">
              ${e.notes}
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
          </div>`,
      });
      return;
    }

    if (action === "open-leave-request") {
      openSlideover({
        title: "Request leave",
        body: `
          <div style="margin-bottom:14px;font-size:13px;color:var(--ink-500);line-height:1.55">
            Your request will go to your PM for endorsement, then HR for final approval. You'll be notified at each step.
          </div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Leave type</label><select class="select" id="lv-type">
              <option value="ANNUAL">Annual Paid Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
              <option value="COMPASSIONATE">Compassionate Leave</option>
              <option value="HAJJ">Hajj Leave</option>
              <option value="MATERNITY">Maternity / Paternity</option>
            </select></div>
            <div class="field"><label class="field__label">Number of days</label><input class="input" type="number" min="0.5" step="0.5" value="3" id="lv-days" /></div>
            <div class="field"><label class="field__label">From</label><input class="input" type="date" value="2026-05-26" id="lv-from" /></div>
            <div class="field"><label class="field__label">To</label><input class="input" type="date" value="2026-05-28" id="lv-to" /></div>
            <div class="field field--full"><label class="field__label">Reason</label><textarea class="textarea" id="lv-reason" placeholder="Brief explanation visible to your PM and HR"></textarea></div>
            <div class="field field--full"><label class="field__label">Supporting document (optional)</label>
              <div style="display:flex;gap:8px;align-items:center;padding:12px;border:1.5px dashed var(--ink-300);border-radius:10px;background:var(--ink-100);color:var(--ink-500);font-size:12px;cursor:pointer">
                ${ICONS.upload} <span>Drag a medical certificate or supporting PDF here, or click to browse</span>
              </div>
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" id="lv-submit">${ICONS.send} Submit request</button>
          </div>`,
      });
      setTimeout(() => {
        const btn = document.getElementById("lv-submit");
        if (!btn) return;
        btn.addEventListener("click", async () => {
          const leaveType = document.getElementById("lv-type").value;
          const startDate = document.getElementById("lv-from").value;
          const endDate = document.getElementById("lv-to").value;
          const reason = (document.getElementById("lv-reason").value || "").trim();
          if (window.api) {
            btn.disabled = true;
            try {
              // Create the draft then submit it for approval
              const created = await api.leave.createRequest({ leaveType, startDate, endDate, reason });
              if (created && created.id) await api.leave.submitRequest(created.id);
              closeSlideover();
              window.__toast("Leave request submitted · PM notified for endorsement");
              if (window.SUDO_HYDRATE) { await SUDO_HYDRATE.rehydrate("leaveRequests"); if (typeof route === "function") route(); }
            } catch (e) {
              btn.disabled = false;
              window.__toast("Could not submit: " + (e.message || "error"));
            }
          } else {
            closeSlideover();
            window.__toast("Leave request submitted · PM (Fatima Al Zaabi) notified for endorsement");
          }
        });
      }, 60);
      return;
    }

    if (action === "edit-field") {
      // Open slide-over with edit form for personal email/phone/address
      const labels = { personalEmail: "Personal Email", phone: "Mobile Number", address: "Address" };
      const currentVal = field === "personalEmail" ? u.personalEmail : field === "phone" ? u.phone : u.address;
      openSlideover({
        title: "Edit " + (labels[field] || field),
        body: `
          <div style="margin-bottom:14px;font-size:13px;color:var(--ink-500);line-height:1.55">
            Changes to this field take effect immediately — no approval needed. We'll send a confirmation email to your work address.
          </div>
          <div class="form-grid form-grid--single">
            <div class="field">
              <label class="field__label">${labels[field] || field}</label>
              ${field === "address"
                ? `<textarea class="textarea">${currentVal}</textarea>`
                : `<input class="input" value="${currentVal}" />`}
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('${labels[field] || field} updated · confirmation sent to your work email')">${ICONS.check} Save changes</button>
          </div>`,
      });
      return;
    }

    if (action === "request-edit") {
      openSlideover({
        title: "Request to edit field",
        body: `
          <div style="margin-bottom:14px;font-size:13px;color:var(--ink-500);line-height:1.55">
            This field is locked. Your request goes to HR (and Super Admin for sensitive fields like IBAN or passport). They'll review and approve or decline within 1–2 business days.
          </div>
          <div class="form-grid form-grid--single">
            <div class="field"><label class="field__label">Field</label><input class="input" value="${field}" disabled style="background:var(--ink-100);color:var(--ink-500)" /></div>
            <div class="field"><label class="field__label">New value</label><input class="input" placeholder="What should it be changed to?" /></div>
            <div class="field"><label class="field__label">Reason (required)</label><textarea class="textarea" placeholder="Why does this need to change?"></textarea></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Edit request sent to HR · you will be notified within 1–2 business days')">${ICONS.send} Send request</button>
          </div>`,
      });
      return;
    }

    if (action === "change-photo") {
      // Open the slideover with three options: upload, remove, or close
      const photoKey = `sudo:profile:photo:${u.employeeId || 'E008'}`;
      let currentPhoto = null;
      try { currentPhoto = localStorage.getItem(photoKey); } catch (e) { /* ignore */ }

      openSlideover({
        title: "Change profile photo",
        body: `
          <div style="margin-bottom:14px;font-size:13px;color:var(--ink-500);line-height:1.55">
            Upload a JPG, PNG, WEBP or GIF (max 2 MB). It will be visible to your team, managers, and HR. Square images work best.
          </div>

          <div style="display:flex;justify-content:center;margin:18px 0 24px">
            <div style="width:140px;height:140px;border-radius:50%;background:var(--brand-100);display:flex;align-items:center;justify-content:center;overflow:hidden;border:3px solid var(--ink-100)">
              ${currentPhoto
                ? `<img src="${currentPhoto}" alt="${u.name}" style="width:100%;height:100%;object-fit:cover">`
                : `<span style="font-size:42px;font-weight:700;color:var(--brand-700)">${u.initials}</span>`}
            </div>
          </div>

          <input type="file" id="sudo-photo-picker" accept="image/png,image/jpeg,image/webp,image/gif" style="display:none">

          <div class="form-foot" style="justify-content:space-between">
            ${currentPhoto
              ? `<button class="btn btn--secondary" data-action="remove-photo" style="color:var(--danger)">${ICONS.trash || '🗑'} Remove photo</button>`
              : '<div></div>'}
            <div style="display:flex;gap:8px">
              <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
              <button class="btn btn--primary" data-action="trigger-photo-picker">
                ${ICONS.upload || ICONS.send} Choose file
              </button>
            </div>
          </div>

          <div id="sudo-photo-error" style="margin-top:14px;display:none;padding:10px 14px;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;color:#B91C1C;font-size:13px"></div>
        `,
      });

      // Wire the picker after the slideover is in the DOM
      setTimeout(() => {
        const picker = document.getElementById("sudo-photo-picker");
        const triggerBtn = document.querySelector('[data-action="trigger-photo-picker"]');
        const removeBtn  = document.querySelector('[data-action="remove-photo"]');
        const errEl      = document.getElementById("sudo-photo-error");

        if (triggerBtn && picker) {
          triggerBtn.addEventListener("click", () => picker.click());
        }
        if (removeBtn) {
          removeBtn.addEventListener("click", () => {
            try { localStorage.removeItem(photoKey); } catch (e) { /* ignore */ }
            closeSlideover();
            window.__toast && window.__toast("Photo removed — reverting to initials", "success");
            // In production: DELETE /api/v1/employees/:id/photo
            setTimeout(() => location.reload(), 500);
          });
        }
        if (picker) {
          picker.addEventListener("change", (ev) => {
            const file = ev.target.files && ev.target.files[0];
            if (!file) return;

            // Validate type + size client-side BEFORE reading
            const okTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
            if (!okTypes.includes(file.type)) {
              if (errEl) {
                errEl.textContent = "Unsupported file type. Use PNG, JPG, WEBP or GIF.";
                errEl.style.display = "block";
              }
              picker.value = "";
              return;
            }
            // 2 MB before encoding (data URI grows ~33%, server cap is 2 MB encoded).
            // Be conservative client-side at 1.5 MB raw.
            if (file.size > 1.5 * 1024 * 1024) {
              if (errEl) {
                errEl.textContent = "File is too large (max 1.5 MB). Try a smaller image, or compress it first.";
                errEl.style.display = "block";
              }
              picker.value = "";
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result;
              if (typeof dataUrl !== "string") return;
              try {
                localStorage.setItem(photoKey, dataUrl);
              } catch (e) {
                // Quota exceeded — rare for one image, but possible if many users on shared device
                if (errEl) {
                  errEl.textContent = "Couldn't save the photo locally (storage full). Try a smaller image.";
                  errEl.style.display = "block";
                }
                return;
              }
              closeSlideover();
              window.__toast && window.__toast("Profile photo updated", "success");
              // In production: PATCH /api/v1/employees/:id/photo with { photoDataUrl: dataUrl }
              setTimeout(() => location.reload(), 500);
            };
            reader.onerror = () => {
              if (errEl) {
                errEl.textContent = "Failed to read the file. Try again.";
                errEl.style.display = "block";
              }
            };
            reader.readAsDataURL(file);
          });
        }
      }, 60);
      return;
    }

    if (action === "show-tag-info") {
      if (!u.tag) return;
      openSlideover({
        title: "Special Tag",
        body: `
          <div style="text-align:center;padding:20px 0 16px">
            <div style="display:inline-block;background:linear-gradient(135deg,var(--gold-deep),var(--gold));color:white;font-size:14px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;padding:10px 22px;border-radius:999px;box-shadow:0 8px 20px rgba(199,122,0,0.3)">★ ${u.tag.label}</div>
          </div>
          <div style="background:var(--ink-100);border-radius:10px;padding:14px 16px;margin-bottom:14px">
            <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.6px;color:var(--ink-500);font-weight:700;margin-bottom:3px">GRANTED BY</div>
            <div style="font-size:13px;font-weight:600;color:var(--ink-900)">${u.tag.grantedBy}</div>
            <div style="font-size:11.5px;color:var(--ink-500);margin-top:2px">${u.tag.grantedOn}</div>
          </div>
          <div style="background:var(--ink-100);border-radius:10px;padding:14px 16px">
            <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.6px;color:var(--ink-500);font-weight:700;margin-bottom:3px">REASON</div>
            <div style="font-size:13px;color:var(--ink-700);line-height:1.5">${u.tag.reason}</div>
          </div>
          <div style="font-size:11.5px;color:var(--ink-500);margin-top:14px;line-height:1.5">Tags are granted by HR, Super Admins, or your Project Manager to recognize exceptional work. They appear on your profile and contribute to your performance record.</div>`,
      });
      return;
    }

    if (action === "request-family") {
      openSlideover({
        title: "Request to add family member",
        body: `
          <div style="margin-bottom:14px;font-size:13px;color:var(--ink-500);line-height:1.55">
            Family members can be added by HR for insurance coverage. Fill in the details below and HR will verify the documentation.
          </div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Relationship</label><select class="select"><option>Spouse</option><option>Child</option></select></div>
            <div class="field"><label class="field__label">Full Name</label><input class="input" placeholder="e.g. Sara Al Otaibi" /></div>
            <div class="field"><label class="field__label">Date of Birth</label><input class="input" type="date" /></div>
            <div class="field"><label class="field__label">Visa Status</label><input class="input" placeholder="e.g. Dependent visa" /></div>
            <div class="field field--full"><label class="field__label">Notes for HR</label><textarea class="textarea" placeholder="Any additional information"></textarea></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Family addition request sent to HR · they will reach out for supporting documents')">${ICONS.send} Send to HR</button>
          </div>`,
      });
      return;
    }

    // ── KPI actions (new flow: employee updates progress, validator confirms) ─
    if (action === "emp-ack-all") {
      const meId = "E008";
      const me = SUDO_DB_HELPERS.findEmployee(meId);
      const myAssigns = SUDO_DB_HELPERS.assignmentsForEmployee(meId, "q2-2026");
      const needsAck = myAssigns.filter(a => a.status === "active" && !a.empAcknowledgedAt);
      if (needsAck.length === 0) { toast("Nothing to acknowledge"); return; }
      openSlideover({
        title: "Acknowledge KPI Scorecard",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.check}
            <div>Sign your acknowledgement of the ${needsAck.length} KPI${needsAck.length===1?'':'s'} on your Q2 2026 scorecard. After signing you can begin updating progress.</div>
          </div>
          <div style="font-size:12.5px;color:var(--ink-700);line-height:1.65;margin-bottom:14px">
            "I acknowledge, agree, and confirm with the KPIs (targets) reflected on my Q2 2026 scorecard."
          </div>
          <div class="form-grid">
            <div class="field field--full">
              <label class="field__label">Type your full name as signature</label>
              <input class="input" id="emp-ack-signature" value="${me ? me.name : ''}" />
            </div>
            <div class="field field--full">
              <label class="field__label">Disagreement note (optional)</label>
              <textarea class="textarea" id="emp-ack-disagreement" rows="2" placeholder="If you disagree with any KPI target, note it here. HR will follow up."></textarea>
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" id="emp-ack-confirm">${ICONS.check} Sign and acknowledge ${needsAck.length} KPI${needsAck.length===1?'':'s'}</button>
          </div>`,
      });
      setTimeout(() => {
        const btn = document.getElementById("emp-ack-confirm");
        if (!btn) return;
        btn.addEventListener("click", () => {
          const sig = (document.getElementById("emp-ack-signature").value || "").trim();
          const note = (document.getElementById("emp-ack-disagreement").value || "").trim();
          if (!sig) { toast("Please type your name to sign", "warn"); return; }
          // Mark each pending-ack assignment as acknowledged
          const now = new Date().toISOString().slice(0,10);
          needsAck.forEach(a => SUDO_DB_OVERRIDES.updateAssignment(a.id, { empAcknowledgedAt: now }));
          // Insert one acknowledgement record
          const totalWeight = needsAck.reduce((s,a) => s + (a.weight || 0), 0);
          SUDO_DB_OVERRIDES.addAcknowledgement({
            empId: meId, cycleId: "q2-2026", signedAt: now,
            signedVia: "portal", agreement: !note, disagreementNote: note,
            preparedBy: me ? me.lm : "", reviewedBy: "", approvedBy: "E004",
            kpiCount: needsAck.length, totalWeight, signature: sig,
          });
          SUDO_DB_OVERRIDES.audit(sig, "kpi.scorecard.acknowledged", meId, `${needsAck.length} KPIs · ${note ? 'with disagreement' : 'agreed'}`);
          SUDO_DB_OVERRIDES.notify({
            title: "KPI scorecard acknowledged",
            desc: `${sig} signed ${needsAck.length} Q2 KPIs${note ? ' (with note)' : ''}`,
            icon: "check", color: "ok",
          });
          closeSlideover();
          toast(`Acknowledged ${needsAck.length} KPI${needsAck.length===1?'':'s'} · scorecard signed`, "success");
          setTimeout(() => location.reload(), 700);
        });
      }, 60);
      return;
    }

    if (action === "emp-update-kpi") {
      const assignId = b.dataset.assignId;
      const a = SUDO_DB.kpiAssignments.find(x => x.id === assignId);
      if (!a) { toast("Cannot find KPI", "warn"); return; }
      const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
      if (!tpl) { toast("Cannot find KPI template", "warn"); return; }
      const validatorLabel = ({ tl: "Team Lead", pm: "Project Manager", hr: "HR" })[tpl.validatorRole] || "Validator";
      const currentVal = a.validatedValue ?? a.empSubmittedValue ?? "—";
      openSlideover({
        title: "Update KPI Progress",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.pen}
            <div><strong>${tpl.krn}</strong> · ${tpl.label}<br><span style="font-size:11.5px;color:var(--ink-700)">After you submit, this goes to your ${validatorLabel} for confirmation. Status colour updates automatically based on your value vs target.</span></div>
          </div>
          <div class="form-grid">
            <div class="field">
              <label class="field__label">Target</label>
              <input class="input" value="${tpl.target}" disabled style="background:var(--ink-50)" />
            </div>
            <div class="field">
              <label class="field__label">Current accomplishment</label>
              <input class="input" value="${currentVal}" disabled style="background:var(--ink-50)" />
            </div>
            <div class="field">
              <label class="field__label">New value (${tpl.targetUnit})</label>
              <input class="input" id="kpi-new-value" type="number" step="0.1" placeholder="e.g. ${tpl.targetValue}" />
            </div>
            <div class="field">
              <label class="field__label">Period reference</label>
              <input class="input" value="${tpl.frequency === 'monthly' ? 'May 2026' : 'Q2 2026'}" disabled style="background:var(--ink-50)" />
            </div>
            <div class="field field--full">
              <label class="field__label">Accomplishment narrative</label>
              <textarea class="textarea" id="kpi-accomp-text" rows="3" placeholder="e.g. 'Resolved 24 critical incidents this month, avg restore time 1h 42m'">${a.accomplishmentText || ''}</textarea>
            </div>
            <div class="field field--full">
              <label class="field__label">Evidence / Means of Validation</label>
              <div style="padding:10px 12px;background:var(--ink-50);border-radius:6px;font-size:12px;color:var(--ink-700)">${tpl.mov}</div>
              <div style="margin-top:6px;font-size:11px;color:var(--ink-500)">Make sure the evidence above is up to date before submitting.</div>
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" id="kpi-submit-progress">${ICONS.send} Submit to ${validatorLabel}</button>
          </div>`,
      });
      setTimeout(() => {
        const btn = document.getElementById("kpi-submit-progress");
        if (!btn) return;
        btn.addEventListener("click", () => {
          const val = parseFloat(document.getElementById("kpi-new-value").value);
          const text = (document.getElementById("kpi-accomp-text").value || "").trim();
          if (isNaN(val)) { toast("Enter a numeric value", "warn"); return; }
          const meName = (SUDO_DB_HELPERS.findEmployee("E008") || {}).name || "Employee";
          const updated = SUDO_DB_OVERRIDES.updateAssignment(a.id, {
            empSubmittedValue: val,
            empSubmittedAt: new Date().toISOString().slice(0,10),
            accomplishmentText: text,
            status: "progress_pending_validation",
          });
          SUDO_DB_OVERRIDES.audit(meName, "kpi.progress.submitted", a.id, `Submitted ${val} · awaiting ${validatorLabel}`);
          SUDO_DB_OVERRIDES.notify({
            title: `New KPI progress to validate`,
            desc: `${meName} submitted progress for ${tpl.krn}`,
            icon: "bell", color: "info",
          });
          closeSlideover();
          toast(`Progress submitted · ${validatorLabel} will validate`, "success");
          setTimeout(() => location.reload(), 600);
        });
      }, 60);
      return;
    }

    if (action === "emp-kpi-detail") {
      const assignId = b.dataset.assignId;
      const a = SUDO_DB.kpiAssignments.find(x => x.id === assignId);
      if (!a) { toast("Cannot find KPI", "warn"); return; }
      const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
      if (!tpl) return;
      const drafter = SUDO_DB_HELPERS.findEmployee(a.draftedBy);
      const tlApprover = SUDO_DB_HELPERS.findEmployee(a.tlApprovedBy);
      const validator = SUDO_DB_HELPERS.findEmployee(a.validatedBy);
      openSlideover({
        title: `${tpl.krn} · ${tpl.label}`,
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.calendar}
            <div>${tpl.metric}</div>
          </div>
          <div class="form-grid">
            <div class="field"><label class="field__label">KRN</label><input class="input" value="${tpl.krn}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Target</label><input class="input" value="${tpl.target}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Frequency</label><input class="input" value="${tpl.frequency}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Weight</label><input class="input" value="${a.weight}%" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Validator role</label><input class="input" value="${tpl.validatorRole}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Status</label><input class="input" value="${a.status}" disabled style="background:var(--ink-50)"></div>
            <div class="field field--full"><label class="field__label">Means of Validation</label><input class="input" value="${tpl.mov}" disabled style="background:var(--ink-50)"></div>
          </div>
          <h4 style="font-size:12px;color:var(--ink-500);text-transform:uppercase;letter-spacing:.5px;margin:18px 0 8px">Workflow trail</h4>
          <div style="font-size:12px;line-height:1.7">
            <div>· <strong>Drafted by</strong> ${drafter ? drafter.name : a.draftedBy || '—'} on ${a.draftedAt || '—'}</div>
            ${a.tlApprovedAt ? `<div>· <strong>TL approved</strong> by ${tlApprover ? tlApprover.name : a.tlApprovedBy} on ${a.tlApprovedAt}</div>` : ''}
            ${a.hrAckAt ? `<div>· <strong>HR acknowledged</strong> on ${a.hrAckAt}</div>` : ''}
            ${a.empAcknowledgedAt ? `<div>· <strong>You acknowledged</strong> on ${a.empAcknowledgedAt}</div>` : ''}
            ${a.empSubmittedAt ? `<div>· <strong>You submitted</strong> value ${a.empSubmittedValue} on ${a.empSubmittedAt}</div>` : ''}
            ${a.validatedAt ? `<div>· <strong>Validated</strong> by ${validator ? validator.name : a.validatedBy} on ${a.validatedAt}</div>` : ''}
          </div>

          <h4 style="font-size:12px;color:var(--ink-500);text-transform:uppercase;letter-spacing:.5px;margin:18px 0 8px">Audit log (${(SUDO_DB.auditLog || []).filter(e => (e.target || "").includes(a.id)).length} entries)</h4>
          <div style="font-size:11.5px;line-height:1.7;background:var(--ink-50);padding:10px;border-radius:6px;max-height:240px;overflow-y:auto">
            ${(function(){
              const entries = (SUDO_DB.auditLog || []).filter(e => (e.target || "").includes(a.id));
              if (entries.length === 0) {
                return '<div style="color:var(--ink-500)">No audit entries yet.</div>';
              }
              return entries.map(e => `
                <div style="padding:6px 0;border-bottom:1px dashed var(--ink-200)">
                  <div><strong>${e.action}</strong> — ${e.actor}</div>
                  <div style="color:var(--ink-700);font-size:11px">${e.note || ''}</div>
                  <div style="color:var(--ink-500);font-size:10.5px;margin-top:2px">${e.at}</div>
                </div>`).join("");
            })()}
          </div>

          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
          </div>`,
      });
      return;
    }

    // Default toasts
    const messages = {
      "submit-request": "Request submitted · HR will respond within 1–2 business days",
      "ack-kpi": "Q2 KPIs acknowledged · your LM has been notified",
      "submit-leave": "Leave request submitted · PM will be notified for endorsement",
    };
    toast(messages[action] || "Action completed");
  }));

  // ── FilterBar mounts (per-page configs) ─────────────────────
  if (window.FilterBar) {
    const fb = (id, opts) => document.getElementById(id) && FilterBar.mount(id, opts);

    // Compute training tab counts dynamically from the .tcard elements only
    // (not the wrapping <section> elements, which would double-count)
    function tagCount(tag) {
      return document.querySelectorAll(`#trainings-results .tcard[data-tag~="${tag}"]`).length;
    }

    fb("fb-trainings", {
      targetContainer: "trainings-results",
      tabs: [
        { id: "all",      label: "All",      count: tagCount("all")           },
        { id: "active",   label: "Active",   count: tagCount("active")        },
        { id: "overdue",  label: "Overdue",  count: tagCount("overdue")       },
        { id: "awaiting", label: "Awaiting", count: tagCount("awaiting")      },
        { id: "verified", label: "Verified", count: tagCount("verified")      },
      ],
      views: ["list", "tiles", "kanban"],
      period: true,
      filters: [
        { id: "provider", label: "Provider", options: ["All providers", "AWS", "KnowBe4", "Udemy", "ITIL"] },
        { id: "priority", label: "Priority", options: ["Any priority", "Required", "Recommended", "Optional"] },
      ],
      search: true,
      download: true,
    });

    function certCount(tag) {
      return document.querySelectorAll(`#certs-results .ccard[data-tag~="${tag}"]`).length;
    }
    fb("fb-certs", {
      targetContainer: "certs-results",
      tabs: [
        { id: "all",      label: "All",            count: certCount("all") },
        { id: "current",  label: "Current",        count: certCount("current") },
        { id: "expiring", label: "Expiring soon",  count: certCount("expiring") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "provider", label: "Provider", options: ["All providers", "AWS", "Microsoft", "Google", "KnowBe4", "ITIL"] },
      ],
      search: true,
      download: true,
    });

    function docCount(tag) {
      return document.querySelectorAll(`#documents-results tbody tr[data-tag~="${tag}"]`).length;
    }

    fb("fb-documents", {
      targetContainer: "documents-results",
      tabs: [
        { id: "all",          label: "All",                   count: docCount("all")          },
        { id: "needs-action", label: "Needs action",          count: docCount("needs-action") },
        { id: "contracts",    label: "Contracts & letters",   count: docCount("contracts")    },
        { id: "government",   label: "Government documents", count: docCount("government")    },
        { id: "forms",        label: "Forms",                 count: docCount("forms")        },
      ],
      views: ["list", "tiles"],
      period: true,
      filters: [
        { id: "status", label: "Status",  options: ["All status", "Pending signature", "Signed", "Verified"] },
        { id: "source", label: "Source",  options: ["All sources", "ODOO (read-only)", "Portal"] },
      ],
      search: true,
      download: true,
    });

    function kpiCountEmp(tag) {
      return document.querySelectorAll(`#kpis-results [data-tag~="${tag}"]`).length;
    }
    fb("fb-kpis", {
      targetContainer: "kpis-results",
      tabs: [
        { id: "all",          label: "All",          count: kpiCountEmp("all") },
        { id: "pending-ack",  label: "Pending ack",  count: kpiCountEmp("pending-ack") },
        { id: "in-progress",  label: "In progress",  count: kpiCountEmp("in-progress") },
        { id: "achieved",     label: "Achieved",     count: kpiCountEmp("achieved") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "cycle", label: "Cycle", options: ["All cycles", "Q2 2026", "Q1 2026", "Q4 2025"] },
      ],
      search: true,
      download: true,
    });

    function toCount(tag) {
      return document.querySelectorAll(`#timeoff-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-timeoff", {
      targetContainer: "timeoff-results",
      tabs: [
        { id: "all",         label: "All",         count: toCount("all") },
        { id: "pending_hr",  label: "Pending HR",  count: toCount("pending_hr") },
        { id: "pending_pm",  label: "Pending PM",  count: toCount("pending_pm") },
        { id: "approved",    label: "Approved",    count: toCount("approved") },
        { id: "denied",      label: "Denied",      count: toCount("denied") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "year",   label: "Year",  options: ["All years", "2026", "2025", "2024"] },
        { id: "type",   label: "Type",  options: ["All types", "Annual Paid", "Sick", "Compassionate", "Hajj", "Unpaid", "Maternity"] },
      ],
      search: true,
      download: true,
    });
    if (window.Pagination && document.getElementById("pg-timeoff")) {
      Pagination.mount("pg-timeoff", { targetContainer: "timeoff-results", itemSelector: "tbody tr[data-tag]", pageSize: 8 });
    }

    function reqCount(tag) {
      return document.querySelectorAll(`#requests-results tbody tr[data-tag~="${tag}"]`).length;
    }

    fb("fb-requests", {
      targetContainer: "requests-results",
      tabs: [
        { id: "all",       label: "All",        count: reqCount("all")       },
        { id: "open",      label: "Open",       count: reqCount("open")      },
        { id: "completed", label: "Completed",  count: reqCount("completed") },
        { id: "rejected",  label: "Rejected",   count: reqCount("rejected")  },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "type",   label: "Type",   options: ["All types", "Salary cert", "Visa letter", "NOC", "Experience cert", "Other"] },
        { id: "status", label: "Status", options: ["All status", "Submitted", "In progress", "Completed", "Rejected"] },
      ],
      search: true,
      download: true,
    });

    fb("fb-team", {
      views: ["list", "tiles"],
      filters: [
        { id: "relationship", label: "Relationship", options: ["All", "Project Manager", "Line Manager", "Peers"] },
        { id: "project",      label: "Project",      options: ["All projects", "Client-Alpha", "Bank-of-Sky", "Internal"] },
      ],
      search: true,
      download: false,
    });

    function notifCount(tag) {
      return document.querySelectorAll(`#notifs-results [data-tag~="${tag}"]`).length;
    }

    fb("fb-notifs", {
      targetContainer: "notifs-results",
      tabs: [
        { id: "all",      label: "All",      count: notifCount("all")      },
        { id: "unread",   label: "Unread",   count: notifCount("unread")   },
        { id: "actions",  label: "Actions",  count: notifCount("actions")  },
        { id: "mentions", label: "Mentions", count: notifCount("mentions") },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "category", label: "Category", options: ["All categories", "Training", "Leave", "KPI", "Documents", "Recognition"] },
      ],
      search: true,
      download: false,
    });

    fb("fb-badges", {
      tabs: [
        { id: "all",     label: "All",       count: 14 },
        { id: "recent",  label: "This month"           },
        { id: "from-me", label: "Given by me"          },
      ],
      views: ["tiles", "list", "chart"],
      period: true,
      filters: [
        { id: "type",   label: "Badge type",  options: ["All types", "Helping Hands", "Mentor", "Runbook Hero", "Debug Wizard", "Above & Beyond"] },
        { id: "from",   label: "Granted by",  options: ["Anyone", "Peer", "PM", "TL", "HR"] },
      ],
      search: false,
      download: true,
    });

    fb("fb-projects", {
      tabs: [
        { id: "all",      label: "All",       count: 5 },
        { id: "active",   label: "Active",    count: 3 },
        { id: "past",     label: "Past",      count: 2 },
        { id: "blocked",  label: "Blocked"             },
      ],
      views: ["list", "tiles", "kanban"],
      period: true,
      filters: [
        { id: "stage",  label: "Stage",  options: ["All stages", "Discovery", "Execution", "Closed", "Blocked"] },
        { id: "health", label: "Health", options: ["All health", "Green", "Amber", "Red"] },
        { id: "client", label: "Client", options: ["All clients", "Client-Alpha", "Bank-of-Sky", "PowerLogis", "Retail-Co", "MedX"] },
      ],
      search: true,
      download: true,
    });
  }
}

// Expose toast globally so inline onclick handlers can call it
window.__toast = toast;

// Handle a state-changing action on a training row
function handleTrainingAction(action, t) {
  if (action === "start-training") {
    // Open a confirm slide-over so the user knows the countdown begins
    openSlideover({
      title: "Start training?",
      body: `
        <div style="margin-bottom:18px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--bright);font-weight:700;margin-bottom:6px">${t.provider} · ${t.platform}</div>
          <div style="font-size:15px;font-weight:700;color:var(--ink-900);margin-bottom:10px">${t.title}</div>
          <div style="font-size:13px;color:var(--ink-500);line-height:1.6">When you click <strong>Start</strong>, the deadline countdown begins. You'll open the training on the external platform — your progress is tracked there, not here. Come back when you finish to upload the certificate.</div>
        </div>
        <div class="form-grid form-grid--single">
          <div class="field"><label class="field__label">Deadline</label><div style="font-size:14px;font-weight:600;color:var(--ink-900)">${t.dueDate ? `${t.dueDate} · ${daysUntil(t.dueDate)} days from today` : "Self-paced — no deadline"}</div></div>
          <div class="field"><label class="field__label">Platform</label><div style="font-size:13px;color:var(--ink-700)">${t.platform}</div></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" onclick="confirmStartTraining('${t.id}')">${ICONS.play} Yes, start now</button>
        </div>`,
    });
  } else if (action === "open-external") {
    toast(`Opening ${t.platform} in a new tab…`);
  } else if (action === "upload-cert") {
    // SHOW THE WARNING PROMPT before allowing upload
    openSlideover({
      title: "Upload certificate",
      body: `
        <div style="margin-bottom:18px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--bright);font-weight:700;margin-bottom:6px">${t.provider} · ${t.platform}</div>
          <div style="font-size:15px;font-weight:700;color:var(--ink-900);margin-bottom:14px">${t.title}</div>
        </div>

        <div class="confirm-dialog">
          ${ICONS.alert}
          <div>
            <strong>One-shot upload — read carefully</strong>
            <p>Once you upload your certificate and mark this training complete, the file is <strong>locked</strong>. You will not be able to edit or replace it.</p>
            <p style="margin-top:6px">If you need to re-upload (wrong file, wrong version), you must request HR or a Super Admin to allow it.</p>
          </div>
        </div>

        <div class="form-grid form-grid--single">
          <div class="field">
            <label class="field__label">Certificate file (PDF, PNG, or JPG)</label>
            <div style="display:flex;gap:8px;align-items:center;padding:14px;border:1.5px dashed var(--ink-300);border-radius:10px;background:var(--ink-100);color:var(--ink-500);font-size:12.5px;cursor:pointer">
              ${ICONS.upload}
              <span>Drag your certificate here, or click to browse</span>
            </div>
          </div>
          <div class="field"><label class="field__label">Issuing platform</label><input class="input" value="${t.platform}" /></div>
          <div class="field"><label class="field__label">Date issued</label><input class="input" type="date" value="2026-05-11" /></div>
          <div class="field"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span>I confirm this certificate is genuine and the training is complete</label></div>
        </div>

        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" onclick="confirmUploadCert('${t.id}')">${ICONS.lock} Submit & lock file</button>
        </div>`,
    });
  } else if (action === "download-cert") {
    toast(`Downloading ${t.certificate?.filename || "certificate.pdf"}…`);
  } else if (action === "request-extension") {
    openSlideover({
      title: "Request deadline extension",
      body: `
        <div style="margin-bottom:18px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--bright);font-weight:700;margin-bottom:6px">${t.provider} · ${t.platform}</div>
          <div style="font-size:15px;font-weight:700;color:var(--ink-900);margin-bottom:6px">${t.title}</div>
          <div style="font-size:12.5px;color:var(--ink-500)">Currently ${deadlineLabel(t).toLowerCase()}. Your request goes to HR for approval.</div>
        </div>
        <div class="form-grid form-grid--single">
          <div class="field"><label class="field__label">Extension requested</label><select class="select"><option>3 days</option><option>7 days</option><option>14 days</option><option>30 days</option></select></div>
          <div class="field"><label class="field__label">Reason</label><textarea class="textarea" placeholder="e.g. Exam slot wasn't available before deadline"></textarea></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" onclick="confirmExtension('${t.id}')">${ICONS.send} Send request</button>
        </div>`,
    });
  } else if (action === "request-reupload") {
    openSlideover({
      title: "Request re-upload",
      body: `
        <div style="margin-bottom:18px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--bright);font-weight:700;margin-bottom:6px">${t.provider} · ${t.platform}</div>
          <div style="font-size:15px;font-weight:700;color:var(--ink-900);margin-bottom:6px">${t.title}</div>
          <div style="font-size:12.5px;color:var(--ink-500)">Locked file: <span class="table__mono">${t.certificate?.filename}</span></div>
        </div>
        <div class="confirm-dialog">
          ${ICONS.alert}
          <div>
            <strong>Why re-upload?</strong>
            <p>This goes to HR for approval. Once HR allows it, you can replace the file once — the new file then locks again.</p>
          </div>
        </div>
        <div class="form-grid form-grid--single">
          <div class="field"><label class="field__label">Reason for re-upload</label><textarea class="textarea" placeholder="e.g. Uploaded the wrong file by mistake — correct file from AWS Skill Builder"></textarea></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" onclick="confirmReupload('${t.id}')">${ICONS.send} Send to HR</button>
        </div>`,
    });
  } else if (action === "open-detail") {
    openTrainingDetail(t);
  }
}

// Detail slide-over (read-only summary)
function openTrainingDetail(t) {
  const s = trainingState(t);
  const stateLabels = {
    assigned: '<span class="status status--muted">Not started</span>',
    in_progress: '<span class="status status--info">In progress</span>',
    overdue: '<span class="status status--danger">Overdue</span>',
    awaiting_verification: '<span class="status status--warn">Awaiting verification</span>',
    verified: '<span class="status status--ok">Verified</span>',
  };
  openSlideover({
    title: t.title,
    body: `
      <div style="margin-bottom:18px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--bright);font-weight:700;margin-bottom:6px">${t.provider} · ${t.platform}</div>
        <div style="font-size:13px;color:var(--ink-500);line-height:1.6">${t.required ? 'Required training' : 'Optional training'}</div>
      </div>
      <div class="form-grid">
        <div class="field"><label class="field__label">State</label><div>${stateLabels[s]}</div></div>
        <div class="field"><label class="field__label">Assigned by</label><div style="font-size:13px;color:var(--ink-700)">${t.assignedBy}</div></div>
        <div class="field"><label class="field__label">Assigned on</label><div class="table__mono" style="font-size:12px;color:var(--ink-700)">${t.assignedOn}</div></div>
        <div class="field"><label class="field__label">Started on</label><div class="table__mono" style="font-size:12px;color:var(--ink-700)">${t.startedOn || "Not started"}</div></div>
        <div class="field"><label class="field__label">Deadline</label><div style="font-size:13px;color:var(--ink-700)">${t.dueDate || "Self-paced"}</div></div>
        ${t.extendedBy ? `<div class="field"><label class="field__label">Extension</label><div style="font-size:12px;color:var(--navy);font-weight:600">+${t.extendedBy.days} days by ${t.extendedBy.hr}</div></div>` : ""}
        ${t.certificate ? `<div class="field field--full"><label class="field__label">Certificate</label><div class="locked-file" style="margin-top:4px">${ICONS.lock}<div class="locked-file__main"><div class="locked-file__name">${t.certificate.filename}</div><div class="locked-file__meta">${t.certificate.size} · ${t.certificate.uploadedOn}</div></div></div></div>` : ""}
        ${t.verifiedBy ? `<div class="field field--full"><label class="field__label">Verified by</label><div style="font-size:13px;color:var(--ok);font-weight:600">${ICONS.check} ${t.verifiedBy} · ${t.verifiedOn}</div></div>` : ""}
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
        ${t.externalUrl && (s === "in_progress" || s === "overdue") ? `<button class="btn btn--primary">${ICONS.external} Open in ${t.platform}</button>` : ""}
      </div>`,
  });
}

// Confirm handlers — called from inline onclick in the slide-over
window.confirmStartTraining = function(id) {
  const t = DATA.myTrainings.find(x => x.id === id);
  if (!t) return;
  t.state = "in_progress";
  t.startedOn = "Today";
  closeSlideover();
  toast(`Started · countdown to ${t.dueDate || "self-paced"} began`);
  route();
};
window.confirmUploadCert = function(id) {
  const t = DATA.myTrainings.find(x => x.id === id);
  if (!t) return;
  t.state = "awaiting_verification";
  t.certificate = { filename: `${t.id.toLowerCase()}-certificate.pdf`, uploadedOn: "Just now", size: "298 KB", locked: true };
  closeSlideover();
  toast(`Certificate locked · HR notified for verification`);
  route();
};
window.confirmExtension = function(id) {
  closeSlideover();
  toast("Extension request sent to HR · you'll be notified within 1 business day");
};
window.confirmReupload = function(id) {
  closeSlideover();
  toast("Re-upload request sent to HR · you'll be notified when allowed");
};
window.closeSlideover = closeSlideover;

// =========================================================
// GLOBAL EVENTS
// =========================================================
function renderNotifDropdown() {
  // Merge cross-portal SUDO_DB notifications with local DATA.notifications.
  // SUDO_DB ones — generated when HR / TL / Admin take action — come first.
  const sudoNotifs = (window.SUDO_DB && Array.isArray(SUDO_DB.notifications))
    ? SUDO_DB.notifications.filter(n => !n.forEmpId || n.forEmpId === "E008").slice(0, 5)
    : [];
  const localNotifs = (DATA.notifications || []).slice(0, 5);
  const merged = [...sudoNotifs, ...localNotifs];
  $("#notif-body").innerHTML = merged.map(n => `
    <div class="notif ${n.unread ? "notif--unread" : ""}">
      <div class="notif__icon card__icon--${n.color || 'info'}">${ICONS[n.icon] || ICONS.bell || ""}</div>
      <div class="notif__main">
        <div class="notif__title">${n.title}</div>
        <div class="notif__desc">${n.desc || ''}</div>
        <div class="notif__time">${n.time || 'now'}</div>
      </div>
    </div>`).join("");

  // Update bell badge with live unread count
  const unread = merged.filter(n => n.unread).length;
  const badge = document.querySelector("#notif-btn .badge");
  if (badge) {
    if (unread > 0) { badge.textContent = unread > 99 ? "99+" : unread; badge.style.display = ""; }
    else { badge.style.display = "none"; }
  }
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

  $("#new-request-btn").addEventListener("click", () => {
    location.hash = "#requests";
  });

  $("#help-btn").addEventListener("click", () => {
    openSlideover({
      title: "Help & Support",
      list: [
        { name: "Contact HR", desc: "Submit a question via the HR Query form", meta: "→" },
        { name: "Employee Handbook", desc: "Policies, benefits, leave rules", meta: "→" },
        { name: "Tech Support", desc: "Portal not working as expected?", meta: "→" },
        { name: "Onboarding FAQ", desc: "Common questions during your first 90 days", meta: "→" },
      ],
    });
  });

  $("#role-switch-btn").addEventListener("click", () => {
    // For the employee, going "back" means signing out → welcome page where they can pick a role
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
SUDO_INIT("employee", () => {
  renderNotifDropdown();
  bindGlobalEvents();
  hydrateSidebarAvatar();
  route();
});

// Replace the sidebar's text-initials avatar with the user's uploaded photo
// if they have one saved. Falls back silently if no photo is set.
function hydrateSidebarAvatar() {
  try {
    const meId = (DATA && DATA.user && DATA.user.employeeId) || "E008";
    const photo = localStorage.getItem(`sudo:profile:photo:${meId}`);
    if (!photo) return;
    const av = document.querySelector(".role-switch .user-avatar");
    if (!av) return;
    av.innerHTML = `<img src="${photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`;
    av.style.padding = "0";
    av.style.overflow = "hidden";
  } catch (e) { /* localStorage unavailable — fine, keep initials */ }
}

// ── Role switcher — Reem is normally a regular employee, but if the Admin
// has granted her additional roles (via the Users page), the switcher lets
// her access those portals. Otherwise only shows up when someone is
// previewing in here from a higher role (?from=hr|pm|tl|admin in the URL).
if (window.RoleSwitcher) {
  const meId = "E008";  // Reem — the Employee demo user
  const myRoles = (window.SUDO_DB_OVERRIDES && SUDO_DB_OVERRIDES.getRoles)
    ? SUDO_DB_OVERRIDES.getRoles(meId)
    : ["employee"];
  RoleSwitcher.mount({
    currentRole: "employee",
    basePath: "..",
    hasMultipleRoles: myRoles.length > 1,
    userRoles: myRoles,
    userId: meId,
  });
}
