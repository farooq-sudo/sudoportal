/**
 * SUDO — Team Lead Portal
 *
 * Pages:
 *   - dashboard        Team overview, today's ratings to give, probation alerts
 *   - team             Direct reports (with multiple views: list / kanban / tiles)
 *   - probation        Probation tracking — meetings, remarks, decisions
 *   - project-ratings  PM ratings flowing in for TL to add comments + forward to HR
 *   - kpis             KPI tracking + ratings the TL gives team members
 *   - badges           Grant badges (filtered to badges TL is allowed to grant)
 *   - profile          TL's own profile (read-only summary, with employee-style fields)
 *   - notifications    Inbox
 */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// -----------------------------------------------------------
// ICONS
// -----------------------------------------------------------
const ICONS = {
  home:       '<svg viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  users:      '<svg viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shield:     '<svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star:       '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  chart:      '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  award:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="currentColor" stroke-width="2"/><path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  user:       '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  bell:       '<svg viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:      '<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock:      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  alert:      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  send:       '<svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pen:        '<svg viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  filter:     '<svg viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  list:       '<svg viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  kanban:     '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="6" height="18" rx="1" stroke="currentColor" stroke-width="2"/><rect x="10" y="3" width="6" height="11" rx="1" stroke="currentColor" stroke-width="2"/><rect x="17" y="3" width="4" height="14" rx="1" stroke="currentColor" stroke-width="2"/></svg>',
  grid:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/></svg>',
  download:   '<svg viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external:   '<svg viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  message:    '<svg viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  briefcase:  '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="2"/></svg>',
  calendar:   '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  plus:       '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  menu:       '<svg viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

// -----------------------------------------------------------
// NAV ITEMS
// -----------------------------------------------------------
const NAV_ITEMS = [
  { id: "dashboard",       label: "Dashboard",            iconKey: "home",      title: "Team Lead Dashboard" },
  { id: "team",            label: "My Team",              iconKey: "users",     title: "My Team",         badge: "12" },
  { id: "probation",       label: "Probation Tracking",   iconKey: "shield",    title: "Probation Tracking", badge: "3" },
  { id: "project-ratings", label: "Project Ratings",      iconKey: "star",      title: "Project Ratings", badge: "4" },
  { id: "kpis",            label: "KPI Reviews",          iconKey: "chart",     title: "KPI Reviews",     badge: "5" },
  { id: "kpi-library",     label: "KPI Library",          iconKey: "menu",      title: "KPI Library" },
  { id: "kpi-assign",      label: "Assign KPIs",          iconKey: "plus",      title: "Assign KPIs" },
  { id: "badges",          label: "Grant Badges",         iconKey: "award",     title: "Grant Badges" },
  { id: "profile",         label: "My Profile",           iconKey: "user",      title: "My Profile" },
  { id: "notifications",   label: "Notifications",        iconKey: "bell",      title: "Notifications",   badge: "4" },
];

// -----------------------------------------------------------
// DATA  (mock, ready to swap to API)
// -----------------------------------------------------------
const DATA = {
  tl: { name: "Khalid Mansour", title: "Engineering Manager · Cloud", dept: "Cloud Engineering", reports: 12 },

  // Direct reports
  team: [
    { id: "E008", name: "Reem Al Otaibi",      title: "Cloud Engineer",       status: "Onboarding", joined: "2026-04-01", progress: 32, kpiScore: 0,  lastRating: null,        flagged: false, probation: true,  badges: 1, projects: 2 },
    { id: "E011", name: "Marcus Wright",       title: "DevOps Engineer",      status: "Probation",  joined: "2026-01-08", progress: 100, kpiScore: 78, lastRating: 4.2,         flagged: false, probation: true,  badges: 3, projects: 1 },
    { id: "E020", name: "Ananya Sharma",       title: "Senior Cloud Eng.",    status: "Confirmed",  joined: "2024-02-12", progress: 100, kpiScore: 91, lastRating: 4.8,         flagged: false, probation: false, badges: 9, projects: 3 },
    { id: "E024", name: "Daniyal Habib",       title: "Cloud Engineer",      status: "Confirmed",  joined: "2024-09-01", progress: 100, kpiScore: 84, lastRating: 4.4,         flagged: false, probation: false, badges: 5, projects: 2 },
    { id: "E031", name: "Lina Haddad",         title: "Senior Cloud Eng.",    status: "Confirmed",  joined: "2023-06-20", progress: 100, kpiScore: 88, lastRating: 4.6,         flagged: false, probation: false, badges: 7, projects: 4 },
    { id: "E032", name: "Tomás Rivera",        title: "Junior Cloud Eng.",    status: "Probation",  joined: "2026-02-18", progress: 100, kpiScore: 65, lastRating: 3.4,         flagged: true,  probation: true,  badges: 0, projects: 1 },
    { id: "E033", name: "Priya Iyer",          title: "Cloud Engineer",      status: "Confirmed",  joined: "2024-11-04", progress: 100, kpiScore: 82, lastRating: 4.5,         flagged: false, probation: false, badges: 4, projects: 2 },
    { id: "E034", name: "Hamza Al Mahmoud",    title: "Cloud Engineer",      status: "Confirmed",  joined: "2025-01-20", progress: 100, kpiScore: 75, lastRating: 4.1,         flagged: false, probation: false, badges: 2, projects: 2 },
    { id: "E035", name: "Yan Zhang",           title: "Senior Cloud Eng.",    status: "Confirmed",  joined: "2023-03-10", progress: 100, kpiScore: 86, lastRating: 4.7,         flagged: false, probation: false, badges: 8, projects: 5 },
    { id: "E036", name: "Maya Robinson",       title: "Junior Cloud Eng.",    status: "Probation",  joined: "2026-03-22", progress: 100, kpiScore: 71, lastRating: 3.9,         flagged: false, probation: true,  badges: 1, projects: 1 },
    { id: "E037", name: "Sami Berkani",        title: "Cloud Engineer",      status: "Confirmed",  joined: "2024-08-05", progress: 100, kpiScore: 80, lastRating: 4.3,         flagged: false, probation: false, badges: 3, projects: 2 },
    { id: "E038", name: "Karim Salah",         title: "Lead Engineer",       status: "Confirmed",  joined: "2022-07-11", progress: 100, kpiScore: 93, lastRating: 4.9,         flagged: false, probation: false, badges: 12, projects: 6 },
  ],

  // Project ratings flowing from PMs — TL reviews and forwards to HR
  projectRatings: [
    { id: "PR-2026-018", projectName: "Client-Alpha · AWS Migration", member: "Reem Al Otaibi",   memberId: "E008", pm: "Fatima Al Zaabi", pmRating: 4.3, pmComment: "Strong delivery on the documentation; needs to push more on architecture decisions.", submittedAt: "2 days ago", state: "pending_tl" },
    { id: "PR-2026-017", projectName: "Bank-of-Sky · Lift & Shift",   member: "Marcus Wright",    memberId: "E011", pm: "Sara Mitchell",   pmRating: 4.1, pmComment: "Reliable, good IaC discipline. Some communication delays.", submittedAt: "3 days ago", state: "pending_tl" },
    { id: "PR-2026-016", projectName: "TelcoCo · DR Implementation", member: "Tomás Rivera",     memberId: "E032", pm: "Khalid Mansour",  pmRating: 3.2, pmComment: "Asks good questions but struggles with self-direction. Recommend additional pairing.", submittedAt: "1 week ago", state: "pending_tl" },
    { id: "PR-2026-015", projectName: "Retail-Co · Migration",       member: "Ananya Sharma",    memberId: "E020", pm: "Fatima Al Zaabi", pmRating: 4.9, pmComment: "Exceptional. Saved the migration timeline with the proactive runbook work.", submittedAt: "1 week ago", state: "pending_tl" },
  ],

  // Past TL→HR forwards (so the page has history)
  ratingsHistory: [
    { id: "PR-2026-014", projectName: "Retail-Co · Migration",        member: "Lina Haddad",      pm: "Fatima Al Zaabi", pmRating: 4.7, tlRating: 4.6, hrApproved: true, autoApproved: true,  decidedAt: "2 weeks ago" },
    { id: "PR-2026-013", projectName: "TelcoCo · DR Implementation",  member: "Daniyal Habib",    pm: "Khalid Mansour",  pmRating: 4.4, tlRating: 4.5, hrApproved: true, autoApproved: false, decidedAt: "2 weeks ago" },
    { id: "PR-2026-012", projectName: "Client-Alpha · AWS Migration", member: "Yan Zhang",        pm: "Fatima Al Zaabi", pmRating: 4.8, tlRating: 4.7, hrApproved: true, autoApproved: true,  decidedAt: "3 weeks ago" },
  ],

  // Probation candidates with meeting history (cross-portal — Hr, TL, PM all see)
  probation: [
    { id: "E011", name: "Marcus Wright",  title: "DevOps Engineer",   started: "2026-01-08", ends: "2026-04-08", extended: false, status: "Approaching decision", risk: "medium", kpiScore: 78, projectRating: 4.2, badges: 3, meetings: 3, nextMeeting: "Tomorrow 11:00" },
    { id: "E032", name: "Tomás Rivera",   title: "Junior Cloud Eng.", started: "2026-02-18", ends: "2026-05-18", extended: false, status: "At risk · review needed", risk: "high",   kpiScore: 65, projectRating: 3.4, badges: 0, meetings: 2, nextMeeting: "Friday 10:00" },
    { id: "E036", name: "Maya Robinson",  title: "Junior Cloud Eng.", started: "2026-03-22", ends: "2026-06-22", extended: false, status: "On track",               risk: "low",    kpiScore: 71, projectRating: 3.9, badges: 1, meetings: 1, nextMeeting: "Next Monday" },
  ],

  // KPIs to review
  kpis: [
    { id: "K-201", title: "Reduce p95 latency on Service-X by 25%", member: "Ananya Sharma",  cycle: "Q2 2026", weight: 30, progress: 85, deadline: "2026-06-30", status: "On track" },
    { id: "K-202", title: "Migrate 3 customer workloads to AWS",    member: "Daniyal Habib",  cycle: "Q2 2026", weight: 40, progress: 60, deadline: "2026-06-30", status: "On track" },
    { id: "K-203", title: "Achieve AWS SA Associate certification", member: "Reem Al Otaibi", cycle: "Q2 2026", weight: 20, progress: 40, deadline: "2026-06-15", status: "At risk" },
    { id: "K-204", title: "Lead 2 internal knowledge-shares",       member: "Lina Haddad",    cycle: "Q2 2026", weight: 20, progress: 100, deadline: "2026-05-20", status: "Achieved" },
    { id: "K-205", title: "Complete DevOps maturity assessment",    member: "Marcus Wright",  cycle: "Q2 2026", weight: 30, progress: 50, deadline: "2026-06-30", status: "On track" },
  ],

  // Badges this TL can grant (HR has defined which roles can grant which badges)
  grantableBadges: [
    { id: "b-mentor",   label: "Mentor",          points: 50, icon: "🎓", color: "#714B8C", grantable_by: ["TL","HR","Admin"],         description: "For dedicated mentorship of junior staff" },
    { id: "b-runbook",  label: "Runbook Hero",    points: 30, icon: "📚", color: "#0F7A8A", grantable_by: ["TL","PM","HR","Admin"],     description: "For exceptional contributions to runbooks/docs" },
    { id: "b-hands",    label: "Helping Hands",   points: 15, icon: "🤝", color: "#1F8A4C", grantable_by: ["Employee","TL","PM","HR"],  description: "For going above & beyond to help a teammate" },
    { id: "b-debug",    label: "Debug Wizard",    points: 35, icon: "🔧", color: "#189CD9", grantable_by: ["TL","PM","HR","Admin"],     description: "For an exceptional debug / RCA contribution" },
    { id: "b-mile",     label: "Above & Beyond",  points: 50, icon: "✨", color: "#E89A1E", grantable_by: ["TL","HR","Admin"],          description: "For exceptional effort beyond the role" },
  ],
};

// -----------------------------------------------------------
// SHELL HELPERS
// -----------------------------------------------------------
function renderNav(activeId) {
  const html = NAV_ITEMS.map(n => `
    <a class="nav__item ${n.id === activeId ? "nav__item--active" : ""}" data-route="${n.id}">
      <span class="nav__icon">${ICONS[n.iconKey] || ICONS.home}</span>
      <span class="nav__label">${n.label}</span>
      ${n.badge ? `<span class="nav__badge">${n.badge}</span>` : ""}
    </a>`).join("");
  $(".nav").innerHTML = `<div class="nav__group"><div class="nav__heading">Team Lead Workspace</div>${html}</div>`;
  $$(".nav__item").forEach(a => a.addEventListener("click", () => {
    location.hash = "#" + a.dataset.route;
  }));
}

function initials(name) {
  return name.split(/\s+/).map(s => s[0]).join("").slice(0, 2).toUpperCase();
}

function openSlideover({ title, body }) {
  $("#slideover-title").textContent = title;
  $("#slideover-body").innerHTML = body;
  $("#slideover").classList.add("slideover--open");
  $("#overlay").classList.add("overlay--show");
}
function closeSlideover() {
  $("#slideover").classList.remove("slideover--open");
  $("#overlay").classList.remove("overlay--show");
}
window.closeSlideover = closeSlideover;
window.__toast = (msg, kind = "info") => {
  const t = $("#toast");
  t.textContent = msg;
  t.className = `toast toast--show toast--${kind}`;
  setTimeout(() => t.classList.remove("toast--show"), 3500);
};

// -----------------------------------------------------------
// KPI Template create / edit / clone dialog
// -----------------------------------------------------------
function openTemplateDialog(krn, isClone) {
  const existing = krn ? SUDO_DB.kpiTemplates.find(t => t.krn === krn) : null;
  const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour")
          || SUDO_DB.employees.find(e => e.teamRole === "lead");
  const myTeamId = me ? me.teamId : "ps";
  const sections = SUDO_DB_HELPERS.sectionsForTeam(myTeamId);

  const mode = !existing ? "Create new" : (isClone ? "Clone" : "Edit");
  const t = existing ? { ...existing } : {
    krn: "", label: "", metric: "", target: "",
    targetValue: 0, targetOperator: "gte", targetUnit: "percent",
    mov: "", frequency: "monthly", defaultWeight: 5,
    sectionId: sections[0] ? sections[0].id : "",
  };
  if (isClone) { t.krn = ""; t.label = (t.label || "") + " (copy)"; }

  openSlideover({
    title: mode + " KPI Template",
    body: `
      <div class="info-banner" style="margin-bottom:14px">${ICONS.menu}
        <div>Templates are reusable. Once approved by HR, you can assign them to any team member.</div>
      </div>
      <div class="form-grid">
        <div class="field">
          <label class="field__label">KRN (stable code)</label>
          <input class="input" id="tpl-krn" value="${t.krn}" placeholder="e.g. MS-IMM006" ${existing && !isClone ? "disabled" : ""}>
          <div style="font-size:11px;color:var(--ink-500);margin-top:4px">Format: TEAM-SECTIONNNN. Auto-generated if blank.</div>
        </div>
        <div class="field">
          <label class="field__label">Section</label>
          <select class="select" id="tpl-section">
            ${sections.map(s => `<option value="${s.id}" ${s.id===t.sectionId?'selected':''}>${s.label}</option>`).join("")}
          </select>
        </div>
        <div class="field field--full">
          <label class="field__label">KPI Title</label>
          <input class="input" id="tpl-label" value="${(t.label||"").replace(/"/g,'&quot;')}" placeholder="e.g. MTTR — Mean Time to Restore">
        </div>
        <div class="field field--full">
          <label class="field__label">Metric (what's being counted)</label>
          <textarea class="textarea" id="tpl-metric" rows="2">${t.metric||""}</textarea>
        </div>
        <div class="field">
          <label class="field__label">Performance Target (display)</label>
          <input class="input" id="tpl-target" value="${(t.target||"").replace(/"/g,'&quot;')}" placeholder="e.g. < 2 hours">
        </div>
        <div class="field">
          <label class="field__label">Target Value</label>
          <input class="input" id="tpl-target-value" type="number" step="0.1" value="${t.targetValue||0}">
        </div>
        <div class="field">
          <label class="field__label">Operator</label>
          <select class="select" id="tpl-target-op">
            <option value="lt"  ${t.targetOperator==='lt'?'selected':''}>&lt; less than</option>
            <option value="lte" ${t.targetOperator==='lte'?'selected':''}>&le; less or equal</option>
            <option value="gte" ${t.targetOperator==='gte'?'selected':''}>&ge; greater or equal</option>
            <option value="gt"  ${t.targetOperator==='gt'?'selected':''}>&gt; greater than</option>
            <option value="eq"  ${t.targetOperator==='eq'?'selected':''}>= equal to</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label">Unit</label>
          <select class="select" id="tpl-target-unit">
            <option value="percent" ${t.targetUnit==='percent'?'selected':''}>percent</option>
            <option value="count"   ${t.targetUnit==='count'?'selected':''}>count</option>
            <option value="minutes" ${t.targetUnit==='minutes'?'selected':''}>minutes</option>
            <option value="hours"   ${t.targetUnit==='hours'?'selected':''}>hours</option>
            <option value="score"   ${t.targetUnit==='score'?'selected':''}>score</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label">Frequency</label>
          <select class="select" id="tpl-frequency">
            <option value="monthly"        ${t.frequency==='monthly'?'selected':''}>Monthly</option>
            <option value="quarterly"      ${t.frequency==='quarterly'?'selected':''}>Quarterly</option>
            <option value="post_probation" ${t.frequency==='post_probation'?'selected':''}>Post-probation</option>
          </select>
        </div>
        <div class="field field--full">
          <label class="field__label">Means of Validation (where the evidence comes from)</label>
          <input class="input" id="tpl-mov" value="${(t.mov||"").replace(/"/g,'&quot;')}" placeholder="e.g. RT incident management system logs">
        </div>
        <div class="field">
          <label class="field__label">Default Weight</label>
          <input class="input" id="tpl-weight" type="number" min="1" max="50" value="${t.defaultWeight||5}">
        </div>
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--primary" id="tpl-save">${ICONS.check || "✓"} Save template</button>
      </div>`,
  });

  // Wire save
  setTimeout(() => {
    const saveBtn = document.getElementById("tpl-save");
    if (!saveBtn) return;
    saveBtn.addEventListener("click", () => {
      const krnVal = (document.getElementById("tpl-krn").value || "").trim();
      const labelVal = (document.getElementById("tpl-label").value || "").trim();
      if (!labelVal) return window.__toast("KPI title is required", "warn");
      const payload = {
        teamId: myTeamId,
        sectionId: document.getElementById("tpl-section").value,
        krn: krnVal || ("TPL-" + Date.now()),
        label: labelVal,
        metric: document.getElementById("tpl-metric").value.trim(),
        target: document.getElementById("tpl-target").value.trim(),
        targetValue: parseFloat(document.getElementById("tpl-target-value").value) || 0,
        targetOperator: document.getElementById("tpl-target-op").value,
        targetUnit: document.getElementById("tpl-target-unit").value,
        mov: document.getElementById("tpl-mov").value.trim(),
        frequency: document.getElementById("tpl-frequency").value,
        defaultWeight: parseInt(document.getElementById("tpl-weight").value, 10) || 5,
        archived: false,
      };
      if (existing && !isClone) {
        SUDO_DB_OVERRIDES.updateTemplate(existing.krn, payload);
        SUDO_DB_OVERRIDES.audit(me ? me.name : "TL", "kpi.template.updated", payload.krn, payload.label);
        window.__toast("Template updated", "success");
      } else {
        SUDO_DB_OVERRIDES.addTemplate(payload);
        SUDO_DB_OVERRIDES.audit(me ? me.name : "TL", "kpi.template.created", payload.krn, payload.label);
        window.__toast("Template created", "success");
      }
      closeSlideover();
      setTimeout(() => location.reload(), 600);
    });
  }, 50);
}

// -----------------------------------------------------------
// PAGE: Dashboard
// -----------------------------------------------------------
// =========================================================
// TL DASHBOARD — sections are reorderable + hideable.
// =========================================================

const TL_DASHBOARD_SECTIONS = [
  { id: "hero",          label: "Welcome banner",                hint: "Greeting + the day's action items + quick-action buttons", alwaysVisible: true },
  { id: "metric-cards",  label: "Metric cards",                  hint: "Direct reports, team KPI avg, pending reviews, probation cases" },
  { id: "ratings-probation", label: "Ratings & Probation split", hint: "Two-column row: project ratings to review + probation cases this week" },
  { id: "kpi-snapshot",  label: "KPI Snapshot table",            hint: "Full team KPI table for current cycle" },
];
const TL_DASHBOARD_DEFAULT_ORDER = TL_DASHBOARD_SECTIONS.map(s => s.id);

function tlDashSectionHero(ctx) {
  return `
    <!-- Hero greeting banner -->
    <div class="tl-hero">
      <div class="tl-hero__main">
        <div class="tl-hero__greet">Good afternoon, ${DATA.tl.name.split(" ")[0]}</div>
        <div class="tl-hero__headline">${ctx.totalActions} item${ctx.totalActions !== 1 ? "s" : ""} need your attention today</div>
        <div class="tl-hero__sub">${ctx.pendingReviews} project ratings to review, ${ctx.probationNeedingReview} probation case${ctx.probationNeedingReview !== 1 ? "s" : ""} approaching decision, ${DATA.kpis.filter(k=>k.status==='At risk').length} KPI at risk.</div>
      </div>
      <div class="tl-hero__actions">
        <button class="tl-hero__cta" data-quick="rate">
          <span class="tl-hero__cta-icon">${ICONS.star}</span>
          <span>Rate a member</span>
        </button>
        <button class="tl-hero__cta" onclick="location.hash='#probation'">
          <span class="tl-hero__cta-icon">${ICONS.shield}</span>
          <span>Probation review</span>
        </button>
        <button class="tl-hero__cta" onclick="location.hash='#kpis'">
          <span class="tl-hero__cta-icon">${ICONS.chart}</span>
          <span>KPI insights</span>
        </button>
        <button class="tl-hero__cta" data-action="tl-customize-dashboard" title="Reorder or hide dashboard sections">
          <span class="tl-hero__cta-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1m17.5-7.5l-4.2 4.2M9.7 14.3l-4.2 4.2m13-0l-4.2-4.2M9.7 9.7L5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
          <span>Customize</span>
        </button>
      </div>
    </div>`;
}

function tlDashSectionMetricCards(ctx) {
  return `
    <div class="cards" style="margin-top:18px">
      <div class="card" data-card-id="team-size">
        <div class="card__head">
          <div class="card__icon card__icon--bright">${ICONS.users}</div>
          <span class="card__trend card__trend--up">↑ +1 this month</span>
        </div>
        <div class="card__title">My Direct Reports</div>
        <div class="card__value">${ctx.team.length}</div>
        <div class="card__meta">3 on probation · 9 confirmed</div>
      </div>
      <div class="card" data-card-id="kpi-avg">
        <div class="card__head">
          <div class="card__icon card__icon--ok">${ICONS.chart}</div>
          <span class="card__trend card__trend--up">↑ +2 vs Q1</span>
        </div>
        <div class="card__title">Team KPI Average</div>
        <div class="card__value">${ctx.avgKpi}<span style="font-size:13px;color:var(--ink-500);font-weight:500"> / 100</span></div>
        <div class="card__meta">Q2 2026 cycle · ${DATA.kpis.length} KPIs tracked</div>
      </div>
      <div class="card" data-card-id="pending">
        <div class="card__head">
          <div class="card__icon card__icon--warn">${ICONS.star}</div>
          <span class="card__trend card__trend--neutral">Action needed</span>
        </div>
        <div class="card__title">Pending Reviews</div>
        <div class="card__value">${ctx.pendingReviews}</div>
        <div class="card__meta">PM ratings awaiting your input</div>
      </div>
      <div class="card" data-card-id="probation">
        <div class="card__head">
          <div class="card__icon card__icon--warn">${ICONS.shield}</div>
          <span class="card__trend card__trend--neutral">${DATA.probation.length} active</span>
        </div>
        <div class="card__title">Probation Cases</div>
        <div class="card__value">${DATA.probation.length}</div>
        <div class="card__meta">1 decision due this week</div>
      </div>
    </div>`;
}

function tlDashSectionRatingsProbation() {
  return `
    <div class="split">
      <div class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Project Ratings Awaiting Your Review</h3>
            <p class="panel__sub">From your PMs · your input goes to HR next</p>
          </div>
          <a class="panel__more" href="#project-ratings">View all ${ICONS.arrowRight}</a>
        </header>
        <div class="panel__body">
          ${DATA.projectRatings.slice(0, 3).map(r => `
            <div class="dash-rating-item" data-rating-id="${r.id}">
              <div class="dash-rating-item__top">
                <div class="dash-rating-item__avatar">${initials(r.member)}</div>
                <div class="dash-rating-item__id">
                  <div class="dash-rating-item__name">${r.member}</div>
                  <div class="dash-rating-item__proj">${r.projectName}</div>
                </div>
                <div class="dash-rating-item__pm-rating">
                  <div class="dash-rating-item__pm-label">PM rated</div>
                  <div class="dash-rating-item__stars">★ ${r.pmRating}</div>
                </div>
              </div>
              <div class="dash-rating-item__foot">
                <span class="dash-rating-item__meta">From ${r.pm} · ${r.submittedAt}</span>
                <button class="btn btn--primary btn--sm">Review</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Probation This Week</h3>
            <p class="panel__sub">Upcoming meetings & decisions</p>
          </div>
          <a class="panel__more" href="#probation">Open ${ICONS.arrowRight}</a>
        </header>
        <div class="panel__body">
          ${DATA.probation.map(p => `
            <div class="dash-prob-item">
              <div class="dash-prob-item__avatar ${p.risk === 'high' ? 'dash-prob-item__avatar--alert' : ''}">${initials(p.name)}</div>
              <div class="dash-prob-item__main">
                <div class="dash-prob-item__name">${p.name}
                  <span class="probation-risk probation-risk--${p.risk}">${p.risk}</span>
                </div>
                <div class="dash-prob-item__status">${p.status} · ends ${p.ends}</div>
              </div>
              <div class="dash-prob-item__meet">
                <div class="dash-prob-item__meet-label">Next meeting</div>
                <div class="dash-prob-item__meet-when">${p.nextMeeting}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`;
}

function tlDashSectionKpiSnapshot() {
  return `
    <div class="panel" style="margin-top:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">KPI Snapshot · Q2 2026</h3>
          <p class="panel__sub">Tracking across your team — click a row for details</p>
        </div>
        <a class="panel__more" href="#kpis">All KPIs ${ICONS.arrowRight}</a>
      </header>
      <div class="panel__body">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Member</th><th>KPI</th><th>Weight</th><th>Progress</th><th>Status</th><th>Deadline</th></tr></thead>
            <tbody>
              ${DATA.kpis.map(k => `
                <tr class="row-clickable">
                  <td>${k.member}</td>
                  <td>${k.title}</td>
                  <td>${k.weight}%</td>
                  <td>
                    <div class="progress-mini">
                      <div class="progress-mini__bar"><div class="progress-mini__fill" style="width:${k.progress}%;background:${k.status==='Achieved'?'var(--ok)':k.status==='At risk'?'var(--warn)':'var(--bright)'}"></div></div>
                      <div class="progress-mini__text">${k.progress}%</div>
                    </div>
                  </td>
                  <td><span class="status status--${k.status==='Achieved'?'ok':k.status==='At risk'?'warn':'info'}">${k.status}</span></td>
                  <td class="table__mono">${k.deadline}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

const TL_DASHBOARD_SECTION_RENDERERS = {
  "hero":              tlDashSectionHero,
  "metric-cards":      tlDashSectionMetricCards,
  "ratings-probation": tlDashSectionRatingsProbation,
  "kpi-snapshot":      tlDashSectionKpiSnapshot,
};

function pageDashboard() {
  const team = DATA.team;
  const avgKpi = Math.round(team.reduce((s, m) => s + m.kpiScore, 0) / team.length);
  const pendingReviews = DATA.projectRatings.filter(r => r.state === 'pending_tl').length;
  const probationNeedingReview = DATA.probation.filter(p => p.risk === 'high' || p.risk === 'medium').length;
  const totalActions = pendingReviews + probationNeedingReview;
  const ctx = { team, avgKpi, pendingReviews, probationNeedingReview, totalActions };

  const prefs = window.SUDO_LAYOUT
    ? SUDO_LAYOUT.getPrefs("tl-dashboard", TL_DASHBOARD_DEFAULT_ORDER)
    : { order: TL_DASHBOARD_DEFAULT_ORDER, hidden: [] };

  const sectionsHtml = prefs.order
    .filter(id => !prefs.hidden.includes(id))
    .map(id => (TL_DASHBOARD_SECTION_RENDERERS[id] || (() => ""))(ctx))
    .join("\n");

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Team Lead Dashboard</h2>
        <div class="page-header__sub">Tuesday, 12 May 2026 · Week 20</div>
      </div>
    </div>
    ${sectionsHtml}
  `;
}

// -----------------------------------------------------------
// PAGE: My Team  (list / kanban / tiles with filters)
// -----------------------------------------------------------
function pageTeam() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Team</h2>
        <div class="page-header__sub">${DATA.team.length} direct reports · Cloud Engineering</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
        <button class="btn btn--primary btn--sm" data-quick="rate">${ICONS.star} Rate a member</button>
      </div>
    </div>

    <div id="fb-tl-team"></div>

    <div id="tl-team-results">${renderTeamList(DATA.team)}</div>
    <div id="pg-tl-team"></div>
  `;
}

function renderTeamList(items) {
  return `
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Member</th><th>Title</th><th>Status</th><th>KPI</th><th>Last rating</th><th>Badges</th><th>Projects</th><th></th></tr></thead>
        <tbody>
          ${items.map(m => {
            const statusSlug = (m.status || "").toLowerCase();
            const tags = ["all", statusSlug];
            if (m.flagged) tags.push("flagged");
            const searchText = `${m.id} ${m.name} ${m.title}`.toLowerCase();
            return `
            <tr class="row-clickable" data-emp-id="${m.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
              <td><div class="emp-cell">
                <div class="so-item__avatar so-item__avatar--sm ${m.flagged ? 'so-item__avatar--alert' : ''}">${initials(m.name)}</div>
                <div><strong>${m.name}</strong><div class="table__mono table__mono--dim">${m.id}</div></div>
              </div></td>
              <td>${m.title}</td>
              <td><span class="status status--${m.status==='Confirmed'?'ok':m.status==='Probation'?'warn':'info'}">${m.status}</span></td>
              <td><strong>${m.kpiScore || '—'}</strong></td>
              <td>${m.lastRating ? `★ ${m.lastRating}` : '<span class="dim">—</span>'}</td>
              <td>${m.badges}</td>
              <td>${m.projects}</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none;padding:30px;text-align:center;color:var(--ink-500)">No team members match these filters</div>
    </div>`;
}

function renderTeamTiles(items) {
  return `
    <div class="team-tiles">
      ${items.map(m => `
        <div class="team-tile" data-emp-id="${m.id}">
          <div class="team-tile__head">
            <div class="so-item__avatar ${m.flagged ? 'so-item__avatar--alert' : ''}">${initials(m.name)}</div>
            <span class="status status--${m.status==='Confirmed'?'ok':m.status==='Probation'?'warn':'info'}">${m.status}</span>
          </div>
          <div class="team-tile__name">${m.name}</div>
          <div class="team-tile__title">${m.title}</div>
          <div class="team-tile__stats">
            <div><span class="dim">KPI</span><strong>${m.kpiScore||'—'}</strong></div>
            <div><span class="dim">Rating</span><strong>${m.lastRating?`★${m.lastRating}`:'—'}</strong></div>
            <div><span class="dim">Badges</span><strong>${m.badges}</strong></div>
          </div>
        </div>
      `).join("")}
    </div>`;
}

function renderTeamKanban(items) {
  const cols = { Onboarding: [], Probation: [], Confirmed: [] };
  items.forEach(m => cols[m.status]?.push(m));
  return `
    <div class="kanban">
      ${Object.entries(cols).map(([col, list]) => `
        <div class="kanban__col">
          <header class="kanban__col-head">
            <h4>${col}</h4><span class="kanban__count">${list.length}</span>
          </header>
          <div class="kanban__cards">
            ${list.map(m => `
              <div class="kanban__card" data-emp-id="${m.id}">
                <div class="kanban__card-head">
                  <div class="so-item__avatar so-item__avatar--sm">${initials(m.name)}</div>
                  <div><strong>${m.name}</strong><div class="dim" style="font-size:11px">${m.title}</div></div>
                </div>
                <div class="kanban__card-meta">
                  <span>KPI ${m.kpiScore||'—'}</span>
                  <span>${m.lastRating?`★${m.lastRating}`:'—'}</span>
                  <span>${m.badges} 🏆</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>`;
}

// -----------------------------------------------------------
// PAGE: Probation Tracking
// -----------------------------------------------------------
function pageProbation() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Probation Tracking</h2>
        <div class="page-header__sub">Shared with HR · meetings, remarks, and decisions are visible across portals</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
        <button class="btn btn--primary btn--sm" data-action="schedule-meeting">${ICONS.clock} Schedule meeting</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:18px">
      ${ICONS.shield}
      <div><strong>Monthly remarks are mandatory.</strong> Every probation case requires a TL remark each month — Month 1, Month 2, Month 3. Probation decisions cascade: <strong>TL recommends → HR approves</strong>. Missing or overdue remarks are flagged red and visible to HR.</div>
    </div>

    <div class="cards" style="margin-bottom:18px">
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--warn">${ICONS.shield}</div></div>
        <div class="card__title">Active Probations</div>
        <div class="card__value">${DATA.probation.length}</div>
        <div class="card__meta">Cloud Engineering</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check}</div></div>
        <div class="card__title">Monthly Remarks Filed</div>
        <div class="card__value">7<span style="font-size:14px;color:var(--ink-500);font-weight:500">/9</span></div>
        <div class="card__meta">2 due this week</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--danger">${ICONS.alert}</div></div>
        <div class="card__title">At Risk</div>
        <div class="card__value">${DATA.probation.filter(p=>p.risk==='high').length}</div>
        <div class="card__meta">Flagged for HR review</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--bright">${ICONS.users}</div></div>
        <div class="card__title">Confirmations This Quarter</div>
        <div class="card__value">5</div>
        <div class="card__meta">Successfully passed probation</div>
      </div>
    </div>

    <div id="fb-tl-probation"></div>

    <div id="tl-probation-results">
    ${DATA.probation.map((p, idx) => {
      // Simulate per-employee monthly remarks state (deterministic from index)
      const months = [
        { n: 1, label: "Month 1 · Onboarding fit",  status: idx === 0 ? "filed" : idx === 1 ? "filed" : "filed",  date: "08 Mar 2026", remark: "Initial impressions positive. Strong fundamentals, needs to ramp on internal tools." },
        { n: 2, label: "Month 2 · Performance",     status: idx === 0 ? "filed" : idx === 1 ? "filed" : "filed",  date: "07 Apr 2026", remark: "Showing improvement on architectural reasoning. Pairing with senior on Wednesdays helps." },
        { n: 3, label: "Month 3 · Final review",    status: idx === 2 ? "overdue" : idx === 0 ? "filed" : "due",  date: idx === 0 ? "06 May 2026" : null, remark: idx === 0 ? "Ready for confirmation — clear delivery on Client-Alpha, well-rated by PM (★4.4), no flags." : null },
      ];
      const filed = months.filter(m => m.status === "filed").length;
      const overdue = months.filter(m => m.status === "overdue").length;
      const tags = ["all", p.risk + "-risk"];
      if (overdue > 0) tags.push("decisions-due");
      if (idx === 0) tags.push("decisions-due");
      const searchText = `${p.id} ${p.name} ${p.title}`.toLowerCase();

      return `
      <div class="probation-card" data-tag="${tags.join(" ")}" data-search="${searchText}">
        <div class="probation-card__head">
          <div class="probation-card__id">
            <div class="so-item__avatar ${p.risk==='high'?'so-item__avatar--alert':''}">${initials(p.name)}</div>
            <div>
              <div class="probation-card__name">${p.name} <span class="probation-risk probation-risk--${p.risk}">${p.risk} risk</span>${overdue > 0 ? ' <span class="probation-risk probation-risk--high">remark overdue</span>' : ''}</div>
              <div class="probation-card__title">${p.title} · ${p.id}</div>
            </div>
          </div>
          <div class="probation-card__actions">
            <button class="btn btn--secondary btn--sm" data-action="add-monthly-remark" data-id="${p.id}">${ICONS.pen} Add monthly remark</button>
            <button class="btn btn--secondary btn--sm" data-action="schedule-meeting" data-id="${p.id}">${ICONS.clock} Schedule meeting</button>
            <button class="btn btn--primary btn--sm" data-action="probation-decision" data-id="${p.id}">${ICONS.send} Send recommendation</button>
          </div>
        </div>

        <div class="probation-card__grid">
          <div class="probation-stat"><div class="probation-stat__label">Probation period</div><div class="probation-stat__value">${p.started} → ${p.ends}</div></div>
          <div class="probation-stat"><div class="probation-stat__label">Status</div><div class="probation-stat__value">${p.status}</div></div>
          <div class="probation-stat"><div class="probation-stat__label">KPI score</div><div class="probation-stat__value">${p.kpiScore}/100</div></div>
          <div class="probation-stat"><div class="probation-stat__label">Project rating</div><div class="probation-stat__value">★ ${p.projectRating}</div></div>
          <div class="probation-stat"><div class="probation-stat__label">Monthly remarks</div><div class="probation-stat__value">${filed}/3 filed${overdue ? ` · <span style="color:var(--danger);font-weight:700">${overdue} overdue</span>` : ''}</div></div>
          <div class="probation-stat"><div class="probation-stat__label">Next meeting</div><div class="probation-stat__value">${p.nextMeeting}</div></div>
        </div>

        <div class="monthly-remarks">
          <div class="monthly-remarks__head">
            <div class="monthly-remarks__title">${ICONS.calendar} Monthly remarks · required cadence</div>
            <div class="monthly-remarks__sub">One remark per month of probation · visible to HR</div>
          </div>
          <div class="monthly-remarks__list">
            ${months.map(m => `
              <div class="m-remark m-remark--${m.status}">
                <div class="m-remark__rail">
                  <div class="m-remark__dot"></div>
                  <div class="m-remark__line"></div>
                </div>
                <div class="m-remark__body">
                  <div class="m-remark__top">
                    <span class="m-remark__num">M${m.n}</span>
                    <span class="m-remark__label">${m.label}</span>
                    ${m.status === "filed"   ? `<span class="m-remark__pill m-remark__pill--filed">${ICONS.check} Filed ${m.date}</span>` : ""}
                    ${m.status === "due"     ? `<span class="m-remark__pill m-remark__pill--due">${ICONS.clock} Due this week</span>` : ""}
                    ${m.status === "overdue" ? `<span class="m-remark__pill m-remark__pill--overdue">${ICONS.alert} Overdue — 5 days</span>` : ""}
                  </div>
                  ${m.remark ? `<div class="m-remark__text">"${m.remark}"</div><div class="m-remark__author">— Khalid Mansour (TL)</div>` : ""}
                  ${m.status === "due" ? `<button class="btn btn--primary btn--sm" data-action="add-monthly-remark" data-id="${p.id}" data-month="${m.n}" style="margin-top:8px">${ICONS.pen} File now</button>` : ""}
                  ${m.status === "overdue" ? `<button class="btn btn--danger btn--sm" data-action="add-monthly-remark" data-id="${p.id}" data-month="${m.n}" style="margin-top:8px">${ICONS.pen} File now — HR notified</button>` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
    }).join("")}
    <div class="fb-empty" style="display:none;padding:30px;text-align:center;color:var(--ink-500)">No probation cases match these filters</div>
    </div>
    <div id="pg-tl-probation"></div>
  `;
}

// -----------------------------------------------------------
// PAGE: Project Ratings (cascade — PM → TL → HR)
// -----------------------------------------------------------
function pageProjectRatings() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Project Ratings</h2>
        <div class="page-header__sub">PM ratings flow to you for review and remarks before going to HR</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:18px">
      ${ICONS.send}
      <div><strong>How this works:</strong> PM submits → TL reviews & adds comments → HR (auto-approves with rule set, or manual approval). Used in KPI calculation and probation decisions.</div>
    </div>

    <div id="fb-tl-ratings"></div>

    <div data-tabpane="pending" class="tabpane tabpane--active">
      ${DATA.projectRatings.map(r => `
        <div class="rating-card">
          <div class="rating-card__head">
            <div>
              <div class="rating-card__title">${r.projectName}</div>
              <div class="rating-card__sub">${r.member} · ${r.id} · submitted ${r.submittedAt}</div>
            </div>
            <span class="odoo-source-pill">${ICONS.external} SYNCED FROM ODOO</span>
          </div>

          <div class="rating-card__pm-section">
            <div class="rating-card__pm-head">
              <div class="so-item__avatar so-item__avatar--sm">${initials(r.pm)}</div>
              <div>
                <strong>${r.pm}</strong> · PM
                <div class="rating-stars">${'★'.repeat(Math.round(r.pmRating))}${'☆'.repeat(5-Math.round(r.pmRating))} <span style="color:var(--ink-700);font-weight:600">${r.pmRating}</span></div>
              </div>
            </div>
            <div class="rating-card__pm-comment">"${r.pmComment}"</div>
          </div>

          <div class="rating-card__tl-section">
            <div class="rating-card__tl-label">Your rating & comment <span class="dim">(required)</span></div>
            <div class="rating-input">
              <label class="rating-input__star-row">
                ${[1,2,3,4,5].map(n => `<button class="rating-star" data-star="${n}" data-rating-id="${r.id}">${ICONS.star}</button>`).join("")}
                <span class="rating-input__value" data-rating-value="${r.id}">—</span>
              </label>
              <textarea class="textarea" placeholder="Add your perspective on this team member's work…" data-rating-comment="${r.id}"></textarea>
              <div class="rating-card__actions">
                <button class="btn btn--secondary btn--sm" data-action="save-rating-draft" data-id="${r.id}">Save as draft</button>
                <button class="btn btn--primary btn--sm" data-action="forward-to-hr" data-id="${r.id}">${ICONS.send} Forward to HR</button>
              </div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>

    <div data-tabpane="forwarded" class="tabpane">
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>ID</th><th>Project</th><th>Member</th><th>PM rating</th><th>Your rating</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${DATA.ratingsHistory.map(r => `
              <tr class="row-clickable">
                <td class="table__mono">${r.id}</td>
                <td>${r.projectName}</td>
                <td>${r.member}</td>
                <td>★ ${r.pmRating}</td>
                <td>★ ${r.tlRating}</td>
                <td><span class="status status--${r.hrApproved?'ok':'warn'}">${r.hrApproved?(r.autoApproved?'Auto-approved by HR':'HR approved'):'Pending HR'}</span></td>
                <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div data-tabpane="history" class="tabpane">
      <div class="empty-state" style="padding:32px">${ICONS.clock}<div>All your past ratings, with full meeting and remark history. Filter by quarter, project, or team member.</div></div>
    </div>
  `;
}

// -----------------------------------------------------------
// PAGE: KPIs
// -----------------------------------------------------------
function pageKPIs() {
  // Find the TL's team (Khalid Mansour or first lead)
  const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour")
          || SUDO_DB.employees.find(e => e.teamRole === "lead");
  const myTeamId = me ? me.teamId : "ps";
  const teamMembers = SUDO_DB_HELPERS.teamMembers(myTeamId).map(m => m.id);

  // Things needing TL action:
  // 1. HR-drafted KPIs awaiting TL approval (hr_to_tl direction, pending_validation)
  // 2. Employee progress updates awaiting TL validation (progress_pending_validation + validatorRole=tl)
  const hrDraftedPendingTL = SUDO_DB.kpiAssignments.filter(a =>
    teamMembers.includes(a.empId) &&
    a.status === "pending_validation" &&
    a.approvalDirection === "hr_to_tl"
  );
  const progressPendingTL = SUDO_DB.kpiAssignments.filter(a =>
    teamMembers.includes(a.empId) &&
    a.status === "progress_pending_validation" &&
    (SUDO_DB_HELPERS.templateByKrn(a.templateKrn) || {}).validatorRole === "tl"
  );
  const queueCount = hrDraftedPendingTL.length + progressPendingTL.length;

  // Team-level RED count (at-risk)
  const teamReds = SUDO_DB.kpiAssignments.filter(a =>
    teamMembers.includes(a.empId) && SUDO_DB_HELPERS.kpiStatusColor(a) === "red"
  );

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">KPI Reviews</h2>
        <div class="page-header__sub">Q2 2026 cycle · ${queueCount} item${queueCount===1?'':'s'} awaiting your validation · ${teamReds.length} team KPIs RED</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
        <button class="btn btn--primary btn--sm" data-action="ai-insights">✨ Generate AI insights</button>
      </div>
    </div>

    ${queueCount > 0 ? `
      <article class="panel" style="margin-bottom:18px;border-left:4px solid var(--warn)">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Validation Queue · ${queueCount}</h3>
            <p class="panel__sub">Approve HR-drafted KPIs · Confirm or revise employee progress submissions</p>
          </div>
        </header>
        <div class="panel__body" style="padding:0">
          <table class="table">
            <thead><tr><th>Type</th><th>KPI</th><th>Employee</th><th>Detail</th><th>Action</th></tr></thead>
            <tbody>
              ${hrDraftedPendingTL.map(a => {
                const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
                const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
                return `
                  <tr>
                    <td><span class="status status--info">HR draft</span></td>
                    <td><strong>${tpl ? tpl.krn : a.templateKrn}</strong> · ${tpl ? tpl.label : '—'}</td>
                    <td>${emp ? emp.name : a.empId}</td>
                    <td class="table__sub" style="font-size:11.5px">${a.scopeLabel || ''} · weight ${a.weight}%</td>
                    <td>
                      <button class="btn btn--primary btn--sm" data-action="tl-approve-hr-draft" data-id="${a.id}">${ICONS.check} Approve</button>
                      <button class="btn btn--ghost btn--sm" data-action="tl-revise-hr-draft" data-id="${a.id}">Revise</button>
                    </td>
                  </tr>`;
              }).join("")}
              ${progressPendingTL.map(a => {
                const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
                const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
                return `
                  <tr>
                    <td><span class="status status--warn">Progress</span></td>
                    <td><strong>${tpl ? tpl.krn : a.templateKrn}</strong> · ${tpl ? tpl.label : '—'}</td>
                    <td>${emp ? emp.name : a.empId}</td>
                    <td><strong>${a.empSubmittedValue}</strong> ${tpl ? tpl.targetUnit : ''} <span class="table__sub" style="font-size:11.5px">(target ${tpl ? tpl.target : '—'})</span></td>
                    <td>
                      <button class="btn btn--primary btn--sm" data-action="tl-confirm-progress" data-id="${a.id}">${ICONS.check} Confirm</button>
                      <button class="btn btn--ghost btn--sm" data-action="tl-revise-progress" data-id="${a.id}">Revise</button>
                    </td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </article>
    ` : `
      <div class="info-banner" style="margin-bottom:14px;background:#ECFDF5;border-color:#86EFAC">${ICONS.check}
        <div><strong>Validation queue is clear.</strong> No HR-drafted KPIs awaiting approval, no employee progress updates pending.</div>
      </div>
    `}

    ${teamReds.length > 0 ? `
      <article class="panel" style="margin-bottom:18px;border-left:4px solid var(--danger)">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">🚨 Team RED KPIs · ${teamReds.length}</h3>
            <p class="panel__sub">Your team members below target — consider 1:1 intervention</p>
          </div>
        </header>
        <div class="panel__body" style="padding:0">
          <table class="table">
            <thead><tr><th>Employee</th><th>KPI</th><th>Current</th><th>Target</th><th>Action</th></tr></thead>
            <tbody>
              ${teamReds.map(a => {
                const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
                const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
                return `
                  <tr>
                    <td><strong>${emp ? emp.name : a.empId}</strong></td>
                    <td>${tpl ? tpl.krn : ''} · ${tpl ? tpl.label : ''}</td>
                    <td><strong>${a.accomplishmentText || a.validatedValue || '—'}</strong></td>
                    <td>${tpl ? tpl.target : '—'}</td>
                    <td><button class="btn btn--secondary btn--sm" data-action="tl-schedule-1on1" data-emp-id="${emp ? emp.id : ''}">Schedule 1:1</button></td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </article>
    ` : ''}

    <div class="info-banner" style="margin-bottom:18px;background:linear-gradient(120deg,#FFF8E1,#FFECB3);border-color:#F5C977">
      ${ICONS.star}
      <div><strong>KPI calculation:</strong> blended score from cycle progress (40%), project ratings PM→TL→HR (30%), peer & TL ratings (20%), badges earned (10%). HR can tune the weighting in the Admin Portal.</div>
    </div>

    <article class="panel" style="margin-bottom:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Team composite scores</h3>
          <p class="panel__sub">Q2 2026 · who needs support, who's leading</p>
        </div>
      </header>
      <div class="panel__body" id="tl-team-scores-chart"></div>
    </article>

    <div id="fb-tl-kpis"></div>

    <div data-tabpane="active" class="tabpane tabpane--active">
      ${DATA.kpis.filter(k=>k.status!=='Achieved').map(k => `
        <div class="kpi-card">
          <div class="kpi-card__head">
            <div>
              <div class="kpi-card__title">${k.title}</div>
              <div class="kpi-card__sub">${k.member} · weight ${k.weight}% · deadline ${k.deadline}</div>
            </div>
            <span class="status status--${k.status==='At risk'?'warn':'info'}">${k.status}</span>
          </div>
          <div class="kpi-card__progress">
            <div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:${k.progress}%"></div></div><div class="progress-mini__text">${k.progress}%</div></div>
          </div>
          <div class="kpi-card__actions">
            <button class="btn btn--secondary btn--sm" data-action="kpi-add-rating" data-id="${k.id}">${ICONS.star} Add my rating</button>
            <button class="btn btn--secondary btn--sm" data-action="kpi-remark" data-id="${k.id}">${ICONS.pen} Remark</button>
            <button class="btn btn--ghost btn--sm">${ICONS.arrowRight} Details</button>
          </div>
        </div>
      `).join("")}
    </div>

    <div data-tabpane="achieved" class="tabpane">
      ${DATA.kpis.filter(k=>k.status==='Achieved').map(k => `
        <div class="kpi-card">
          <div class="kpi-card__head">
            <div>
              <div class="kpi-card__title">${k.title}</div>
              <div class="kpi-card__sub">${k.member} · weight ${k.weight}%</div>
            </div>
            <span class="status status--ok">${ICONS.check} Achieved</span>
          </div>
        </div>
      `).join("")}
    </div>

    <div data-tabpane="team-scores" class="tabpane">
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Member</th><th>Composite score</th><th>Cycle progress</th><th>Project ratings</th><th>Badges</th><th>Trend</th></tr></thead>
          <tbody>
            ${DATA.team.filter(t=>t.kpiScore>0).sort((a,b)=>b.kpiScore-a.kpiScore).map(t => `
              <tr class="row-clickable">
                <td>${t.name}</td>
                <td><strong style="font-size:14px">${t.kpiScore}</strong>/100</td>
                <td>${Math.round((t.kpiScore-5))}%</td>
                <td>★ ${t.lastRating || '—'}</td>
                <td>${t.badges}</td>
                <td><span class="status status--${t.kpiScore>=85?'ok':t.kpiScore>=70?'info':'warn'}">${t.kpiScore>=85?'Excellent':t.kpiScore>=70?'On track':'Needs support'}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div data-tabpane="ai" class="tabpane">
      <div class="ai-panel">
        <div class="ai-panel__head">
          <h3>AI-Generated Team Insights</h3>
          <p class="dim">Powered by Claude · Configured in Admin Portal · Last generated 2 days ago</p>
        </div>
        <div class="ai-panel__cards">
          <div class="ai-insight ai-insight--success">
            <strong>Top performer trend:</strong> Ananya, Yan, and Karim have all consistently scored 85+ for 3 consecutive quarters. Consider for senior progression review.
          </div>
          <div class="ai-insight ai-insight--warn">
            <strong>Support needed:</strong> Tomás (E032) has KPI 65 + project rating 3.4 + zero badges. Probation decision in 2 weeks — recommend immediate 1:1 + pairing.
          </div>
          <div class="ai-insight ai-insight--info">
            <strong>Skill gap:</strong> 4 team members have no AWS Solutions Architect Associate cert. Aligns with upcoming Q3 client work — consider cohort training.
          </div>
          <div class="ai-insight ai-insight--info">
            <strong>Recognition gap:</strong> Daniyal and Sami have above-average performance but only 5 and 3 badges respectively. Consider giving more peer-visible recognition.
          </div>
        </div>
        <button class="btn btn--primary" data-action="ai-regenerate">✨ Regenerate insights</button>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------
// PAGE: KPI Library — TL views/edits/clones team's KPI templates
// -----------------------------------------------------------
//
// The TL sees only their own team's templates (filtered by teamId).
// HR sees all teams' templates (handled separately in HR portal).
// Actions: Create new, Clone, Edit, Archive.
// All writes go through SUDO_DB_OVERRIDES so changes persist + appear in
// HR's approval queue and Employee scorecard view on refresh.
// -----------------------------------------------------------
function pageKpiLibrary() {
  // Find the current TL's team. In the prototype Khalid Mansour is the
  // signed-in TL; pull his teamId.
  const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour")
          || SUDO_DB.employees.find(e => e.teamRole === "lead");
  const myTeamId = me ? me.teamId : "ps";
  const team = SUDO_DB_HELPERS.findTeam(myTeamId);
  const templates = SUDO_DB_HELPERS.templatesForTeam(myTeamId);
  const sections = SUDO_DB_HELPERS.sectionsForTeam(myTeamId);

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">${team ? team.name : "Team"} · KPI Library</h2>
        <div class="page-header__sub">${templates.length} active templates across ${sections.length} sections · drafted by ${team && team.lead ? team.lead.name : "—"}</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--primary" data-action="kpi-tpl-new">${ICONS.plus} New template</button>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.menu}
      <div>
        <strong>What is a KPI template?</strong> A reusable definition with a KRN code, target, frequency, and Means of Validation. You assign templates to your team via <strong>Assign KPIs</strong>. HR approves before they go live for the employee.
      </div>
    </div>

    ${sections.map(sec => {
      const inSection = templates.filter(t => t.sectionId === sec.id);
      if (inSection.length === 0) return "";
      return `
        <div class="kpi-section-block" style="margin-top:18px">
          <h3 class="section-header" style="font-size:13px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px">
            ${sec.label} · ${inSection.length} templates
          </h3>
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th style="width:110px">KRN</th>
                  <th>KPI</th>
                  <th>Target</th>
                  <th>Frequency</th>
                  <th>Weight</th>
                  <th>Means of Validation</th>
                  <th style="width:200px;text-align:right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${inSection.map(t => `
                  <tr data-tag="all ${sec.id}" data-krn="${t.krn}">
                    <td class="table__mono" style="font-size:11px;color:var(--ink-700);font-weight:700">${t.krn}</td>
                    <td>
                      <div class="table__name" style="font-size:13px">${t.label}</div>
                      <div class="table__sub" style="font-size:11.5px;color:var(--ink-500);max-width:380px">${t.metric}</div>
                    </td>
                    <td><strong style="font-size:12.5px">${t.target}</strong></td>
                    <td><span class="status status--muted" style="font-size:10.5px">${(t.frequency||"").replace("_"," ")}</span></td>
                    <td><strong>${t.defaultWeight}</strong></td>
                    <td style="font-size:11px;color:var(--ink-500);max-width:240px">${t.mov}</td>
                    <td style="text-align:right">
                      <button class="btn btn--ghost btn--sm" data-action="kpi-tpl-edit" data-krn="${t.krn}">${ICONS.pen || "✎"} Edit</button>
                      <button class="btn btn--ghost btn--sm" data-action="kpi-tpl-clone" data-krn="${t.krn}">⧉ Clone</button>
                      <button class="btn btn--secondary btn--sm" data-action="kpi-tpl-quick-assign" data-krn="${t.krn}">${ICONS.send || "→"} Assign</button>
                    </td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>`;
    }).join("")}
  `;
}

// -----------------------------------------------------------
// PAGE: Assign KPIs — wizard-style form
// -----------------------------------------------------------
function pageKpiAssign() {
  const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour")
          || SUDO_DB.employees.find(e => e.teamRole === "lead");
  const myTeamId = me ? me.teamId : "ps";
  const team = SUDO_DB_HELPERS.findTeam(myTeamId);
  const templates = SUDO_DB_HELPERS.templatesForTeam(myTeamId);
  const members = SUDO_DB_HELPERS.teamMembers(myTeamId);
  const cycles = (SUDO_DB.kpiCycles && Array.isArray(SUDO_DB.kpiCycles))
    ? SUDO_DB.kpiCycles
    : [
        { id: "q2-2026", label: "Q2 2026 · current", status: "active" },
        { id: "q3-2026", label: "Q3 2026 · upcoming", status: "upcoming" },
        { id: "q4-2026", label: "Q4 2026 · upcoming", status: "upcoming" },
      ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Assign KPIs to ${team ? team.name : "Team"}</h2>
        <div class="page-header__sub">Pick a template, pick who it applies to, pick the cycle. HR approves before it activates.</div>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.send}
      <div>
        <strong>Flow:</strong> You draft → HR reviews → Employee acknowledges → KPI is active. Each step is audit-logged. You can recall a KPI from HR queue if you need to fix it.
      </div>
    </div>

    <article class="panel" style="max-width:880px;margin-top:14px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">New KPI Assignment</h3>
          <p class="panel__sub">All fields required unless marked optional</p>
        </div>
      </header>
      <div class="panel__body">
        <div class="form-grid">
          <div class="field field--full">
            <label class="field__label">1. Select KPI Template</label>
            <select class="select" id="ka-template" style="font-size:13px">
              <option value="">— pick a template —</option>
              ${templates.map(t => `<option value="${t.krn}">${t.krn} · ${t.label} (target: ${t.target})</option>`).join("")}
            </select>
            <div style="font-size:11px;color:var(--ink-500);margin-top:6px">${templates.length} templates available · manage them in <strong>KPI Library</strong></div>
          </div>

          <div class="field">
            <label class="field__label">2. Assignment Scope</label>
            <select class="select" id="ka-scope">
              <option value="team">Whole team (${members.length} people)</option>
              <option value="subset">Subset by role</option>
              <option value="individual">Individual person</option>
            </select>
          </div>

          <div class="field" id="ka-scope-detail-field">
            <label class="field__label">Scope detail</label>
            <select class="select" id="ka-scope-detail">
              <option value="all-members">All team members</option>
            </select>
          </div>

          <div class="field">
            <label class="field__label">3. Cycle</label>
            <select class="select" id="ka-cycle">
              ${cycles.map(c => `<option value="${c.id}">${c.label}</option>`).join("")}
            </select>
          </div>

          <div class="field">
            <label class="field__label">4. Weight (% of composite KPI)</label>
            <input class="input" id="ka-weight" type="number" min="1" max="100" value="5" />
            <div style="font-size:11px;color:var(--ink-500);margin-top:4px">Recommended weight from template auto-fills on selection</div>
          </div>

          <div class="field field--full">
            <label class="field__label">5. TL Note (optional · visible to HR &amp; Employee)</label>
            <textarea class="textarea" id="ka-note" rows="2" placeholder="e.g. 'Junior engineers only, target 80% in Q2; full target Q3.'"></textarea>
          </div>
        </div>

        <div id="ka-preview" style="margin-top:18px;padding:14px;background:var(--ink-50);border-radius:8px;border:1px dashed var(--ink-200);display:none">
          <div style="font-size:11px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px">Preview</div>
          <div id="ka-preview-content"></div>
        </div>

        <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
          <button class="btn btn--secondary" data-action="ka-cancel">Cancel</button>
          <button class="btn btn--primary" data-action="ka-submit">${ICONS.send} Submit for HR approval</button>
        </div>
      </div>
    </article>

    <article class="panel" style="margin-top:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Recent assignments by you</h3>
          <p class="panel__sub">KPIs you drafted · all cycles</p>
        </div>
      </header>
      <div class="panel__body" style="padding:0">
        <table class="table">
          <thead><tr><th>ID</th><th>KPI</th><th>Assigned to</th><th>Cycle</th><th>Status</th></tr></thead>
          <tbody id="ka-recent-list">
            ${(SUDO_DB.kpiAssignments || []).filter(a => a.draftedBy === (me ? me.id : "E003")).map(a => {
              const tpl = SUDO_DB.kpiTemplates.find(t => t.krn === a.templateKrn);
              const emp = SUDO_DB.employees.find(e => e.id === a.empId);
              const statusPill = ({
                "pending_hr":          '<span class="status status--warn">Pending HR</span>',
                "pending_emp_ack":     '<span class="status status--info">Pending employee ack</span>',
                "active":              '<span class="status status--ok">Active</span>',
                "draft":               '<span class="status status--muted">Draft</span>',
                "achieved":            '<span class="status status--ok">Achieved</span>',
                "missed":              '<span class="status status--danger">Missed</span>',
                "rejected":            '<span class="status status--danger">Rejected by HR</span>',
              })[a.status] || `<span class="status status--muted">${a.status}</span>`;
              return `
                <tr>
                  <td class="table__mono" style="font-size:11px">${a.id}</td>
                  <td>${tpl ? tpl.krn + " · " + tpl.label : a.templateKrn}</td>
                  <td>${emp ? emp.name : a.empId} ${a.scope === "team" ? '<span style="color:var(--ink-500);font-size:11px">(whole team)</span>' : ""}</td>
                  <td class="table__mono">${a.cycleId}</td>
                  <td>${statusPill}</td>
                </tr>`;
            }).join("") || `<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--ink-500)">No assignments drafted yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </article>
  `;
}


// -----------------------------------------------------------
// PAGE: Badges (grant interface — filtered to badges TL is allowed to give)
// -----------------------------------------------------------
function pageBadges() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Grant Badges</h2>
        <div class="page-header__sub">Recognize your team — badge catalogue is managed by HR with per-role grant permissions</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm" data-action="view-my-grants">${ICONS.clock} My past grants</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:18px">
      ${ICONS.shield}
      <div><strong>You are a Team Lead.</strong> You can grant the ${DATA.grantableBadges.filter(b=>b.grantable_by.includes('TL')).length} badges below. Other badges are restricted to specific roles. HR manages the catalogue.</div>
    </div>

    <div class="badge-grid">
      ${DATA.grantableBadges.filter(b=>b.grantable_by.includes('TL')).map(b => `
        <div class="badge-tile" style="--badge-color:${b.color}">
          <div class="badge-tile__icon">${b.icon}</div>
          <div class="badge-tile__title">${b.label}</div>
          <div class="badge-tile__points">+${b.points} points</div>
          <div class="badge-tile__desc">${b.description}</div>
          <div class="badge-tile__permissions">
            <span class="dim">Grantable by:</span>
            ${b.grantable_by.map(r => `<span class="badge-role-pill">${r}</span>`).join(' ')}
          </div>
          <button class="btn btn--primary btn--sm badge-tile__cta" data-action="grant-badge" data-badge-id="${b.id}">${ICONS.send} Grant this badge</button>
        </div>
      `).join("")}
    </div>

    <div class="panel" style="margin-top:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Recent grants from your team</h3>
          <p class="panel__sub">Last 30 days</p>
        </div>
      </header>
      <div class="panel__body">
        <div class="activity-feed">
          <div class="act"><div class="act__dot">🎓</div><div class="act__main"><strong>Mentor</strong> granted to Lina Haddad<br><span>By you · "For mentoring Reem and Maya in Q2"</span></div><div class="act__time">3 days ago</div></div>
          <div class="act"><div class="act__dot">📚</div><div class="act__main"><strong>Runbook Hero</strong> granted to Karim Salah<br><span>By Sara Mitchell (PM) · "Comprehensive DR runbook for TelcoCo"</span></div><div class="act__time">1 week ago</div></div>
          <div class="act"><div class="act__dot">🔧</div><div class="act__main"><strong>Debug Wizard</strong> granted to Yan Zhang<br><span>By you · "Tracked down a 3-month-old prod bug in 4 hours"</span></div><div class="act__time">2 weeks ago</div></div>
          <div class="act"><div class="act__dot">🤝</div><div class="act__main"><strong>Helping Hands</strong> granted to Hamza Al Mahmoud<br><span>By Daniyal Habib (Employee) · "Stayed back to help with deployment"</span></div><div class="act__time">2 weeks ago</div></div>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------
// PAGE: Profile (TL's own)
// -----------------------------------------------------------
function pageProfile() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">My Profile</h2>
        <div class="page-header__sub">Your own employee record · for full personal details visit your Employee portal</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <div class="info-card__title">${ICONS.user} Personal</div>
        <div class="info-row"><span class="info-row__label">Name</span><span class="info-row__value">Khalid Mansour</span></div>
        <div class="info-row"><span class="info-row__label">Employee ID</span><span class="info-row__value info-row__value--mono">E003</span></div>
        <div class="info-row"><span class="info-row__label">Title</span><span class="info-row__value">Engineering Manager</span></div>
        <div class="info-row"><span class="info-row__label">Department</span><span class="info-row__value">Cloud Engineering</span></div>
        <div class="info-row"><span class="info-row__label">Joined</span><span class="info-row__value">2022-09-12</span></div>
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.users} Team Management</div>
        <div class="info-row"><span class="info-row__label">Direct reports</span><span class="info-row__value">${DATA.tl.reports}</span></div>
        <div class="info-row"><span class="info-row__label">Probation cases</span><span class="info-row__value">${DATA.probation.length} active</span></div>
        <div class="info-row"><span class="info-row__label">KPIs to review</span><span class="info-row__value">${DATA.kpis.length}</span></div>
        <div class="info-row"><span class="info-row__label">Project ratings pending</span><span class="info-row__value">${DATA.projectRatings.length}</span></div>
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.award} My Recognition</div>
        <div class="info-row"><span class="info-row__label">Badges earned</span><span class="info-row__value">11</span></div>
        <div class="info-row"><span class="info-row__label">Badges I granted</span><span class="info-row__value">23 this quarter</span></div>
        <div class="info-row"><span class="info-row__label">Top performer</span><span class="info-row__value">★ #4 overall</span></div>
      </div>
    </div>

    <div style="text-align:center;margin-top:20px;font-size:13px;color:var(--ink-500)">
      For complete profile and editing, switch to <a href="../employee/index.html" style="color:var(--bright);font-weight:600">Employee Portal</a>
    </div>
  `;
}

// -----------------------------------------------------------
// PAGE: Notifications
// -----------------------------------------------------------
function pageNotifications() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Notifications</h2>
        <div class="page-header__sub">4 unread</div>
      </div>
      <div class="page-actions"><button class="btn btn--secondary btn--sm">Mark all read</button></div>
    </div>

    <div class="panel">
      <div class="panel__body">
        <div class="activity-feed">
          <div class="act act--unread"><div class="act__dot act__dot--warn">${ICONS.star}</div><div class="act__main"><strong>Fatima Al Zaabi submitted a project rating</strong><br><span>Reem Al Otaibi · Client-Alpha · AWS Migration · ★ 4.3</span></div><div class="act__time">2h ago</div></div>
          <div class="act act--unread"><div class="act__dot act__dot--warn">${ICONS.shield}</div><div class="act__main"><strong>Probation meeting due</strong><br><span>Tomás Rivera (E032) — 30-day check-in scheduled Friday</span></div><div class="act__time">5h ago</div></div>
          <div class="act act--unread"><div class="act__dot act__dot--info">${ICONS.chart}</div><div class="act__main"><strong>KPI weighting changed by HR</strong><br><span>Project ratings now 30% (was 25%) of composite score</span></div><div class="act__time">1d ago</div></div>
          <div class="act act--unread"><div class="act__dot act__dot--ok">${ICONS.check}</div><div class="act__main"><strong>HR auto-approved your rating</strong><br><span>Lina Haddad · Retail-Co · Migration · ★ 4.6</span></div><div class="act__time">2d ago</div></div>
          <div class="act"><div class="act__dot act__dot--info">${ICONS.award}</div><div class="act__main"><strong>You granted Mentor badge</strong><br><span>To Lina Haddad · +50 points · "For mentoring Reem and Maya"</span></div><div class="act__time">3d ago</div></div>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------
// ROUTER
// -----------------------------------------------------------
const ROUTES = {
  "dashboard":       pageDashboard,
  "team":            pageTeam,
  "probation":       pageProbation,
  "project-ratings": pageProjectRatings,
  "kpis":            pageKPIs,
  "kpi-library":     pageKpiLibrary,
  "kpi-assign":      pageKpiAssign,
  "badges":          pageBadges,
  "profile":         pageProfile,
  "notifications":   pageNotifications,
};

function route() {
  const hash = location.hash.replace(/^#/, "") || "dashboard";
  const id = ROUTES[hash] ? hash : "dashboard";
  const meta = NAV_ITEMS.find(n => n.id === id);

  $("#page-title").textContent = meta.title;
  $("#page-breadcrumb").innerHTML = id === "dashboard"
    ? `<span>Cloud Engineering</span><span class="dot-sep">•</span><span>${DATA.tl.reports} direct reports</span>`
    : `<span>Team Lead</span><span class="dot-sep">›</span><span>${meta.label}</span>`;
  $("#page-content").innerHTML = ROUTES[id]();

  renderNav(id);
  bindPageEvents(id);
  closeSlideover();
  window.scrollTo(0, 0);
}

function bindPageEvents(pageId) {
  // TL dashboard customize button
  $$('[data-action="tl-customize-dashboard"]').forEach(b => b.addEventListener("click", () => {
    if (!window.SUDO_LAYOUT) { window.__toast && window.__toast("Layout helper not loaded", "warn"); return; }
    SUDO_LAYOUT.openCustomizer({
      pageKey: "tl-dashboard",
      label: "Team Lead Dashboard",
      sections: TL_DASHBOARD_SECTIONS,
      defaultOrder: TL_DASHBOARD_DEFAULT_ORDER,
      onSave: () => {
        window.__toast && window.__toast("Layout saved — reloading", "success");
        setTimeout(() => location.reload(), 500);
      },
    });
  }));

  // Render TL team composite chart on KPI Reviews page, with click drill-down
  if (pageId === "kpis" && window.SUDO_CHARTS && window.SUDO_DB_HELPERS) {
    setTimeout(() => {
      const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour")
              || SUDO_DB.employees.find(e => e.teamRole === "lead");
      const myTeamId = me ? me.teamId : "ps";
      const members = SUDO_DB_HELPERS.teamMembers(myTeamId).filter(m => m.teamRole === "member");
      const rows = members.map(m => {
        const c = SUDO_DB_HELPERS.compositeScore(m.id, "q2-2026");
        const val = c !== null ? Math.round(c) : 0;
        const tone = val >= 95 ? "green" : val >= 80 ? "amber" : val > 0 ? "red" : "grey";
        return { label: m.name.split(" ")[0], value: val, color: SUDO_CHARTS.COLORS[tone], emp: m, tone };
      }).filter(r => r.value > 0).sort((a,b) => b.value - a.value).slice(0, 12);
      if (rows.length > 0) {
        SUDO_CHARTS.hbar("tl-team-scores-chart", rows, {
          max: 100, unit: "%",
          onClick: (row) => {
            const emp = row.emp;
            const assigns = SUDO_DB_HELPERS.assignmentsForEmployee(emp.id, "q2-2026");
            openSlideover({
              title: `${emp.name} · KPI breakdown`,
              body: `
                <div class="info-banner" style="margin-bottom:14px;background:${row.tone === 'red' ? '#FEF2F2' : row.tone === 'amber' ? '#FFFBEB' : row.tone === 'green' ? '#F0FDF4' : '#F9FAFB'};border-color:${row.color}">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${row.color};margin-right:6px"></span>
                  <div><strong>${emp.title || 'Engineer'}</strong> · Composite ${row.value}% · ${assigns.length} active KPI${assigns.length === 1 ? '' : 's'} ${row.tone === 'red' ? '· Consider a 1:1 to discuss the below-target items' : ''}</div>
                </div>
                <div class="table-wrap">
                  <table class="table">
                    <thead><tr><th>KPI</th><th>Current</th><th>Target</th><th>Weight</th><th>Status</th></tr></thead>
                    <tbody>
                      ${assigns.map(a => {
                        const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn) || {};
                        const status = SUDO_DB_HELPERS.kpiStatusColor(a);
                        const statusLabel = { green: 'On target', amber: 'At risk', red: 'Below', grey: 'No data' }[status] || status;
                        const statusTone = { green: 'ok', amber: 'warn', red: 'danger', grey: 'info' }[status];
                        return `
                          <tr>
                            <td><code style="font-size:11px">${a.templateKrn}</code><br><span class="table__sub" style="font-size:11px">${tpl.title || ''}</span></td>
                            <td>${a.currentValue || '—'}</td>
                            <td>${tpl.target || '—'}</td>
                            <td>${a.weight}%</td>
                            <td><span class="status status--${statusTone}">${statusLabel}</span></td>
                          </tr>`;
                      }).join("")}
                    </tbody>
                  </table>
                </div>
                <div class="form-foot">
                  <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
                  ${row.tone === 'red' ? '<button class="btn btn--primary">Schedule 1:1</button>' : ''}
                </div>`,
            });
          },
        });
      } else {
        const el = document.getElementById("tl-team-scores-chart");
        if (el) el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--ink-500);font-size:12.5px">No composite data yet · team needs to submit KPI progress first</div>';
      }
    }, 60);
  }

  // Card click → page
  $$("[data-card-id]").forEach(el => el.addEventListener("click", () => {
    const id = el.dataset.cardId;
    const map = { 'team-size':'team', 'kpi-avg':'kpis', 'pending':'project-ratings', 'probation':'probation' };
    if (map[id]) location.hash = "#" + map[id];
  }));

  // Tabs
  $$(".tabs .tab").forEach(tab => tab.addEventListener("click", () => {
    const parent = tab.closest(".tabs").parentElement;
    parent.querySelectorAll(".tab").forEach(t => t.classList.remove("tab--active"));
    tab.classList.add("tab--active");
    const target = tab.dataset.tab;
    parent.querySelectorAll(".tabpane").forEach(p => p.classList.remove("tabpane--active"));
    parent.querySelector(`[data-tabpane="${target}"]`)?.classList.add("tabpane--active");
  }));

  // Team view switcher
  $$("#team-view .view-switch__btn").forEach(b => b.addEventListener("click", () => {
    $$("#team-view .view-switch__btn").forEach(x => x.classList.remove("view-switch__btn--active"));
    b.classList.add("view-switch__btn--active");
    const v = b.dataset.view;
    const content = $("#team-view-content");
    if (v === "list") content.innerHTML = renderTeamList(DATA.team);
    if (v === "tiles") content.innerHTML = renderTeamTiles(DATA.team);
    if (v === "kanban") content.innerHTML = renderTeamKanban(DATA.team);
    bindRowClicks();
  }));
  bindRowClicks();

  // Star rating
  $$(".rating-star").forEach(s => s.addEventListener("click", () => {
    const id = s.dataset.ratingId;
    const star = +s.dataset.star;
    const row = s.parentElement;
    row.querySelectorAll(".rating-star").forEach((x, i) => {
      x.classList.toggle("rating-star--filled", i < star);
    });
    document.querySelector(`[data-rating-value="${id}"]`).textContent = star + ".0";
  }));

  // ── TL Validation Queue actions ──────────────────────────────────────
  $$("[data-action='tl-approve-hr-draft']").forEach(b => b.addEventListener("click", async () => {
    const id = b.dataset.id;
    const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
    if (!a) return;
    const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
    const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour") || SUDO_DB.employees.find(e => e.teamRole === "lead");
    // Real API call — approve the KPI assignment
    if (window.api) {
      try {
        b.disabled = true;
        await api.kpi.approve(id);
      } catch (e) {
        window.__toast("Approve failed: " + (e.message || "error"), "danger");
        b.disabled = false;
        return;
      }
    }
    SUDO_DB_OVERRIDES.updateAssignment(id, {
      status: "active",
      tlApprovedBy: me ? me.id : "E003",
      tlApprovedAt: new Date().toISOString().slice(0,10),
    });
    SUDO_DB_OVERRIDES.audit(me ? me.name : "TL", "kpi.assignment.tl_approved", id, `${tpl ? tpl.krn : ''} now active for employee`);
    SUDO_DB_OVERRIDES.notify({ title: "TL approved HR-drafted KPI", desc: `${tpl ? tpl.krn : id} is now active`, icon: "check", color: "ok" });
    window.__toast("Approved · employee can now acknowledge & track", "success");
    if (window.SUDO_HYDRATE) { await SUDO_HYDRATE.rehydrate("kpiAssignments"); route(); }
    else setTimeout(() => location.reload(), 600);
  }));

  $$("[data-action='tl-revise-hr-draft']").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.id;
    const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
    if (!a) return;
    openSlideover({
      title: "Revise HR-drafted KPI",
      body: `
        <div class="info-banner" style="margin-bottom:14px">${ICONS.pen}
          <div>Send back to HR with your suggested changes. The KPI stays in draft until HR re-submits.</div>
        </div>
        <div class="form-grid">
          <div class="field"><label class="field__label">Suggested weight (%)</label><input class="input" type="number" id="tl-revise-weight" value="${a.weight}"></div>
          <div class="field field--full"><label class="field__label">Revision note</label><textarea class="textarea" id="tl-revise-note" rows="3" placeholder="e.g. 'Suggest dropping weight to 5% for first cycle'"></textarea></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" id="tl-revise-send">${ICONS.send} Send back to HR</button>
        </div>`,
    });
    setTimeout(() => {
      const btn = document.getElementById("tl-revise-send");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const w = parseInt(document.getElementById("tl-revise-weight").value, 10) || a.weight;
        const note = (document.getElementById("tl-revise-note").value || "").trim();
        SUDO_DB_OVERRIDES.updateAssignment(id, { status: "draft", weight: w, tlReviseNote: note });
        SUDO_DB_OVERRIDES.audit("TL", "kpi.assignment.tl_revised", id, note);
        closeSlideover();
        window.__toast("Sent back to HR with revision note", "info");
        setTimeout(() => location.reload(), 600);
      });
    }, 60);
  }));

  $$("[data-action='tl-confirm-progress']").forEach(b => b.addEventListener("click", async () => {
    const id = b.dataset.id;
    const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
    if (!a) return;
    const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour") || SUDO_DB.employees.find(e => e.teamRole === "lead");
    if (window.api) {
      try {
        b.disabled = true;
        await api.kpi.validate(id, { validatedValue: a.empSubmittedValue });
      } catch (e) {
        window.__toast("Validate failed: " + (e.message || "error"), "danger");
        b.disabled = false;
        return;
      }
    }
    SUDO_DB_OVERRIDES.updateAssignment(id, {
      status: "active",
      validatedValue: a.empSubmittedValue,
      validatedBy: me ? me.id : "E003",
      validatedAt: new Date().toISOString().slice(0,10),
    });
    SUDO_DB_OVERRIDES.audit(me ? me.name : "TL", "kpi.progress.tl_confirmed", id, `Confirmed ${a.empSubmittedValue}`);
    window.__toast("Validated · employee scorecard updated", "success");
    if (window.SUDO_HYDRATE) { await SUDO_HYDRATE.rehydrate("kpiAssignments"); route(); }
    else setTimeout(() => location.reload(), 600);
  }));

  $$("[data-action='tl-revise-progress']").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.id;
    const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
    if (!a) return;
    openSlideover({
      title: "Revise Employee Submitted Value",
      body: `
        <div class="info-banner" style="margin-bottom:14px">${ICONS.pen}
          <div>Employee submitted <strong>${a.empSubmittedValue}</strong>. Enter the value you consider accurate.</div>
        </div>
        <div class="form-grid">
          <div class="field"><label class="field__label">Submitted value</label><input class="input" value="${a.empSubmittedValue}" disabled style="background:var(--ink-50)"></div>
          <div class="field"><label class="field__label">Validated value</label><input class="input" type="number" step="0.1" id="tl-revised-val" value="${a.empSubmittedValue}"></div>
          <div class="field field--full"><label class="field__label">Note</label><textarea class="textarea" id="tl-validate-note" rows="2"></textarea></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" id="tl-confirm-revise">${ICONS.check} Save validated value</button>
        </div>`,
    });
    setTimeout(() => {
      const btn = document.getElementById("tl-confirm-revise");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const val = parseFloat(document.getElementById("tl-revised-val").value);
        const note = (document.getElementById("tl-validate-note").value || "").trim();
        if (isNaN(val)) { window.__toast("Enter numeric value", "warn"); return; }
        const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour") || SUDO_DB.employees.find(e => e.teamRole === "lead");
        SUDO_DB_OVERRIDES.updateAssignment(id, {
          status: "active",
          validatedValue: val,
          validatedBy: me ? me.id : "E003",
          validatedAt: new Date().toISOString().slice(0,10),
          statusRemarks: note,
        });
        SUDO_DB_OVERRIDES.audit(me ? me.name : "TL", "kpi.progress.tl_revised", id, `Revised ${a.empSubmittedValue} → ${val}`);
        closeSlideover();
        window.__toast("Revised and validated", "success");
        setTimeout(() => location.reload(), 600);
      });
    }, 60);
  }));

  $$("[data-action='tl-schedule-1on1']").forEach(b => b.addEventListener("click", () => {
    const emp = SUDO_DB_HELPERS.findEmployee(b.dataset.empId);
    if (!emp) return;
    SUDO_DB_OVERRIDES.audit("TL", "at_risk.1on1_scheduled", emp.id, `1:1 scheduled with ${emp.name}`);
    SUDO_DB_OVERRIDES.notify({ title: `1:1 scheduled with ${emp.name}`, desc: "Calendar invite sent for this week", icon: "calendar", color: "info" });
    window.__toast(`1:1 scheduled with ${emp.name}`, "success");
  }));

  // Generic actions → toasts
  $$("[data-action]:not([data-action^='tl-']):not([data-action^='kpi-tpl-']):not([data-action^='ka-'])").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.action;
    if (a === "forward-to-hr")       window.__toast("Forwarded to HR for approval", "success");
    else if (a === "save-rating-draft") window.__toast("Draft saved", "info");
    else if (a === "grant-badge")    openGrantBadgeDialog(b.dataset.badgeId);
    else if (a === "add-remark")     openRemarkDialog(b.dataset.id);
    else if (a === "add-monthly-remark") openMonthlyRemarkDialog(b.dataset.id, b.dataset.month);
    else if (a === "schedule-meeting") openScheduleMeetingDialog(b.dataset.id);
    else if (a === "probation-decision") openProbationDecisionDialog(b.dataset.id);
    else if (a === "ai-insights" || a === "ai-regenerate") window.__toast("AI insights regenerating · check back in 30 seconds", "info");
    else if (a === "kpi-add-rating") window.__toast("Open the project rating flow to rate this KPI's underlying work", "info");
    else if (a === "kpi-remark")     openKpiRemarkDialog(b.dataset.id);
    else                              window.__toast("Action triggered (demo)", "info");
  }));

  // Quick rate (top bar)
  const qr = $("#quick-rate");
  if (qr) qr.addEventListener("click", () => location.hash = "#project-ratings");

  // Notifications dropdown
  $("#notif-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    $("#notif-dropdown").classList.toggle("notif-dropdown--show");
  });
  document.addEventListener("click", () => $("#notif-dropdown")?.classList.remove("notif-dropdown--show"));
  $("#notif-body").innerHTML = (function(){
    const sudoNotifs = (window.SUDO_DB && Array.isArray(SUDO_DB.notifications)) ? SUDO_DB.notifications.slice(0, 8) : [];
    const seeded = `
      <div class="act act--unread"><div class="act__dot act__dot--warn">${ICONS.star}</div><div class="act__main"><strong>Fatima submitted a project rating</strong><br><span>Reem Al Otaibi · ★ 4.3</span></div><div class="act__time">2h</div></div>
      <div class="act act--unread"><div class="act__dot act__dot--warn">${ICONS.shield}</div><div class="act__main"><strong>Probation meeting due</strong><br><span>Tomás Rivera Friday</span></div><div class="act__time">5h</div></div>`;
    const fromDb = sudoNotifs.map(n => `
      <div class="act ${n.unread ? 'act--unread' : ''}"><div class="act__dot act__dot--${n.color || 'info'}">${ICONS[n.icon] || ICONS.bell || ''}</div><div class="act__main"><strong>${n.title}</strong><br><span>${n.desc || ''}</span></div><div class="act__time">${n.time || 'now'}</div></div>`).join("");
    return `<div class="activity-feed">${fromDb}${seeded}</div>`;
  })();

  $("#slideover-close")?.addEventListener("click", closeSlideover);
  $("#overlay")?.addEventListener("click", closeSlideover);

  // ── FilterBar mounts (TL pages) ─────────────────────────
  if (window.FilterBar) {
    const fb = (id, opts) => document.getElementById(id) && FilterBar.mount(id, opts);
    const pg = (id, opts) => window.Pagination && document.getElementById(id) && Pagination.mount(id, opts);

    function tlTeamCount(tag) {
      return document.querySelectorAll(`#tl-team-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-tl-team", {
      targetContainer: "tl-team-results",
      tabs: [
        { id: "all",        label: "All",        count: tlTeamCount("all") },
        { id: "onboarding", label: "Onboarding", count: tlTeamCount("onboarding") },
        { id: "probation",  label: "Probation",  count: tlTeamCount("probation") },
        { id: "confirmed",  label: "Confirmed",  count: tlTeamCount("confirmed") },
        { id: "flagged",    label: "Flagged",    count: tlTeamCount("flagged") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "status", label: "Status", options: ["All statuses", "Onboarding", "Probation", "Confirmed"] },
        { id: "title",  label: "Title",  options: ["Any title", "Cloud Engineer", "Senior Cloud Eng.", "DevOps Engineer", "Junior Cloud Eng.", "Lead Engineer"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-tl-team", { targetContainer: "tl-team-results", itemSelector: "tbody tr[data-tag]", pageSize: 8 });

    function tlProbCount(tag) {
      return document.querySelectorAll(`#tl-probation-results .probation-card[data-tag~="${tag}"]`).length;
    }
    fb("fb-tl-probation", {
      targetContainer: "tl-probation-results",
      tabs: [
        { id: "all",           label: "All",           count: tlProbCount("all") },
        { id: "high-risk",     label: "High risk",     count: tlProbCount("high-risk") },
        { id: "decisions-due", label: "Decisions due", count: tlProbCount("decisions-due") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "stage", label: "Stage", options: ["Any stage", "30-day", "60-day", "Pre-confirmation"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-tl-probation", { targetContainer: "tl-probation-results", itemSelector: ".probation-card[data-tag]", pageSize: 5 });

    fb("fb-tl-ratings", {
      tabs: [
        { id: "pending",   label: "Pending Your Review", count: DATA.projectRatings.length },
        { id: "forwarded", label: "Forwarded to HR",      count: 7 },
        { id: "history",   label: "History"                       },
      ],
      views: ["list", "tiles"],
      period: true,
      filters: [
        { id: "project", label: "Project", options: ["All projects", "Client-Alpha", "Bank-of-Sky", "TelcoCo", "Retail-Co"] },
        { id: "pm",      label: "PM",      options: ["All PMs", "Fatima Al Zaabi", "Sara Mitchell", "Khalid Mansour"] },
        { id: "rating",  label: "PM rating", options: ["Any", "★ 4.5+", "★ 3.5–4.5", "★ < 3.5"] },
      ],
      search: true,
      download: true,
    });

    fb("fb-tl-kpis", {
      tabs: [
        { id: "active",      label: "Active",       count: DATA.kpis.filter(k=>k.status!=='Achieved').length },
        { id: "achieved",    label: "Achieved",     count: DATA.kpis.filter(k=>k.status==='Achieved').length },
        { id: "team-scores", label: "Team Scores"            },
        { id: "ai",          label: "AI Insights ✨"         },
      ],
      views: ["list", "tiles", "chart"],
      period: true,
      filters: [
        { id: "member",   label: "Member",   options: ["All members", ...DATA.team.map(m=>m.name)] },
        { id: "status",   label: "Status",   options: ["All statuses", "On track", "At risk", "Achieved", "Missed"] },
        { id: "category", label: "Category", options: ["All categories", "Learning", "Performance", "Delivery", "Leadership"] },
      ],
      search: true,
      download: true,
    });
  }

  // ─── KPI Library actions ─────────────────────────────────────────────
  if (pageId === "kpi-library") {
    $$("[data-action='kpi-tpl-new']").forEach(b => b.addEventListener("click", () => openTemplateDialog(null)));
    $$("[data-action='kpi-tpl-edit']").forEach(b => b.addEventListener("click", () => openTemplateDialog(b.dataset.krn)));
    $$("[data-action='kpi-tpl-clone']").forEach(b => b.addEventListener("click", () => openTemplateDialog(b.dataset.krn, /* clone= */ true)));
    $$("[data-action='kpi-tpl-quick-assign']").forEach(b => b.addEventListener("click", () => {
      // Hop to Assign page with the template pre-selected via hash query
      sessionStorage.setItem("ka-prefill-krn", b.dataset.krn);
      location.hash = "#kpi-assign";
    }));
  }

  // ─── KPI Assign wizard ───────────────────────────────────────────────
  if (pageId === "kpi-assign") {
    const me = SUDO_DB.employees.find(e => e.name === "Khalid Mansour")
            || SUDO_DB.employees.find(e => e.teamRole === "lead");
    const myTeamId = me ? me.teamId : "ps";
    const members = SUDO_DB_HELPERS.teamMembers(myTeamId);

    const tplSel  = $("#ka-template");
    const scopeSel = $("#ka-scope");
    const scopeDetail = $("#ka-scope-detail");
    const weightInp = $("#ka-weight");
    const cycleSel = $("#ka-cycle");
    const noteInp  = $("#ka-note");
    const preview  = $("#ka-preview");
    const previewC = $("#ka-preview-content");

    // Pre-fill template from sessionStorage if user came from "Quick Assign"
    const prefillKrn = sessionStorage.getItem("ka-prefill-krn");
    if (prefillKrn && tplSel) {
      tplSel.value = prefillKrn;
      sessionStorage.removeItem("ka-prefill-krn");
    }

    function rebuildScopeDetail() {
      const scope = scopeSel.value;
      let opts = [];
      if (scope === "team") {
        opts = [`<option value="all-members">All ${members.length} team members</option>`];
      } else if (scope === "subset") {
        // Group by job title prefix
        const titles = [...new Set(members.map(m => (m.title || "").split("·")[0].trim()))];
        opts = titles.map(t => {
          const c = members.filter(m => (m.title || "").startsWith(t)).length;
          return `<option value="role:${t}">${t} (${c} people)</option>`;
        });
      } else {
        opts = members.map(m => `<option value="emp:${m.id}">${m.name} · ${m.title}</option>`);
      }
      scopeDetail.innerHTML = opts.join("");
      updatePreview();
    }

    function updatePreview() {
      const tpl = SUDO_DB.kpiTemplates.find(t => t.krn === tplSel.value);
      if (!tpl) { preview.style.display = "none"; return; }
      // Auto-fill weight from template
      if (!weightInp.dataset.userTouched) weightInp.value = tpl.defaultWeight;
      const scope = scopeSel.value;
      const scopeLabel = scope === "team" ? `All ${members.length} ${SUDO_DB_HELPERS.findTeam(myTeamId).name} members`
                       : scope === "subset" ? scopeDetail.value.replace("role:", "")
                       : (members.find(m => "emp:" + m.id === scopeDetail.value) || {}).name || "—";
      const cycle = cycleSel.options[cycleSel.selectedIndex].text;
      preview.style.display = "block";
      previewC.innerHTML = `
        <div style="font-size:14px;font-weight:600;color:var(--ink-900);margin-bottom:8px">${tpl.krn} · ${tpl.label}</div>
        <div style="font-size:12px;color:var(--ink-700);line-height:1.7">
          <div><strong>Target:</strong> ${tpl.target}</div>
          <div><strong>Frequency:</strong> ${tpl.frequency}</div>
          <div><strong>MoV:</strong> ${tpl.mov}</div>
          <div><strong>Assigned to:</strong> ${scopeLabel}</div>
          <div><strong>Cycle:</strong> ${cycle}</div>
          <div><strong>Weight:</strong> ${weightInp.value}%</div>
        </div>
      `;
    }

    weightInp.addEventListener("input", () => { weightInp.dataset.userTouched = "1"; updatePreview(); });
    scopeSel.addEventListener("change", rebuildScopeDetail);
    scopeDetail.addEventListener("change", updatePreview);
    tplSel.addEventListener("change", () => { delete weightInp.dataset.userTouched; updatePreview(); });
    cycleSel.addEventListener("change", updatePreview);

    rebuildScopeDetail();
    if (tplSel.value) updatePreview();

    $$("[data-action='ka-cancel']").forEach(b => b.addEventListener("click", () => {
      tplSel.value = ""; weightInp.value = 5; noteInp.value = "";
      preview.style.display = "none";
      window.__toast("Draft cleared", "info");
    }));

    $$("[data-action='ka-submit']").forEach(b => b.addEventListener("click", () => {
      const tpl = SUDO_DB.kpiTemplates.find(t => t.krn === tplSel.value);
      if (!tpl) return window.__toast("Pick a template first", "warn");
      const scope = scopeSel.value;
      const cycleId = cycleSel.value;
      const weight = parseInt(weightInp.value, 10) || 5;
      const note = noteInp.value.trim();

      // Determine which employees to assign to
      let targets = [];
      let scopeLabel = "";
      if (scope === "team") {
        targets = members.map(m => m.id);
        scopeLabel = "All " + SUDO_DB_HELPERS.findTeam(myTeamId).name + " members";
      } else if (scope === "subset") {
        const rolePrefix = scopeDetail.value.replace("role:", "");
        targets = members.filter(m => (m.title || "").startsWith(rolePrefix)).map(m => m.id);
        scopeLabel = rolePrefix;
      } else {
        const empId = scopeDetail.value.replace("emp:", "");
        targets = [empId];
        const emp = SUDO_DB.employees.find(e => e.id === empId);
        scopeLabel = emp ? emp.name + " only" : empId;
      }

      if (targets.length === 0) return window.__toast("No employees selected", "warn");

      // Create one assignment per target
      const created = [];
      targets.forEach(empId => {
        const a = SUDO_DB_OVERRIDES.addAssignment({
          krn: tpl.krn,
          templateKrn: tpl.krn,
          empId, cycleId, scope, scopeLabel, weight,
          draftedBy: me ? me.id : "E003",
          status: "pending_hr",
          tlNote: note,
        });
        created.push(a);
      });

      // Audit
      SUDO_DB_OVERRIDES.audit(
        (me ? me.name : "Team Lead") + " (" + (me ? me.id : "?") + ")",
        "kpi.assignment.drafted",
        tpl.krn + " → " + targets.length + " people",
        note || `${tpl.label} · ${scopeLabel}`
      );

      window.__toast(`${created.length} KPI assignment(s) sent to HR for approval`, "success");
      setTimeout(() => location.reload(), 800);
    }));
  }
}

function bindRowClicks() {
  $$("[data-emp-id]").forEach(el => el.addEventListener("click", () => {
    const id = el.dataset.empId;
    const member = DATA.team.find(m => m.id === id);
    if (!member) return;
    openSlideover({
      title: member.name,
      body: `
        <div class="emp-detail-hero" style="margin-bottom:14px">
          <div class="emp-detail-hero__avatar">${initials(member.name)}</div>
          <div class="emp-detail-hero__main">
            <div class="emp-detail-hero__name">${member.name}</div>
            <div class="emp-detail-hero__title">${member.title}</div>
            <div class="emp-detail-hero__meta">
              <span>${ICONS.briefcase} ${member.id}</span>
              <span>KPI ${member.kpiScore}</span>
              <span>${member.lastRating?'★ '+member.lastRating:'No rating yet'}</span>
            </div>
          </div>
        </div>
        <div class="info-grid" style="grid-template-columns:1fr 1fr">
          <div class="info-card"><div class="info-card__title">Performance</div>
            <div class="info-row"><span class="info-row__label">KPI score</span><span class="info-row__value">${member.kpiScore}/100</span></div>
            <div class="info-row"><span class="info-row__label">Last rating</span><span class="info-row__value">${member.lastRating?'★ '+member.lastRating:'—'}</span></div>
            <div class="info-row"><span class="info-row__label">Badges</span><span class="info-row__value">${member.badges}</span></div>
            <div class="info-row"><span class="info-row__label">Active projects</span><span class="info-row__value">${member.projects}</span></div>
          </div>
          <div class="info-card"><div class="info-card__title">Status</div>
            <div class="info-row"><span class="info-row__label">Employment</span><span class="info-row__value">${member.status}</span></div>
            <div class="info-row"><span class="info-row__label">Joined</span><span class="info-row__value">${member.joined}</span></div>
            ${member.probation?`<div class="info-row"><span class="info-row__label">Probation</span><span class="info-row__value"><span class="status status--warn">Active</span></span></div>`:''}
            ${member.flagged?`<div class="info-row"><span class="info-row__label">Flagged</span><span class="info-row__value"><span class="status status--danger">Needs review</span></span></div>`:''}
          </div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
          <button class="btn btn--secondary">${ICONS.message} Message</button>
          <button class="btn btn--primary" onclick="closeSlideover(); location.hash='#project-ratings'">${ICONS.star} Rate on project</button>
        </div>`,
    });
  }));
}

function openGrantBadgeDialog(badgeId) {
  const badge = DATA.grantableBadges.find(b => b.id === badgeId);
  if (!badge) return;
  openSlideover({
    title: `Grant ${badge.label}`,
    body: `
      <div class="badge-grant-hero" style="--badge-color:${badge.color}">
        <div class="badge-grant-hero__icon">${badge.icon}</div>
        <div>
          <div class="badge-grant-hero__title">${badge.label}</div>
          <div class="badge-grant-hero__points">+${badge.points} points</div>
        </div>
      </div>
      <p style="font-size:12.5px;color:var(--ink-700);margin:12px 0">${badge.description}</p>
      <div class="form-grid">
        <div class="field field--full"><label class="field__label">Recipient</label>
          <select class="select">${DATA.team.map(m=>`<option>${m.name} · ${m.id}</option>`).join('')}</select>
        </div>
        <div class="field field--full"><label class="field__label">Reason (visible to recipient)</label>
          <textarea class="textarea" placeholder="What did they do? Be specific — the recipient sees this."></textarea>
        </div>
        <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Announce in #celebrations (Slack)</label></div>
        <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Notify the recipient's PM</label></div>
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('${badge.label} granted · +${badge.points} points', 'success')">${ICONS.send} Grant badge</button>
      </div>`,
  });
}

function openRemarkDialog(empId) {
  const p = DATA.probation.find(x => x.id === empId);
  openSlideover({
    title: `Add probation remark · ${p?.name || empId}`,
    body: `
      <p style="font-size:12.5px;color:var(--ink-700);margin-bottom:12px">Remarks are visible to HR. Use them to capture meeting outcomes, concerns, or observations.</p>
      <div class="form-grid">
        <div class="field"><label class="field__label">Remark type</label><select class="select"><option>Meeting outcome</option><option>Performance observation</option><option>Behavioural feedback</option><option>Recommendation</option><option>Concern flag</option></select></div>
        <div class="field"><label class="field__label">Visibility</label><select class="select"><option>HR + me (default)</option><option>HR + me + the employee</option></select></div>
        <div class="field field--full"><label class="field__label">Remark</label><textarea class="textarea" placeholder="Be specific. Quote what was discussed if relevant."></textarea></div>
        <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Flag this for HR's immediate attention</label></div>
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Remark added · HR notified', 'success')">${ICONS.send} Save remark</button>
      </div>`,
  });
}

function openMonthlyRemarkDialog(empId, month) {
  const p = DATA.probation.find(x => x.id === empId);
  const monthLabel = month === "1" ? "Month 1 · Onboarding fit" : month === "2" ? "Month 2 · Performance" : month === "3" ? "Month 3 · Final review" : "Monthly remark";
  const monthNum = month || "?";
  openSlideover({
    title: `Monthly remark · ${monthLabel}`,
    body: `
      <div class="info-banner" style="margin-bottom:14px">${ICONS.calendar}<div><strong>${p?.name || empId} · M${monthNum} of 3.</strong> Monthly remarks are mandatory and visible to HR. They feed into the final probation decision at Month 3.</div></div>
      <div class="form-grid">
        <div class="field"><label class="field__label">Overall standing this month</label><select class="select"><option>On track · meeting expectations</option><option>Exceeding expectations</option><option>Needs support · improving</option><option>At risk · concerns</option><option>Not meeting expectations</option></select></div>
        <div class="field"><label class="field__label">Trend vs last month</label><select class="select"><option>Improving</option><option>Stable</option><option>Slipping</option><option>N/A · first month</option></select></div>
        <div class="field field--full"><label class="field__label">What went well</label><textarea class="textarea" rows="2" placeholder="Concrete wins, delivery, behaviours, peer feedback…"></textarea></div>
        <div class="field field--full"><label class="field__label">Areas to improve</label><textarea class="textarea" rows="2" placeholder="Skills gaps, behaviours, where they need support…"></textarea></div>
        <div class="field field--full"><label class="field__label">Plan for next month</label><textarea class="textarea" rows="2" placeholder="What you'll work on with them, training, pairing…"></textarea></div>
        ${monthNum === "3" ? `<div class="field field--full"><label class="field__label">Recommendation to HR</label><select class="select"><option>Recommend confirmation</option><option>Recommend 30-day extension</option><option>Recommend 60-day extension</option><option>Recommend 90-day extension</option><option>Recommend release</option></select></div>` : ""}
        <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Flag this remark for HR's immediate review</label></div>
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--secondary" onclick="closeSlideover(); window.__toast('Draft saved', 'info')">Save draft</button>
        <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('M${monthNum} remark filed · HR notified', 'success')">${ICONS.send} File remark</button>
      </div>`,
  });
}

function openScheduleMeetingDialog(empId) {
  openSlideover({
    title: "Schedule probation meeting",
    body: `
      <div class="form-grid">
        <div class="field field--full"><label class="field__label">Attendee</label><select class="select">${DATA.probation.map(p=>`<option ${p.id===empId?'selected':''}>${p.name}</option>`).join('')}</select></div>
        <div class="field"><label class="field__label">Date</label><input class="input" type="date" /></div>
        <div class="field"><label class="field__label">Time</label><input class="input" type="time" /></div>
        <div class="field field--full"><label class="field__label">Meeting type</label><select class="select"><option>30-day check-in</option><option>60-day check-in</option><option>Pre-confirmation review</option><option>Concern discussion</option><option>Decision meeting</option></select></div>
        <div class="field field--full"><label class="field__label">Agenda</label><textarea class="textarea" placeholder="Topics to cover"></textarea></div>
        <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Send Teams invite</label></div>
        <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> CC HR</label></div>
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Meeting scheduled · invite sent', 'success')">${ICONS.send} Schedule</button>
      </div>`,
  });
}

function openProbationDecisionDialog(empId) {
  const p = DATA.probation.find(x => x.id === empId);
  openSlideover({
    title: `Probation recommendation · ${p?.name || ''}`,
    body: `
      <div class="info-banner" style="margin-bottom:14px">${ICONS.shield}<div>Your recommendation goes to HR. HR makes the final decision.</div></div>
      <div class="form-grid">
        <div class="field field--full"><label class="field__label">Recommendation</label>
          <select class="select"><option>Confirm — pass probation</option><option>Extend probation by 30 days</option><option>Extend probation by 60 days</option><option>End employment</option><option>Recommend role change</option></select>
        </div>
        <div class="field field--full"><label class="field__label">Justification</label><textarea class="textarea" placeholder="Reference KPI scores, project ratings, meetings…"></textarea></div>
        <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Request urgent HR review</label></div>
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Recommendation sent to HR', 'success')">${ICONS.send} Send to HR</button>
      </div>`,
  });
}

function openKpiRemarkDialog(kpiId) {
  const k = DATA.kpis.find(x => x.id === kpiId);
  openSlideover({
    title: `KPI remark · ${k?.title || kpiId}`,
    body: `
      <p style="font-size:12.5px;color:var(--ink-700);margin-bottom:12px">Visible to the employee and HR. Used in cycle-end review.</p>
      <div class="form-grid">
        <div class="field field--full"><label class="field__label">Remark</label><textarea class="textarea" placeholder="Progress, concerns, support needed…"></textarea></div>
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Remark added', 'success')">${ICONS.send} Save</button>
      </div>`,
  });
}

// -----------------------------------------------------------
// BOOT
// -----------------------------------------------------------
window.addEventListener("hashchange", route);
SUDO_INIT("team_lead", route);

// ── Role switcher — every TL is also an Employee in real life, so the switcher
// appears and lets Khalid hop to his own Employee portal.
if (window.RoleSwitcher) {
  const meId = "E003";  // Khalid Mansour — the TL demo user
  const myRoles = (window.SUDO_DB_OVERRIDES && SUDO_DB_OVERRIDES.getRoles)
    ? SUDO_DB_OVERRIDES.getRoles(meId)
    : ["tl", "employee"];
  RoleSwitcher.mount({
    currentRole: "tl",
    basePath: "..",
    hasMultipleRoles: myRoles.length > 1,
    userRoles: myRoles,
    userId: meId,
  });
}
