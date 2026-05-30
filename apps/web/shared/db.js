/**
 * ============================================================================
 *  SUDO Portal · Shared Local "Database"
 * ============================================================================
 *
 *  PURPOSE
 *  --------
 *  Centralised seed data for the prototype, loaded by every portal as a
 *  single global `window.SUDO_DB`. Each portal's dashboard.js reads from
 *  this object rather than carrying its own inline copy, so:
 *
 *    • Employees, leaves, trainings, projects, KPIs, ratings, badges,
 *      document types, doc requests and notification templates have ONE
 *      source of truth.
 *    • Historical data (past salaries, past leaves, past ratings, past
 *      KPI cycles, audit logs) lives next to the current data, in
 *      `.history` arrays. The data shape mirrors how a real backend would
 *      version-track those entities.
 *    • Adding seed data once (e.g. a new employee) makes them visible to
 *      HR, PM, TL, Admin, and Employee portals without per-portal edits.
 *
 *  ARCHITECTURE
 *  ------------
 *  This file is loaded BEFORE each portal's dashboard.js. It defines
 *  `window.SUDO_DB = { ... }` and exposes helper functions on
 *  `window.SUDO_DB_HELPERS = { ... }` for cross-cutting lookups.
 *
 *  Each portal's dashboard.js still has its OWN `DATA` reference for
 *  backwards compatibility — that `DATA` is just `window.SUDO_DB`
 *  (aliased at the top of the portal file). When code reads
 *  `DATA.employees`, it really reads `SUDO_DB.employees`.
 *
 *  PERSISTENCE (future)
 *  --------------------
 *  Today the data is in-memory: closing the browser tab resets state.
 *  A future iteration could mirror writes to localStorage so that
 *  approving a leave in HR's tab updates the count in another open
 *  tab. The structure here is already shaped for that — see the
 *  `mutations` helpers near the bottom.
 *
 *  HISTORICAL DATA PATTERN
 *  -----------------------
 *  Every long-lived entity that can change over time uses a
 *  `.history` sub-array:
 *
 *    employee.salary = {
 *      basic, housing, transport, ...,              // CURRENT values
 *      history: [                                   // PAST snapshots, newest first
 *        { effective: "2026-04-01", basic, gross, reason, approvedBy },
 *        { effective: "2025-04-01", basic, gross, reason, approvedBy },
 *        ...
 *      ]
 *    }
 *
 *  The current values are always the first entry of `.history` once
 *  history exists. UI code computes "previous → new" deltas by
 *  walking pairs in the history array.
 *
 *  Same pattern for: probation outcomes (history of monthly remarks),
 *  KPI cycles (cycle-by-cycle snapshots), project ratings (rating
 *  history per employee), training assignments (state transitions),
 *  and leave balances (year-by-year entitlement + carry-over).
 * ============================================================================
 */
