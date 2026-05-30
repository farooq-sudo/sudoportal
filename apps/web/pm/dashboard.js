/* =========================================================
   SUDO Employee Portal — PM Portal
   Single-file SPA with hash router
   User: Fatima Al Zaabi (Project Manager · Delivery)
========================================================= */

// =========================================================
// NAV
// =========================================================
const NAV_ITEMS = [
  { id: "dashboard",         label: "Team Dashboard",      iconKey: "grid",     title: "My Team Dashboard" },
  { id: "team",              label: "My Team",             iconKey: "users",    count: 8, title: "My Team" },
  { id: "team-onboarding",   label: "Team Onboarding",     iconKey: "rocket",   count: 3, countStyle: "accent", title: "Team Onboarding" },
  { id: "team-kpis",         label: "Team KPIs",           iconKey: "chart",    count: 4, title: "Team KPIs" },
  { id: "probation",         label: "Probation Endorsements", iconKey: "shield", count: 2, countStyle: "warn", title: "Probation Endorsements" },
  { id: "feedback",          label: "Feedback Sessions",   iconKey: "comments", title: "Feedback Sessions" },
  { id: "task-quality",      label: "ODOO Task Quality",   iconKey: "clipboard", count: 5, countStyle: "warn", title: "ODOO Task Quality" },
  { id: "team-trainings",    label: "Team Trainings",      iconKey: "book",     title: "Team Trainings" },
  { id: "team-documents",    label: "Team Documents",      iconKey: "doc",      title: "Team Documents" },
  { id: "grant-badges",      label: "Grant Badges",        iconKey: "star",     title: "Grant Badges" },
  { id: "notifications",     label: "Notifications",       iconKey: "bell",     count: 3, countStyle: "danger", title: "Notifications" },
  { id: "profile",           label: "My Profile",          iconKey: "user",     title: "My Profile" },
];

// =========================================================
// ICONS
// =========================================================
const ICONS = {
  grid:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>',
  users:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7M16 11a4 4 0 100-8M22 21c0-3-2-5.5-5-6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  rocket:     '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2v6m0 0l-3-3m3 3l3-3M4 13h16M4 13v7a2 2 0 002 2h12a2 2 0 002-2v-7M4 13l2-4h12l2 4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  chart:      '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shield:     '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  comments:   '<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clipboard:  '<svg viewBox="0 0 24 24" fill="none"><rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" stroke-width="1.8"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="currentColor" stroke-width="1.8"/><path d="M9 14l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  book:       '<svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.8"/><path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  doc:        '<svg viewBox="0 0 24 24" fill="none"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v6h6M9 15h6M9 12h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  bell:       '<svg viewBox="0 0 24 24" fill="none"><path d="M18 16h2l-1.4-1.4A2 2 0 0118 13.2V10a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 16h2m12 0H6m12 0a3 3 0 11-6 0m-6 0a3 3 0 006 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  user:       '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" stroke-width="1.8"/></svg>',

  check:      '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  xmark:      '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  alert:      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.3 3.6L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  calendar:   '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  star:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7l3-7z"/></svg>',
  starOutline:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7l3-7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trending:   '<svg viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8M14 7h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pen:        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9M17 3l4 4-13 13H4v-4L17 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  send:       '<svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.8"/></svg>',
  external:   '<svg viewBox="0 0 24 24" fill="none"><path d="M14 3h7v7M10 14L21 3M19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search:     '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  mail:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.8"/></svg>',
  phone:      '<svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  briefcase:  '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="1.8"/></svg>',
  videoCam:   '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M22 8l-6 4 6 4V8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  thumbsUp:   '<svg viewBox="0 0 24 24" fill="none"><path d="M7 22V11M2 13v7a2 2 0 002 2h13a3 3 0 003-2.4l1-7A3 3 0 0018 9h-4V4a3 3 0 00-3-3l-4 11" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  thumbsDown: '<svg viewBox="0 0 24 24" fill="none"><path d="M17 2v11M22 11V4a2 2 0 00-2-2H7a3 3 0 00-3 2.4l-1 7A3 3 0 006 15h4v5a3 3 0 003 3l4-11" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  refresh:    '<svg viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-3.3-7M21 3v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// =========================================================
// DATA — Fatima Al Zaabi's PM workspace
// =========================================================
const DATA = {
  user: {
    name: "Fatima Al Zaabi",
    initials: "FZ",
    title: "Project Manager",
    dept: "Delivery",
    email: "fatima.z@sudoconsultants.com",
    phone: "+971 50 ●●● 2218",
    employeeId: "E006",
    joined: "2023-05-15",
  },

  // 4 KPI cards (team-scoped, not org-wide)
  kpiCards: [
    { id: "team-size", title: "My Team", value: 8, icon: "users", iconStyle: "teal", meta: "5 confirmed · 3 onboarding" },
    { id: "probation-due", title: "Probation Reviews", value: 2, icon: "shield", iconStyle: "warn", meta: "Reem (Jul 1) · Daniel (Aug 15)" },
    { id: "kpis-pending", title: "Team KPIs to Review", value: 4, icon: "trending", iconStyle: "navy", meta: "Q2 cycle · for my review" },
    { id: "tasks-to-rate", title: "ODOO Tasks to Rate", value: 5, icon: "clipboard", iconStyle: "warn", meta: "Closed last week · quality rating needed" },
  ],

  // Tasks needing my attention as PM
  tasks: [
    { icon: "shield", style: "warn", name: "Endorse Reem Al Otaibi's probation outcome", desc: "Review due in 4 weeks (1 July) · she's at 32% onboarding", action: "Endorse" },
    { icon: "clipboard", style: "warn", name: "Rate 5 closed ODOO tasks", desc: "AWS Migration Project · last week's closed tasks", action: "Rate" },
    { icon: "calendar", style: "teal", name: "Monthly 1:1 with Ahmed Al Rashid scheduled", desc: "Thursday 14 May, 10:30 · Microsoft Teams", action: "Open" },
    { icon: "trending", style: "navy", name: "4 Team KPIs awaiting your input", desc: "Q2 KPIs need PM endorsement before HR closes the cycle", action: "Review" },
    { icon: "alert", style: "warn", name: "Marcus Wright's training overdue", desc: "AWS Solutions Architect Associate · 3 days overdue", action: "Nudge" },
  ],

  // Activity feed (my team's events)
  activity: [
    { icon: "check", style: "ok", title: "Priya Sharma completed AWS DevOps Pro certification", desc: "Auto-added to her certifications · she's now eligible for senior track", time: "2h ago" },
    { icon: "pen", style: "info", title: "You endorsed Ahmed Al Rashid's Q2 KPIs", desc: "Forwarded to HR for finalization", time: "Yesterday" },
    { icon: "calendar", style: "info", title: "1:1 with Tariq Hassan completed", desc: "Notes saved · next session in 4 weeks", time: "2 days ago" },
    { icon: "star", style: "ok", title: "Rated 3 ODOO tasks completed by Reem", desc: "Avg quality: 4.7/5 · contributes to her onboarding KPI", time: "3 days ago" },
    { icon: "shield", style: "info", title: "Khalid Mansour (LM) endorsed Sara Mitchell's probation", desc: "Pass recommendation · forwarded to HR for final decision", time: "1 week ago" },
  ],

  // Notifications dropdown / inbox
  notifications: [
    { title: "Reem Al Otaibi requested an extension on AWS SA Associate", desc: "Reason: exam slot fully booked · forwarded to HR", time: "1h ago", unread: true, icon: "clock", color: "warn" },
    { title: "Marcus Wright's training is now overdue", desc: "AWS Solutions Architect Associate · 3 days past deadline", time: "3h ago", unread: true, icon: "alert", color: "danger" },
    { title: "HR finalized Sara Mitchell's probation as Pass", desc: "Your endorsement was accepted · she's now confirmed", time: "Yesterday", unread: true, icon: "check", color: "ok" },
    { title: "1:1 reminder · Ahmed Al Rashid in 2 days", desc: "Thursday 14 May · Microsoft Teams", time: "Yesterday", unread: false, icon: "calendar", color: "teal" },
    { title: "Daniel Chen completed AWS Cloud Practitioner", desc: "Auto-verified · he's progressed to Step 4", time: "2 days ago", unread: false, icon: "check", color: "ok" },
    { title: "Q2 KPI cycle opened · 4 team members assigned", desc: "Justine (HR) set Q2 goals · you can review and endorse", time: "1 week ago", unread: false, icon: "trending", color: "navy" },
  ],

  // My team — 8 people
  team: [
    {
      id: "E001", name: "Ahmed Al Rashid", initials: "AR", title: "Solutions Architect",
      email: "ahmed.r@sudoconsultants.com", phone: "+971 50 ●●● 1422", joined: "2024-01-08",
      status: "Confirmed", attention: [],
      onboardingPct: 100, trainingsActive: 2, kpisActive: 5, certs: 4,
      lastFeedback: "12 days ago", nextFeedback: "14 May (Teams)",
    },
    {
      id: "E007", name: "Priya Sharma", initials: "PS", title: "DevOps Engineer",
      email: "priya.s@sudoconsultants.com", phone: "+971 50 ●●● 7732", joined: "2023-09-22",
      status: "Confirmed", attention: [],
      onboardingPct: 100, trainingsActive: 3, kpisActive: 5, certs: 5,
      lastFeedback: "3 weeks ago", nextFeedback: "22 May (Teams)",
    },
    {
      id: "E005", name: "Tariq Hassan", initials: "TH", title: "Cloud Engineer",
      email: "tariq.h@sudoconsultants.com", phone: "+971 50 ●●● 9112", joined: "2024-03-11",
      status: "Confirmed", attention: [],
      onboardingPct: 100, trainingsActive: 2, kpisActive: 4, certs: 3,
      lastFeedback: "2 days ago", nextFeedback: "9 June (Teams)",
    },
    {
      id: "E013", name: "Sara Mitchell", initials: "SM", title: "Project Manager",
      email: "sara.m@sudoconsultants.com", phone: "+971 50 ●●● 3401", joined: "2024-02-01",
      status: "Confirmed", attention: [],
      onboardingPct: 100, trainingsActive: 1, kpisActive: 4, certs: 2,
      lastFeedback: "1 week ago", nextFeedback: "20 May (Teams)",
    },
    {
      id: "E011", name: "Marcus Wright", initials: "MW", title: "DevOps Engineer",
      email: "marcus.w@sudoconsultants.com", phone: "+971 50 ●●● 6677", joined: "2026-01-08",
      status: "Onboarding · Step 5", attention: ["overdue-training", "probation-soon"],
      onboardingPct: 78, trainingsActive: 4, kpisActive: 3, certs: 1,
      lastFeedback: "1 week ago", nextFeedback: "16 May (Teams)",
    },
    {
      id: "E008", name: "Reem Al Otaibi", initials: "RO", title: "Cloud Engineer",
      email: "reem.o@sudoconsultants.com", phone: "+971 50 ●●● 4218", joined: "2026-04-01",
      status: "Onboarding · Step 3", attention: ["probation-soon", "kpi-pending"],
      onboardingPct: 32, trainingsActive: 4, kpisActive: 1, certs: 3,
      lastFeedback: "Not yet", nextFeedback: "15 May (Teams)",
    },
    {
      id: "E009", name: "Daniel Chen", initials: "DC", title: "Solutions Architect",
      email: "daniel.c@sudoconsultants.com", phone: "+971 50 ●●● 5083", joined: "2026-03-15",
      status: "Onboarding · Step 3", attention: [],
      onboardingPct: 44, trainingsActive: 3, kpisActive: 2, certs: 2,
      lastFeedback: "3 weeks ago", nextFeedback: "19 May (Teams)",
    },
    {
      id: "E014", name: "Bilal Anwar", initials: "BA", title: "Cloud Engineer",
      email: "bilal.a@sudoconsultants.com", phone: "+971 50 ●●● 2298", joined: "2026-03-25",
      status: "Onboarding · Step 3", attention: ["awaiting-verification"],
      onboardingPct: 32, trainingsActive: 2, kpisActive: 1, certs: 1,
      lastFeedback: "4 weeks ago", nextFeedback: "23 May (Teams)",
    },
  ],

  // Team onboarding details — extended view of who's where
  teamOnboarding: [
    { empId: "E011", name: "Marcus Wright", initials: "MW", step: 5, stepName: "Monthly Feedback", pct: 78, joined: "2026-01-08", probationDue: "2026-04-08", probationStatus: "Awaiting your endorsement", flag: "probation-this-week" },
    { empId: "E008", name: "Reem Al Otaibi", initials: "RO", step: 3, stepName: "NEO + CPD", pct: 32, joined: "2026-04-01", probationDue: "2026-07-01", probationStatus: "On track", flag: null },
    { empId: "E009", name: "Daniel Chen", initials: "DC", step: 3, stepName: "NEO + CPD", pct: 44, joined: "2026-03-15", probationDue: "2026-06-15", probationStatus: "On track", flag: null },
    { empId: "E014", name: "Bilal Anwar", initials: "BA", step: 3, stepName: "NEO + CPD", pct: 32, joined: "2026-03-25", probationDue: "2026-06-25", probationStatus: "On track", flag: "awaiting-verification" },
  ],

  // Team KPIs — Q2 cycle, for my team
  teamKpis: [
    { id: "K-2026-Q2-12", emp: "Ahmed Al Rashid", initials: "AR", title: "Lead 2 client engagements end-to-end", cycle: "Q2 2026", state: "Active", progress: 60, target: "2 engagements", canEdit: true },
    { id: "K-2026-Q2-13", emp: "Priya Sharma", initials: "PS", title: "Reduce CI/CD pipeline duration by 30%", cycle: "Q2 2026", state: "Active", progress: 75, target: "≥30% improvement", canEdit: true },
    { id: "K-2026-Q2-14", emp: "Tariq Hassan", initials: "TH", title: "Pass AWS Solutions Architect Pro exam", cycle: "Q2 2026", state: "Active", progress: 40, target: "Pass by 30 June", canEdit: false },
    { id: "K-2026-Q2-15", emp: "Sara Mitchell", initials: "SM", title: "Manage 3 concurrent client deliveries", cycle: "Q2 2026", state: "Active", progress: 65, target: "3 deliveries", canEdit: true },
    { id: "K-2026-Q2-06", emp: "Reem Al Otaibi", initials: "RO", title: "Q2 Goals — Cloud Engineering (onboarding)", cycle: "Q2 2026", state: "Pending Emp Ack", progress: 0, target: "5 KPIs", canEdit: false },
  ],

  // Probation endorsements queue
  probationQueue: [
    {
      id: "PROB001", emp: "Marcus Wright", initials: "MW", title: "DevOps Engineer",
      joined: "2026-01-08", probationDue: "2026-04-08 (overdue by 5 weeks)", urgent: true,
      onboardingPct: 78, trainingsCompleted: "7 / 9", kpisAchieved: "2 / 3",
      lmEndorsed: "Khalid Mansour · 1 week ago · recommends Pass with note: 'Strong DevOps fundamentals, slow on documentation'",
      tasksRated: 12, avgQuality: 4.2,
    },
    {
      id: "PROB002", emp: "Reem Al Otaibi", initials: "RO", title: "Cloud Engineer",
      joined: "2026-04-01", probationDue: "2026-07-01 (in 7 weeks)", urgent: false,
      onboardingPct: 32, trainingsCompleted: "4 / 9", kpisAchieved: "0 / 5",
      lmEndorsed: "Pending — Khalid Mansour scheduled to review 15 June",
      tasksRated: 3, avgQuality: 4.7,
    },
  ],

  // Feedback sessions — past + upcoming
  feedbackUpcoming: [
    { empId: "E008", emp: "Reem Al Otaibi", initials: "RO", date: "Thursday, 15 May 2026", time: "11:00 GST", channel: "Teams", purpose: "Monthly 1:1 (first since joining)" },
    { empId: "E011", emp: "Marcus Wright", initials: "MW", date: "Friday, 16 May 2026", time: "14:30 GST", channel: "Teams", purpose: "Pre-probation review chat" },
    { empId: "E001", emp: "Ahmed Al Rashid", initials: "AR", date: "Thursday, 14 May 2026", time: "10:30 GST", channel: "Teams", purpose: "Monthly 1:1" },
    { empId: "E009", emp: "Daniel Chen", initials: "DC", date: "Monday, 19 May 2026", time: "15:00 GST", channel: "Teams", purpose: "Monthly 1:1" },
    { empId: "E013", emp: "Sara Mitchell", initials: "SM", date: "Tuesday, 20 May 2026", time: "11:30 GST", channel: "Teams", purpose: "Monthly 1:1" },
    { empId: "E007", emp: "Priya Sharma", initials: "PS", date: "Thursday, 22 May 2026", time: "10:00 GST", channel: "Teams", purpose: "Monthly 1:1" },
  ],

  feedbackHistory: [
    { empId: "E005", emp: "Tariq Hassan", initials: "TH", date: "10 May 2026", durationMin: 30, notes: "Discussed AWS SA Pro prep, blocking issues with current client. Action: pair with Ahmed for the next 2 weeks." },
    { empId: "E013", emp: "Sara Mitchell", initials: "SM", date: "5 May 2026", durationMin: 45, notes: "Q1 retrospective, raised capacity concerns around the EMP-2024 project. Reassigned 2 tasks to balance workload." },
    { empId: "E001", emp: "Ahmed Al Rashid", initials: "AR", date: "30 April 2026", durationMin: 25, notes: "Client engagement going well. Recommended he start AWS SA Pro track in Q3." },
    { empId: "E007", emp: "Priya Sharma", initials: "PS", date: "22 April 2026", durationMin: 40, notes: "Pipeline duration KPI on track. Discussed Sara's mentorship opportunity for new DevOps hires." },
    { empId: "E009", emp: "Daniel Chen", initials: "DC", date: "20 April 2026", durationMin: 20, notes: "First 1:1 since joining. Settling in well, no blockers." },
    { empId: "E014", emp: "Bilal Anwar", initials: "BA", date: "15 April 2026", durationMin: 30, notes: "First 1:1. Confident on AWS basics, needs more Terraform exposure. Action: pair with Priya on next pipeline review." },
  ],

  // ODOO tasks pending PM quality rating
  odooTasksToRate: [
    { id: "ODOO-1042", title: "Implement S3 cross-region replication for client-alpha", emp: "Ahmed Al Rashid", initials: "AR", closedOn: "9 May 2026", hours: 12, complexity: "Medium" },
    { id: "ODOO-1044", title: "Migrate legacy auth service to AWS Cognito", emp: "Priya Sharma", initials: "PS", closedOn: "10 May 2026", hours: 18, complexity: "High" },
    { id: "ODOO-1047", title: "Cost optimization review for client-beta", emp: "Tariq Hassan", initials: "TH", closedOn: "10 May 2026", hours: 8, complexity: "Medium" },
    { id: "ODOO-1051", title: "Set up CloudWatch alarms for production workloads", emp: "Daniel Chen", initials: "DC", closedOn: "11 May 2026", hours: 6, complexity: "Low" },
    { id: "ODOO-1053", title: "Document AWS Well-Architected review findings", emp: "Reem Al Otaibi", initials: "RO", closedOn: "11 May 2026", hours: 10, complexity: "Medium" },
  ],

  // Recently rated tasks (history)
  odooTasksRated: [
    { id: "ODOO-1038", title: "Set up VPC peering for client-gamma", emp: "Ahmed Al Rashid", rating: 5, ratedOn: "7 May 2026", notes: "Excellent diagram and runbook documentation." },
    { id: "ODOO-1039", title: "Lambda function for daily cost reports", emp: "Tariq Hassan", rating: 4, ratedOn: "7 May 2026", notes: "Worked well, missed unit tests on the date helper." },
    { id: "ODOO-1040", title: "Terraform module for IAM roles", emp: "Priya Sharma", rating: 5, ratedOn: "6 May 2026", notes: "Reusable module already adopted by 2 other engagements." },
    { id: "ODOO-1041", title: "Client onboarding runbook update", emp: "Sara Mitchell", rating: 4, ratedOn: "5 May 2026", notes: "Good structure, could expand troubleshooting section." },
  ],

  // Team trainings — read-only PM view
  teamTrainings: [
    { emp: "Marcus Wright", initials: "MW", training: "AWS Solutions Architect Associate", state: "overdue", deadline: "9 May 2026", overdueBy: 3 },
    { emp: "Reem Al Otaibi", initials: "RO", training: "AWS Solutions Architect Associate", state: "in_progress", deadline: "26 May 2026 (extended +7 by HR)" },
    { emp: "Reem Al Otaibi", initials: "RO", training: "KnowBe4 Security Awareness", state: "in_progress", deadline: "19 May 2026" },
    { emp: "Bilal Anwar", initials: "BA", training: "AWS Cloud Practitioner Essentials", state: "awaiting_verification", deadline: "8 May 2026", certUploaded: "3 days ago" },
    { emp: "Daniel Chen", initials: "DC", training: "AWS Cloud Practitioner", state: "verified", verifiedOn: "8 Apr 2026", verifiedBy: "Justine" },
    { emp: "Priya Sharma", initials: "PS", training: "AWS DevOps Engineer Professional", state: "verified", verifiedOn: "Yesterday", verifiedBy: "Justine" },
    { emp: "Ahmed Al Rashid", initials: "AR", training: "AWS Well-Architected Framework", state: "in_progress", deadline: "No deadline" },
    { emp: "Tariq Hassan", initials: "TH", training: "AWS Solutions Architect Pro", state: "in_progress", deadline: "30 June 2026" },
  ],

  // Team documents — non-sensitive only
  teamDocuments: [
    { emp: "Reem Al Otaibi", initials: "RO", doc: "Employment Contract", status: "Signed", date: "2026-03-25" },
    { emp: "Reem Al Otaibi", initials: "RO", doc: "Probation Evaluation Form (Step 3)", status: "Pending Employee Signature", date: "2026-05-10" },
    { emp: "Marcus Wright", initials: "MW", doc: "Probation Evaluation Form (Step 5)", status: "Pending LM Endorsement", date: "2026-05-08" },
    { emp: "Daniel Chen", initials: "DC", doc: "Employment Contract", status: "Signed", date: "2026-03-15" },
    { emp: "Bilal Anwar", initials: "BA", doc: "NDA — Client A", status: "Signed", date: "2026-04-12" },
    { emp: "Sara Mitchell", initials: "SM", doc: "Confirmation Letter", status: "Signed", date: "2026-05-10" },
    { emp: "Ahmed Al Rashid", initials: "AR", doc: "NDA — Client B", status: "Signed", date: "2024-09-15" },
    { emp: "Priya Sharma", initials: "PS", doc: "NDA — Client C", status: "Signed", date: "2024-11-02" },
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
  setTimeout(() => t.classList.remove("open"), 2600);
}

// Render attention pills for team member rows
function attentionPills(attentions) {
  if (!attentions || attentions.length === 0) return "";
  const map = {
    "overdue-training":      { icon: "alert", style: "danger", label: "Training overdue" },
    "probation-soon":        { icon: "shield", style: "warn", label: "Probation soon" },
    "kpi-pending":           { icon: "trending", style: "info", label: "KPI pending" },
    "awaiting-verification": { icon: "clock", style: "teal", label: "Cert awaiting" },
  };
  return attentions.map(a => {
    const m = map[a];
    if (!m) return "";
    return `<span class="attn-pill attn-pill--${m.style}">${ICONS[m.icon] || ""}${m.label}</span>`;
  }).join("");
}

// =========================================================
// SIDEBAR
// =========================================================
function renderNav(activeId) {
  const nav = $("#nav .nav__group");
  nav.innerHTML = `<div class="nav__heading">PM Workspace</div>` + NAV_ITEMS.map(item => `
    <a class="nav__item ${item.id === activeId ? "nav__item--active" : ""}" data-route="${item.id}" href="#${item.id}">
      ${ICONS[item.iconKey] || ""}
      ${item.label}
      ${item.count !== undefined ? `<span class="nav__count ${item.countStyle ? "nav__count--" + item.countStyle : ""}">${item.count}</span>` : ""}
    </a>`).join("");
}

// =========================================================
// SLIDE-OVER
// =========================================================
function openSlideover({ title, body }) {
  $("#slideover-title").textContent = title;
  $("#slideover-body").innerHTML = body || "";
  $("#overlay").classList.add("open");
  $("#slideover").classList.add("open");
}
function closeSlideover() {
  $("#overlay").classList.remove("open");
  $("#slideover").classList.remove("open");
}
window.closeSlideover = closeSlideover;

// =========================================================
// PAGE: Dashboard
// =========================================================
// =========================================================
// PM DASHBOARD — sections are reorderable + hideable.
// =========================================================

const PM_DASHBOARD_SECTIONS = [
  { id: "welcome",        label: "Welcome banner",            hint: "Greeting + quick-action buttons", alwaysVisible: true },
  { id: "kpi-cards",      label: "Metric cards",              hint: "Team size, KPI scores, pending items strip" },
  { id: "attention-1on1", label: "Attention & 1:1 Sessions",  hint: "Two-column row: tasks needing attention + upcoming 1:1s" },
  { id: "team-activity",  label: "Team Activity feed",        hint: "Audit feed for your team this week" },
];
const PM_DASHBOARD_DEFAULT_ORDER = PM_DASHBOARD_SECTIONS.map(s => s.id);

function pmDashSectionWelcome() {
  return `
    <section class="welcome">
      <div class="welcome__text">
        <div class="welcome__eyebrow">GOOD AFTERNOON, FATIMA</div>
        <h2 class="welcome__h">5 items need your attention from your team today</h2>
        <p class="welcome__p">Marcus Wright's probation review is overdue. Reem's onboarding is at Step 3 and needs your input. 5 ODOO tasks closed last week need your quality rating.</p>
      </div>
      <div class="welcome__quick">
        <button class="quick-action" data-quick="probation">
          <div class="quick-action__icon">${ICONS.shield}</div>
          <span>Endorsements</span>
        </button>
        <button class="quick-action" data-quick="task-quality">
          <div class="quick-action__icon">${ICONS.clipboard}</div>
          <span>Rate tasks</span>
        </button>
        <button class="quick-action" data-quick="feedback">
          <div class="quick-action__icon">${ICONS.comments}</div>
          <span>1:1 Sessions</span>
        </button>
        <button class="quick-action quick-action--ghost" data-action="pm-customize-dashboard" title="Reorder or hide dashboard sections">
          <div class="quick-action__icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1m17.5-7.5l-4.2 4.2M9.7 14.3l-4.2 4.2m13-0l-4.2-4.2M9.7 9.7L5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>
          <span>Customize</span>
        </button>
      </div>
    </section>`;
}

function pmDashSectionKpiCards() {
  return `
    <section class="cards">
      ${DATA.kpiCards.map(card => `
        <div class="card" data-card-id="${card.id}">
          <div class="card__head"><div class="card__icon card__icon--${card.iconStyle}">${ICONS[card.icon] || ""}</div></div>
          <div class="card__title">${card.title}</div>
          <div class="card__value">${card.value}</div>
          <div class="card__meta">${card.meta}</div>
        </div>`).join("")}
    </section>`;
}

function pmDashSectionAttention1on1() {
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
          <div class="team-list">
            ${DATA.tasks.map(t => `
              <div class="team-row" data-task>
                <div class="team-row__avatar" style="background: ${t.style === 'warn' ? 'var(--warn-bg)' : t.style === 'danger' ? 'var(--danger-bg)' : t.style === 'teal' ? 'var(--teal-bg)' : 'var(--tint-3)'}; color: ${t.style === 'warn' ? 'var(--warn)' : t.style === 'danger' ? 'var(--danger)' : t.style === 'teal' ? 'var(--teal)' : 'var(--navy)'}">${ICONS[t.icon]}</div>
                <div class="team-row__main">
                  <div class="team-row__name">${t.name}</div>
                  <div class="team-row__role">${t.desc}</div>
                </div>
                <div></div>
                <div class="team-row__action">${t.action} →</div>
              </div>`).join("")}
          </div>
        </div>
      </article>

      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Upcoming 1:1 Sessions</h3>
            <p class="panel__sub">Next 14 days</p>
          </div>
          <a class="panel__link" data-nav="feedback">All sessions →</a>
        </header>
        <div class="panel__body">
          ${DATA.feedbackUpcoming.slice(0, 4).map(s => `
            <div class="feedback-row">
              <div class="feedback-row__avatar">${s.initials}</div>
              <div class="feedback-row__main">
                <div class="feedback-row__name">${s.emp}</div>
                <div class="feedback-row__detail">${ICONS.videoCam} ${s.date} · ${s.time}</div>
              </div>
              <div class="feedback-row__date">Teams</div>
            </div>`).join("")}
        </div>
      </article>
    </section>`;
}

function pmDashSectionTeamActivity() {
  return `
    <article class="panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Team Activity</h3>
          <p class="panel__sub">What's happened with your team this week</p>
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

const PM_DASHBOARD_SECTION_RENDERERS = {
  "welcome":        pmDashSectionWelcome,
  "kpi-cards":      pmDashSectionKpiCards,
  "attention-1on1": pmDashSectionAttention1on1,
  "team-activity":  pmDashSectionTeamActivity,
};

function pageDashboard() {
  const prefs = window.SUDO_LAYOUT
    ? SUDO_LAYOUT.getPrefs("pm-dashboard", PM_DASHBOARD_DEFAULT_ORDER)
    : { order: PM_DASHBOARD_DEFAULT_ORDER, hidden: [] };

  return prefs.order
    .filter(id => !prefs.hidden.includes(id))
    .map(id => (PM_DASHBOARD_SECTION_RENDERERS[id] || (() => ""))())
    .join("\n");
}

// =========================================================
// PAGE: My Team
// =========================================================
function pageTeam() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Team</h2>
        <div class="page-header__sub">${DATA.team.length} people · ${DATA.team.filter(t => t.status === "Confirmed").length} confirmed · ${DATA.team.filter(t => t.status !== "Confirmed").length} in onboarding</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.send} Message team</button>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.shield}
      <div>
        <strong>Team-only view.</strong> You see your assigned team members here. Sensitive fields (salary, IBAN, Emirates ID, passport) are hidden — these are only visible to HR and Super Admins.
      </div>
    </div>

    <div id="fb-pm-team"></div>

    <div id="pm-team-results">
    <div class="team-grid">
      ${DATA.team.map(t => {
        const statusSlug = (t.status || "").toLowerCase().replace(/\s+/g, "-");
        const attnSlug = t.attention.length ? "needs-attn" : "on-track";
        const tags = ["all", statusSlug, attnSlug];
        const searchText = `${t.id} ${t.name} ${t.title} ${t.email}`.toLowerCase();
        return `
        <div class="team-card" data-team-member="${t.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
          <div class="team-card__head">
            <div class="team-card__avatar">${t.initials}</div>
            <div class="team-card__main">
              <div class="team-card__name">${t.name}</div>
              <div class="team-card__role">${t.title}</div>
              <div class="team-card__contact">${t.email}</div>
            </div>
          </div>
          ${t.status === "Confirmed"
            ? '<span class="status status--ok">Confirmed</span>'
            : `<span class="status status--teal">${t.status}</span>`}
          ${t.attention.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:5px">${attentionPills(t.attention)}</div>` : ""}
          <div class="team-card__stats">
            <div class="team-card__stat">
              <div class="team-card__stat-value">${t.onboardingPct}%</div>
              <div class="team-card__stat-label">Onb.</div>
            </div>
            <div class="team-card__stat">
              <div class="team-card__stat-value">${t.kpisActive}</div>
              <div class="team-card__stat-label">KPIs</div>
            </div>
            <div class="team-card__stat">
              <div class="team-card__stat-value">${t.certs}</div>
              <div class="team-card__stat-label">Certs</div>
            </div>
          </div>
          <div class="team-card__foot">
            <button class="btn btn--ghost btn--sm">${ICONS.calendar} 1:1</button>
            <button class="btn btn--ghost btn--sm" style="margin-left:auto">${ICONS.arrowRight}</button>
          </div>
        </div>`;
      }).join("")}
    </div>
    <div class="fb-empty" style="display:none;padding:30px;text-align:center;color:var(--ink-500)">No team members match these filters</div>
    </div>
    <div id="pg-pm-team"></div>`;
}

// =========================================================
// PAGE: Team Onboarding
// =========================================================
function pageTeamOnboarding() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Team Onboarding</h2>
        <div class="page-header__sub">${DATA.teamOnboarding.length} team members in onboarding · monitor progress and probation timelines</div>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.rocket}
      <div>
        <strong>Your role in onboarding.</strong> HR owns the lifecycle, but you monitor your team's progress, hold monthly 1:1s starting Step 5, and provide a probation endorsement when their probation period ends.
      </div>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Team Member</th>
            <th>Current Step</th>
            <th>Progress</th>
            <th>Joined</th>
            <th>Probation Due</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${DATA.teamOnboarding.map(t => `
            <tr class="row-clickable" data-team-member="${t.empId}">
              <td>
                <div class="table__cell-name">
                  <div class="table__avatar">${t.initials}</div>
                  <div>
                    <div class="table__name">${t.name}</div>
                  </div>
                </div>
              </td>
              <td><span class="status status--teal">Step ${t.step} · ${t.stepName}</span></td>
              <td>
                <div class="progress-mini" style="min-width:140px">
                  <div class="progress-mini__bar"><div class="progress-mini__fill ${t.pct >= 75 ? "progress-mini__fill--ok" : ""}" style="width:${t.pct}%"></div></div>
                  <div class="progress-mini__text">${t.pct}%</div>
                </div>
              </td>
              <td class="table__mono">${t.joined}</td>
              <td class="table__mono">${t.probationDue}</td>
              <td>
                ${t.flag === "probation-this-week"
                  ? '<span class="status status--warn">Endorse now</span>'
                  : t.flag === "awaiting-verification"
                  ? '<span class="status status--teal">Cert awaiting HR</span>'
                  : '<span class="status status--ok">On track</span>'}
              </td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

// =========================================================
// PAGE: Team KPIs
// =========================================================
function pageTeamKpis() {
  // PM-validated KPIs awaiting confirmation (employee submitted, PM confirms)
  const pmValidQueue = SUDO_DB.kpiAssignments.filter(a =>
    a.status === "progress_pending_validation" &&
    (SUDO_DB_HELPERS.templateByKrn(a.templateKrn) || {}).validatorRole === "pm"
  );
  const pmAckQueue = SUDO_DB.kpiAssignments.filter(a =>
    a.status === "pending_validation" &&
    a.approvalDirection === "tl_to_hr" &&
    (SUDO_DB_HELPERS.templateByKrn(a.templateKrn) || {}).validatorRole === "pm"
  );
  const queueCount = pmValidQueue.length + pmAckQueue.length;

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Team KPIs</h2>
        <div class="page-header__sub">Q2 2026 cycle · ${DATA.teamKpis.length} active KPIs across your team · ${queueCount} item${queueCount===1?'':'s'} awaiting your validation</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.refresh} Sync from HR</button>
      </div>
    </div>

    ${queueCount > 0 ? `
      <article class="panel" style="margin-bottom:18px;border-left:4px solid var(--warn)">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">PM Validation Queue · ${queueCount}</h3>
            <p class="panel__sub">Project-related KPIs (NPS, knowledge transfer, project delivery) where you're the validator</p>
          </div>
        </header>
        <div class="panel__body" style="padding:0">
          <table class="table">
            <thead><tr><th>Type</th><th>KPI</th><th>Employee</th><th>Submitted value</th><th>Target</th><th>Action</th></tr></thead>
            <tbody>
              ${pmValidQueue.map(a => {
                const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
                const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
                return `
                  <tr>
                    <td><span class="status status--warn">Progress</span></td>
                    <td><strong>${tpl ? tpl.krn : a.templateKrn}</strong> · ${tpl ? tpl.label : '—'}</td>
                    <td>${emp ? emp.name : a.empId}</td>
                    <td><strong>${a.empSubmittedValue}</strong> ${tpl ? tpl.targetUnit : ''}</td>
                    <td>${tpl ? tpl.target : '—'}</td>
                    <td>
                      <button class="btn btn--primary btn--sm" data-action="pm-confirm-progress" data-id="${a.id}">${ICONS.check || ''} Confirm</button>
                      <button class="btn btn--ghost btn--sm" data-action="pm-revise-progress" data-id="${a.id}">Revise</button>
                    </td>
                  </tr>`;
              }).join("")}
              ${pmAckQueue.map(a => {
                const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
                const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
                return `
                  <tr>
                    <td><span class="status status--info">TL draft</span></td>
                    <td><strong>${tpl ? tpl.krn : a.templateKrn}</strong> · ${tpl ? tpl.label : '—'}</td>
                    <td>${emp ? emp.name : a.empId}</td>
                    <td class="table__sub">${a.scopeLabel || ''}</td>
                    <td>${tpl ? tpl.target : '—'}</td>
                    <td><button class="btn btn--primary btn--sm" data-action="pm-ack-draft" data-id="${a.id}">${ICONS.check || ''} Acknowledge</button></td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </article>
    ` : `
      <div class="info-banner" style="margin-bottom:14px;background:#ECFDF5;border-color:#86EFAC">${ICONS.check || ''}
        <div><strong>PM validation queue is clear.</strong> No PM-validated KPIs awaiting your action.</div>
      </div>
    `}

    <div class="info-banner">
      ${ICONS.trending}
      <div>
        <strong>What you can do here.</strong> View your team's KPIs and comment on them. For KPIs you set as Line Manager you can also edit. KPIs created by HR are read-only — you can endorse them but not change targets. Final approvals stay with HR.
      </div>
    </div>

    <div id="fb-pm-kpis"></div>

    <div id="pm-kpis-results">
    ${DATA.teamKpis.map(k => {
      const memberSlug = k.emp.toLowerCase().replace(/[^\w]+/g, "-");
      const stateSlug = (k.state || "").toLowerCase();
      const tags = ["all", stateSlug, memberSlug, "q2-2026"];
      const searchText = `${k.id} ${k.title} ${k.emp} ${k.cycle} ${k.target}`.toLowerCase();
      return `
      <div class="task-row" data-tag="${tags.join(" ")}" data-search="${searchText}">
        <div class="task-row__main">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <div class="table__avatar" style="width:28px;height:28px;font-size:10.5px">${k.initials}</div>
            <div class="task-row__title" style="margin:0">${k.title}</div>
          </div>
          <div class="task-row__meta">
            <span><strong>${k.emp}</strong></span>
            <span class="task-row__odoo-id">${k.id}</span>
            <span>${k.cycle}</span>
            <span>Target: <strong>${k.target}</strong></span>
            ${k.state === "Active"
              ? `<span>Progress: <strong>${k.progress}%</strong></span>`
              : `<span class="status status--warn">${k.state}</span>`}
          </div>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          ${k.canEdit
            ? '<button class="btn btn--secondary btn--sm">' + ICONS.pen + ' Edit</button>'
            : '<button class="btn btn--ghost btn--sm">' + ICONS.lock + ' HR-owned</button>'}
          <button class="btn btn--secondary btn--sm">${ICONS.comments} Comment</button>
          <button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button>
        </div>
      </div>`;
    }).join("")}
    <div class="fb-empty" style="display:none;padding:30px;text-align:center;color:var(--ink-500)">No KPIs match these filters</div>
    </div>
    <div id="pg-pm-kpis"></div>
  `;
}

// =========================================================
// PAGE: Probation Endorsements
// =========================================================
function pageProbation() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Probation Endorsements</h2>
        <div class="page-header__sub">Your PM input contributes to HR's final probation decision · ${DATA.probationQueue.length} pending</div>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.shield}
      <div>
        <strong>How endorsements work.</strong> The Line Manager submits their formal endorsement first. As Project Manager, you add delivery-quality context — task ratings, technical performance, collaboration. HR reviews both and makes the final call.
      </div>
    </div>

    <div id="fb-pm-probation"></div>

    ${DATA.probationQueue.map(p => `
      <div class="endorsement ${p.urgent ? "endorsement--urgent" : ""}">
        <div class="endorsement__avatar">${p.initials}</div>
        <div class="endorsement__main">
          <div class="endorsement__name">${p.emp}</div>
          <div class="endorsement__sub">${p.title} · joined ${p.joined} · probation due ${p.probationDue}</div>
          <div class="endorsement__pills">
            <span class="attn-pill attn-pill--teal">${ICONS.rocket} Onboarding ${p.onboardingPct}%</span>
            <span class="attn-pill attn-pill--info">${ICONS.book} Trainings ${p.trainingsCompleted}</span>
            <span class="attn-pill attn-pill--info">${ICONS.trending} KPIs ${p.kpisAchieved}</span>
            <span class="attn-pill attn-pill--teal">${ICONS.star} ODOO tasks rated ${p.tasksRated} · avg ${p.avgQuality}/5</span>
          </div>

          <div style="background:var(--ink-100);border-radius:8px;padding:10px 12px;margin-bottom:12px">
            <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--ink-500);margin-bottom:3px">LINE MANAGER ENDORSEMENT</div>
            <div style="font-size:12.5px;color:var(--ink-700);line-height:1.45">${p.lmEndorsed}</div>
          </div>

          <div class="endorsement-form">
            <div class="endorsement-field">
              <div class="endorsement-field__label">YOUR DELIVERY RECOMMENDATION</div>
              <div class="recommendation-options">
                <button class="rec-btn rec-btn--pass" data-rec="pass" data-emp="${p.id}">${ICONS.thumbsUp} Pass</button>
                <button class="rec-btn rec-btn--extend" data-rec="extend" data-emp="${p.id}">${ICONS.clock} Extend</button>
                <button class="rec-btn rec-btn--fail" data-rec="fail" data-emp="${p.id}">${ICONS.thumbsDown} Fail</button>
              </div>
            </div>
            <div class="endorsement-field">
              <div class="endorsement-field__label">PM NOTES (visible to HR + LM)</div>
              <textarea class="textarea" placeholder="Delivery quality, technical performance, collaboration, any concerns…"></textarea>
            </div>
          </div>
        </div>
        <div class="endorsement__actions">
          ${p.urgent ? '<div class="endorsement__meta" style="color:var(--danger);font-weight:700">URGENT · OVERDUE</div>' : ''}
          <button class="btn btn--primary" data-action="submit-endorsement">${ICONS.send} Submit to HR</button>
          <button class="btn btn--secondary btn--sm">Save draft</button>
        </div>
      </div>`).join("")}
  `;
}

// =========================================================
// PAGE: Feedback Sessions
// =========================================================
function pageFeedback() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Feedback Sessions</h2>
        <div class="page-header__sub">Monthly 1:1s with your team · all sessions on Microsoft Teams · notes private to you and the employee</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--primary">${ICONS.calendar} Schedule 1:1</button>
      </div>
    </div>

    <div class="split">
      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Upcoming Sessions</h3>
            <p class="panel__sub">${DATA.feedbackUpcoming.length} scheduled · next 14 days</p>
          </div>
        </header>
        <div class="panel__body">
          ${DATA.feedbackUpcoming.map(s => `
            <div class="feedback-row">
              <div class="feedback-row__avatar">${s.initials}</div>
              <div class="feedback-row__main">
                <div class="feedback-row__name">${s.emp}</div>
                <div class="feedback-row__detail">${ICONS.videoCam} ${s.date} · ${s.time}</div>
                <div style="font-size:11px;color:var(--ink-400);margin-top:2px">${s.purpose}</div>
              </div>
              <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">
                <button class="btn btn--secondary btn--sm" style="background:linear-gradient(135deg,#4B53BC,#6264A7);color:white;border:none">${ICONS.videoCam} Join</button>
              </div>
            </div>`).join("")}
        </div>
      </article>

      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Session History</h3>
            <p class="panel__sub">Last 6 completed sessions · notes are private</p>
          </div>
        </header>
        <div class="panel__body">
          ${DATA.feedbackHistory.map(s => `
            <div style="padding:14px 0;border-bottom:1px solid var(--ink-100)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                <div class="feedback-row__avatar" style="width:32px;height:32px;font-size:11px">${s.initials}</div>
                <div style="flex:1;min-width:0">
                  <div class="feedback-row__name">${s.emp}</div>
                  <div class="feedback-row__date">${s.date} · ${s.durationMin}min</div>
                </div>
                <button class="btn btn--ghost btn--sm">${ICONS.pen}</button>
              </div>
              <div style="font-size:12px;color:var(--ink-700);line-height:1.5;padding-left:42px">${s.notes}</div>
            </div>`).join("")}
        </div>
      </article>
    </div>`;
}

// =========================================================
// PAGE: ODOO Task Quality
// =========================================================
function pageTaskQuality() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">ODOO Task Quality</h2>
        <div class="page-header__sub">Rate completed ODOO tasks for delivery quality · feeds into team KPIs and probation reviews</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.external} Open in ODOO</button>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.clipboard}
      <div>
        <strong>Why this matters.</strong> Your task quality ratings are a PM-only contribution. They build the delivery picture of each team member — feeding into KPIs, probation endorsements, and performance reviews. ODOO is the source of truth for task lifecycle; you rate quality here.
      </div>
    </div>

    <div id="fb-pm-tasks"></div>

    <div class="section-header">Pending Rating <span class="section-header__count">${DATA.odooTasksToRate.length}</span></div>
    ${DATA.odooTasksToRate.map(t => `
      <div class="task-row">
        <div class="task-row__main">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <div class="table__avatar" style="width:28px;height:28px;font-size:10.5px">${t.initials}</div>
            <div class="task-row__title" style="margin:0">${t.title}</div>
          </div>
          <div class="task-row__meta">
            <span class="task-row__odoo-id">${t.id}</span>
            <span><strong>${t.emp}</strong></span>
            <span>Closed ${t.closedOn}</span>
            <span>${t.hours} hrs</span>
            <span>Complexity: <strong>${t.complexity}</strong></span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          <div class="stars" data-task-id="${t.id}">
            ${[1,2,3,4,5].map(n => `<div class="star" data-star="${n}">${ICONS.starOutline}</div>`).join("")}
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn--ghost btn--sm">${ICONS.pen} Note</button>
            <button class="btn btn--primary btn--sm" data-action="submit-rating">${ICONS.send} Submit</button>
          </div>
        </div>
      </div>`).join("")}

    <div class="section-header">Recently Rated <span class="section-header__count">${DATA.odooTasksRated.length}</span></div>
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr><th>Task</th><th>Employee</th><th>Rating</th><th>Notes</th><th>Rated</th></tr>
        </thead>
        <tbody>
          ${DATA.odooTasksRated.map(t => `
            <tr class="row-clickable">
              <td>
                <div class="table__name">${t.title}</div>
                <div class="task-row__odoo-id" style="display:inline-block;margin-top:2px">${t.id}</div>
              </td>
              <td>${t.emp}</td>
              <td>
                <div class="stars">
                  ${[1,2,3,4,5].map(n => `<div class="star ${n <= t.rating ? "star--active" : ""}" style="cursor:default">${ICONS.star}</div>`).join("")}
                </div>
              </td>
              <td style="font-size:12px;color:var(--ink-500);max-width:240px">${t.notes}</td>
              <td class="table__mono">${t.ratedOn}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

// =========================================================
// PAGE: Team Trainings (read-only)
// =========================================================
function pageTeamTrainings() {
  const stateMap = {
    overdue: { pill: 'status--danger', label: 'Overdue' },
    in_progress: { pill: 'status--info', label: 'In progress' },
    awaiting_verification: { pill: 'status--warn', label: 'Awaiting HR' },
    verified: { pill: 'status--ok', label: 'Verified' },
  };
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Team Trainings</h2>
        <div class="page-header__sub">Read-only view of your team's training assignments · HR owns the workflow</div>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.book}
      <div>
        <strong>Read-only for PMs.</strong> Training assignments, deadlines, and certificate verifications are managed by HR. You can see your team's progress here and nudge them, but only HR can extend deadlines, allow re-uploads, or verify certificates.
      </div>
    </div>

    <div id="fb-pm-trainings"></div>

    <div class="table-wrap" id="pm-trainings-results">
      <table class="table">
        <thead>
          <tr><th>Team Member</th><th>Training</th><th>State</th><th>Deadline / Verified</th><th></th></tr>
        </thead>
        <tbody>
          ${DATA.teamTrainings.map(t => {
            const s = stateMap[t.state];
            const dl = t.state === "verified"
              ? `Verified ${t.verifiedOn} by ${t.verifiedBy}`
              : t.state === "awaiting_verification"
              ? `Uploaded ${t.certUploaded}`
              : t.state === "overdue"
              ? `${t.deadline} (overdue ${t.overdueBy} days)`
              : t.deadline;
            const memberSlug = t.emp.toLowerCase().replace(/[^\w]+/g, "-");
            const tags = ["all", t.state.replace(/_/g, "-"), memberSlug];
            const searchText = `${t.emp} ${t.training} ${t.state}`.toLowerCase();
            return `
              <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
                <td>
                  <div class="table__cell-name">
                    <div class="table__avatar">${t.initials}</div>
                    <div><div class="table__name">${t.emp}</div></div>
                  </div>
                </td>
                <td><div class="table__name" style="font-size:12.5px;font-weight:600">${t.training}</div></td>
                <td><span class="status ${s.pill}">${s.label}</span></td>
                <td class="table__mono" style="font-size:11.5px">${dl}</td>
                <td>${t.state === "overdue" ? '<button class="btn btn--secondary btn--sm">' + ICONS.send + ' Nudge</button>' : '<button class="btn btn--ghost btn--sm">' + ICONS.arrowRight + '</button>'}</td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none;padding:30px;text-align:center;color:var(--ink-500)">No trainings match these filters</div>
    </div>
    <div id="pg-pm-trainings"></div>`;
}

// =========================================================
// PAGE: Team Documents (read-only, non-sensitive)
// =========================================================
function pageTeamDocuments() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Team Documents</h2>
        <div class="page-header__sub">Non-sensitive documents for your team · contracts, NDAs, evaluations</div>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.lock}
      <div>
        <strong>What you can see.</strong> Contract status, NDA signing status, and evaluation forms for your team — but not the documents themselves. Salary letters, banking documents, and personal IDs are HR-only. To download a document on behalf of an employee, ask HR.
      </div>
    </div>

    <div id="fb-pm-docs"></div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr><th>Team Member</th><th>Document</th><th>Status</th><th>Date</th><th></th></tr>
        </thead>
        <tbody>
          ${DATA.teamDocuments.map(d => {
            const st = d.status === "Signed" ? "ok" :
                       d.status.includes("Pending Employee") ? "warn" :
                       d.status.includes("Pending LM") ? "danger" : "muted";
            return `
              <tr class="row-clickable">
                <td>
                  <div class="table__cell-name">
                    <div class="table__avatar">${d.initials}</div>
                    <div><div class="table__name">${d.emp}</div></div>
                  </div>
                </td>
                <td><div class="table__name" style="font-size:12.5px;font-weight:600">${d.doc}</div></td>
                <td><span class="status status--${st}">${d.status}</span></td>
                <td class="table__mono">${d.date}</td>
                <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button></td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
}

// =========================================================
// PAGE: Grant Badges (PM can grant role-specific badges)
// =========================================================
function pageGrantBadgesPm() {
  // Badges PM is allowed to grant (HR controls per-badge permissions)
  const PM_GRANTABLE = [
    { id: "b-good",     label: "Good Job",        points: 5,  icon: "👍", color: "#94A3B8", roles: ["Employee","TL","PM","HR","Admin"], desc: "Peer-to-peer recognition for everyday wins" },
    { id: "b-hands",    label: "Helping Hands",   points: 15, icon: "🤝", color: "#1F8A4C", roles: ["Employee","TL","PM","HR"],          desc: "For going above & beyond to help a teammate" },
    { id: "b-runbook",  label: "Runbook Hero",    points: 30, icon: "📚", color: "#0F7A8A", roles: ["TL","PM","HR","Admin"],             desc: "For exceptional contributions to runbooks/docs" },
    { id: "b-debug",    label: "Debug Wizard",    points: 35, icon: "🔧", color: "#189CD9", roles: ["TL","PM","HR","Admin"],             desc: "For an exceptional debug / RCA contribution" },
    { id: "b-cust",     label: "Customer Hero",   points: 60, icon: "🦸", color: "#C8333A", roles: ["PM","HR","Admin"],                  desc: "For a notable customer-facing win" },
  ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Grant Badges</h2>
        <div class="page-header__sub">Recognize your team · ${PM_GRANTABLE.length} badges available to you as PM</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.clock || ICONS.refresh} My past grants</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:18px">
      ${ICONS.shield}
      <div><strong>You are a PM.</strong> The badges below are the ones HR has marked as grantable by PMs. Other badges (like Mentor, Innovator) are restricted to other roles. Customize per-badge permissions in the HR Badges Catalogue.</div>
    </div>

    <div id="fb-pm-badges"></div>

    <div class="badge-grid">
      ${PM_GRANTABLE.map(b => `
        <div class="badge-tile" style="--badge-color:${b.color}">
          <div class="badge-tile__icon">${b.icon}</div>
          <div class="badge-tile__title">${b.label}</div>
          <div class="badge-tile__points">+${b.points} points</div>
          <div class="badge-tile__desc">${b.desc}</div>
          <div class="badge-tile__permissions">
            <span class="dim">Grantable by:</span>
            ${b.roles.map(r => `<span class="badge-role-pill">${r}</span>`).join(' ')}
          </div>
          <button class="btn btn--primary btn--sm badge-tile__cta" data-action="pm-grant-badge" data-badge-id="${b.id}">${ICONS.send} Grant this badge</button>
        </div>
      `).join("")}
    </div>

    <article class="panel" style="margin-top:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Recent grants from your team</h3>
          <p class="panel__sub">Last 30 days</p>
        </div>
      </header>
      <div class="panel__body">
        <div class="activity-feed">
          <div class="act"><div class="act__dot">📚</div><div class="act__main"><strong>Runbook Hero</strong> granted to Karim Salah<br><span>By you · "Comprehensive DR runbook for TelcoCo"</span></div><div class="act__time">3 days ago</div></div>
          <div class="act"><div class="act__dot">🦸</div><div class="act__main"><strong>Customer Hero</strong> granted to Ananya Sharma<br><span>By you · "Saved the Client-Alpha go-live"</span></div><div class="act__time">1 week ago</div></div>
          <div class="act"><div class="act__dot">🔧</div><div class="act__main"><strong>Debug Wizard</strong> granted to Yan Zhang<br><span>By Khalid (TL) · "Tracked down a 3-month-old prod bug"</span></div><div class="act__time">2 weeks ago</div></div>
        </div>
      </div>
    </article>
  `;
}

// =========================================================
// PAGE: Notifications
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

    <div id="fb-pm-notifs"></div>

    <div class="inbox">
      ${DATA.notifications.map(n => `
        <div class="inbox__item ${n.unread ? "inbox__item--unread" : ""}">
          <div class="inbox__icon card__icon--${n.color}">${ICONS[n.icon] || ""}</div>
          <div class="inbox__main">
            <div class="inbox__title">${n.title}</div>
            <div class="inbox__desc">${n.desc}</div>
          </div>
          <div class="inbox__time">${n.time}</div>
        </div>`).join("")}
    </div>`;
}

// =========================================================
// PAGE: My Profile (Fatima's own profile — she's also an employee)
// =========================================================
function pageProfile() {
  return `
    <section class="profile-hero">
      <div class="profile-hero__avatar">${DATA.user.initials}</div>
      <div class="profile-hero__main">
        <div class="profile-hero__name">${DATA.user.name}</div>
        <div class="profile-hero__title">${DATA.user.title} · ${DATA.user.dept}</div>
        <div class="profile-hero__meta">
          <span>${ICONS.briefcase} <strong>${DATA.user.employeeId}</strong></span>
          <span>${ICONS.mail} <strong>${DATA.user.email}</strong></span>
          <span>${ICONS.calendar} Joined <strong>${DATA.user.joined}</strong></span>
        </div>
      </div>
      <div style="position:relative;z-index:1">
        <button class="btn btn--secondary" style="background:rgba(255,255,255,0.15);color:white;border-color:rgba(255,255,255,0.25);backdrop-filter:blur(6px)">${ICONS.pen} Edit Profile</button>
      </div>
    </section>

    <div class="info-banner">
      ${ICONS.user}
      <div>
        <strong>You are both a PM and an Employee.</strong> Your personal employee view (your trainings, certifications, KPIs, payslip) lives in the Employee portal. Switch to it by clicking your name in the sidebar, then choose Employee.
      </div>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <div class="info-card__title">${ICONS.user} Personal Information</div>
        <div class="info-row"><span class="info-row__label">Full Name</span><span class="info-row__value">${DATA.user.name}</span></div>
        <div class="info-row"><span class="info-row__label">Nationality</span><span class="info-row__value">UAE</span></div>
        <div class="info-row"><span class="info-row__label">Languages</span><span class="info-row__value">Arabic, English</span></div>
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.mail} Contact</div>
        <div class="info-row"><span class="info-row__label">Work Email</span><span class="info-row__value info-row__value--mono">${DATA.user.email}</span></div>
        <div class="info-row"><span class="info-row__label">Mobile</span><span class="info-row__value info-row__value--mono">${DATA.user.phone}</span></div>
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.briefcase} Role</div>
        <div class="info-row"><span class="info-row__label">Title</span><span class="info-row__value">${DATA.user.title}</span></div>
        <div class="info-row"><span class="info-row__label">Department</span><span class="info-row__value">${DATA.user.dept}</span></div>
        <div class="info-row"><span class="info-row__label">Employee ID</span><span class="info-row__value info-row__value--mono">${DATA.user.employeeId}</span></div>
        <div class="info-row"><span class="info-row__label">Joined</span><span class="info-row__value">${DATA.user.joined}</span></div>
      </div>

      <div class="info-card" style="grid-column: 1 / -1">
        <div class="info-card__title">${ICONS.users} PM Responsibilities</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">
          <div>
            <div class="team-card__stat-label" style="margin-bottom:4px">TEAM SIZE</div>
            <div style="font-size:22px;font-weight:700;color:var(--ink-900)">${DATA.team.length} <span style="font-size:13px;color:var(--ink-400);font-weight:500">people</span></div>
          </div>
          <div>
            <div class="team-card__stat-label" style="margin-bottom:4px">ENTRA GROUPS</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:4px">
              <span class="status status--teal" style="font-family:var(--font-mono);font-size:10.5px">sudoconsultants-portal-pm</span>
              <span class="status status--muted" style="font-family:var(--font-mono);font-size:10.5px">sudoconsultants-portal-user</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// =========================================================
// ROUTER
// =========================================================
const ROUTES = {
  "dashboard":        pageDashboard,
  "team":             pageTeam,
  "team-onboarding":  pageTeamOnboarding,
  "team-kpis":        pageTeamKpis,
  "probation":        pageProbation,
  "feedback":         pageFeedback,
  "task-quality":     pageTaskQuality,
  "team-trainings":   pageTeamTrainings,
  "team-documents":   pageTeamDocuments,
  "grant-badges":     pageGrantBadgesPm,
  "notifications":    pageNotifications,
  "profile":          pageProfile,
};

function route() {
  const hash = location.hash.replace(/^#/, "") || "dashboard";
  const id = ROUTES[hash] ? hash : "dashboard";
  const meta = NAV_ITEMS.find(n => n.id === id);

  $("#page-title").textContent = meta.title;
  $("#page-breadcrumb").innerHTML = id === "dashboard"
    ? `<span>Tuesday, 12 May 2026</span><span class="dot-sep">•</span><span>Delivery · 8 team members</span>`
    : `<span>PM Workspace</span><span class="dot-sep">›</span><span>${meta.label}</span>`;
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
  // PM dashboard customize button
  $$('[data-action="pm-customize-dashboard"]').forEach(b => b.addEventListener("click", () => {
    if (!window.SUDO_LAYOUT) { toast("Layout helper not loaded"); return; }
    SUDO_LAYOUT.openCustomizer({
      pageKey: "pm-dashboard",
      label: "PM Dashboard",
      sections: PM_DASHBOARD_SECTIONS,
      defaultOrder: PM_DASHBOARD_DEFAULT_ORDER,
      onSave: () => {
        toast("Layout saved — reloading");
        setTimeout(() => location.reload(), 500);
      },
    });
  }));

  // KPI cards / quick-action navigation
  $$("[data-card-id]").forEach(el => el.addEventListener("click", () => {
    const id = el.dataset.cardId;
    const navMap = { "team-size": "team", "probation-due": "probation", "kpis-pending": "team-kpis", "tasks-to-rate": "task-quality" };
    if (navMap[id]) location.hash = "#" + navMap[id];
  }));
  $$("[data-quick]").forEach(b => b.addEventListener("click", () => {
    location.hash = "#" + b.dataset.quick;
  }));
  $$("[data-nav]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    location.hash = "#" + a.dataset.nav;
  }));

  // Tabs (notifications page)
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    const parent = t.parentElement;
    $$(".tab", parent).forEach(x => x.classList.remove("tab--active"));
    t.classList.add("tab--active");
  }));

  // Team member card click → detail slide-over
  $$("[data-team-member]").forEach(card => card.addEventListener("click", e => {
    if (e.target.closest("button")) return;
    const id = card.dataset.teamMember;
    const m = DATA.team.find(x => x.id === id);
    if (!m) return;
    openTeamMemberDetail(m);
  }));

  // Probation recommendation buttons (single-select per row)
  $$(".rec-btn").forEach(b => b.addEventListener("click", () => {
    // remove active from siblings in the same row
    const row = b.closest(".recommendation-options");
    $$(".rec-btn", row).forEach(x => x.classList.remove("rec-btn--active"));
    b.classList.add("rec-btn--active");
  }));

  // Star ratings on task quality page
  $$("[data-task-id]").forEach(starsEl => {
    const stars = $$(".star", starsEl);
    stars.forEach((s, idx) => {
      s.addEventListener("click", () => {
        stars.forEach((x, i) => {
          x.classList.toggle("star--active", i <= idx);
          x.innerHTML = i <= idx ? ICONS.star : ICONS.starOutline;
        });
      });
    });
  });

  // ── PM Validation Queue actions ────────────────────────────────────
  $$("[data-action='pm-confirm-progress']").forEach(b => b.addEventListener("click", async () => {
    const id = b.dataset.id;
    const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
    if (!a) return;
    const me = SUDO_DB.employees.find(e => e.name === "Fatima Al Zaabi") || SUDO_DB.employees.find(e => e.teamId === "pm" && e.teamRole === "lead");
    if (window.api) {
      try {
        b.disabled = true;
        await api.kpi.validate(id, { validatedValue: a.empSubmittedValue });
      } catch (e) {
        toast("Validate failed: " + (e.message || "error"));
        b.disabled = false;
        return;
      }
    }
    SUDO_DB_OVERRIDES.updateAssignment(id, {
      status: "active",
      validatedValue: a.empSubmittedValue,
      validatedBy: me ? me.id : "E006",
      validatedAt: new Date().toISOString().slice(0, 10),
    });
    const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
    SUDO_DB_OVERRIDES.audit(me ? me.name + " (PM)" : "PM", "kpi.progress.pm_confirmed", id, `${tpl ? tpl.krn : ''} value ${a.empSubmittedValue}`);
    toast("Validated · employee scorecard updated");
    if (window.SUDO_HYDRATE) { await SUDO_HYDRATE.rehydrate("kpiAssignments"); route(); }
    else setTimeout(() => location.reload(), 600);
  }));

  $$("[data-action='pm-revise-progress']").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.id;
    const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
    if (!a) return;
    const newVal = prompt(`Submitted: ${a.empSubmittedValue}. Enter revised value:`, a.empSubmittedValue);
    if (newVal === null) return;
    const num = parseFloat(newVal);
    if (isNaN(num)) { toast("Enter a number"); return; }
    const me = SUDO_DB.employees.find(e => e.name === "Fatima Al Zaabi") || SUDO_DB.employees.find(e => e.teamId === "pm" && e.teamRole === "lead");
    SUDO_DB_OVERRIDES.updateAssignment(id, {
      status: "active",
      validatedValue: num,
      validatedBy: me ? me.id : "E006",
      validatedAt: new Date().toISOString().slice(0, 10),
    });
    SUDO_DB_OVERRIDES.audit(me ? me.name + " (PM)" : "PM", "kpi.progress.pm_revised", id, `${a.empSubmittedValue} → ${num}`);
    toast("Revised and validated");
    setTimeout(() => location.reload(), 600);
  }));

  $$("[data-action='pm-ack-draft']").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.id;
    const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
    if (!a) return;
    const me = SUDO_DB.employees.find(e => e.name === "Fatima Al Zaabi") || SUDO_DB.employees.find(e => e.teamId === "pm" && e.teamRole === "lead");
    SUDO_DB_OVERRIDES.updateAssignment(id, {
      status: "active",
      tlApprovedBy: me ? me.id : "E006",
      tlApprovedAt: new Date().toISOString().slice(0, 10),
    });
    SUDO_DB_OVERRIDES.audit(me ? me.name + " (PM)" : "PM", "kpi.assignment.pm_acknowledged", id, "Now active");
    toast("Acknowledged · KPI is now active");
    setTimeout(() => location.reload(), 600);
  }));

  // Generic action toasts
  $$("[data-action]:not([data-action^='pm-confirm']):not([data-action^='pm-revise']):not([data-action^='pm-ack'])").forEach(b => b.addEventListener("click", () => {
    const action = b.dataset.action;
    const messages = {
      "submit-endorsement": "Endorsement submitted to HR · LM and Employee notified",
      "submit-rating": "Task rating saved · contributes to employee's quality metric",
      "pm-grant-badge": "Badge granted · recipient and HR have been notified",
    };
    toast(messages[action] || "Action completed");
  }));

  // ── FilterBar mounts (PM pages) ─────────────────────────
  if (window.FilterBar) {
    const fb = (id, opts) => document.getElementById(id) && FilterBar.mount(id, opts);
    const pg = (id, opts) => window.Pagination && document.getElementById(id) && Pagination.mount(id, opts);

    // ── My Team (item-tagged + paginated) ──────────────
    function pmTeamCount(tag) {
      return document.querySelectorAll(`#pm-team-results .team-card[data-tag~="${tag}"]`).length;
    }
    fb("fb-pm-team", {
      targetContainer: "pm-team-results",
      tabs: [
        { id: "all",          label: "All",              count: pmTeamCount("all") },
        { id: "confirmed",    label: "Confirmed",        count: pmTeamCount("confirmed") },
        { id: "onboarding",   label: "Onboarding",       count: pmTeamCount("onboarding") },
        { id: "needs-attn",   label: "Needs attention",  count: pmTeamCount("needs-attn") },
      ],
      views: ["tiles"],
      filters: [
        { id: "status", label: "Status", options: ["All statuses", "Confirmed", "Probation", "Onboarding"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-pm-team", { targetContainer: "pm-team-results", itemSelector: ".team-card[data-tag]", pageSize: 6 });

    function pmKpiCount(tag) {
      return document.querySelectorAll(`#pm-kpis-results .task-row[data-tag~="${tag}"]`).length;
    }
    fb("fb-pm-kpis", {
      targetContainer: "pm-kpis-results",
      tabs: [
        { id: "all",     label: "All",         count: pmKpiCount("all") },
        { id: "active",  label: "Active",      count: pmKpiCount("active") },
        { id: "pending", label: "Pending ack", count: pmKpiCount("pending-ack") },
        { id: "achieved",label: "Achieved",    count: pmKpiCount("achieved") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "member", label: "Member", options: ["All members", ...DATA.team.slice(0,8).map(t=>t.name)] },
        { id: "cycle",  label: "Cycle",  options: ["All cycles", "Q2 2026", "Q1 2026"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-pm-kpis", { targetContainer: "pm-kpis-results", itemSelector: ".task-row[data-tag]", pageSize: 8 });

    fb("fb-pm-probation", {
      tabs: [
        { id: "pending",   label: "Pending Endorsement", count: DATA.probationQueue.length },
        { id: "submitted", label: "Submitted",           count: 2 },
        { id: "decided",   label: "Decided"                       },
      ],
      views: ["list", "tiles"],
      period: true,
      filters: [
        { id: "urgency", label: "Urgency", options: ["All", "Urgent (due ≤7 days)", "Normal"] },
      ],
      search: true,
      download: true,
    });

    fb("fb-pm-tasks", {
      tabs: [
        { id: "pending",   label: "Pending rating", count: DATA.odooTasksToRate.length },
        { id: "rated",     label: "Rated this week"                                     },
        { id: "all",       label: "All history"                                          },
      ],
      views: ["list", "tiles", "kanban"],
      period: true,
      filters: [
        { id: "member",     label: "Member",     options: ["All members", ...DATA.team.slice(0,8).map(t=>t.name)] },
        { id: "complexity", label: "Complexity", options: ["Any", "High", "Medium", "Low"] },
      ],
      search: true,
      download: true,
    });

    function pmTrCount(tag) {
      return document.querySelectorAll(`#pm-trainings-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-pm-trainings", {
      targetContainer: "pm-trainings-results",
      tabs: [
        { id: "all",         label: "All",          count: pmTrCount("all") },
        { id: "overdue",     label: "Overdue",      count: pmTrCount("overdue") },
        { id: "in-progress", label: "In progress",  count: pmTrCount("in-progress") },
        { id: "awaiting-verification", label: "Awaiting HR", count: pmTrCount("awaiting-verification") },
        { id: "verified",    label: "Verified",     count: pmTrCount("verified") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "member", label: "Member", options: ["All team", ...DATA.team.slice(0,8).map(t=>t.name)] },
      ],
      search: true,
      download: true,
    });
    pg("pg-pm-trainings", { targetContainer: "pm-trainings-results", itemSelector: "tbody tr[data-tag]", pageSize: 8 });

    fb("fb-pm-docs", {
      tabs: [
        { id: "all",      label: "All"           },
        { id: "pending",  label: "Pending"       },
        { id: "signed",   label: "Signed"        },
      ],
      views: ["list", "tiles"],
      period: true,
      filters: [
        { id: "type",   label: "Type",   options: ["All types", "Contract", "NDA", "Evaluation"] },
        { id: "member", label: "Member", options: ["All team", ...DATA.team.slice(0,8).map(t=>t.name)] },
      ],
      search: true,
      download: true,
    });

    fb("fb-pm-badges", {
      views: ["tiles", "list"],
      period: false,
      filters: [
        { id: "points", label: "Point range", options: ["All", "1-15 pts", "16-40 pts", "41-75 pts"] },
      ],
      search: true,
      download: false,
    });

    fb("fb-pm-notifs", {
      tabs: [
        { id: "all",     label: "All",       count: DATA.notifications.length },
        { id: "unread",  label: "Unread"            },
        { id: "team",    label: "My Team"           },
        { id: "from-hr", label: "From HR"           },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "category", label: "Category", options: ["All", "Training", "Leave", "KPI", "Probation"] },
      ],
      search: true,
      download: false,
    });
  }
}

// Team member detail slide-over (with PM's restricted-field view)
function openTeamMemberDetail(m) {
  openSlideover({
    title: m.name,
    body: `
      <div class="member-hero">
        <div class="member-hero__avatar">${m.initials}</div>
        <div>
          <div class="member-hero__name">${m.name}</div>
          <div class="member-hero__role">${m.title}</div>
          <div class="member-hero__email">${m.email}</div>
        </div>
      </div>

      <div class="form-grid form-grid--single">
        <div class="info-row"><span class="info-row__label">Employee ID</span><span class="info-row__value info-row__value--mono">${m.id}</span></div>
        <div class="info-row"><span class="info-row__label">Mobile</span><span class="info-row__value info-row__value--mono">${m.phone}</span></div>
        <div class="info-row"><span class="info-row__label">Joined</span><span class="info-row__value">${m.joined}</span></div>
        <div class="info-row"><span class="info-row__label">Status</span><span class="info-row__value">${m.status === "Confirmed" ? '<span class="status status--ok">Confirmed</span>' : `<span class="status status--teal">${m.status}</span>`}</span></div>
        <div class="info-row"><span class="info-row__label">Onboarding</span><span class="info-row__value">${m.onboardingPct}% complete</span></div>
        <div class="info-row"><span class="info-row__label">Active trainings</span><span class="info-row__value">${m.trainingsActive}</span></div>
        <div class="info-row"><span class="info-row__label">Active KPIs</span><span class="info-row__value">${m.kpisActive}</span></div>
        <div class="info-row"><span class="info-row__label">Certifications</span><span class="info-row__value">${m.certs}</span></div>
        <div class="info-row"><span class="info-row__label">Last 1:1</span><span class="info-row__value">${m.lastFeedback}</span></div>
        <div class="info-row"><span class="info-row__label">Next 1:1</span><span class="info-row__value">${m.nextFeedback}</span></div>
      </div>

      <div class="private-locked" style="margin-top:16px">
        ${ICONS.lock}
        <span><strong>Private fields hidden.</strong> Salary, IBAN, Emirates ID, passport, banking details are visible to HR only. To view these, request from HR with a documented reason.</span>
      </div>

      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
        <button class="btn btn--secondary">${ICONS.calendar} Schedule 1:1</button>
        <button class="btn btn--primary">${ICONS.send} Message</button>
      </div>`,
  });
}

// =========================================================
// GLOBAL EVENTS
// =========================================================
function renderNotifDropdown() {
  $("#notif-body").innerHTML = DATA.notifications.slice(0, 5).map(n => `
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

  $("#schedule-feedback-btn").addEventListener("click", () => {
    location.hash = "#feedback";
  });

  // Role-switch back to welcome page
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
SUDO_INIT("pm", () => {
  renderNotifDropdown();
  bindGlobalEvents();
  route();
});

// ── Role switcher — Fatima Al Zaabi happens to be both a PM and a TL in this
// prototype (a real-world case: engineering managers who lead a project AND
// have direct reports). She can preview Employee.
if (window.RoleSwitcher) {
  const meId = "E006";  // Fatima — the PM demo user
  const myRoles = (window.SUDO_DB_OVERRIDES && SUDO_DB_OVERRIDES.getRoles)
    ? SUDO_DB_OVERRIDES.getRoles(meId)
    : ["pm", "tl", "employee"];
  RoleSwitcher.mount({
    currentRole: "pm",
    basePath: "..",
    hasMultipleRoles: myRoles.length > 1,
    userRoles: myRoles,
    userId: meId,
  });
}