(function (global) {
'use strict';

const SUDO_DB =

{
  user: { name: "Justine", role: "HR", email: "justine@sudoconsultants.com" },

  // -------- Dashboard cards --------
  kpiCards: [
    { id: "active-employees", title: "Active Employees", value: 147, delta: { dir: "up", text: "+4 this month" }, icon: "usersGroup", iconStyle: "navy", meta: "8 in onboarding · 139 confirmed" },
    { id: "in-onboarding", title: "In Onboarding", value: 8, bar: { pct: 64 }, barLabel: "Avg 64% complete", icon: "rocketAlt", iconStyle: "bright" },
    { id: "probation-due", title: "Probation Due", value: 3, delta: { dir: "down", text: "−1 vs last week" }, icon: "clock", iconStyle: "warn", meta: "Within next 14 days" },
    { id: "expiring-certs", title: "Expiring Certifications", value: 12, delta: { dir: "up", text: "+3 this week" }, icon: "award", iconStyle: "warn", meta: "Next 90 days · AWS focus" },
    { id: "expiring-visas", title: "Expiring Visas / IDs", value: 2, icon: "id", iconStyle: "danger", meta: "Action required" },
    { id: "training-compliance", title: "Training Compliance", value: 87, valueSub: "%", bar: { pct: 87, style: "ok" }, barLabel: "Above 80% target", icon: "check", iconStyle: "ok" },
    { id: "kpi-pending", title: "KPIs Pending Ack", value: 5, icon: "trending", iconStyle: "warn", meta: "2 overdue · 3 due this week" },
    { id: "pending-signatures", title: "Pending Signatures", value: 6, icon: "pen", iconStyle: "warn", meta: "3 confirmation letters" },
    { id: "open-requests", title: "Open HR Requests", value: 14, delta: { dir: "up", text: "+5 today" }, icon: "inbox", iconStyle: "bright", meta: "9 letters · 5 queries" },
    { id: "notifications-sent", title: "Notifications This Week", value: 326, delta: { dir: "flat", text: "84% read rate" }, icon: "bell", iconStyle: "navy", meta: "274 read · 52 unread" },
  ],

  onboardingFunnel: [
    { step: 1, name: "Mandatory Training", count: 2, pct: 14 },
    { step: 2, name: "Joiner Info Submission", count: 1, pct: 30 },
    { step: 3, name: "NEO + CPD", count: 2, pct: 42 },
    { step: 4, name: "Performance Tracking", count: 1, pct: 56 },
    { step: 5, name: "Monthly Feedback", count: 2, pct: 78 },
  ],

  attention: [
    { initials: "MW", name: "Marcus Wright", desc: "Probation review due in 3 days · PM endorsed", badge: "urgent", text: "Probation" },
    { initials: "PS", name: "Priya Sharma", desc: "Employment visa expires in 18 days · No renewal in progress", badge: "urgent", text: "Visa" },
    { initials: "NF", name: "Noor Faisal", desc: "Q2 KPIs · 2 days overdue acknowledgement", badge: "urgent", text: "KPI" },
    { initials: "BA", name: "Bilal Anwar", desc: "Q2 KPIs · 1 day overdue acknowledgement", badge: "urgent", text: "KPI" },
    { initials: "AR", name: "Ahmed Al Rashid", desc: "AWS Solutions Architect Pro expires in 8 days", badge: "soon", text: "Cert" },
    { initials: "DC", name: "Daniel Chen", desc: "Emirates ID expires in 27 days · Docs pending", badge: "soon", text: "ID" },
    { initials: "SM", name: "Sara Mitchell", desc: "Final probation feedback scheduled in 8 days", badge: "soon", text: "Probation" },
    { initials: "AK", name: "Aisha Khan", desc: "Onboarding KPIs due Friday", badge: "info", text: "KPI" },
  ],

  compliance: [
    { name: "Cloud Engineering", count: "27 / 28", pct: 96, style: "ok" },
    { name: "Advisory", count: "22 / 26", pct: 85, style: "ok" },
    { name: "Delivery / PM", count: "13 / 16", pct: 81, style: "ok" },
    { name: "People Operations", count: "4 / 5", pct: 80, style: "warn" },
    { name: "Pre-sales", count: "6 / 9", pct: 67, style: "warn" },
    { name: "Finance & Admin", count: "3 / 6", pct: 50, style: "danger" },
  ],

  activity: [
    { icon: "check", style: "ok", title: "Marcus Wright passed probation", desc: "Line Manager confirmed · CEO signature pending", time: "8m ago" },
    { icon: "upload", style: "info", title: "Priya Sharma uploaded AWS DevOps cert", desc: "Awaiting HR validation", time: "32m ago" },
    { icon: "send", style: "info", title: "Justine assigned 'KnowBe4 Security Awareness' to 12 employees", desc: "Cloud Engineering team · Due in 7 days", time: "1h ago" },
    { icon: "alert", style: "warn", title: "Visa expiry alert for Priya Sharma", desc: "18 days remaining · Notification sent", time: "2h ago" },
    { icon: "user", style: "info", title: "Reem Al Otaibi completed Step 3 — NEO + CPD", desc: "Onboarding now at 32%", time: "3h ago" },
    { icon: "pen", style: "info", title: "Sara Mitchell signed evaluation form", desc: "Forwarded to Line Manager", time: "4h ago" },
    { icon: "check", style: "ok", title: "12 training reminders auto-sent", desc: "Read by 8 employees so far", time: "6h ago" },
  ],

  notifications: [
    { title: "Probation review due", desc: "Marcus Wright · in 3 days", time: "Just now", unread: true, icon: "clock", color: "warn" },
    { title: "Visa expiring", desc: "Priya Sharma · 18 days remaining", time: "12m ago", unread: true, icon: "alert", color: "danger" },
    { title: "KPI acknowledgement overdue", desc: "Noor Faisal · 2 days overdue", time: "1h ago", unread: true, icon: "trending", color: "warn" },
    { title: "Document signed", desc: "Sara Mitchell signed evaluation form", time: "4h ago", unread: true, icon: "pen", color: "ok" },
    { title: "Certificate uploaded", desc: "Priya Sharma uploaded AWS DevOps Pro", time: "32m ago", unread: true, icon: "upload", color: "ok" },
    { title: "Onboarding step completed", desc: "Reem Al Otaibi reached 32%", time: "3h ago", unread: true, icon: "check", color: "ok" },
    { title: "New HR request", desc: "Ahmed Al Rashid requested salary certificate", time: "2h ago", unread: true, icon: "inbox", color: "info" },
  ],

  // ============================================================================
  //  TEAMS — 6 delivery teams + 1 PM team. HR is a role, not a team.
  // ============================================================================
  //  Each team has a Lead (operational owner, drafts KPIs) and a Manager
  //  (informational; appears on scorecard's "Reviewed by" line).
  //  Members are derived from `employees[].teamId` rather than stored here,
  //  so admin role/team changes apply via a single update.
  // ============================================================================
  teams: [
    { id: "ps",  name: "Professional Services", short: "PS",  color: "#2563eb", icon: "briefcase", leadEmpId: "E003", managerEmpId: "E018", description: "Cloud architecture, AWS advisory, client delivery" },
    { id: "ms",  name: "Managed Services",      short: "MS",  color: "#0891b2", icon: "shield",    leadEmpId: "E061", managerEmpId: "E062", description: "24×7 monitoring, incident response, automation" },
    { id: "it",  name: "IT Operations",         short: "IT",  color: "#7c3aed", icon: "cog",       leadEmpId: "E063", managerEmpId: "E064", description: "Internal IT, endpoint security, helpdesk" },
    { id: "mkt", name: "Marketing",             short: "MKT", color: "#db2777", icon: "megaphone", leadEmpId: "E065", managerEmpId: "E066", description: "Brand, content, demand-side marketing" },
    { id: "dg",  name: "Demand Generation",     short: "DG",  color: "#ea580c", icon: "trending",  leadEmpId: "E067", managerEmpId: "E068", description: "Outbound, SDR pipeline, MQL handoff" },
    { id: "sal", name: "Sales",                 short: "SAL", color: "#16a34a", icon: "chart",     leadEmpId: "E069", managerEmpId: "E070", description: "Account exec, deal closure, renewals" },
    { id: "pm",  name: "Project Management",    short: "PM",  color: "#475569", icon: "tasks",     leadEmpId: "E006", managerEmpId: "E071", description: "Project delivery, client engagement health" },
  ],

  // -------- Employees (master list) --------
  employees: [
    { id: "E001", name: "Ahmed Al Rashid", email: "ahmed.r@sudoconsultants.com", dept: "Cloud Engineering", title: "Solutions Architect", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-01-15", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E002", name: "Priya Sharma", email: "priya.s@sudoconsultants.com", dept: "Cloud Engineering", title: "DevOps Engineer", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-03-04", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E003", name: "Khalid Mansour", email: "khalid.m@sudoconsultants.com", dept: "Advisory", title: "Senior Consultant", lm: "—", pm: "—", status: "Confirmed", joined: "2023-09-18", progress: 100, teamId: "ps", teamRole: "lead" },
    { id: "E004", name: "Layla Ibrahim", email: "layla.i@sudoconsultants.com", dept: "People Operations", title: "HR Specialist", lm: "Justine", pm: "—", status: "Confirmed", joined: "2024-08-22", progress: 100, teamId: null, teamRole: "hr" },
    { id: "E005", name: "Tariq Hassan", email: "tariq.h@sudoconsultants.com", dept: "Cloud Engineering", title: "Cloud Engineer", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-02-10", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E006", name: "Fatima Al Zaabi", email: "fatima.z@sudoconsultants.com", dept: "Project Management", title: "Project Manager", lm: "—", pm: "—", status: "Confirmed", joined: "2023-06-01", progress: 100, teamId: "pm", teamRole: "lead" },
    { id: "E007", name: "Omar Siddiqui", email: "omar.s@sudoconsultants.com", dept: "Advisory", title: "Junior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-04-11", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E008", name: "Reem Al Otaibi", email: "reem.o@sudoconsultants.com", dept: "Cloud Engineering", title: "Cloud Engineer", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Onboarding", joined: "2026-04-01", progress: 32, teamId: "ps", teamRole: "member" },
    { id: "E009", name: "Daniel Chen", email: "daniel.c@sudoconsultants.com", dept: "Cloud Engineering", title: "Solutions Architect", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Onboarding", joined: "2026-03-15", progress: 44, teamId: "ps", teamRole: "member" },
    { id: "E010", name: "Aisha Khan", email: "aisha.k@sudoconsultants.com", dept: "Advisory", title: "Junior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Onboarding", joined: "2026-04-20", progress: 12, teamId: "ps", teamRole: "member" },
    { id: "E011", name: "Marcus Wright", email: "marcus.w@sudoconsultants.com", dept: "Cloud Engineering", title: "DevOps Engineer", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Onboarding", joined: "2026-01-08", progress: 78, teamId: "ps", teamRole: "member" },
    { id: "E012", name: "Noor Faisal", email: "noor.f@sudoconsultants.com", dept: "People Operations", title: "HR Officer", lm: "Justine", pm: "—", status: "Onboarding", joined: "2026-04-10", progress: 20, teamId: null, teamRole: "hr" },
    { id: "E013", name: "Bilal Anwar", email: "bilal.a@sudoconsultants.com", dept: "Cloud Engineering", title: "Cloud Engineer", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Onboarding", joined: "2026-03-25", progress: 32, teamId: "ps", teamRole: "member" },
    { id: "E014", name: "Sara Mitchell", email: "sara.m@sudoconsultants.com", dept: "Project Management", title: "Project Manager", lm: "Fatima Al Zaabi", pm: "—", status: "Onboarding", joined: "2026-02-01", progress: 82, teamId: "pm", teamRole: "member" },
    { id: "E015", name: "Yousef Karim", email: "yousef.k@sudoconsultants.com", dept: "Advisory", title: "Junior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Onboarding", joined: "2026-04-28", progress: 8, teamId: "ps", teamRole: "member" },
    // ── Bulk dummy data for realistic pagination (E016–E060) ────────────
    { id: "E016", name: "Ananya Sharma",     email: "ananya.s@sudoconsultants.com",    dept: "Cloud Engineering", title: "Senior Cloud Eng.", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-05-12", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E017", name: "Yan Zhang",         email: "yan.z@sudoconsultants.com",       dept: "Cloud Engineering", title: "Senior Cloud Eng.", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-02-18", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E018", name: "Karim Salah",       email: "karim.s@sudoconsultants.com",     dept: "Cloud Engineering", title: "Lead Engineer",     lm: "—",              pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2023-04-03", progress: 100, teamId: "ps", teamRole: "manager" },
    { id: "E019", name: "Hiba Al Khoury",    email: "hiba.k@sudoconsultants.com",      dept: "People Operations", title: "HR Officer",        lm: "Justine",        pm: "—",                status: "Confirmed", joined: "2024-09-22", progress: 100, teamId: null, teamRole: "hr" },
    { id: "E020", name: "Daniyal Habib",     email: "daniyal.h@sudoconsultants.com",   dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Sara Mitchell",    status: "Confirmed", joined: "2024-11-04", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E021", name: "Junaid Bashir",     email: "junaid.b@sudoconsultants.com",    dept: "Delivery",          title: "Project Manager",   lm: "—",              pm: "—",                status: "Confirmed", joined: "2024-07-30", progress: 100, teamId: "pm", teamRole: "member" },
    { id: "E022", name: "Lina Haddad",       email: "lina.h@sudoconsultants.com",      dept: "Cloud Engineering", title: "Senior Cloud Eng.", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-03-08", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E023", name: "Mariam Saleem",     email: "mariam.s@sudoconsultants.com",    dept: "Pre-sales",         title: "Solutions Consultant", lm: "Khalid Mansour", pm: "—",            status: "Onboarding", joined: "2026-05-02", progress: 6, teamId: "sal", teamRole: "member" },
    { id: "E024", name: "Hassan Bukhari",    email: "hassan.b@sudoconsultants.com",    dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Omar Siddiqui",    status: "Probation", joined: "2026-02-01", progress: 65, teamId: "ps", teamRole: "member" },
    { id: "E025", name: "Pierre Dubois",     email: "pierre.d@sudoconsultants.com",    dept: "Cloud Engineering", title: "Junior DevOps",     lm: "Khalid Mansour", pm: "Khalid Mansour",   status: "Probation", joined: "2026-03-10", progress: 42, teamId: "ps", teamRole: "member" },
    { id: "E026", name: "Sara Al Mansoori",  email: "sara.am@sudoconsultants.com",     dept: "Finance & Admin",   title: "Finance Officer",   lm: "Justine",        pm: "—",                status: "Confirmed", joined: "2024-06-18", progress: 100, teamId: null, teamRole: "admin" },
    { id: "E027", name: "Hamza Al Mahmoud",  email: "hamza.m@sudoconsultants.com",     dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-01-12", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E028", name: "Priya Iyer",        email: "priya.i@sudoconsultants.com",     dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-03-04", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E029", name: "Sami Berkani",      email: "sami.b@sudoconsultants.com",      dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Sara Mitchell",    status: "Confirmed", joined: "2025-05-19", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E030", name: "Tomás Rivera",      email: "tomas.r@sudoconsultants.com",     dept: "Cloud Engineering", title: "Junior Cloud Eng.", lm: "Khalid Mansour", pm: "Khalid Mansour",   status: "Probation", joined: "2026-02-18", progress: 38, teamId: "ps", teamRole: "member" },
    { id: "E031", name: "Maya Robinson",     email: "maya.r@sudoconsultants.com",      dept: "Cloud Engineering", title: "Junior Cloud Eng.", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Probation", joined: "2026-03-22", progress: 28, teamId: "ps", teamRole: "member" },
    { id: "E032", name: "Adeel Mahmood",     email: "adeel.m@sudoconsultants.com",     dept: "Advisory",          title: "Senior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-04-15", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E033", name: "Rania Awwad",       email: "rania.a@sudoconsultants.com",     dept: "Advisory",          title: "Junior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-06-08", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E034", name: "Ibrahim Naseer",    email: "ibrahim.n@sudoconsultants.com",   dept: "Cloud Engineering", title: "DevOps Engineer",   lm: "Khalid Mansour", pm: "Sara Mitchell",    status: "Confirmed", joined: "2024-12-01", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E035", name: "Eman Othman",       email: "eman.o@sudoconsultants.com",      dept: "People Operations", title: "Recruiter",         lm: "Justine",        pm: "—",                status: "Confirmed", joined: "2025-02-26", progress: 100, teamId: null, teamRole: "hr" },
    { id: "E036", name: "Anand Kapoor",      email: "anand.k@sudoconsultants.com",     dept: "Pre-sales",         title: "Solutions Consultant", lm: "Khalid Mansour", pm: "—",            status: "Confirmed", joined: "2024-10-11", progress: 100, teamId: "sal", teamRole: "member" },
    { id: "E037", name: "Salma Al Hadidi",   email: "salma.h@sudoconsultants.com",     dept: "Finance & Admin",   title: "Finance Officer",   lm: "Justine",        pm: "—",                status: "Confirmed", joined: "2025-04-22", progress: 100, teamId: null, teamRole: "admin" },
    { id: "E038", name: "Ravi Shankar",      email: "ravi.s@sudoconsultants.com",      dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-07-15", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E039", name: "Zaynab Sharif",     email: "zaynab.s@sudoconsultants.com",    dept: "Advisory",          title: "Junior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Onboarding", joined: "2026-04-15", progress: 24, teamId: "ps", teamRole: "member" },
    { id: "E040", name: "Mohammed Aslam",    email: "mohammed.a@sudoconsultants.com",  dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Sara Mitchell",    status: "Confirmed", joined: "2025-09-08", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E041", name: "Nadia El Sayed",    email: "nadia.e@sudoconsultants.com",     dept: "Delivery",          title: "Project Coordinator", lm: "Fatima Al Zaabi", pm: "—",             status: "Confirmed", joined: "2024-11-19", progress: 100, teamId: "pm", teamRole: "member" },
    { id: "E042", name: "Faisal Hashmi",     email: "faisal.h@sudoconsultants.com",    dept: "Cloud Engineering", title: "DevOps Engineer",   lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-08-05", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E043", name: "Reema Joshi",       email: "reema.j@sudoconsultants.com",     dept: "Advisory",          title: "Junior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-08-14", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E044", name: "Tariq Al Nabhani",  email: "tariq.n@sudoconsultants.com",     dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-10-22", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E045", name: "Sundus Kazmi",      email: "sundus.k@sudoconsultants.com",    dept: "People Operations", title: "HR Specialist",     lm: "Justine",        pm: "—",                status: "Confirmed", joined: "2024-04-30", progress: 100, teamId: null, teamRole: "hr" },
    { id: "E046", name: "Vikram Reddy",      email: "vikram.r@sudoconsultants.com",    dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Sara Mitchell",    status: "Confirmed", joined: "2025-11-04", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E047", name: "Layan Mubarak",     email: "layan.m@sudoconsultants.com",     dept: "Pre-sales",         title: "Solutions Consultant", lm: "Khalid Mansour", pm: "—",            status: "Confirmed", joined: "2024-07-08", progress: 100, teamId: "sal", teamRole: "member" },
    { id: "E048", name: "Imran Qureshi",     email: "imran.q@sudoconsultants.com",     dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-12-15", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E049", name: "Aisha Bourhan",     email: "aisha.b@sudoconsultants.com",     dept: "Advisory",          title: "Senior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-02-09", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E050", name: "Diego Fernandez",   email: "diego.f@sudoconsultants.com",     dept: "Cloud Engineering", title: "DevOps Engineer",   lm: "Khalid Mansour", pm: "Sara Mitchell",    status: "Confirmed", joined: "2025-01-28", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E051", name: "Houda Bensalem",    email: "houda.b@sudoconsultants.com",     dept: "Finance & Admin",   title: "Accountant",        lm: "Justine",        pm: "—",                status: "Confirmed", joined: "2024-09-04", progress: 100, teamId: null, teamRole: "admin" },
    { id: "E052", name: "Arjun Mehta",       email: "arjun.m@sudoconsultants.com",     dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Onboarding", joined: "2026-04-25", progress: 14, teamId: "ps", teamRole: "member" },
    { id: "E053", name: "Yara Khalil",       email: "yara.k@sudoconsultants.com",      dept: "People Operations", title: "L&D Specialist",    lm: "Justine",        pm: "—",                status: "Confirmed", joined: "2024-12-17", progress: 100, teamId: null, teamRole: "hr" },
    { id: "E054", name: "Bilal Anwar",       email: "bilal.a2@sudoconsultants.com",    dept: "Delivery",          title: "Project Coordinator", lm: "Fatima Al Zaabi", pm: "—",             status: "Confirmed", joined: "2025-05-30", progress: 100, teamId: "pm", teamRole: "member" },
    { id: "E055", name: "Hala Ramadan",      email: "hala.r@sudoconsultants.com",      dept: "Advisory",          title: "Senior Consultant", lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2024-06-22", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E056", name: "Sebastian Wagner",  email: "seb.w@sudoconsultants.com",       dept: "Cloud Engineering", title: "Senior Cloud Eng.", lm: "Khalid Mansour", pm: "Sara Mitchell",    status: "Confirmed", joined: "2025-08-01", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E057", name: "Mariama Diallo",    email: "mariama.d@sudoconsultants.com",   dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-11-18", progress: 100, teamId: "ps", teamRole: "member" },
    { id: "E058", name: "Rohan Bhatt",       email: "rohan.b@sudoconsultants.com",     dept: "Pre-sales",         title: "Solutions Consultant", lm: "Khalid Mansour", pm: "—",            status: "Confirmed", joined: "2024-08-25", progress: 100, teamId: "sal", teamRole: "member" },
    { id: "E059", name: "Salma El Idrissi",  email: "salma.i@sudoconsultants.com",     dept: "Finance & Admin",   title: "Senior Accountant", lm: "Justine",        pm: "—",                status: "Confirmed", joined: "2024-03-19", progress: 100, teamId: null, teamRole: "admin" },
    { id: "E060", name: "Karthik Raman",     email: "karthik.r@sudoconsultants.com",   dept: "Cloud Engineering", title: "Cloud Engineer",    lm: "Khalid Mansour", pm: "Fatima Al Zaabi", status: "Confirmed", joined: "2025-09-30", progress: 100, teamId: "ps",  teamRole: "member" },
    // ── New team leadership (introduced for 7-team structure) ───────────
    { id: "E061", name: "Awais Khan",         email: "awais.k@sudoconsultants.com",      dept: "Managed Services",      title: "Lead, Managed Services",        lm: "Danish Ghauri",    pm: "—",                status: "Confirmed", joined: "2023-02-14", progress: 100, teamId: "ms",  teamRole: "lead" },
    { id: "E062", name: "Danish Ghauri",      email: "danish.g@sudoconsultants.com",     dept: "Managed Services",      title: "Manager, Managed Services",     lm: "—",                pm: "—",                status: "Confirmed", joined: "2022-08-10", progress: 100, teamId: "ms",  teamRole: "manager" },
    { id: "E063", name: "Hassan Iqbal",       email: "hassan.i@sudoconsultants.com",     dept: "IT Operations",          title: "Lead, IT Operations",           lm: "Zainab Qureshi",   pm: "—",                status: "Confirmed", joined: "2023-05-22", progress: 100, teamId: "it",  teamRole: "lead" },
    { id: "E064", name: "Zainab Qureshi",     email: "zainab.q@sudoconsultants.com",     dept: "IT Operations",          title: "Manager, IT Operations",        lm: "—",                pm: "—",                status: "Confirmed", joined: "2022-11-04", progress: 100, teamId: "it",  teamRole: "manager" },
    { id: "E065", name: "Maya Singh",         email: "maya.s@sudoconsultants.com",       dept: "Marketing",              title: "Lead, Marketing",                lm: "Rashed Al Maktoum", pm: "—",                status: "Confirmed", joined: "2023-07-19", progress: 100, teamId: "mkt", teamRole: "lead" },
    { id: "E066", name: "Rashed Al Maktoum",  email: "rashed.m@sudoconsultants.com",     dept: "Marketing",              title: "Manager, Marketing",             lm: "—",                pm: "—",                status: "Confirmed", joined: "2022-04-15", progress: 100, teamId: "mkt", teamRole: "manager" },
    { id: "E067", name: "Imran Sheikh",       email: "imran.s@sudoconsultants.com",      dept: "Demand Generation",      title: "Lead, Demand Generation",       lm: "Nadia Hosseini",   pm: "—",                status: "Confirmed", joined: "2023-10-12", progress: 100, teamId: "dg",  teamRole: "lead" },
    { id: "E068", name: "Nadia Hosseini",     email: "nadia.h@sudoconsultants.com",      dept: "Demand Generation",      title: "Manager, Demand Generation",     lm: "—",                pm: "—",                status: "Confirmed", joined: "2022-12-01", progress: 100, teamId: "dg",  teamRole: "manager" },
    { id: "E069", name: "Tariq Al Saud",      email: "tariq.alsaud@sudoconsultants.com", dept: "Sales",                  title: "Lead, Sales",                    lm: "Hala Al Rashidi",  pm: "—",                status: "Confirmed", joined: "2023-03-08", progress: 100, teamId: "sal", teamRole: "lead" },
    { id: "E070", name: "Hala Al Rashidi",    email: "hala.r@sudoconsultants.com",       dept: "Sales",                  title: "Manager, Sales",                 lm: "—",                pm: "—",                status: "Confirmed", joined: "2022-06-20", progress: 100, teamId: "sal", teamRole: "manager" },
    { id: "E071", name: "Yasmin Al Jaber",    email: "yasmin.j@sudoconsultants.com",     dept: "Project Management",     title: "Manager, Project Management",    lm: "—",                pm: "—",                status: "Confirmed", joined: "2022-09-05", progress: 100, teamId: "pm",  teamRole: "manager" },
    // ── MS team members ────────────────────────────────────────────────
    { id: "E072", name: "Bilal Tariq",        email: "bilal.t@sudoconsultants.com",      dept: "Managed Services",      title: "Senior Cloud Eng. (MS)",         lm: "Awais Khan",       pm: "—",                status: "Confirmed", joined: "2024-04-02", progress: 100, teamId: "ms",  teamRole: "member" },
    { id: "E073", name: "Sana Mirza",         email: "sana.m@sudoconsultants.com",       dept: "Managed Services",      title: "DevOps Engineer (MS)",           lm: "Awais Khan",       pm: "—",                status: "Confirmed", joined: "2024-08-11", progress: 100, teamId: "ms",  teamRole: "member" },
    { id: "E074", name: "Faisal Mehmood",     email: "faisal.m@sudoconsultants.com",     dept: "Managed Services",      title: "Junior Cloud/DevOps Eng. (MS)",  lm: "Awais Khan",       pm: "—",                status: "Confirmed", joined: "2025-01-13", progress: 100, teamId: "ms",  teamRole: "member" },
    { id: "E075", name: "Ameer Hamza",        email: "ameer.h@sudoconsultants.com",      dept: "Managed Services",      title: "Junior Cloud/DevOps Eng. (MS)",  lm: "Awais Khan",       pm: "—",                status: "Probation", joined: "2025-09-12", progress: 100, teamId: "ms",  teamRole: "member" },
    { id: "E076", name: "Hina Akram",         email: "hina.a@sudoconsultants.com",       dept: "Managed Services",      title: "Cloud Engineer (MS)",            lm: "Awais Khan",       pm: "—",                status: "Confirmed", joined: "2024-11-06", progress: 100, teamId: "ms",  teamRole: "member" },
    { id: "E077", name: "Usman Riaz",         email: "usman.r@sudoconsultants.com",      dept: "Managed Services",      title: "Cloud Engineer (MS)",            lm: "Awais Khan",       pm: "—",                status: "Confirmed", joined: "2025-04-17", progress: 100, teamId: "ms",  teamRole: "member" },
    // ── IT Ops members ─────────────────────────────────────────────────
    { id: "E078", name: "Saif Al Mazrouei",   email: "saif.m@sudoconsultants.com",       dept: "IT Operations",          title: "Systems Administrator",          lm: "Hassan Iqbal",     pm: "—",                status: "Confirmed", joined: "2024-02-26", progress: 100, teamId: "it",  teamRole: "member" },
    { id: "E079", name: "Rabia Tariq",        email: "rabia.t@sudoconsultants.com",      dept: "IT Operations",          title: "Helpdesk Engineer",              lm: "Hassan Iqbal",     pm: "—",                status: "Confirmed", joined: "2024-06-04", progress: 100, teamId: "it",  teamRole: "member" },
    { id: "E080", name: "Khaled Bouazizi",    email: "khaled.b@sudoconsultants.com",     dept: "IT Operations",          title: "Endpoint Security Eng.",         lm: "Hassan Iqbal",     pm: "—",                status: "Confirmed", joined: "2025-03-22", progress: 100, teamId: "it",  teamRole: "member" },
    // ── Marketing members ──────────────────────────────────────────────
    { id: "E081", name: "Eman Al Tamimi",     email: "eman.t@sudoconsultants.com",       dept: "Marketing",              title: "Content Strategist",             lm: "Maya Singh",       pm: "—",                status: "Confirmed", joined: "2024-01-30", progress: 100, teamId: "mkt", teamRole: "member" },
    { id: "E082", name: "Fadi Haddad",        email: "fadi.h@sudoconsultants.com",       dept: "Marketing",              title: "Brand Designer",                 lm: "Maya Singh",       pm: "—",                status: "Confirmed", joined: "2024-07-23", progress: 100, teamId: "mkt", teamRole: "member" },
    { id: "E083", name: "Layla Murad",        email: "layla.murad@sudoconsultants.com",  dept: "Marketing",              title: "Marketing Specialist",           lm: "Maya Singh",       pm: "—",                status: "Confirmed", joined: "2025-02-05", progress: 100, teamId: "mkt", teamRole: "member" },
    // ── Demand Generation members ──────────────────────────────────────
    { id: "E084", name: "Tariq Belkacem",     email: "tariq.b@sudoconsultants.com",      dept: "Demand Generation",      title: "SDR · Outbound",                 lm: "Imran Sheikh",     pm: "—",                status: "Confirmed", joined: "2024-09-16", progress: 100, teamId: "dg",  teamRole: "member" },
    { id: "E085", name: "Mariam Boutros",     email: "mariam.b@sudoconsultants.com",     dept: "Demand Generation",      title: "BDR · Inbound",                  lm: "Imran Sheikh",     pm: "—",                status: "Confirmed", joined: "2024-12-09", progress: 100, teamId: "dg",  teamRole: "member" },
    { id: "E086", name: "Ali Nazari",         email: "ali.n@sudoconsultants.com",        dept: "Demand Generation",      title: "Pipeline Analyst",               lm: "Imran Sheikh",     pm: "—",                status: "Onboarding", joined: "2026-04-15", progress: 40, teamId: "dg",  teamRole: "member" },
    // ── Sales members ──────────────────────────────────────────────────
    { id: "E087", name: "Khalifa Al Nahyan",  email: "khalifa.n@sudoconsultants.com",    dept: "Sales",                  title: "Account Executive",              lm: "Tariq Al Saud",    pm: "—",                status: "Confirmed", joined: "2024-03-11", progress: 100, teamId: "sal", teamRole: "member" },
    { id: "E088", name: "Layan Khalil",       email: "layan.k@sudoconsultants.com",      dept: "Sales",                  title: "Account Executive",              lm: "Tariq Al Saud",    pm: "—",                status: "Confirmed", joined: "2024-08-28", progress: 100, teamId: "sal", teamRole: "member" },
    { id: "E089", name: "Salah Ben Youssef",  email: "salah.y@sudoconsultants.com",      dept: "Sales",                  title: "Renewals Specialist",            lm: "Tariq Al Saud",    pm: "—",                status: "Confirmed", joined: "2025-05-19", progress: 100, teamId: "sal", teamRole: "member" },
  ],

  // Full profiles keyed by employee ID. Only "rich" demo employees are populated;
  // a fallback is computed on the fly for others (so HR can still open a detail view).
  fullProfiles: {
    "E001": {  // Ahmed Al Rashid — long-tenure Cloud Engineering anchor
      personal: { fullName: "Ahmed Tariq Al Rashid", dob: "1989-07-22", nationality: "UAE", gender: "Male", marital: "Married", religion: "Muslim", languages: "Arabic, English" },
      contact: { personalEmail: "ahmed.rashid.uae@gmail.com", phone: "+971 50 ●●● 1102", addressLine: "The Greens, Block 4, Apt 805", city: "Dubai", emergencyName: "Mariam Al Rashid", emergencyRel: "Spouse", emergencyPhone: "+971 50 ●●● 1103" },
      identity: { emiratesId: "784-1989-●●●●●●●-2", emiratesIdExpiry: "2027-07-31", passportNo: "P●●●●●●1", passportCountry: "UAE", passportExpiry: "2031-04-18", visaType: "Employment Residence", visaExpiry: "2027-07-31" },
      banking: { bankName: "First Abu Dhabi Bank", iban: "AE12 ●●●● ●●●● ●●●● ●●02 7", holder: "Ahmed Al Rashid", accountType: "Salary Account" },
      salary: { basic: 18500, housing: 7000, transport: 2000, other: 1500, currency: "AED", effective: "2026-01-15", nextReview: "2027-01-15", cycle: "Monthly · last working day",
        history: [
          { effective: "2026-01-15", basic: 18500, gross: 29000, reason: "Annual increment + Solutions Architect promotion",         note: "Promoted from Senior Cloud Engineer · 11% gross increase",          approvedBy: "Justine (HR) · M. Farooq (Admin) co-signed" },
          { effective: "2025-01-15", basic: 16500, gross: 26000, reason: "Annual increment",                                          note: "Performance-based · KPI score 89/100 in 2024",                       approvedBy: "Justine (HR)" },
          { effective: "2024-07-15", basic: 15000, gross: 24000, reason: "Mid-year market adjustment",                                note: "Salary calibration after Tier-1 partner certification",              approvedBy: "Justine (HR)" },
          { effective: "2024-01-15", basic: 14000, gross: 22500, reason: "Initial offer · joining package",                          note: "Joined as Senior Cloud Engineer from Bank-of-Sky",                   approvedBy: "M. Farooq (Admin)" },
        ]
      },
      family: { spouse: { name: "Mariam Al Rashid", dob: "1991-03-10" }, children: [{ name: "Layla", dob: "2018-05-22" }, { name: "Yusuf", dob: "2021-11-04" }] },
      insurance: { provider: "Daman Premium", tier: "Tier 1 · Comprehensive + Family", policyNo: "DPS-2024-●●●●●-1102", validUntil: "2027-01-14", coverage: "Inpatient + Outpatient + Maternity + Dental + Vision", family: [{ name: "Mariam Al Rashid", rel: "Spouse" }, { name: "Layla Al Rashid", rel: "Child" }, { name: "Yusuf Al Rashid", rel: "Child" }] },
      airTickets: { cycle: "Annual", ticketsPerCycle: 4, class: "Economy", route: "Dubai (DXB) ↔ Manama (BAH)", coversFamily: true, used: 4, remaining: 0, history: [{ date: "2025-12-20", route: "DXB → BAH → DXB × 4", amount: 4280, currency: "AED", status: "Reimbursed" }, { date: "2024-08-04", route: "DXB → BAH → DXB × 4", amount: 3960, currency: "AED", status: "Reimbursed" }] },
      tag: { label: "Senior Anchor", grantedBy: "Khalid Mansour (TL)", grantedOn: "Apr 2026", reason: "Consistent 4★+ ratings across 6 cycles · informal mentor to 4 junior engineers" },
      audit: [
        { actor: "Justine (HR)",       action: "Applied salary increment · gross +11.5% on promotion",  time: "15 Jan 2026" },
        { actor: "Justine (HR)",       action: "Promoted: Senior Cloud Engineer → Solutions Architect", time: "15 Jan 2026" },
        { actor: "Fatima Al Zaabi (PM)", action: "Filed Q4 2025 project rating · 4.6 stars (Client-Alpha)", time: "20 Dec 2025" },
        { actor: "Khalid Mansour (TL)",  action: "Granted tag · Senior Anchor",                          time: "10 Apr 2026" },
        { actor: "System",             action: "Synced from ODOO · employee record",                    time: "15 Jan 2024" },
      ],
    },
    "E008": {  // Reem Al Otaibi — our demo lead
      personal: { fullName: "Reem Khalid Al Otaibi", dob: "1996-03-12", nationality: "UAE", gender: "Female", marital: "Single", religion: "Muslim", languages: "Arabic, English" },
      contact: { personalEmail: "reem.k.otaibi@gmail.com", phone: "+971 50 ●●● 4218", addressLine: "Marina Heights, Building 4", city: "Dubai", emergencyName: "Khalid Al Otaibi", emergencyRel: "Father", emergencyPhone: "+971 50 ●●● 7741" },
      identity: { emiratesId: "784-1996-●●●●●●●-1", emiratesIdExpiry: "2028-03-31", passportNo: "P●●●●●●5", passportCountry: "UAE", passportExpiry: "2030-08-14", visaType: "Employment Residence", visaExpiry: "2028-03-31" },
      banking: { bankName: "Emirates NBD", iban: "AE07 ●●●● ●●●● ●●●● ●●41 8", holder: "Reem Al Otaibi", accountType: "Salary Account" },
      salary: { basic: 12500, housing: 5000, transport: 1500, other: 0, currency: "AED", effective: "2026-04-01", nextReview: "2027-04-01", cycle: "Monthly · last working day",
        history: [
          { effective: "2026-04-01", basic: 12500, gross: 19000, reason: "Annual increment + AWS SA-A cert recognition", note: "8% basic increase · housing allowance +500", approvedBy: "Justine (HR)" },
          { effective: "2025-04-01", basic: 11500, gross: 17500, reason: "Annual increment",                                 note: "Performance-based · KPI score 88/100",  approvedBy: "Justine (HR)" },
          { effective: "2024-10-01", basic: 10500, gross: 15500, reason: "Confirmation increment",                          note: "Post-probation confirmation · automatic",approvedBy: "Justine (HR)" },
          { effective: "2024-04-01", basic: 9500,  gross: 13500, reason: "Initial offer · joining package",                  note: "Joining salary as per offer letter",     approvedBy: "M. Farooq (Admin)" },
        ]
      },
      family: { spouse: null, children: [] },
      insurance: { provider: "Daman Premium", tier: "Tier 2 · Comprehensive", policyNo: "DPS-2026-●●●●●-4218", validUntil: "2027-03-31", coverage: "Inpatient + Outpatient + Maternity + Dental (limited)", family: [] },
      airTickets: { cycle: "Annual", ticketsPerCycle: 1, class: "Economy", route: "Dubai (DXB) ↔ Riyadh (RUH)", coversFamily: false, used: 0, remaining: 1, history: [{ date: "2025-08-12", route: "DXB → RUH → DXB", amount: 1820, currency: "AED", status: "Reimbursed" }, { date: "2024-09-04", route: "DXB → RUH → DXB", amount: 1240, currency: "AED", status: "Reimbursed" }] },
      tag: { label: "Rising Star", grantedBy: "Fatima Al Zaabi (PM)", grantedOn: "Yesterday", reason: "Outstanding documentation contributions in first 6 weeks" },
      audit: [
        { actor: "Justine (HR)", action: "Approved leave LV-2026-007", time: "20 Apr 2026" },
        { actor: "Justine (HR)", action: "Verified training certificate · AWS Cloud Practitioner", time: "9 Apr 2026" },
        { actor: "System", action: "Synced from ODOO · employee record", time: "1 Apr 2026" },
        { actor: "Justine (HR)", action: "Assigned KPIs · Q2 2026 cycle", time: "1 Apr 2026" },
      ],
    },
    "E011": {  // Marcus Wright — probation candidate
      personal: { fullName: "Marcus Daniel Wright", dob: "1992-11-08", nationality: "UK", gender: "Male", marital: "Married", religion: "—", languages: "English" },
      contact: { personalEmail: "marcus.d.wright@gmail.com", phone: "+971 50 ●●● 6677", addressLine: "JLT, Cluster H, Apt 1801", city: "Dubai", emergencyName: "Sarah Wright", emergencyRel: "Spouse", emergencyPhone: "+971 50 ●●● 6678" },
      identity: { emiratesId: "784-1992-●●●●●●●-3", emiratesIdExpiry: "2028-01-08", passportNo: "X●●●●●●2", passportCountry: "UK", passportExpiry: "2029-06-22", visaType: "Employment Residence", visaExpiry: "2028-01-08" },
      banking: { bankName: "HSBC UAE", iban: "AE12 ●●●● ●●●● ●●●● ●●77 4", holder: "Marcus Daniel Wright", accountType: "Salary Account" },
      salary: { basic: 16000, housing: 6000, transport: 1500, other: 1000, currency: "AED", effective: "2026-01-08", nextReview: "2027-01-08", cycle: "Monthly · last working day",
        history: [
          { effective: "2026-01-08", basic: 16000, gross: 24500, reason: "Initial offer · joining package", note: "Senior hire · DevOps Engineer", approvedBy: "M. Farooq (Admin)" },
        ]
      },
      family: { spouse: { name: "Sarah Wright", dob: "1993-05-19", visa: "Dependent visa (sponsored)", visaExpiry: "2028-01-08" }, children: [] },
      insurance: { provider: "Daman Premium", tier: "Tier 1 · Premium", policyNo: "DPS-2026-●●●●●-6677", validUntil: "2027-01-07", coverage: "Inpatient + Outpatient + Maternity + Dental + Optical", family: [{ name: "Sarah Wright", relation: "Spouse", policyNo: "DPS-2026-●●●●●-6678", tier: "Tier 1 · Premium" }] },
      airTickets: { cycle: "Annual", ticketsPerCycle: 2, class: "Economy", route: "Dubai (DXB) ↔ London (LHR)", coversFamily: true, used: 1, remaining: 1, history: [{ date: "2025-12-18", route: "DXB → LHR → DXB", amount: 2400, currency: "AED", status: "Reimbursed" }] },
      tag: null,
      audit: [
        { actor: "Justine (HR)", action: "Assigned mandatory trainings", time: "10 Jan 2026" },
        { actor: "System", action: "Synced from ODOO · employee record", time: "8 Jan 2026" },
        { actor: "Justine (HR)", action: "Set probation review for 8 Apr 2026", time: "8 Jan 2026" },
      ],
    },
  },

  // -------- Training catalogue --------
  trainings: [
    { id: "T001", title: "AWS Cloud Practitioner Essentials", provider: "AWS", duration: "6 hrs", required: "All technical", enrolled: 42, completion: 91 },
    { id: "T002", title: "AWS Solutions Architect Associate", provider: "AWS", duration: "30 hrs", required: "SA track", enrolled: 18, completion: 67 },
    { id: "T003", title: "AWS DevOps Engineer Professional", provider: "AWS", duration: "40 hrs", required: "DevOps", enrolled: 9, completion: 56 },
    { id: "T004", title: "AWS Sales Accreditation", provider: "AWS", duration: "2 hrs", required: "All", enrolled: 147, completion: 88 },
    { id: "T005", title: "AWS Cloud Economics", provider: "AWS", duration: "3 hrs", required: "All", enrolled: 147, completion: 84 },
    { id: "T006", title: "AWS Well-Architected Framework", provider: "AWS", duration: "5 hrs", required: "All technical", enrolled: 47, completion: 79 },
    { id: "T007", title: "AWS Generative AI Essentials", provider: "AWS", duration: "4 hrs", required: "All", enrolled: 89, completion: 62 },
    { id: "T008", title: "AWS Cybersecurity Awareness", provider: "AWS", duration: "2 hrs", required: "All", enrolled: 147, completion: 93 },
    { id: "T009", title: "Security Awareness Training", provider: "KnowBe4", duration: "1 hr", required: "All", enrolled: 147, completion: 97 },
    { id: "T010", title: "SUDO Profile Training", provider: "Internal", duration: "1.5 hrs", required: "All new joiners", enrolled: 12, completion: 75 },
    { id: "T011", title: "Terraform Associate Prep", provider: "HashiCorp", duration: "20 hrs", required: "DevOps recommended", enrolled: 6, completion: 50 },
    { id: "T012", title: "AWS Security Specialty", provider: "AWS", duration: "35 hrs", required: "Optional", enrolled: 3, completion: 33 },
  ],

  // -------- Training Verification Queue --------
  // Employees uploaded certificates that HR needs to sign off on. Once verified,
  // the training is "closed" for that employee. Trust-but-verify model.
  pendingVerifications: [
    {
      id: "V001",
      employee: "Reem Al Otaibi", initials: "RO", dept: "Cloud Engineering",
      training: "AWS Cloud Economics", trainingId: "T005",
      provider: "AWS", platform: "AWS Skill Builder",
      certFile: "aws-cloud-economics-cert.pdf", size: "342 KB",
      uploadedAt: "Yesterday, 16:08", deadline: "2026-04-26", daysSinceUpload: 1,
    },
    {
      id: "V002",
      employee: "Daniel Chen", initials: "DC", dept: "Cloud Engineering",
      training: "AWS Sales Accreditation", trainingId: "T004",
      provider: "AWS", platform: "AWS Partner Central",
      certFile: "sales-accreditation-2026.pdf", size: "287 KB",
      uploadedAt: "2 hours ago", deadline: "2026-05-15", daysSinceUpload: 0,
    },
    {
      id: "V003",
      employee: "Aisha Khan", initials: "AK", dept: "Advisory",
      training: "KnowBe4 Security Awareness", trainingId: "T009",
      provider: "KnowBe4", platform: "KnowBe4 LMS",
      certFile: "knowbe4-security-2026.pdf", size: "198 KB",
      uploadedAt: "Today, 09:42", deadline: "2026-05-18", daysSinceUpload: 0,
    },
    {
      id: "V004",
      employee: "Bilal Anwar", initials: "BA", dept: "Cloud Engineering",
      training: "AWS Cloud Practitioner Essentials", trainingId: "T001",
      provider: "AWS", platform: "AWS Skill Builder",
      certFile: "aws-cp-essentials-2026.pdf", size: "311 KB",
      uploadedAt: "3 days ago", deadline: "2026-05-08", daysSinceUpload: 3,
      overdueVerification: true,
    },
  ],

  // Employees asking to be allowed to replace their already-locked certificate.
  pendingReuploadRequests: [
    {
      id: "RU001",
      employee: "Priya Sharma", initials: "PS", dept: "Cloud Engineering",
      training: "AWS Well-Architected Framework", trainingId: "T006",
      provider: "AWS", platform: "AWS Skill Builder",
      lockedFile: "aws-well-architected.pdf",
      requestedAt: "1 day ago",
      reason: "Uploaded the wrong PDF — was an old 2025 cert. Correct one is the 2026 version completed last week.",
    },
    {
      id: "RU002",
      employee: "Marcus Wright", initials: "MW", dept: "Cloud Engineering",
      training: "KnowBe4 Security Awareness", trainingId: "T009",
      provider: "KnowBe4", platform: "KnowBe4 LMS",
      lockedFile: "knowbe4-2025-old.pdf",
      requestedAt: "4 hours ago",
      reason: "Original cert was redacted incorrectly. AWS team asked for a non-redacted copy for partner submission.",
    },
  ],

  // Employees requesting more time on a deadline they may miss.
  pendingExtensionRequests: [
    {
      id: "EX001",
      employee: "Noor Faisal", initials: "NF", dept: "People Operations",
      training: "AWS Solutions Architect Associate", trainingId: "T002",
      provider: "AWS", platform: "AWS Skill Builder",
      currentDue: "2026-05-19", requestedDays: 14,
      requestedAt: "Yesterday",
      reason: "Exam slot at AWS testing centre fully booked for next 2 weeks. Have booked the earliest slot.",
    },
    {
      id: "EX002",
      employee: "Yousef Karim", initials: "YK", dept: "Advisory",
      training: "SUDO Profile Training", trainingId: "T010",
      provider: "Internal", platform: "SUDO Portal",
      currentDue: "2026-05-15", requestedDays: 7,
      requestedAt: "Today, 11:14",
      reason: "Was assigned to a client engagement last-minute and lost training time. Will complete this week.",
    },
  ],

  // Active training assignments shown on the Assign Trainings page — used so HR
  // can extend deadlines from there too.
  activeAssignments: [
    { trainingId: "T002", training: "AWS Solutions Architect Associate", scope: "SA track · 18 employees", assignedOn: "2026-04-10", due: "2026-05-19", inProgress: 12, awaiting: 0, verified: 6, overdue: 0 },
    { trainingId: "T009", training: "KnowBe4 Security Awareness", scope: "Company-wide · 147 employees", assignedOn: "2026-05-01", due: "2026-05-19", inProgress: 89, awaiting: 12, verified: 38, overdue: 8 },
    { trainingId: "T010", training: "SUDO Profile Training", scope: "All new joiners · 12 employees", assignedOn: "2026-04-15", due: "2026-05-15", inProgress: 5, awaiting: 2, verified: 4, overdue: 1 },
    { trainingId: "T005", training: "AWS Cloud Economics", scope: "Company-wide · 147 employees", assignedOn: "2026-04-01", due: "2026-04-26", inProgress: 22, awaiting: 1, verified: 124, overdue: 0 },
  ],

  // -------- Leave Approvals Queue --------
  leaveApprovals: [
    // === 2026 ===
    { id:"LV-2026-008", emp:"Reem Al Otaibi",    empId:"E008", type:"Annual Paid",  from:"2026-05-26", to:"2026-05-28", days:3, status:"pending_pm", pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Family event" },
    { id:"LV-2026-007", emp:"Marcus Wright",     empId:"E011", type:"Annual Paid",  from:"2026-06-02", to:"2026-06-06", days:5, status:"pending_hr", pm:"Sara Mitchell",    tl:"Khalid Mansour", priority:"normal", reason:"Wedding" },
    { id:"LV-2026-006", emp:"Daniyal Habib",     empId:"E024", type:"Sick",         from:"2026-05-13", to:"2026-05-14", days:2, status:"pending_hr", pm:"Khalid Mansour",   tl:"Khalid Mansour", priority:"normal", reason:"Medical certificate attached" },
    { id:"LV-2026-005", emp:"Tomás Rivera",      empId:"E032", type:"Compassionate",from:"2026-05-15", to:"2026-05-17", days:3, status:"pending_hr", pm:"Khalid Mansour",   tl:"Khalid Mansour", priority:"urgent", reason:"Family bereavement" },
    { id:"LV-2026-004", emp:"Ananya Sharma",     empId:"E020", type:"Annual Paid",  from:"2026-06-10", to:"2026-06-20", days:11,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Vacation", decidedAt:"3d ago" },
    { id:"LV-2026-003", emp:"Lina Haddad",       empId:"E031", type:"Annual Paid",  from:"2026-07-01", to:"2026-07-15", days:11,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Family travel", decidedAt:"1w ago" },
    { id:"LV-2026-002", emp:"Yan Zhang",         empId:"E035", type:"Hajj",         from:"2026-06-15", to:"2026-06-30", days:16,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Hajj pilgrimage", decidedAt:"2w ago" },
    { id:"LV-2026-001", emp:"Bilal Anwar",       empId:"E025", type:"Annual Paid",  from:"2026-04-29", to:"2026-04-30", days:2, status:"denied",     pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Personal", decidedAt:"3w ago" },
    { id:"LV-2026-009", emp:"Karim Salah",       empId:"E018", type:"Sick",         from:"2026-05-18", to:"2026-05-19", days:2, status:"pending_hr", pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Flu" },
    { id:"LV-2026-010", emp:"Priya Iyer",        empId:"E028", type:"Annual Paid",  from:"2026-06-25", to:"2026-07-04", days:8, status:"pending_pm", pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Family vacation" },
    { id:"LV-2026-011", emp:"Sami Berkani",      empId:"E029", type:"Annual Paid",  from:"2026-07-15", to:"2026-07-20", days:4, status:"pending_hr", pm:"Sara Mitchell",    tl:"Khalid Mansour", priority:"normal", reason:"Personal" },
    { id:"LV-2026-012", emp:"Hamza Al Mahmoud",  empId:"E027", type:"Annual Paid",  from:"2026-05-22", to:"2026-05-26", days:3, status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Wedding attendance", decidedAt:"4d ago" },
    { id:"LV-2026-013", emp:"Adeel Mahmood",     empId:"E032", type:"Hajj",         from:"2026-06-12", to:"2026-06-30", days:18,status:"pending_hr", pm:"Omar Siddiqui",    tl:"Khalid Mansour", priority:"normal", reason:"Hajj pilgrimage" },
    { id:"LV-2026-014", emp:"Pierre Dubois",     empId:"E025", type:"Sick",         from:"2026-05-10", to:"2026-05-12", days:3, status:"approved",   pm:"Khalid Mansour",   tl:"Khalid Mansour", priority:"normal", reason:"Migraine", decidedAt:"5d ago" },
    { id:"LV-2026-015", emp:"Rania Awwad",       empId:"E033", type:"Annual Paid",  from:"2026-08-05", to:"2026-08-15", days:8, status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Family travel", decidedAt:"1w ago" },
    { id:"LV-2026-016", emp:"Ibrahim Naseer",    empId:"E034", type:"Compassionate",from:"2026-05-08", to:"2026-05-10", days:3, status:"approved",   pm:"Sara Mitchell",    tl:"Khalid Mansour", priority:"urgent", reason:"Family bereavement", decidedAt:"1w ago" },
    // === 2025 (historical) ===
    { id:"LV-2025-058", emp:"Reem Al Otaibi",    empId:"E008", type:"Annual Paid",  from:"2025-11-20", to:"2025-12-05", days:11,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Family travel",  decidedAt:"Nov 2025" },
    { id:"LV-2025-057", emp:"Lina Haddad",       empId:"E031", type:"Annual Paid",  from:"2025-12-22", to:"2026-01-05", days:11,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Year-end break",  decidedAt:"Dec 2025" },
    { id:"LV-2025-056", emp:"Karim Salah",       empId:"E018", type:"Annual Paid",  from:"2025-08-04", to:"2025-08-18", days:11,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Summer vacation", decidedAt:"Aug 2025" },
    { id:"LV-2025-055", emp:"Daniyal Habib",     empId:"E024", type:"Hajj",         from:"2025-06-01", to:"2025-06-20", days:20,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Hajj pilgrimage", decidedAt:"Jun 2025" },
    { id:"LV-2025-054", emp:"Ananya Sharma",     empId:"E020", type:"Sick",         from:"2025-09-15", to:"2025-09-17", days:3, status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Surgery recovery",decidedAt:"Sep 2025" },
    { id:"LV-2025-053", emp:"Tomás Rivera",      empId:"E032", type:"Compassionate",from:"2025-04-12", to:"2025-04-15", days:4, status:"approved",   pm:"Khalid Mansour",   tl:"Khalid Mansour", priority:"urgent", reason:"Family bereavement", decidedAt:"Apr 2025" },
    { id:"LV-2025-052", emp:"Hamza Al Mahmoud",  empId:"E027", type:"Annual Paid",  from:"2025-07-10", to:"2025-07-24", days:11,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Family travel",  decidedAt:"Jul 2025" },
    { id:"LV-2025-051", emp:"Priya Iyer",        empId:"E028", type:"Maternity",    from:"2025-02-01", to:"2025-04-30", days:60,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Maternity leave",decidedAt:"Feb 2025" },
    // === 2024 (historical) ===
    { id:"LV-2024-105", emp:"Reem Al Otaibi",    empId:"E008", type:"Annual Paid",  from:"2024-12-23", to:"2024-12-31", days:7, status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Year-end break · family in Riyadh", decidedAt:"Dec 2024" },
    { id:"LV-2024-106", emp:"Reem Al Otaibi",    empId:"E008", type:"Sick",         from:"2024-09-04", to:"2024-09-05", days:2, status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Migraine · medical certificate attached", decidedAt:"Sep 2024" },
    { id:"LV-2024-104", emp:"Yan Zhang",         empId:"E035", type:"Annual Paid",  from:"2024-12-15", to:"2024-12-29", days:11,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Family travel",  decidedAt:"Dec 2024" },
    { id:"LV-2024-103", emp:"Karim Salah",       empId:"E018", type:"Annual Paid",  from:"2024-08-01", to:"2024-08-15", days:11,status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Summer vacation", decidedAt:"Aug 2024" },
    { id:"LV-2024-102", emp:"Lina Haddad",       empId:"E031", type:"Sick",         from:"2024-10-22", to:"2024-10-24", days:3, status:"approved",   pm:"Fatima Al Zaabi", tl:"Khalid Mansour", priority:"normal", reason:"Flu",            decidedAt:"Oct 2024" },
    { id:"LV-2024-101", emp:"Adeel Mahmood",     empId:"E032", type:"Annual Paid",  from:"2024-11-04", to:"2024-11-18", days:11,status:"approved",   pm:"Omar Siddiqui",    tl:"Khalid Mansour", priority:"normal", reason:"Family travel",  decidedAt:"Nov 2024" },
  ],


  // -------- KPIs (kanban) --------
  kpis: {
    Draft: [
      { id: "K-2026-Q2-08", emp: "Omar Siddiqui", title: "Q2 Goals", initials: "OS" },
      { id: "K-2026-Q2-09", emp: "Tariq Hassan", title: "Q2 Goals", initials: "TH" },
    ],
    Assigned: [
      { id: "K-2026-Q2-04", emp: "Aisha Khan", title: "Onboarding KPIs", initials: "AK" },
      { id: "K-2026-Q2-05", emp: "Yousef Karim", title: "Onboarding KPIs", initials: "YK" },
      { id: "K-2026-Q2-06", emp: "Reem Al Otaibi", title: "Q2 Goals", initials: "RO" },
    ],
    "Pending Ack": [
      { id: "K-2026-Q2-01", emp: "Noor Faisal", title: "Q2 Goals (2d overdue)", initials: "NF", overdue: true },
      { id: "K-2026-Q2-02", emp: "Bilal Anwar", title: "Q2 Goals (1d overdue)", initials: "BA", overdue: true },
    ],
    "In Progress": [
      { id: "K-2026-Q1-31", emp: "Marcus Wright", title: "Q1 Final review", initials: "MW" },
      { id: "K-2026-Q1-32", emp: "Sara Mitchell", title: "Q1 Final review", initials: "SM" },
      { id: "K-2026-Q1-33", emp: "Daniel Chen", title: "Q1 Final review", initials: "DC" },
      { id: "K-2026-Q1-34", emp: "Priya Sharma", title: "Q1 Goals tracking", initials: "PS" },
    ],
  },

  // -------- Documents --------
  documents: [
    { name: "Ahmed Al Rashid · Confirmation Letter", type: "Confirmation", status: "Signed", date: "2024-04-15", size: "142 KB" },
    { name: "Marcus Wright · Probation Evaluation", type: "Evaluation", status: "Pending CEO", date: "2026-05-10", size: "98 KB" },
    { name: "Sara Mitchell · Confirmation Letter", type: "Confirmation", status: "Pending Employee", date: "2026-05-08", size: "138 KB" },
    { name: "Priya Sharma · Updated Contract", type: "Contract", status: "Pending Employee", date: "2026-05-07", size: "215 KB" },
    { name: "Daniel Chen · Evaluation Form", type: "Evaluation", status: "Pending Employee", date: "2026-05-06", size: "102 KB" },
    { name: "Noor Faisal · NDA", type: "NDA", status: "Pending Employee", date: "2026-04-25", size: "76 KB" },
    { name: "Bilal Anwar · Updated Contract", type: "Contract", status: "Pending Employee", date: "2026-04-12", size: "210 KB" },
    { name: "Aisha Khan · Probation Evaluation", type: "Evaluation", status: "Pending LM", date: "2026-05-09", size: "94 KB" },
    { name: "Layla Ibrahim · Confirmation Letter", type: "Confirmation", status: "Signed", date: "2025-02-20", size: "139 KB" },
    { name: "Fatima Al Zaabi · Offer Letter", type: "Offer", status: "Signed", date: "2023-05-15", size: "189 KB" },
    { name: "Tariq Hassan · NDA", type: "NDA", status: "Signed", date: "2025-02-10", size: "75 KB" },
  ],

  // -------- Offboarding --------
  offboardingStages: [
    { name: "Resignation Received", count: 2 },
    { name: "Knowledge Transfer", count: 1 },
    { name: "Access Revocation", count: 1 },
    { name: "Final Settlement", count: 1 },
  ],
  offboarding: [
    { name: "James Patel", title: "Solutions Architect · Cloud Engineering", stage: "Knowledge Transfer", lastDay: "2026-05-30", reason: "Career move" },
    { name: "Hala Salim", title: "Junior Consultant · Advisory", stage: "Resignation Received", lastDay: "2026-06-15", reason: "Family relocation" },
    { name: "Adel Mubarak", title: "Cloud Engineer · Cloud Engineering", stage: "Access Revocation", lastDay: "2026-05-22", reason: "Career move" },
    { name: "Ravi Kapoor", title: "Senior Consultant · Advisory", stage: "Final Settlement", lastDay: "2026-05-15", reason: "Retirement" },
    { name: "Mariam Hassan", title: "HR Officer · People Operations", stage: "Resignation Received", lastDay: "2026-06-30", reason: "Higher studies" },
  ],

  // -------- Reports --------
  reports: [
    { id: "r1", title: "Onboarding Funnel", desc: "Joiners by step, average completion time, bottlenecks", icon: "rocketAlt", color: "bright", updated: "Updated 2h ago" },
    { id: "r2", title: "Training Compliance", desc: "% of staff who hold each required cert, by department", icon: "check", color: "ok", updated: "Live" },
    { id: "r3", title: "Certification Matrix", desc: "Company-wide cert holdings vs. AWS Partner tier requirements", icon: "award", color: "navy", updated: "Updated daily" },
    { id: "r4", title: "KPI Heatmap", desc: "KPI achievement across teams and departments", icon: "trending", color: "warn", updated: "Updated weekly" },
    { id: "r5", title: "Probation Trends", desc: "Pass / fail rates over the last 12 months", icon: "clock", color: "navy", updated: "Updated monthly" },
    { id: "r6", title: "Notification Engagement", desc: "Delivered, read, actioned rates by template and channel", icon: "bell", color: "bright", updated: "Live" },
    { id: "r7", title: "Attrition Signals", desc: "Resignations, probation failures, exit interview themes", icon: "alert", color: "danger", updated: "Updated weekly" },
    { id: "r8", title: "Executive Summary", desc: "Workforce health one-pager for CEO and leadership", icon: "doc", color: "navy", updated: "Sent every Monday" },
    { id: "r9", title: "Document Audit", desc: "Pending signatures, expiry tracking, signed-doc compliance", icon: "pen", color: "bright", updated: "Live" },
  ],

  // -------- Notification compose history --------
  notifHistory: [
    { title: "Q2 Performance Review Reminder", audience: "All employees · 147", channels: ["email", "slack"], sent: "2 days ago", read: 124 },
    { title: "Visa Renewal Alert (Auto)", audience: "Priya Sharma + her PM", channels: ["email", "slack", "in-app"], sent: "2h ago", read: 3 },
    { title: "Mandatory Training: KnowBe4 Q2", audience: "Cloud Engineering · 28", channels: ["email", "in-app"], sent: "1h ago", read: 12 },
    { title: "Welcome — Onboarding Started", audience: "Yousef Karim", channels: ["email", "slack"], sent: "3 days ago", read: 2 },
    { title: "All-Hands Reminder", audience: "All employees · 147", channels: ["email", "slack"], sent: "1 week ago", read: 141 },
  ],

  // ============================================================================
  //  KPI · sections per team
  // ============================================================================
  //  Each team groups its KPIs under sections (the MS document showed 5
  //  sections: Incident Mgmt, Security, Cost Opt, Automation, Operational Ex).
  //  Other teams have analogous groupings appropriate to their function.
  // ============================================================================
  kpiSections: [
    // MS (Managed Services) — from the Awais Khan / Danish Ghauri document
    { id: "ms-imm",   teamId: "ms",  label: "Incident Management & Monitoring",         order: 1 },
    { id: "ms-sc",    teamId: "ms",  label: "Security & Compliance",                     order: 2 },
    { id: "ms-corm",  teamId: "ms",  label: "Cost Optimisation & Resource Management",   order: 3 },
    { id: "ms-ad",    teamId: "ms",  label: "Automation & DevOps",                       order: 4 },
    { id: "ms-oetp",  teamId: "ms",  label: "Operational Excellence & Team Performance", order: 5 },
    // PS (Professional Services)
    { id: "ps-delv",  teamId: "ps",  label: "Delivery Excellence",                       order: 1 },
    { id: "ps-tech",  teamId: "ps",  label: "Technical Quality",                          order: 2 },
    { id: "ps-cert",  teamId: "ps",  label: "Certifications & Learning",                  order: 3 },
    { id: "ps-cust",  teamId: "ps",  label: "Customer Engagement",                        order: 4 },
    // IT Operations
    { id: "it-svc",   teamId: "it",  label: "Service Desk & Endpoint",                    order: 1 },
    { id: "it-sec",   teamId: "it",  label: "Internal Security",                          order: 2 },
    { id: "it-proj",  teamId: "it",  label: "IT Project Delivery",                        order: 3 },
    // Marketing
    { id: "mkt-pipe", teamId: "mkt", label: "Pipeline Influence",                         order: 1 },
    { id: "mkt-cont", teamId: "mkt", label: "Content & Brand",                            order: 2 },
    { id: "mkt-evt",  teamId: "mkt", label: "Events & Field",                              order: 3 },
    // Demand Generation
    { id: "dg-pipe",  teamId: "dg",  label: "Pipeline Generation",                        order: 1 },
    { id: "dg-qual",  teamId: "dg",  label: "Lead Quality",                                order: 2 },
    { id: "dg-act",   teamId: "dg",  label: "Activity Metrics",                            order: 3 },
    // Sales
    { id: "sal-rev",  teamId: "sal", label: "Revenue & Quota",                            order: 1 },
    { id: "sal-eng",  teamId: "sal", label: "Engagement & Outreach",                      order: 2 },
    { id: "sal-ren",  teamId: "sal", label: "Renewals & Retention",                        order: 3 },
    // PM (Project Management)
    { id: "pm-delv",  teamId: "pm",  label: "Delivery Health",                            order: 1 },
    { id: "pm-cust",  teamId: "pm",  label: "Customer Satisfaction",                      order: 2 },
    { id: "pm-fin",   teamId: "pm",  label: "Financial Discipline",                       order: 3 },
  ],

  // ============================================================================
  //  KPI · template catalogue per team
  // ============================================================================
  //  Each template is a reusable definition that a Team Lead can assign to
  //  team members. The MS team's catalogue is the full 25 KPIs from Awais
  //  Khan's published document; other teams have plausible 8-12 templates.
  //
  //  Each template carries:
  //    krn               — stable code (e.g. MS-IMM001), human-meaningful
  //    teamId            — which team this template belongs to
  //    sectionId         — grouping within the team
  //    label             — short title
  //    metric            — what's being counted (longer description)
  //    target            — display-format target ("< 5 minutes", "95%+")
  //    targetValue       — numeric for auto-compute (5 / 95)
  //    targetOperator    — "lt", "lte", "gte", "gt", "eq"
  //    targetUnit        — "minutes", "hours", "percent", "count", "score"
  //    mov               — Means of Validation (where evidence comes from)
  //    frequency         — "monthly" | "quarterly" | "post_probation"
  //    defaultWeight     — recommended weight when assigning
  //    grantableBy       — roles allowed to create/assign this (default: lead, hr)
  //    archived          — soft-delete flag
  // ============================================================================
  kpiTemplates: [
    // ── MS · Incident Management & Monitoring ────────────────────────
    { krn: "MS-IMM001", teamId: "ms", sectionId: "ms-imm",  label: "MTTA — Mean Time to Acknowledge",         metric: "Critical alerts acknowledged within target",                                       target: "< 5 minutes",     targetValue: 5,    targetOperator: "lt",  targetUnit: "minutes", mov: "Monitoring tool logs · RT or Slack alert acknowledgment timestamp",       frequency: "monthly",   defaultWeight: 8, validatorRole: "auto", autoComputed: true, archived: false },
    { krn: "MS-IMM002", teamId: "ms", sectionId: "ms-imm",  label: "MTTR — Mean Time to Restore",             metric: "Critical incidents resolved within target",                                        target: "< 2 hours",       targetValue: 2,    targetOperator: "lt",  targetUnit: "hours",   mov: "RT incident management system logs",                                       frequency: "monthly",   defaultWeight: 10, validatorRole: "auto", autoComputed: true, archived: false },
    { krn: "MS-IMM003", teamId: "ms", sectionId: "ms-imm",  label: "Self-Healing Success Rate",               metric: "% of incidents auto-resolved via automation (Lambda, SSM, Ansible)",               target: "50%+",            targetValue: 50,   targetOperator: "gte", targetUnit: "percent", mov: "CloudWatch / SSM automation runbooks",                                       frequency: "monthly",   defaultWeight: 6, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-IMM004", teamId: "ms", sectionId: "ms-imm",  label: "Escalation Avoidance Rate",                metric: "% of incidents resolved at L1 without escalation",                                  target: "75%+",            targetValue: 75,   targetOperator: "gte", targetUnit: "percent", mov: "Escalation tracker in ticket system / Slack",                                frequency: "monthly",   defaultWeight: 6, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-IMM005", teamId: "ms", sectionId: "ms-imm",  label: "Post-Incident RCA Completion",             metric: "% of major incidents with documented RCA",                                          target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "RCA docs submitted, peer-reviewed by buddies and Team Lead",                 frequency: "monthly",   defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    // ── MS · Security & Compliance ────────────────────────────────────
    { krn: "MS-SC001",  teamId: "ms", sectionId: "ms-sc",   label: "IAM Compliance",                            metric: "Adherence to least-privilege IAM policies",                                          target: "95%+",            targetValue: 95,   targetOperator: "gte", targetUnit: "percent", mov: "AWS IAM Analyzer / Access Analyzer reports · msOps team review",             frequency: "monthly",   defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-SC002",  teamId: "ms", sectionId: "ms-sc",   label: "Patch Management",                          metric: "% of EC2 instances auto-patched via SSM",                                            target: "75%+",            targetValue: 75,   targetOperator: "gte", targetUnit: "percent", mov: "SSM compliance reports",                                                     frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-SC003",  teamId: "ms", sectionId: "ms-sc",   label: "Zero Misconfigurations",                    metric: "Misconfigured S3 buckets, IAM policies, or security groups",                          target: "0",               targetValue: 0,    targetOperator: "eq",  targetUnit: "count",   mov: "AWS Config & Security Hub scans monthly",                                    frequency: "monthly",   defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-SC004",  teamId: "ms", sectionId: "ms-sc",   label: "Backup of Production Servers",              metric: "Backups enabled on production and critical servers",                                  target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "AWS Backup / snapshots",                                                     frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    // ── MS · Cost Optimisation & Resource Management ──────────────────
    { krn: "MS-CORM001",teamId: "ms", sectionId: "ms-corm", label: "Idle Resource Cleanup",                     metric: "% of idle EC2/EBS/RDS removed monthly",                                              target: "90%+",            targetValue: 90,   targetOperator: "gte", targetUnit: "percent", mov: "Trusted Advisor · custom cleanup scripts · manual overview",                  frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-CORM002",teamId: "ms", sectionId: "ms-corm", label: "Rightsizing Actions",                       metric: "Compute Optimizer recommendations applied",                                          target: "2+ per quarter",  targetValue: 2,    targetOperator: "gte", targetUnit: "count",   mov: "Logged tickets with before/after cost changes",                              frequency: "quarterly", defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-CORM003",teamId: "ms", sectionId: "ms-corm", label: "Spot/Reserved Usage",                       metric: "% of workloads on cost-efficient instances",                                         target: "40%+",            targetValue: 40,   targetOperator: "gte", targetUnit: "percent", mov: "Cost Explorer / Savings Plans utilisation reports",                          frequency: "monthly",   defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-CORM004",teamId: "ms", sectionId: "ms-corm", label: "Cost Optimisation Initiatives",             metric: "Actionable cost-saving suggestions submitted",                                      target: "2+ per quarter",  targetValue: 2,    targetOperator: "gte", targetUnit: "count",   mov: "Tracked in internal Docs / SharePoint",                                      frequency: "quarterly", defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },
    // ── MS · Automation & DevOps ──────────────────────────────────────
    { krn: "MS-AD001",  teamId: "ms", sectionId: "ms-ad",   label: "IaC Contribution Quality",                  metric: "Terraform MRs merged with 0 major rework comments",                                  target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "GitLab MR review summary",                                                   frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-AD002",  teamId: "ms", sectionId: "ms-ad",   label: "IaC SUDO / Community Contributions",        metric: "PRs to SUDO or internal open-source Terraform modules",                              target: "4+ per quarter",  targetValue: 4,    targetOperator: "gte", targetUnit: "count",   mov: "GitHub / SUDO repo activity log",                                            frequency: "quarterly", defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-AD003",  teamId: "ms", sectionId: "ms-ad",   label: "Code Review Engagement",                    metric: "Meaningful MR review comments per engineer",                                         target: "5+ per quarter",  targetValue: 5,    targetOperator: "gte", targetUnit: "count",   mov: "GitLab activity insights",                                                   frequency: "quarterly", defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-AD004",  teamId: "ms", sectionId: "ms-ad",   label: "Pipeline Failure Response Time",            metric: "CI/CD failures identified within target window",                                     target: "< 15 minutes",    targetValue: 15,   targetOperator: "lt",  targetUnit: "minutes", mov: "CI system alerts and Slack logs",                                            frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-AD005",  teamId: "ms", sectionId: "ms-ad",   label: "Task Automation Rate",                      metric: "% of repetitive tasks automated",                                                    target: "50%+",            targetValue: 50,   targetOperator: "gte", targetUnit: "percent", mov: "RT task type breakdown",                                                     frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    // ── MS · Operational Excellence & Team Performance ────────────────
    { krn: "MS-OETP001",teamId: "ms", sectionId: "ms-oetp", label: "SOP & Runbook Contributions",               metric: "SOPs/runbooks created or updated",                                                   target: "2+ per quarter",  targetValue: 2,    targetOperator: "gte", targetUnit: "count",   mov: "Versioned uploads in Internal Docs",                                         frequency: "quarterly", defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-OETP002",teamId: "ms", sectionId: "ms-oetp", label: "Process Improvement Proposals",             metric: "Improvement proposals submitted",                                                    target: "1+ per quarter",  targetValue: 1,    targetOperator: "gte", targetUnit: "count",   mov: "Submitted via email / Slack",                                                frequency: "quarterly", defaultWeight: 2, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-OETP003",teamId: "ms", sectionId: "ms-oetp", label: "AWS Certification",                          metric: "% of team certified (Cloud Practitioner or SA)",                                     target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "HR records",                                                                 frequency: "post_probation", defaultWeight: 3, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "MS-OETP004",teamId: "ms", sectionId: "ms-oetp", label: "Ticket Resolution SLA",                      metric: "Tickets closed within SLA timelines",                                                target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "Ticketing system SLA reports",                                               frequency: "monthly",   defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-OETP005",teamId: "ms", sectionId: "ms-oetp", label: "Customer Acknowledgement Time",              metric: "Customer messages acknowledged during shift",                                        target: "< 5–10 minutes",  targetValue: 10,   targetOperator: "lt",  targetUnit: "minutes", mov: "Slack / ticket logs",                                                        frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-OETP006",teamId: "ms", sectionId: "ms-oetp", label: "Shift Adherence",                            metric: "Adherence to assigned login/logout schedule",                                        target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "HR attendance tool · time-tracking sheet",                                   frequency: "monthly",   defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-OETP007",teamId: "ms", sectionId: "ms-oetp", label: "Communication Quality",                      metric: "Score in quarterly peer or TL feedback",                                             target: "4/5+",            targetValue: 4,    targetOperator: "gte", targetUnit: "score",   mov: "Internal review forms",                                                      frequency: "quarterly", defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MS-OETP008",teamId: "ms", sectionId: "ms-oetp", label: "Change Request Compliance",                  metric: "Production changes backed by approved CRs",                                          target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "CR tracking log with change history",                                        frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },

    // ── PS · Professional Services (plausible KPIs) ───────────────────
    { krn: "PS-DLV001", teamId: "ps", sectionId: "ps-delv", label: "Project Milestone Adherence",                metric: "Milestones delivered on or before committed date",                                   target: "90%+",            targetValue: 90,   targetOperator: "gte", targetUnit: "percent", mov: "ODOO project tracker · weekly status",                                       frequency: "monthly",   defaultWeight: 8, validatorRole: "auto", autoComputed: true, archived: false },
    { krn: "PS-DLV002", teamId: "ps", sectionId: "ps-delv", label: "Utilisation",                                metric: "Billable hours / available hours",                                                    target: "75%+",            targetValue: 75,   targetOperator: "gte", targetUnit: "percent", mov: "Timesheet · ODOO",                                                           frequency: "monthly",   defaultWeight: 6, validatorRole: "auto", autoComputed: true, archived: false },
    { krn: "PS-TCH001", teamId: "ps", sectionId: "ps-tech", label: "Code Review Comments",                        metric: "Meaningful review comments on team's MRs",                                            target: "8+ per cycle",    targetValue: 8,    targetOperator: "gte", targetUnit: "count",   mov: "GitLab activity",                                                            frequency: "quarterly", defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "PS-TCH002", teamId: "ps", sectionId: "ps-tech", label: "Architecture Reviews Owned",                  metric: "Client architecture reviews led",                                                     target: "2+ per quarter",  targetValue: 2,    targetOperator: "gte", targetUnit: "count",   mov: "Confluence · client engagement record",                                      frequency: "quarterly", defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "PS-CRT001", teamId: "ps", sectionId: "ps-cert", label: "AWS Certifications Held",                     metric: "Active AWS certifications per engineer",                                              target: "2+",              targetValue: 2,    targetOperator: "gte", targetUnit: "count",   mov: "Credly · HR records",                                                        frequency: "quarterly", defaultWeight: 3, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "PS-CRT002", teamId: "ps", sectionId: "ps-cert", label: "Specialty Track Progress",                    metric: "Completion of assigned specialty track milestones",                                   target: "On track",        targetValue: 100,  targetOperator: "gte", targetUnit: "percent", mov: "Learning plan · HR records",                                                 frequency: "quarterly", defaultWeight: 2, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "PS-CST001", teamId: "ps", sectionId: "ps-cust", label: "Client NPS Contribution",                     metric: "Client survey score for engagements led/contributed",                                 target: "8/10+",           targetValue: 8,    targetOperator: "gte", targetUnit: "score",   mov: "Post-engagement NPS surveys",                                                frequency: "quarterly", defaultWeight: 5, validatorRole: "auto", autoComputed: true, archived: false },
    { krn: "PS-CST002", teamId: "ps", sectionId: "ps-cust", label: "Knowledge Transfer Sessions",                  metric: "KT sessions delivered to client team",                                                target: "3+ per project",  targetValue: 3,    targetOperator: "gte", targetUnit: "count",   mov: "Calendar · session recordings",                                              frequency: "monthly",   defaultWeight: 3, validatorRole: "pm", autoComputed: false, archived: false },

    // ── IT Operations (plausible KPIs) ────────────────────────────────
    { krn: "IT-SVC001", teamId: "it", sectionId: "it-svc",  label: "Helpdesk First-Response Time",                metric: "Internal ticket first response time",                                                  target: "< 30 minutes",    targetValue: 30,   targetOperator: "lt",  targetUnit: "minutes", mov: "JIRA Service Desk",                                                          frequency: "monthly",   defaultWeight: 7, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "IT-SVC002", teamId: "it", sectionId: "it-svc",  label: "Endpoint Compliance",                          metric: "Devices compliant with security baseline",                                            target: "98%+",            targetValue: 98,   targetOperator: "gte", targetUnit: "percent", mov: "Intune / Jamf reports",                                                      frequency: "monthly",   defaultWeight: 6, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "IT-SEC001", teamId: "it", sectionId: "it-sec",  label: "Phishing Test Pass Rate",                       metric: "Employees passing KnowBe4 phishing simulations",                                      target: "95%+",            targetValue: 95,   targetOperator: "gte", targetUnit: "percent", mov: "KnowBe4 admin dashboard",                                                    frequency: "monthly",   defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "IT-SEC002", teamId: "it", sectionId: "it-sec",  label: "MFA Enrolment",                                 metric: "Active accounts with MFA enrolled",                                                   target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "Entra ID admin centre",                                                      frequency: "monthly",   defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "IT-PRJ001", teamId: "it", sectionId: "it-proj", label: "Internal Project Delivery",                     metric: "IT projects delivered against committed date",                                        target: "85%+",            targetValue: 85,   targetOperator: "gte", targetUnit: "percent", mov: "Internal project board",                                                     frequency: "quarterly", defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },

    // ── Marketing (plausible KPIs) ────────────────────────────────────
    { krn: "MKT-PIP001",teamId: "mkt",sectionId: "mkt-pipe",label: "Marketing-Sourced Pipeline",                    metric: "Pipeline ($) sourced from marketing activities",                                      target: "$2M+ / quarter",  targetValue: 2,    targetOperator: "gte", targetUnit: "score",   mov: "HubSpot pipeline reports",                                                   frequency: "quarterly", defaultWeight: 9, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MKT-PIP002",teamId: "mkt",sectionId: "mkt-pipe",label: "MQL Volume",                                    metric: "Marketing-qualified leads handed to DG/Sales",                                        target: "120+ / month",    targetValue: 120,  targetOperator: "gte", targetUnit: "count",   mov: "HubSpot lifecycle stage",                                                    frequency: "monthly",   defaultWeight: 7, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MKT-CNT001",teamId: "mkt",sectionId: "mkt-cont",label: "Content Output",                                metric: "Long-form pieces published (blog, case study, whitepaper)",                            target: "8+ / quarter",    targetValue: 8,    targetOperator: "gte", targetUnit: "count",   mov: "CMS · content calendar",                                                     frequency: "quarterly", defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MKT-CNT002",teamId: "mkt",sectionId: "mkt-cont",label: "Website Conversion",                            metric: "Visitor → lead conversion rate",                                                       target: "2.5%+",           targetValue: 2.5,  targetOperator: "gte", targetUnit: "percent", mov: "GA4 / HubSpot funnel",                                                       frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "MKT-EVT001",teamId: "mkt",sectionId: "mkt-evt", label: "Field Event Execution",                          metric: "Events delivered (booth, dinner, summit) per quarter",                                target: "3+ / quarter",    targetValue: 3,    targetOperator: "gte", targetUnit: "count",   mov: "Marketing calendar · post-event report",                                     frequency: "quarterly", defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },

    // ── Demand Generation (plausible KPIs) ────────────────────────────
    { krn: "DG-PIP001", teamId: "dg", sectionId: "dg-pipe", label: "Pipeline Created",                              metric: "Outbound-sourced pipeline value per rep",                                              target: "$500K+ / quarter",targetValue: 500,  targetOperator: "gte", targetUnit: "score",   mov: "HubSpot",                                                                    frequency: "quarterly", defaultWeight: 9, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "DG-PIP002", teamId: "dg", sectionId: "dg-pipe", label: "Qualified Meetings Booked",                     metric: "Discovery meetings handed to AEs",                                                     target: "12+ / month",     targetValue: 12,   targetOperator: "gte", targetUnit: "count",   mov: "Calendar bookings · HubSpot",                                                frequency: "monthly",   defaultWeight: 7, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "DG-QUL001", teamId: "dg", sectionId: "dg-qual", label: "MQL→SQL Conversion",                            metric: "% of MQLs that become SQLs",                                                          target: "30%+",            targetValue: 30,   targetOperator: "gte", targetUnit: "percent", mov: "HubSpot lifecycle reports",                                                  frequency: "monthly",   defaultWeight: 5, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "DG-ACT001", teamId: "dg", sectionId: "dg-act",  label: "Daily Outreach Volume",                          metric: "Outbound touches per rep per day (email + call + social)",                            target: "60+ / day",       targetValue: 60,   targetOperator: "gte", targetUnit: "count",   mov: "Outreach / Salesloft cadence reports",                                       frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "DG-ACT002", teamId: "dg", sectionId: "dg-act",  label: "CRM Hygiene",                                   metric: "Leads updated within 24h of activity",                                                target: "95%+",            targetValue: 95,   targetOperator: "gte", targetUnit: "percent", mov: "HubSpot data audit",                                                         frequency: "monthly",   defaultWeight: 3, validatorRole: "tl", autoComputed: false, archived: false },

    // ── Sales (plausible KPIs) ────────────────────────────────────────
    { krn: "SAL-REV001",teamId: "sal",sectionId: "sal-rev", label: "Quota Attainment",                              metric: "Closed-won revenue vs quota",                                                          target: "100%+",           targetValue: 100,  targetOperator: "gte", targetUnit: "percent", mov: "HubSpot deals · Finance reconciliation",                                     frequency: "quarterly", defaultWeight: 10, validatorRole: "auto", autoComputed: true, archived: false },
    { krn: "SAL-REV002",teamId: "sal",sectionId: "sal-rev", label: "Win Rate",                                       metric: "% of qualified opportunities closed-won",                                              target: "25%+",            targetValue: 25,   targetOperator: "gte", targetUnit: "percent", mov: "HubSpot opportunity reports",                                                frequency: "quarterly", defaultWeight: 6, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "SAL-ENG001",teamId: "sal",sectionId: "sal-eng", label: "Pipeline Coverage",                              metric: "Open pipeline value vs remaining quota",                                              target: "3×+ coverage",    targetValue: 3,    targetOperator: "gte", targetUnit: "score",   mov: "HubSpot weekly pipeline",                                                    frequency: "monthly",   defaultWeight: 6, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "SAL-ENG002",teamId: "sal",sectionId: "sal-eng", label: "Account Engagement",                             metric: "Active named accounts with meeting in last 30 days",                                  target: "70%+",            targetValue: 70,   targetOperator: "gte", targetUnit: "percent", mov: "Account-engagement dashboard",                                               frequency: "monthly",   defaultWeight: 4, validatorRole: "tl", autoComputed: false, archived: false },
    { krn: "SAL-REN001",teamId: "sal",sectionId: "sal-ren", label: "Net Revenue Retention",                           metric: "Renewal & expansion revenue / opening ARR",                                            target: "115%+",           targetValue: 115,  targetOperator: "gte", targetUnit: "percent", mov: "Finance / Customer Success reports",                                         frequency: "quarterly", defaultWeight: 6, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "SAL-REN002",teamId: "sal",sectionId: "sal-ren", label: "Churn Avoidance",                                metric: "Accounts retained without churn signals",                                              target: "95%+",            targetValue: 95,   targetOperator: "gte", targetUnit: "percent", mov: "Customer Success scorecard",                                                 frequency: "quarterly", defaultWeight: 4, validatorRole: "hr", autoComputed: false, archived: false },

    // ── PM (Project Management) — plausible KPIs ──────────────────────
    { krn: "PM-DLV001", teamId: "pm", sectionId: "pm-delv", label: "On-Time Delivery",                              metric: "Projects delivered against committed timeline",                                       target: "90%+",            targetValue: 90,   targetOperator: "gte", targetUnit: "percent", mov: "ODOO project tracker",                                                       frequency: "quarterly", defaultWeight: 8, validatorRole: "auto", autoComputed: true, archived: false },
    { krn: "PM-DLV002", teamId: "pm", sectionId: "pm-delv", label: "Scope Discipline",                              metric: "Projects completed within +/- 10% scope",                                              target: "85%+",            targetValue: 85,   targetOperator: "gte", targetUnit: "percent", mov: "Change request log",                                                         frequency: "quarterly", defaultWeight: 6, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "PM-CST001", teamId: "pm", sectionId: "pm-cust", label: "Client NPS (project-level)",                     metric: "Post-project survey score",                                                            target: "9/10+",           targetValue: 9,    targetOperator: "gte", targetUnit: "score",   mov: "Post-project NPS",                                                           frequency: "quarterly", defaultWeight: 7, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "PM-CST002", teamId: "pm", sectionId: "pm-cust", label: "Stakeholder Update Cadence",                    metric: "Weekly client status report delivered on time",                                       target: "100%",            targetValue: 100,  targetOperator: "eq",  targetUnit: "percent", mov: "Status report archive",                                                      frequency: "monthly",   defaultWeight: 4, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "PM-FIN001", teamId: "pm", sectionId: "pm-fin",  label: "Margin Adherence",                              metric: "Project gross margin vs target",                                                       target: "Within 5%",       targetValue: 5,    targetOperator: "lt",  targetUnit: "percent", mov: "ODOO finance reports",                                                       frequency: "quarterly", defaultWeight: 6, validatorRole: "hr", autoComputed: false, archived: false },
    { krn: "PM-FIN002", teamId: "pm", sectionId: "pm-fin",  label: "Invoice Timeliness",                            metric: "Invoices sent within 7 days of milestone",                                            target: "95%+",            targetValue: 95,   targetOperator: "gte", targetUnit: "percent", mov: "ODOO invoicing log",                                                         frequency: "monthly",   defaultWeight: 3, validatorRole: "hr", autoComputed: false, archived: false },
  ],

  // KPI assignments — instances of a template assigned to specific people for
  // a specific cycle. Status flows: draft → pending_hr → pending_emp_ack →
  // active → achieved/missed/cancelled.
  // Seeded with a handful of demo assignments; the rest are created live by
  // Team Leads through the UI.
  // ────────────────────────────────────────────────────────────────────
  //  KPI ASSIGNMENTS — instances of a template assigned to one employee.
  //  ────────────────────────────────────────────────────────────────────
  //  State machine:
  //    draft → pending_validation → active → progress_pending_validation
  //          → active (with validated value) → closed (at cycle end)
  //
  //  Who validates depends on the template's validatorRole:
  //    tl   = Team Lead (operational KPIs)
  //    pm   = Project Manager (project-related)
  //    hr   = HR (training, certs, learning, comp)
  //    auto = System (no human validation)
  //
  //  approvalDirection: which way the *initial* approval flows:
  //    hr_to_tl     = HR drafted → needs Team Lead approval to activate
  //    tl_to_hr     = TL drafted → needs HR acknowledgement to activate
  //
  //  Status colours computed on the fly by SUDO_DB_HELPERS.kpiStatusColor()
  //    GREEN  ≥ 95% of target
  //    AMBER  80–95%
  //    RED    < 80% OR overdue OR validator flagged
  //    GREY   no data yet
  // ────────────────────────────────────────────────────────────────────
  kpiAssignments: [
    // ── MS team · ACTIVE with various performance levels ─────────────
    { id: "KA-2026-001", templateKrn: "MS-IMM001", empId: "E072", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All MS team", weight: 8,
      status: "active", approvalDirection: "tl_to_hr",
      draftedBy: "E061", draftedAt: "2026-04-02",
      hrAckBy: "E004",  hrAckAt: "2026-04-05",
      tlApprovedBy: null, tlApprovedAt: null,
      empAcknowledgedAt: "2026-04-06",
      empSubmittedValue: 4.2, empSubmittedAt: "2026-05-15",
      validatedValue: 4.2, validatedBy: "E061", validatedAt: "2026-05-16",
      accomplishmentText: "4.2 min avg", statusRemarks: "On track",
      met: true },

    { id: "KA-2026-002", templateKrn: "MS-IMM001", empId: "E073", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All MS team", weight: 8,
      status: "active", approvalDirection: "tl_to_hr",
      draftedBy: "E061", draftedAt: "2026-04-02",
      hrAckBy: "E004",  hrAckAt: "2026-04-05",
      empAcknowledgedAt: "2026-04-07",
      empSubmittedValue: 3.8, empSubmittedAt: "2026-05-14",
      validatedValue: 3.8, validatedBy: "E061", validatedAt: "2026-05-15",
      accomplishmentText: "3.8 min avg", statusRemarks: "Above target",
      met: true },

    { id: "KA-2026-003", templateKrn: "MS-IMM002", empId: "E072", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All MS team", weight: 10,
      status: "active", approvalDirection: "tl_to_hr",
      draftedBy: "E061", draftedAt: "2026-04-02",
      hrAckBy: "E004",  hrAckAt: "2026-04-05",
      empAcknowledgedAt: "2026-04-06",
      empSubmittedValue: 1.5, empSubmittedAt: "2026-05-15",
      validatedValue: 1.5, validatedBy: "E061", validatedAt: "2026-05-16",
      accomplishmentText: "1h 30m avg", statusRemarks: "Within SLA",
      met: true },

    // RED case: Ameer Hamza below target on AWS Certification
    { id: "KA-2026-004", templateKrn: "MS-OETP003", empId: "E075", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Ameer Hamza only", weight: 10,
      status: "active", approvalDirection: "tl_to_hr",
      draftedBy: "E061", draftedAt: "2026-04-02",
      hrAckBy: "E004",  hrAckAt: "2026-04-04",
      empAcknowledgedAt: "2026-04-05",
      empSubmittedValue: 0, empSubmittedAt: "2026-05-10",
      validatedValue: 0, validatedBy: "E004", validatedAt: "2026-05-11",
      accomplishmentText: "Not yet certified", statusRemarks: "Studying for SAA-C03 · scheduled 18 Jun",
      met: false, flaggedRed: true, flaggedAt: "2026-05-11" },

    { id: "KA-2026-005", templateKrn: "MS-AD002", empId: "E076", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All MS team", weight: 3,
      status: "active", approvalDirection: "tl_to_hr",
      draftedBy: "E061", draftedAt: "2026-04-02",
      hrAckBy: "E004",  hrAckAt: "2026-04-05",
      empAcknowledgedAt: "2026-04-08",
      empSubmittedValue: 5, empSubmittedAt: "2026-05-12",
      validatedValue: 5, validatedBy: "E061", validatedAt: "2026-05-13",
      accomplishmentText: "5 PRs merged", statusRemarks: "Exceeded target",
      met: true },

    // AMBER case: Bilal slightly below MTTA target
    { id: "KA-2026-006", templateKrn: "MS-IMM004", empId: "E072", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All MS team", weight: 6,
      status: "active", approvalDirection: "tl_to_hr",
      draftedBy: "E061", draftedAt: "2026-04-02",
      hrAckBy: "E004",  hrAckAt: "2026-04-05",
      empAcknowledgedAt: "2026-04-06",
      empSubmittedValue: 68, empSubmittedAt: "2026-05-15",
      validatedValue: 68, validatedBy: "E061", validatedAt: "2026-05-16",
      accomplishmentText: "68% L1 resolved", statusRemarks: "Slightly below target",
      met: false },

    // Bilal's MTTR — submitted, awaiting TL validation
    { id: "KA-2026-007", templateKrn: "MS-IMM002", empId: "E073", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All MS team", weight: 10,
      status: "progress_pending_validation", approvalDirection: "tl_to_hr",
      draftedBy: "E061", draftedAt: "2026-04-02",
      hrAckBy: "E004", hrAckAt: "2026-04-05",
      empAcknowledgedAt: "2026-04-07",
      empSubmittedValue: 1.8, empSubmittedAt: "2026-05-18",
      accomplishmentText: "1h 48m avg",
      statusRemarks: "" },

    // ── PS team (Khalid's team) — AUTO-COMPUTED examples ─────────────
    { id: "KA-2026-020", templateKrn: "PS-DLV001", empId: "E001", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Ahmed Al Rashid", weight: 8,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-04-01",
      tlApprovedBy: "E003", tlApprovedAt: "2026-04-02",
      empAcknowledgedAt: "2026-04-03",
      empSubmittedValue: null,
      validatedValue: 92, validatedBy: "auto", validatedAt: "2026-05-18",
      accomplishmentText: "Auto-computed · 92% milestones on time", statusRemarks: "Auto-computed from project tracker",
      met: true },

    { id: "KA-2026-021", templateKrn: "PS-DLV002", empId: "E001", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Ahmed Al Rashid", weight: 6,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-04-01",
      tlApprovedBy: "E003", tlApprovedAt: "2026-04-02",
      empAcknowledgedAt: "2026-04-03",
      empSubmittedValue: null,
      validatedValue: 78, validatedBy: "auto", validatedAt: "2026-05-18",
      accomplishmentText: "Auto-computed · 78% utilisation", statusRemarks: "Auto from timesheet",
      met: true },

    { id: "KA-2026-022", templateKrn: "PS-CRT001", empId: "E001", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Ahmed Al Rashid", weight: 3,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-04-01",
      tlApprovedBy: "E003", tlApprovedAt: "2026-04-02",
      empAcknowledgedAt: "2026-04-03",
      empSubmittedValue: 4, empSubmittedAt: "2026-05-10",
      validatedValue: 4, validatedBy: "E004", validatedAt: "2026-05-11",
      accomplishmentText: "4 active AWS certifications", statusRemarks: "Above target",
      met: true },

    // Reem (E008) — onboarding employee with KPIs in various states
    { id: "KA-2026-030", templateKrn: "PS-DLV001", empId: "E008", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All Cloud Engineering", weight: 8,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-04-15",
      tlApprovedBy: "E003", tlApprovedAt: "2026-04-16",
      empAcknowledgedAt: "2026-04-17",
      empSubmittedValue: null,
      validatedValue: 60, validatedBy: "auto", validatedAt: "2026-05-18",
      accomplishmentText: "Auto-computed · 60% (onboarding ramp)", statusRemarks: "Below target — expected during onboarding",
      met: false, flaggedRed: true, flaggedAt: "2026-05-18" },

    { id: "KA-2026-031", templateKrn: "PS-CRT001", empId: "E008", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Reem Al Otaibi", weight: 5,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-04-15",
      tlApprovedBy: "E003", tlApprovedAt: "2026-04-16",
      empAcknowledgedAt: "2026-04-17",
      empSubmittedValue: 1, empSubmittedAt: "2026-05-10",
      validatedValue: 1, validatedBy: "E004", validatedAt: "2026-05-12",
      accomplishmentText: "1 cert (Cloud Practitioner) — SAA in progress", statusRemarks: "On track",
      met: false },

    { id: "KA-2026-032", templateKrn: "PS-TCH001", empId: "E008", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All Cloud Engineering", weight: 4,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-04-15",
      tlApprovedBy: "E003", tlApprovedAt: "2026-04-16",
      empAcknowledgedAt: "2026-04-17",
      empSubmittedValue: 3, empSubmittedAt: "2026-05-14",
      validatedValue: 3, validatedBy: "E003", validatedAt: "2026-05-15",
      accomplishmentText: "3 review comments this cycle", statusRemarks: "Below target of 8+",
      met: false, flaggedRed: true, flaggedAt: "2026-05-15" },

    // Reem has a KPI she hasn't yet acknowledged
    { id: "KA-2026-033", templateKrn: "PS-CST002", empId: "E008", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Reem Al Otaibi", weight: 3,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-05-10",
      tlApprovedBy: "E003", tlApprovedAt: "2026-05-11",
      empAcknowledgedAt: null,
      empSubmittedValue: null,
      accomplishmentText: "", statusRemarks: "" },

    // ── HR-drafted KPIs awaiting TL approval (the hr_to_tl direction) ─
    { id: "KA-2026-040", templateKrn: "PS-CRT001", empId: "E005", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All Cloud Engineering", weight: 3,
      status: "pending_validation", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-05-16" },

    { id: "KA-2026-041", templateKrn: "PS-CRT002", empId: "E005", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All Cloud Engineering", weight: 2,
      status: "pending_validation", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-05-16" },

    // ── TL-drafted KPIs awaiting HR acknowledgement (tl_to_hr direction) ─
    { id: "KA-2026-101", templateKrn: "IT-SVC001", empId: "E078", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Saif Al Mazrouei only", weight: 7,
      status: "pending_validation", approvalDirection: "tl_to_hr",
      draftedBy: "E063", draftedAt: "2026-05-12" },

    { id: "KA-2026-102", templateKrn: "IT-SVC002", empId: "E078", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All IT team", weight: 6,
      status: "pending_validation", approvalDirection: "tl_to_hr",
      draftedBy: "E063", draftedAt: "2026-05-12" },

    { id: "KA-2026-103", templateKrn: "IT-SEC001", empId: "E079", cycleId: "q2-2026",
      scope: "team", scopeLabel: "All IT team", weight: 5,
      status: "pending_validation", approvalDirection: "tl_to_hr",
      draftedBy: "E063", draftedAt: "2026-05-12" },

    // ── Sales team with a mix of statuses ─────────────────────────────
    { id: "KA-2026-200", templateKrn: "SAL-REV001", empId: "E087", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Khalifa Al Nahyan", weight: 10,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-04-01",
      tlApprovedBy: "E069", tlApprovedAt: "2026-04-02",
      empAcknowledgedAt: "2026-04-03",
      validatedValue: 102, validatedBy: "auto", validatedAt: "2026-05-18",
      accomplishmentText: "102% of quota · $620K closed", statusRemarks: "On target",
      met: true },

    { id: "KA-2026-201", templateKrn: "SAL-REV001", empId: "E088", cycleId: "q2-2026",
      scope: "individual", scopeLabel: "Layan Khalil", weight: 10,
      status: "active", approvalDirection: "hr_to_tl",
      draftedBy: "E004", draftedAt: "2026-04-01",
      tlApprovedBy: "E069", tlApprovedAt: "2026-04-02",
      empAcknowledgedAt: "2026-04-03",
      validatedValue: 58, validatedBy: "auto", validatedAt: "2026-05-18",
      accomplishmentText: "58% of quota · $290K closed", statusRemarks: "Below target — meeting with TL scheduled",
      met: false, flaggedRed: true, flaggedAt: "2026-05-18" },
  ],

  // Employee acknowledgements — captures the signature step from the MS doc
  kpiAcknowledgements: [
    { id: "AK-2026-001", empId: "E075", cycleId: "q2-2026", signedAt: "2026-04-05",
      signedVia: "portal", agreement: true, disagreementNote: "",
      preparedBy: "E061", reviewedBy: "E062", approvedBy: "E004",
      kpiCount: 8, totalWeight: 100, signature: "Ameer Hamza" },
    { id: "AK-2026-002", empId: "E072", cycleId: "q2-2026", signedAt: "2026-04-06",
      signedVia: "portal", agreement: true, disagreementNote: "",
      preparedBy: "E061", reviewedBy: "E062", approvedBy: "E004",
      kpiCount: 12, totalWeight: 100, signature: "Bilal Tariq" },
    { id: "AK-2026-003", empId: "E001", cycleId: "q2-2026", signedAt: "2026-04-03",
      signedVia: "portal", agreement: true, disagreementNote: "",
      preparedBy: "E003", reviewedBy: "E018", approvedBy: "E004",
      kpiCount: 5, totalWeight: 100, signature: "Ahmed Al Rashid" },
    { id: "AK-2026-004", empId: "E008", cycleId: "q2-2026", signedAt: "2026-04-17",
      signedVia: "portal", agreement: true, disagreementNote: "",
      preparedBy: "E003", reviewedBy: "E018", approvedBy: "E004",
      kpiCount: 4, totalWeight: 80, signature: "Reem Al Otaibi" },
  ],

  // ────────────────────────────────────────────────────────────────────
  //  KPI CYCLES — calendar of formal review periods
  // ────────────────────────────────────────────────────────────────────
  kpiCycles: [
    { id: "q1-2026", label: "Q1 2026", start: "2026-01-01", end: "2026-03-31", status: "closed", closedAt: "2026-04-08" },
    { id: "q2-2026", label: "Q2 2026", start: "2026-04-01", end: "2026-06-30", status: "active" },
    { id: "q3-2026", label: "Q3 2026", start: "2026-07-01", end: "2026-09-30", status: "upcoming" },
    { id: "q4-2026", label: "Q4 2026", start: "2026-10-01", end: "2026-12-31", status: "upcoming" },
  ],

  // ────────────────────────────────────────────────────────────────────
  //  CYCLE HISTORY — frozen composite + per-section scores for closed cycles.
  //  When a cycle closes, HR snapshots the composite + breakdown into here.
  //  The Employee profile and management reports read this for trends.
  // ────────────────────────────────────────────────────────────────────
  kpiCycleHistory: [
    // Reem Al Otaibi (E008) — Q1 2026 closed score
    { empId: "E008", cycleId: "q1-2026", composite: 73, kpiCount: 4, red: 1, amber: 1, green: 2,
      sections: [
        { id: "ps-delv", score: 80 },
        { id: "ps-cert", score: 50 },
        { id: "ps-tech", score: 70 },
        { id: "ps-cust", score: 92 },
      ],
      signedAt: "2026-01-08", closedAt: "2026-04-08" },
    // Ahmed Al Rashid (E001) — strong performer
    { empId: "E001", cycleId: "q1-2026", composite: 94, kpiCount: 5, red: 0, amber: 1, green: 4,
      sections: [
        { id: "ps-delv", score: 96 },
        { id: "ps-cert", score: 85 },
        { id: "ps-tech", score: 100 },
        { id: "ps-cust", score: 95 },
      ],
      signedAt: "2026-01-12", closedAt: "2026-04-08" },
    // Bilal Tariq (E072) — MS engineer
    { empId: "E072", cycleId: "q1-2026", composite: 88, kpiCount: 8, red: 0, amber: 2, green: 6,
      sections: [
        { id: "ms-imm", score: 92 },
        { id: "ms-sc",  score: 88 },
        { id: "ms-corm",score: 78 },
        { id: "ms-ad",  score: 90 },
        { id: "ms-oetp",score: 92 },
      ],
      signedAt: "2026-01-10", closedAt: "2026-04-08" },
    // Ameer Hamza (E075) — on probation
    { empId: "E075", cycleId: "q1-2026", composite: 62, kpiCount: 6, red: 2, amber: 2, green: 2,
      sections: [
        { id: "ms-imm", score: 70 },
        { id: "ms-sc",  score: 65 },
        { id: "ms-ad",  score: 55 },
        { id: "ms-oetp",score: 58 },
      ],
      signedAt: "2026-01-14", closedAt: "2026-04-08" },
  ],

  // Append-only audit log. Every role/team change in Admin, every KPI
  // approval, every salary edit. The prototype writes here via
  // SUDO_DB_MUTATIONS.audit().
  auditLog: [
    { id: "AL-001", at: "2026-04-02 09:14", actor: "Awais Khan (E061)",  action: "kpi.assignment.drafted",  target: "KA-2026-001 → E072", note: "MTTA KPI assigned to all MS team" },
    { id: "AL-002", at: "2026-04-05 11:30", actor: "Justine (HR)",        action: "kpi.assignment.approved", target: "KA-2026-001",        note: "Approved without changes" },
    { id: "AL-003", at: "2026-05-12 14:48", actor: "Hassan Iqbal (E063)", action: "kpi.assignment.drafted",  target: "KA-2026-101 → E078", note: "First-response SLA KPI" },
  ],
};

// ============================================================================
//  SUDO_DB_OVERRIDES — localStorage-backed mutation layer
// ============================================================================
//  In the prototype there is no backend. To support "real working" admin
//  actions (Admin changes a role here → the change is visible in TL/HR/Emp
//  portals on next page load), we mirror writes into localStorage and merge
//  them back over the seed data on every page load.
//
//  Keys we manage:
//    sudo:overrides:roles            — { empId: ["admin","hr","pm","tl","employee"] }
//    sudo:overrides:teams            — { empId: { teamId, teamRole } }
//    sudo:overrides:kpi-templates    — TL-created or HR-edited templates
//    sudo:overrides:kpi-assignments  — new KPI assignments
//    sudo:overrides:kpi-acks         — employee acknowledgements
//    sudo:overrides:audit            — appended audit entries
//
//  All five portals read these on load. A change in HR's tab will be visible
//  to Employee on next refresh.
//
//  Defensive: if localStorage is unavailable (file:// in some browsers, or
//  privacy mode), we fall back to in-memory state — the prototype still
//  works, just doesn't persist across reloads.
// ============================================================================
const SUDO_DB_OVERRIDES = (function() {

  const KEYS = {
    roles:       "sudo:overrides:roles",
    teams:       "sudo:overrides:teams",
    templates:   "sudo:overrides:kpi-templates",
    assignments: "sudo:overrides:kpi-assignments",
    acks:        "sudo:overrides:kpi-acks",
    audit:       "sudo:overrides:audit",
  };

  function safeGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch (e) { /* in-memory fallback already mutated */ }
  }

  // Read all overrides once at load
  const roleOverrides         = safeGet(KEYS.roles, {});
  const teamOverrides         = safeGet(KEYS.teams, {});
  const templateOverrides     = safeGet(KEYS.templates, []);
  const assignmentOverrides   = safeGet(KEYS.assignments, []);
  const ackOverrides          = safeGet(KEYS.acks, []);
  const auditOverrides        = safeGet(KEYS.audit, []);
  const notificationOverrides = safeGet("sudo:overrides:notifications", []);

  // ── Apply overrides onto SUDO_DB ────────────────────────────────────────
  // 1. Merge role + team overrides into employees
  SUDO_DB.employees.forEach(e => {
    if (roleOverrides[e.id])    e.roles = roleOverrides[e.id];
    if (teamOverrides[e.id]) {
      if (teamOverrides[e.id].teamId !== undefined) e.teamId = teamOverrides[e.id].teamId;
      if (teamOverrides[e.id].teamRole !== undefined) e.teamRole = teamOverrides[e.id].teamRole;
    }
  });
  // 2. Merge override templates / assignments / acks / audit
  //    Dedupe by id/krn: an override REPLACES the seed entry with the same key.
  function mergeBy(seedArr, overrides, keyFn) {
    if (!overrides || overrides.length === 0) return;
    overrides.forEach(o => {
      const key = keyFn(o);
      const idx = seedArr.findIndex(s => keyFn(s) === key);
      if (idx >= 0) Object.assign(seedArr[idx], o);
      else seedArr.push(o);
    });
  }
  mergeBy(SUDO_DB.kpiTemplates,        templateOverrides,    t => t.krn);
  mergeBy(SUDO_DB.kpiAssignments,      assignmentOverrides,  a => a.id);
  mergeBy(SUDO_DB.kpiAcknowledgements, ackOverrides,         a => a.id);
  // audit log is append-only history — duplicates are OK by design,
  // but we still want to avoid re-appending on every reload.
  if (auditOverrides.length) {
    const seenIds = new Set(SUDO_DB.auditLog.map(a => a.id));
    auditOverrides.forEach(o => { if (!seenIds.has(o.id)) SUDO_DB.auditLog.push(o); });
  }
  // Cross-portal notifications — prepend persisted ones so newest stay first.
  if (notificationOverrides.length) {
    SUDO_DB.notifications = SUDO_DB.notifications || [];
    const seen = new Set(SUDO_DB.notifications.map(n => n.ts || n.title + '|' + n.desc));
    notificationOverrides.forEach(n => {
      const key = n.ts || n.title + '|' + n.desc;
      if (!seen.has(key)) SUDO_DB.notifications.unshift(n);
    });
  }

  // ── Write paths ─────────────────────────────────────────────────────────
  return {
    setRoles(empId, roles) {
      roleOverrides[empId] = Array.isArray(roles) ? roles : [];
      safeSet(KEYS.roles, roleOverrides);
      const emp = SUDO_DB.employees.find(e => e.id === empId);
      if (emp) emp.roles = roleOverrides[empId];
      return roleOverrides[empId];
    },
    getRoles(empId) {
      if (roleOverrides[empId]) return roleOverrides[empId];
      const emp = SUDO_DB.employees.find(e => e.id === empId);
      if (!emp) return [];
      // Derive from teamRole + dept
      const derived = ["employee"];
      if (emp.teamRole === "hr")      derived.push("hr");
      if (emp.teamRole === "admin")   derived.push("admin");
      if (emp.teamRole === "lead")    derived.push("tl");
      if (emp.teamRole === "manager") derived.push("tl"); // managers can use TL portal
      if (emp.teamId === "pm")        derived.push("pm");
      return Array.from(new Set(derived));
    },
    setTeam(empId, teamId, teamRole) {
      teamOverrides[empId] = { teamId, teamRole };
      safeSet(KEYS.teams, teamOverrides);
      const emp = SUDO_DB.employees.find(e => e.id === empId);
      if (emp) { emp.teamId = teamId; emp.teamRole = teamRole; }
      return teamOverrides[empId];
    },
    addTemplate(template) {
      // Stable ID if KRN omitted
      if (!template.krn) template.krn = "USR-" + (Date.now() % 1000000);
      template.createdAt = template.createdAt || new Date().toISOString();
      template.archived  = template.archived || false;
      templateOverrides.push(template);
      SUDO_DB.kpiTemplates.push(template);
      safeSet(KEYS.templates, templateOverrides);
      return template;
    },
    updateTemplate(krn, patch) {
      const t = SUDO_DB.kpiTemplates.find(t => t.krn === krn);
      if (!t) return null;
      Object.assign(t, patch);
      // Find in overrides (it might be there if user-created) and update
      const idx = templateOverrides.findIndex(x => x.krn === krn);
      if (idx >= 0) templateOverrides[idx] = t;
      else templateOverrides.push(t); // shadow override for a seed template
      safeSet(KEYS.templates, templateOverrides);
      return t;
    },
    addAssignment(assignment) {
      assignment.id = assignment.id || "KA-" + Date.now();
      assignment.draftedAt = assignment.draftedAt || new Date().toISOString();
      assignment.status = assignment.status || "pending_validation";
      assignment.approvalDirection = assignment.approvalDirection || "tl_to_hr";
      assignmentOverrides.push(assignment);
      SUDO_DB.kpiAssignments.push(assignment);
      safeSet(KEYS.assignments, assignmentOverrides);
      return assignment;
    },
    updateAssignment(id, patch) {
      const a = SUDO_DB.kpiAssignments.find(a => a.id === id);
      if (!a) return null;
      Object.assign(a, patch);
      const idx = assignmentOverrides.findIndex(x => x.id === id);
      if (idx >= 0) assignmentOverrides[idx] = a;
      else assignmentOverrides.push(a);
      safeSet(KEYS.assignments, assignmentOverrides);
      return a;
    },
    addAcknowledgement(ack) {
      ack.id = ack.id || "AK-" + Date.now();
      ack.signedAt = ack.signedAt || new Date().toISOString();
      ackOverrides.push(ack);
      SUDO_DB.kpiAcknowledgements.push(ack);
      safeSet(KEYS.acks, ackOverrides);
      return ack;
    },
    /**
     * Insert a notification at the top of the in-memory list.
     * For: dashboard bell · approval queues · at-risk alerts.
     */
    notify({ title, desc, icon = "bell", color = "info", forEmpId = null, kind = "system" }) {
      SUDO_DB.notifications = SUDO_DB.notifications || [];
      SUDO_DB.notifications.unshift({
        title, desc, time: "Just now", unread: true,
        icon, color, forEmpId, kind,
        ts: new Date().toISOString(),
      });
      // Persist last 50
      try { safeSet("sudo:overrides:notifications", SUDO_DB.notifications.slice(0, 50)); } catch (e) {}
      return SUDO_DB.notifications[0];
    },
    audit(actor, action, target, note) {
      const entry = {
        id: "AL-" + Date.now(),
        at: new Date().toISOString().replace("T", " ").slice(0, 16),
        actor, action, target, note: note || "",
      };
      auditOverrides.push(entry);
      SUDO_DB.auditLog.push(entry);
      safeSet(KEYS.audit, auditOverrides);
      return entry;
    },
    // Clear all overrides — useful for "reset to seed" demos.
    clearAll() {
      Object.values(KEYS).forEach(k => { try { localStorage.removeItem(k); } catch(e){} });
      location.reload();
    },
  };
})();

// ============================================================================
//  CROSS-CUTTING HELPERS — used by all portals
// ============================================================================
const SUDO_DB_HELPERS = {

  /**
   * Find an employee by id. Used everywhere — HR opens a profile, PM
   * looks up a team member, Employee portal renders the current user.
   */
  findEmployee(id) {
    return SUDO_DB.employees.find(e => e.id === id) || null;
  },

  /** Find a team by id, return team + its lead/manager employee records. */
  findTeam(id) {
    const team = (SUDO_DB.teams || []).find(t => t.id === id);
    if (!team) return null;
    return {
      ...team,
      lead:    SUDO_DB.employees.find(e => e.id === team.leadEmpId),
      manager: SUDO_DB.employees.find(e => e.id === team.managerEmpId),
    };
  },

  /** Members of a team (excluding leads/managers if asked). */
  teamMembers(teamId, opts = {}) {
    const members = SUDO_DB.employees.filter(e => e.teamId === teamId);
    if (opts.includeLeadership === false) {
      return members.filter(e => e.teamRole === "member");
    }
    return members;
  },

  /** KPI templates filtered by team. */
  templatesForTeam(teamId) {
    return SUDO_DB.kpiTemplates.filter(t => t.teamId === teamId && !t.archived);
  },

  /** KPI sections for a team, sorted by order. */
  sectionsForTeam(teamId) {
    return SUDO_DB.kpiSections
      .filter(s => s.teamId === teamId)
      .sort((a, b) => a.order - b.order);
  },

  /** Find a template by KRN. */
  templateByKrn(krn) {
    return SUDO_DB.kpiTemplates.find(t => t.krn === krn) || null;
  },

  /**
   * Compute a KPI assignment's status colour.
   *   GREEN  ≥ 95% of target
   *   AMBER  80–95%
   *   RED    < 80% OR flaggedRed
   *   GREY   no value yet
   *
   * Direction-aware: for "less than" targets (e.g. MTTR < 2h), the
   * computation inverts (lower is better).
   */
  kpiStatusColor(assignment) {
    if (!assignment) return "grey";
    if (assignment.flaggedRed) return "red";
    if (assignment.status === "pending_validation" ||
        assignment.status === "progress_pending_validation") return "amber";
    const value = assignment.validatedValue ?? assignment.empSubmittedValue;
    if (value === null || value === undefined) return "grey";
    const tpl = this.templateByKrn(assignment.templateKrn);
    if (!tpl) return "grey";
    const target = tpl.targetValue;
    if (target === 0 && tpl.targetOperator === "eq") {
      return value === 0 ? "green" : "red";
    }
    let ratio;
    if (tpl.targetOperator === "lt" || tpl.targetOperator === "lte") {
      // Lower is better. ratio = target / actual.
      ratio = value <= 0 ? 999 : target / value;
    } else {
      // Higher is better. ratio = actual / target.
      ratio = target === 0 ? 0 : value / target;
    }
    if (ratio >= 0.95) return "green";
    if (ratio >= 0.80) return "amber";
    return "red";
  },

  /** Aggregate composite score (weighted average of validated values vs targets). */
  compositeScore(empId, cycleId) {
    const assigns = this.assignmentsForEmployee(empId, cycleId)
      .filter(a => a.status === "active" && (a.validatedValue !== null && a.validatedValue !== undefined));
    if (assigns.length === 0) return null;
    let weightedSum = 0;
    let weightTotal = 0;
    assigns.forEach(a => {
      const tpl = this.templateByKrn(a.templateKrn);
      if (!tpl) return;
      const value = a.validatedValue;
      let ratio;
      if (tpl.targetOperator === "lt" || tpl.targetOperator === "lte") {
        ratio = value <= 0 ? 1 : Math.min(1.2, tpl.targetValue / value);
      } else {
        ratio = tpl.targetValue === 0 ? 0 : Math.min(1.2, value / tpl.targetValue);
      }
      weightedSum += ratio * a.weight;
      weightTotal += a.weight;
    });
    return weightTotal === 0 ? null : (weightedSum / weightTotal) * 100;
  },

  /** Assignments by employee, optionally filtered by cycle. */
  assignmentsForEmployee(empId, cycleId) {
    return SUDO_DB.kpiAssignments
      .filter(a => a.empId === empId && (!cycleId || a.cycleId === cycleId));
  },

  /**
   * Closed cycle history for an employee — returns oldest first, with
   * computed delta vs previous cycle. Used by the Employee profile page
   * and management trend visualisations.
   */
  cycleHistoryForEmployee(empId) {
    const rows = (SUDO_DB.kpiCycleHistory || [])
      .filter(h => h.empId === empId)
      .sort((a, b) => (a.cycleId || "").localeCompare(b.cycleId || ""));
    return rows.map((row, i) => ({
      ...row,
      cycle: (SUDO_DB.kpiCycles || []).find(c => c.id === row.cycleId),
      delta: i > 0 ? row.composite - rows[i - 1].composite : 0,
    }));
  },

  /** Assignments by team (via employee.teamId), optionally filtered by status. */
  assignmentsForTeam(teamId, statusFilter) {
    const teamEmpIds = new Set(SUDO_DB.employees
      .filter(e => e.teamId === teamId)
      .map(e => e.id));
    return SUDO_DB.kpiAssignments.filter(a => {
      if (!teamEmpIds.has(a.empId)) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  },

  /**
   * Compute total accrued leave balance for an employee, broken down
   * by leave type. Real backends would derive this from yearly
   * entitlements + used days. Here we return the current snapshot
   * from `leaveBalances`, or sensible defaults.
   */
  leaveBalance(empId) {
    const b = (SUDO_DB.leaveBalances || []).find(x => x.empId === empId);
    return b || {
      empId,
      annual:        { entitled: 22, used: 0, remaining: 22, carryOver: 0 },
      sick:          { used: 0, remaining: 14 },
      compassionate: { used: 0, remaining: 5 },
      hajj:          { used: 0, eligible: true },
    };
  },

  /**
   * Walk an employee's salary history and return the row at index `n`
   * (0 = current). Used by Past Salaries UI + audit screens.
   */
  salaryAt(empId, index = 0) {
    const profile = SUDO_DB.fullProfiles[empId];
    if (!profile || !profile.salary || !profile.salary.history) return null;
    return profile.salary.history[index] || null;
  },

  /**
   * All leaves for one employee, sorted newest-first. PM and TL use
   * this when looking at a team member's leave history.
   */
  leavesFor(empId) {
    return (SUDO_DB.leaveApprovals || [])
      .filter(l => l.empId === empId)
      .sort((a, b) => (b.from || "").localeCompare(a.from || ""));
  },

  /**
   * Group an array of records by a date field's year. Used by the
   * Leaves page's yearly grouping/sort.
   */
  groupByYear(arr, dateField = "from") {
    const out = {};
    arr.forEach(r => {
      const y = (r[dateField] || "").slice(0, 4) || "unknown";
      (out[y] = out[y] || []).push(r);
    });
    return out;
  },

};

// ============================================================================
//  Backwards-compat shim — old code still calls SUDO_DB_MUTATIONS.
//  Forward those to the new override system.
// ============================================================================
const SUDO_DB_MUTATIONS = {

  updateLeaveBalance(empId, leaveType, delta, reason) {
    SUDO_DB.leaveBalances = SUDO_DB.leaveBalances || [];
    let bal = SUDO_DB.leaveBalances.find(b => b.empId === empId);
    if (!bal) {
      bal = SUDO_DB_HELPERS.leaveBalance(empId);
      SUDO_DB.leaveBalances.push(bal);
    }
    if (bal[leaveType]) {
      const before = bal[leaveType].remaining || 0;
      bal[leaveType].remaining = Math.max(0, before + delta);
      bal[leaveType].entitled = (bal[leaveType].entitled || 0) + (delta > 0 ? delta : 0);
      bal[leaveType].adjustments = bal[leaveType].adjustments || [];
      bal[leaveType].adjustments.push({
        date: new Date().toISOString().slice(0, 10),
        delta, reason,
        before, after: bal[leaveType].remaining,
      });
    }
    return bal;
  },

  applySalaryIncrement(empId, increment) {
    const p = SUDO_DB.fullProfiles[empId];
    if (!p) return null;
    p.salary.history = p.salary.history || [];
    p.salary.history.unshift({
      effective: increment.effective,
      basic: increment.basic,
      gross: increment.gross,
      reason: increment.reason,
      note: increment.note || "",
      approvedBy: increment.approvedBy || "—",
    });
    p.salary.basic = increment.basic;
    p.salary.effective = increment.effective;
    return p.salary;
  },

  // Forwards to override system
  setRoles:           (empId, roles)      => SUDO_DB_OVERRIDES.setRoles(empId, roles),
  setTeam:            (empId, t, r)        => SUDO_DB_OVERRIDES.setTeam(empId, t, r),
  addKpiTemplate:     (tpl)                => SUDO_DB_OVERRIDES.addTemplate(tpl),
  updateKpiTemplate:  (krn, p)             => SUDO_DB_OVERRIDES.updateTemplate(krn, p),
  addKpiAssignment:   (a)                  => SUDO_DB_OVERRIDES.addAssignment(a),
  updateKpiAssignment:(id, p)              => SUDO_DB_OVERRIDES.updateAssignment(id, p),
  addKpiAck:          (a)                  => SUDO_DB_OVERRIDES.addAcknowledgement(a),
  audit:              (actor, act, t, n)   => SUDO_DB_OVERRIDES.audit(actor, act, t, n),
  resetOverrides:     ()                   => SUDO_DB_OVERRIDES.clearAll(),

};

global.SUDO_DB = SUDO_DB;
global.SUDO_DB_HELPERS = SUDO_DB_HELPERS;
global.SUDO_DB_MUTATIONS = SUDO_DB_MUTATIONS;
global.SUDO_DB_OVERRIDES = SUDO_DB_OVERRIDES;

})(window);
