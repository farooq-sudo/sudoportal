/* =========================================================
   SUDO Employee Portal — HR Portal
   Single-file SPA with hash router
========================================================= */

// =========================================================
// NAV (sidebar items, also used as route registry)
// =========================================================
const NAV_ITEMS = [
  { id: "dashboard",         label: "Dashboard",          iconKey: "grid",       title: "HR Dashboard" },
  { id: "employees",         label: "Employees",          iconKey: "user",       count: 147, title: "Employees" },
  { id: "onboarding",        label: "Onboarding",         iconKey: "rocket",     count: 8, countStyle: "accent", title: "Onboarding Pipeline" },
  { id: "probation",         label: "Probation Tracking", iconKey: "shield",     count: 5, countStyle: "warn", title: "Probation Tracking" },
  { id: "background-checks", label: "Background Checks",  iconKey: "lock",       count: 2, title: "Background Checks" },
  { id: "training-catalogue",label: "Training Catalogue", iconKey: "book",       title: "Training Catalogue" },
  { id: "assign-trainings",  label: "Assign Trainings",   iconKey: "check-circle", title: "Assign Trainings" },
  { id: "training-verifications", label: "Training Verification", iconKey: "shield", count: 4, countStyle: "warn", title: "Training Verification" },
  { id: "kpi-management",    label: "KPI Management",     iconKey: "chart",      title: "KPI Management" },
  { id: "project-ratings",   label: "Project Ratings",    iconKey: "menu-lines", count: 6, countStyle: "warn", title: "Project Ratings Inbox" },
  { id: "projects",          label: "Projects (ODOO)",    iconKey: "code",       title: "Projects — synced from ODOO" },
  { id: "leave-approvals",   label: "Leave Approvals",    iconKey: "calendar",   count: 3, countStyle: "warn", title: "Leave Approvals" },
  { id: "recognition",       label: "Recognition Wall",   iconKey: "star",       title: "Recognition · Top Performers" },
  { id: "badges-admin",      label: "Badges Catalog",     iconKey: "award",      title: "Badges Catalog & Points" },
  { id: "notifications",     label: "Notification Templates", iconKey: "doc",    title: "Notification Templates" },
  { id: "documents",         label: "Documents",          iconKey: "doc",        title: "Documents" },
  { id: "reports",           label: "Reports",            iconKey: "bar",        title: "Reports" },
  { id: "offboarding",       label: "Offboarding",        iconKey: "code",       title: "Offboarding" },
];

// =========================================================
// ICONS
// =========================================================
const ICONS = {
  // sidebar
  grid:         '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>',
  user:         '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" stroke-width="1.8"/></svg>',
  rocket:       '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2v6m0 0l-3-3m3 3l3-3M4 13h16M4 13v7a2 2 0 002 2h12a2 2 0 002-2v-7M4 13l2-4h12l2 4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  book:         '<svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.8"/><path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  "check-circle":'<svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  chart:        '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  users:        '<svg viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  "menu-lines": '<svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  doc:          '<svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.8"/></svg>',
  bar:          '<svg viewBox="0 0 24 24" fill="none"><path d="M9 17v-6m4 6V7m4 10v-3M3 21h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  code:         '<svg viewBox="0 0 24 24" fill="none"><path d="M17 8l4 4-4 4M7 8l-4 4 4 4M14 4l-4 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // dashboard card icons
  usersGroup:   '<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7M16 11a4 4 0 100-8M22 21c0-3-2-5.5-5-6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  rocketAlt:    '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 7-7m-4-6c4 0 8 4 8 8 0 .9-.2 1.8-.4 2.6-.7-1.4-2-2.3-3.4-2.5 1.5-.5 2.6-1.8 2.6-3.4M5 14c-2-1.5-3-3.5-3-5 0-.5.1-1 .2-1.5 1 1.4 2.5 2.3 4.2 2.5-1.8.5-3 1.8-3.4 4z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock:        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  award:        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="currentColor" stroke-width="2"/><path d="M8 13l-2 8 6-3 6 3-2-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  id:           '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="12" r="2.5" stroke="currentColor" stroke-width="2"/><path d="M14 10h5M14 14h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  check:        '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trending:     '<svg viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8M14 7h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pen:          '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9M17 3l4 4-13 13H4v-4L17 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  inbox:        '<svg viewBox="0 0 24 24" fill="none"><path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3.5 7v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7L5.5 5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bell:         '<svg viewBox="0 0 24 24" fill="none"><path d="M18 16h2l-1.4-1.4A2 2 0 0118 13.2V10a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 16h2m12 0H6m12 0a3 3 0 11-6 0m-6 0a3 3 0 006 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  upload:       '<svg viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  send:         '<svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  alert:        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.3 3.6L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shield:       '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  calendar:     '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  lock:         '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.8"/></svg>',
  unlock:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 019.9-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  clockPlus:    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M12 9v4l3 2M5 4l-2 2M19 4l2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  videoCam:     '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M22 8l-6 4 6 4V8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  download:     '<svg viewBox="0 0 24 24" fill="none"><path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  xmark:        '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  userPlus:     '<svg viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM20 8v6m-3-3h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  arrowUp:      '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 19V5m0 0l-7 7m7-7l7 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowDown:    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowRight:   '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  flat:         '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  download:     '<svg viewBox="0 0 24 24" fill="none"><path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  filter:       '<svg viewBox="0 0 24 24" fill="none"><path d="M3 4h18l-7 9v6l-4 2v-8L3 4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  list:         '<svg viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  kanban:       '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="6" height="18" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="10" y="3" width="6" height="11" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="17" y="3" width="4" height="14" rx="1" stroke="currentColor" stroke-width="1.8"/></svg>',
  cog:          '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15.06a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 5.06a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  refresh:      '<svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16m0 5v-5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external:     '<svg viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  eye:          '<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>',
  briefcase:    '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke="currentColor" stroke-width="1.8"/></svg>',
  star:         '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  award:        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  menu:         '<svg viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  plus:         '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  edit:         '<svg viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mail:         '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="2"/></svg>',
  slack:        '<svg viewBox="0 0 24 24" fill="none"><path d="M14 2a2 2 0 012 2v6a2 2 0 11-2-2V2zM14 14a2 2 0 012 2v6a2 2 0 11-2-2v-6zM10 22a2 2 0 01-2-2v-6a2 2 0 112 2v6zM10 10a2 2 0 01-2-2V2a2 2 0 112 2v6z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  phone:        '<svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search:       '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  logout:       '<svg viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// =========================================================
// DATA — single source of dummy data for the whole portal
// =========================================================
// =====================================================================
// DATA — sourced from shared/db.js (window.SUDO_DB).
// `DATA` is kept as a local alias so the rest of this file can keep
// referencing DATA.employees, DATA.trainings, etc. without churn. To
// edit the seed data, open /shared/db.js instead of this file.
// =====================================================================
const DATA = window.SUDO_DB;


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

// Re-fetch a hydrated dataset from the API, then re-render the current page
// so the change is reflected. Safe no-op if hydration isn't available.
async function refreshAndRerender(datasetKey) {
  try {
    if (window.SUDO_HYDRATE && datasetKey) {
      await SUDO_HYDRATE.rehydrate(datasetKey);
    }
  } catch (e) {
    // non-fatal — the optimistic row fade still gives feedback
  }
  if (typeof route === "function") {
    try { route(); } catch (e) { /* ignore */ }
  }
}

// Animate a row out of a queue/list after an action resolves
function fadeRow(btn) {
  const row = btn.closest(".verif-row") || btn.closest("tr") || btn.closest(".row");
  if (row) {
    row.style.transition = "opacity 240ms, transform 240ms";
    row.style.opacity = "0";
    row.style.transform = "translateX(20px)";
    setTimeout(() => row.remove(), 240);
  }
}

// =========================================================
// SIDEBAR
// =========================================================
function renderNav(activeId) {
  const nav = $("#nav .nav__group");
  // keep the heading, replace items
  nav.innerHTML = `<div class="nav__heading">HR</div>` + NAV_ITEMS.map(item => `
    <a class="nav__item ${item.id === activeId ? "nav__item--active" : ""}" data-route="${item.id}" href="#${item.id}">
      ${ICONS[item.iconKey] || ""}
      ${item.label}
      ${item.count !== undefined ? `<span class="nav__count ${item.countStyle === "accent" ? "nav__count--accent" : ""}">${item.count}</span>` : ""}
    </a>
  `).join("");
}

// =========================================================
// SLIDE-OVER (generic)
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
  // Auto-wire any checkbox or toggle controls inside the slideover
  setTimeout(() => {
    $("#slideover-body").querySelectorAll('.checkbox').forEach(cb => {
      cb.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        cb.classList.toggle("checkbox--checked");
        const box = cb.querySelector(".checkbox__box");
        if (box) box.innerHTML = cb.classList.contains("checkbox--checked") ? (ICONS.check || "✓") : "";
      });
    });
    $("#slideover-body").querySelectorAll('.toggle').forEach(tg => {
      tg.addEventListener("click", (e) => { e.stopPropagation(); tg.classList.toggle("toggle--on"); });
    });
  }, 30);
}
function closeSlideover() {
  $("#overlay").classList.remove("open");
  $("#slideover").classList.remove("open");
}

// =========================================================
// PAGE: Dashboard
// =========================================================
// =========================================================
// HR DASHBOARD — sections are independently reorderable.
// Each section is a function returning HTML. The final page assembles
// them in the user-preferred order (saved to localStorage). The
// "Customize" quick-action opens a dialog to reorder sections.
// =========================================================

const HR_DASHBOARD_SECTIONS = [
  { id: "kpi-cards",            label: "KPI Cards",                              hint: "Top metrics strip (Active Employees, Onboarding, Probation Due, etc.)" },
  { id: "onboarding-attention", label: "Onboarding & Needs Attention",           hint: "Two-column row: onboarding funnel + people needing follow-up" },
  { id: "training-activity",    label: "Training Compliance & Recent Activity",  hint: "Two-column row: compliance bars + audit feed" },
  { id: "kpi-analytics",        label: "KPI Analytics charts",                   hint: "Status donut, team scores, KPI lifecycle funnel" },
];
const HR_DASHBOARD_DEFAULT_ORDER = HR_DASHBOARD_SECTIONS.map(s => s.id);

function hrDashSectionKpiCards() {
  return `
    <section class="cards" id="kpi-cards">
      ${DATA.kpiCards.map(card => {
        let deltaHtml = "";
        if (card.delta) {
          const arrow = card.delta.dir === "up" ? ICONS.arrowUp : card.delta.dir === "down" ? ICONS.arrowDown : ICONS.flat;
          deltaHtml = `<span class="card__delta card__delta--${card.delta.dir}">${arrow}${card.delta.text}</span>`;
        }
        return `
        <article class="card" data-card-id="${card.id}">
          <div class="card__head">
            <div class="card__icon card__icon--${card.style}">${ICONS[card.icon]}</div>
            ${deltaHtml}
          </div>
          <div class="card__title">${card.title}</div>
          <div class="card__value">${card.value}${card.unit ? `<span class="card__unit">${card.unit}</span>` : ""}</div>
          ${card.bar ? `<div class="card__bar"><div class="card__bar-fill" style="width:${card.bar}%"></div></div>` : ""}
          <div class="card__meta">${card.meta}</div>
        </article>`;
      }).join("")}
    </section>`;
}

function hrDashSectionOnboardingAttention() {
  return `
    <section class="grid-two">
      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Onboarding Pipeline</h3>
            <p class="panel__sub">8 employees currently in onboarding</p>
          </div>
          <a class="panel__link" data-nav="onboarding">View all →</a>
        </header>
        <div class="panel__body">
          <div class="funnel">
            ${DATA.onboardingFunnel.map(row => {
              const inside = row.pct >= 40;
              const label = inside
                ? `<div class="funnel__bar-label funnel__bar-label--inside">${row.name}</div>`
                : `<div class="funnel__bar-label funnel__bar-label--outside" style="left:calc(${row.pct}% + 10px)">${row.name}</div>`;
              return `
                <div class="funnel__row">
                  <div class="funnel__num">${row.step}</div>
                  <div class="funnel__bar-wrap">
                    <div class="funnel__bar" style="width:${row.pct}%"></div>
                    ${label}
                  </div>
                  <div class="funnel__count">${row.count} people</div>
                  <div class="funnel__pct">${row.pct}%</div>
                </div>`;
            }).join("")}
          </div>
        </div>
      </article>

      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Needs Attention</h3>
            <p class="panel__sub">Sorted by urgency</p>
          </div>
          <div class="panel__filters" data-attn-filters>
            <button class="chip chip--active" data-filter="all">All</button>
            <button class="chip" data-filter="urgent">Urgent</button>
            <button class="chip" data-filter="soon">Soon</button>
          </div>
        </header>
        <div class="panel__body">
          <div class="attention-list" id="attention-list">${renderAttention("all")}</div>
        </div>
      </article>
    </section>`;
}

function hrDashSectionTrainingActivity() {
  return `
    <section class="grid-two">
      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Training Compliance by Designation</h3>
            <p class="panel__sub">% of staff who hold all required certifications</p>
          </div>
          <a class="panel__link" data-nav="reports">Open report →</a>
        </header>
        <div class="panel__body">
          <div class="compliance-list">
            ${DATA.compliance.map(row => `
              <div class="comp">
                <div>
                  <div class="comp__name">${row.name}</div>
                  <div class="comp__bar"><div class="comp__bar-fill" style="width:${row.pct}%;background:${
                    row.style === "ok" ? "var(--ok)" : row.style === "warn" ? "var(--warn)" : "var(--danger)"
                  }"></div></div>
                </div>
                <div class="comp__count">${row.count}</div>
                <div class="comp__pct">${row.pct}%</div>
              </div>`).join("")}
          </div>
        </div>
      </article>

      <article class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Recent Activity</h3>
            <p class="panel__sub">Last 24 hours</p>
          </div>
          <a class="panel__link">Audit log →</a>
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
      </article>
    </section>`;
}

function hrDashSectionKpiAnalytics() {
  return `
    <!-- ── KPI Analytics ───────────────────────────────────────── -->
    <section style="margin-top:24px">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:14px">
        <div>
          <h3 style="font-size:14px;color:var(--ink-700);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin:0">KPI Analytics · Q2 2026</h3>
          <p style="font-size:12px;color:var(--ink-500);margin:4px 0 0">Cross-team health snapshot — drill into any team for the full breakdown</p>
        </div>
        <a class="panel__link" href="#kpi-management">Open KPI Management →</a>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px">
        <article class="panel">
          <header class="panel__head">
            <div>
              <h3 class="panel__title">Status Distribution</h3>
              <p class="panel__sub">All active KPIs across the org</p>
            </div>
          </header>
          <div class="panel__body" id="hr-dash-status-donut"></div>
        </article>

        <article class="panel">
          <header class="panel__head">
            <div>
              <h3 class="panel__title">Team Composite Scores</h3>
              <p class="panel__sub">Average KPI achievement per team</p>
            </div>
          </header>
          <div class="panel__body" id="hr-dash-team-bars"></div>
        </article>

        <article class="panel">
          <header class="panel__head">
            <div>
              <h3 class="panel__title">KPI Lifecycle</h3>
              <p class="panel__sub">Flow across the assignment pipeline</p>
            </div>
          </header>
          <div class="panel__body" id="hr-dash-funnel"></div>
        </article>
      </div>
    </section>`;
}

const HR_DASHBOARD_SECTION_RENDERERS = {
  "kpi-cards":            hrDashSectionKpiCards,
  "onboarding-attention": hrDashSectionOnboardingAttention,
  "training-activity":    hrDashSectionTrainingActivity,
  "kpi-analytics":        hrDashSectionKpiAnalytics,
};

function pageDashboard() {
  const prefs = window.SUDO_LAYOUT
    ? SUDO_LAYOUT.getPrefs("hr-dashboard", HR_DASHBOARD_DEFAULT_ORDER)
    : { order: HR_DASHBOARD_DEFAULT_ORDER, hidden: [] };

  const sectionsHtml = prefs.order
    .filter(id => !prefs.hidden.includes(id))
    .map(id => (HR_DASHBOARD_SECTION_RENDERERS[id] || (() => ""))())
    .join("\n");

  return `
    <section class="welcome">
      <div class="welcome__text">
        <div class="welcome__eyebrow">Good afternoon, Justine</div>
        <h2 class="welcome__h">7 items need your attention today</h2>
        <p class="welcome__p">3 probation reviews due this week, 2 visas expiring in &lt;30 days, and 2 KPI acknowledgements overdue.</p>
      </div>
      <div class="welcome__quick">
        <button class="quick-action" data-quick="assign-trainings">
          <div class="quick-action__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 14v7m0 0l-3-3m3 3l3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <span>Assign Training</span>
        </button>
        <button class="quick-action" data-quick="add-employee">
          <div class="quick-action__icon">${ICONS.userPlus}</div>
          <span>Add Employee</span>
        </button>
        <button class="quick-action" data-quick="notifications">
          <div class="quick-action__icon"><svg viewBox="0 0 24 24" fill="none"><path d="M11 5l9 4v6l-9 4M4 9h7v6H4V9zm0 6l3 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <span>Broadcast</span>
        </button>
        <button class="quick-action quick-action--ghost" data-action="customize-dashboard" title="Reorder dashboard sections">
          <div class="quick-action__icon">${ICONS.cog || '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1m17.5-7.5l-4.2 4.2M9.7 14.3l-4.2 4.2m13-0l-4.2-4.2M9.7 9.7L5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'}</div>
          <span>Customize</span>
        </button>
      </div>
    </section>

    ${sectionsHtml}`;
}

function renderAttention(filter) {
  const items = filter === "all" ? DATA.attention : DATA.attention.filter(a => a.badge === filter);
  return items.map(a => `
    <div class="attn">
      <div class="attn__avatar">${a.initials}</div>
      <div class="attn__main">
        <div class="attn__name">${a.name}</div>
        <div class="attn__desc">${a.desc}</div>
      </div>
      <div class="attn__badge attn__badge--${a.badge}">${a.text}</div>
    </div>`).join("");
}

// =========================================================
// PAGE: Employees (table)
// =========================================================
function pageEmployees() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Employee Directory</h2>
        <div class="page-header__sub">${DATA.employees.length} active · ${DATA.employees.filter(e=>e.status==='Onboarding').length} in onboarding · synced from ODOO &amp; Microsoft Entra</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary" data-action="export-csv">${ICONS.download} Export</button>
        <button class="btn btn--primary" data-action="add-employee">${ICONS.plus} Add Employee</button>
      </div>
    </div>

    <div id="fb-hr-employees"></div>

    <div class="table-wrap" id="hr-employees-results">
      <table class="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Line Manager</th>
            <th>Project Manager</th>
            <th>Status</th>
            <th>Progress</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${DATA.employees.map(e => {
            const deptSlug = e.dept.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
            const statusSlug = e.status.toLowerCase();
            const tags = ["all", statusSlug, deptSlug].join(" ");
            const searchText = `${e.id} ${e.name} ${e.email} ${e.title} ${e.dept}`.toLowerCase();
            return `
              <tr class="row-clickable" data-emp-id="${e.id}" data-tag="${tags}" data-search="${searchText}">
                <td>
                  <div class="table__cell-name">
                    <div class="table__avatar">${initials(e.name)}</div>
                    <div>
                      <div class="table__name">${e.name}</div>
                      <div class="table__sub">${e.title} · ${e.email}</div>
                    </div>
                  </div>
                </td>
                <td>${e.dept}</td>
                <td>${e.lm}</td>
                <td>${e.pm}</td>
                <td><span class="status status--${e.status === "Confirmed" ? "ok" : e.status === "Probation" ? "warn" : "info"}">${e.status}</span></td>
                <td>
                  <div class="progress-mini">
                    <div class="progress-mini__bar"><div class="progress-mini__fill" style="width:${e.progress}%"></div></div>
                    <div class="progress-mini__text">${e.progress}%</div>
                  </div>
                </td>
                <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button></td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No employees match these filters</div>
      </div>
      <div id="pg-hr-employees"></div>
    </div>`;
}
function renderEmployeesRows(rows) {
  return rows.map(e => `
    <tr class="row-clickable" data-emp-id="${e.id}">
      <td>
        <div class="table__cell-name">
          <div class="table__avatar">${initials(e.name)}</div>
          <div>
            <div class="table__name">${e.name}</div>
            <div class="table__sub">${e.title} · ${e.email}</div>
          </div>
        </div>
      </td>
      <td>${e.dept}</td>
      <td>${e.lm}</td>
      <td>${e.pm}</td>
      <td><span class="status status--${e.status === "Confirmed" ? "ok" : "info"}">${e.status}</span></td>
      <td>
        <div class="progress-mini">
          <div class="progress-mini__bar"><div class="progress-mini__fill" style="width:${e.progress}%"></div></div>
          <div class="progress-mini__text">${e.progress}%</div>
        </div>
      </td>
      <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button></td>
    </tr>`).join("");
}

// =========================================================
// PAGE: Onboarding (sub-cards + table)
// =========================================================
function pageOnboarding() {
  const onbEmployees = DATA.employees.filter(e => e.status === "Onboarding");
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Onboarding Pipeline</h2>
        <div class="page-header__sub">8 employees in onboarding · Avg completion 38%</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.filter} Filters</button>
        <button class="btn btn--primary" data-action="new-onboarding">${ICONS.plus} Start onboarding</button>
      </div>
    </div>

    <div class="cards" style="grid-template-columns:repeat(6,1fr);margin-bottom:18px">
      ${DATA.onboardingFunnel.map((s, i) => `
        <div class="card" style="cursor:default;min-height:auto">
          <div class="card__head"><div class="card__icon card__icon--${i < 2 ? "bright" : i < 4 ? "navy" : "ok"}"><div style="font-size:13px;font-weight:700">${s.step}</div></div></div>
          <div class="card__title">${s.name}</div>
          <div class="card__value" style="font-size:24px">${s.count}</div>
          <div class="card__meta">${s.pct}% weight</div>
        </div>`).join("")}
      <div class="card" style="cursor:default;min-height:auto;background:linear-gradient(135deg,#204D9B,#189CD9);color:white;border:none">
        <div class="card__head"><div class="card__icon" style="background:rgba(255,255,255,0.2);color:white">${ICONS.check}</div></div>
        <div class="card__title" style="color:#BCD7F2">Confirmed</div>
        <div class="card__value" style="color:white;font-size:24px">139</div>
        <div class="card__meta" style="color:#95C3EA">Active staff</div>
      </div>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Employee</th><th>Joined</th><th>Current Step</th><th>Completion</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          ${onbEmployees.map(e => {
            const stepIdx = e.progress < 10 ? 1 : e.progress < 25 ? 2 : e.progress < 50 ? 3 : e.progress < 70 ? 4 : 5;
            const stepNames = ["", "Mandatory Training", "Joiner Info Submission", "NEO + CPD", "Performance Tracking", "Monthly Feedback"];
            return `
              <tr class="row-clickable" data-emp-id="${e.id}">
                <td>
                  <div class="table__cell-name">
                    <div class="table__avatar">${initials(e.name)}</div>
                    <div>
                      <div class="table__name">${e.name}</div>
                      <div class="table__sub">${e.title}</div>
                    </div>
                  </div>
                </td>
                <td>${e.joined}</td>
                <td><span class="status status--info">Step ${stepIdx} · ${stepNames[stepIdx]}</span></td>
                <td>
                  <div class="progress-mini">
                    <div class="progress-mini__bar"><div class="progress-mini__fill" style="width:${e.progress}%"></div></div>
                    <div class="progress-mini__text">${e.progress}%</div>
                  </div>
                </td>
                <td>${e.progress >= 70 ? '<span class="status status--warn">Probation Soon</span>' : '<span class="status status--info">On Track</span>'}</td>
                <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button></td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
}

// =========================================================
// PAGE: Training Catalogue (cards grid)
// =========================================================
function pageTrainingCatalogue() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Training Catalogue</h2>
        <div class="page-header__sub">${DATA.trainings.length} trainings · AWS, KnowBe4, HashiCorp, Internal</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Export</button>
        <button class="btn btn--primary" data-action="add-training">${ICONS.plus} Add Training</button>
      </div>
    </div>

    <div id="fb-hr-catalogue"></div>

    <div id="hr-catalogue-results">
    <div class="tcards">
      ${DATA.trainings.map(t => {
        const providerSlug = (t.provider || "").toLowerCase().replace(/\s+/g, "-");
        const audienceSlug = (t.required || "").toLowerCase().includes("technical") ? "technical" :
                              (t.required || "").toLowerCase().includes("devops") ? "devops" :
                              (t.required || "").toLowerCase().includes("all") ? "all-staff" : "specialist";
        const tags = ["all", providerSlug, audienceSlug];
        const searchText = `${t.title} ${t.provider} ${t.required}`.toLowerCase();
        return `
          <div class="tcard" data-training-id="${t.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
            <div class="tcard__head">
              <div class="tcard__provider">${t.provider}</div>
              <span class="status status--${t.required === "All" || t.required === "All technical" || t.required.startsWith("All") ? "info" : "muted"}">${t.required}</span>
            </div>
            <div class="tcard__title">${t.title}</div>
            <div class="tcard__desc">Duration ${t.duration} · ${t.enrolled} enrolled · ${t.completion}% completion company-wide.</div>
            <div class="tcard__meta">
              <div><strong>${t.enrolled}</strong> enrolled</div>
              <div><strong>${t.completion}%</strong> completed</div>
            </div>
          </div>`;
      }).join("")}
    </div>
    <div class="fb-empty" style="display:none">
      <div style="text-align:center;padding:30px;color:var(--ink-500)">No trainings match these filters</div>
    </div>
    </div>
    <div id="pg-hr-catalogue"></div>`;
}

// =========================================================
// PAGE: Assign Trainings (form)
// =========================================================
function pageAssignTrainings() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Assign Trainings</h2>
        <div class="page-header__sub">Target individuals, teams, or the entire company. Tracked from this page through to completion.</div>
      </div>
    </div>

    <div class="split">
      <div class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">New Assignment</h3>
            <p class="panel__sub">Choose audience, training, and timing.</p>
          </div>
        </header>
        <div class="panel__body">
          <div class="field" style="margin-bottom:16px">
            <label class="field__label">Assignment Type</label>
            <div class="radio-group" id="assignment-type">
              <div class="radio radio--selected" data-type="individuals"><div class="radio__indicator"></div><div><div class="radio__title">Individual Employees</div><div class="radio__desc">Pick one or more employees by name.</div></div></div>
              <div class="radio" data-type="team"><div class="radio__indicator"></div><div><div class="radio__title">A Team / Department</div><div class="radio__desc">All members of a selected team.</div></div></div>
              <div class="radio" data-type="selected"><div class="radio__indicator"></div><div><div class="radio__title">Selected Team Members</div><div class="radio__desc">Pick a team, then choose specific members.</div></div></div>
              <div class="radio" data-type="all"><div class="radio__indicator"></div><div><div class="radio__title">All Active Employees</div><div class="radio__desc">Company-wide assignment (147 employees).</div></div></div>
            </div>
          </div>

          <div class="form-grid">
            <!-- Team dropdown — visible for "team" and "selected" types, hidden for "individuals" and "all" -->
            <div class="field field--full" id="team-picker-field" style="display:none">
              <label class="field__label">Team / Department</label>
              <select class="select" id="team-picker">
                <option value="">Choose a team…</option>
                <optgroup label="Departments">
                  <option value="dept:cloud-engineering" data-count="42">Cloud Engineering · 42 members</option>
                  <option value="dept:devops" data-count="18">DevOps · 18 members</option>
                  <option value="dept:advisory" data-count="14">Advisory & Architecture · 14 members</option>
                  <option value="dept:delivery" data-count="24">Delivery & PMO · 24 members</option>
                  <option value="dept:business" data-count="11">Business Development · 11 members</option>
                  <option value="dept:people-ops" data-count="6">People Operations · 6 members</option>
                  <option value="dept:finance" data-count="5">Finance & Admin · 5 members</option>
                </optgroup>
                <optgroup label="PM-led project teams">
                  <option value="pm:fatima" data-count="8">Fatima Al Zaabi's team · 8 members</option>
                  <option value="pm:khalid" data-count="6">Khalid Mansour's team · 6 members</option>
                  <option value="pm:sara" data-count="5">Sara Mitchell's team · 5 members</option>
                  <option value="pm:omar" data-count="4">Omar Siddiqui's team · 4 members</option>
                </optgroup>
                <optgroup label="Cohorts">
                  <option value="cohort:new-joiners-q2" data-count="8">New joiners · Q2 2026 · 8 members</option>
                  <option value="cohort:probation" data-count="5">Currently on probation · 5 members</option>
                  <option value="cohort:onboarding" data-count="8">Currently in onboarding · 8 members</option>
                </optgroup>
              </select>
              <div class="team-picker-summary" id="team-picker-summary" style="display:none">
                ${ICONS.users || ""}<span id="team-picker-summary-text"></span>
              </div>
            </div>

            <!-- Employees chips — visible for "individuals" and "selected" types -->
            <div class="field field--full" id="employees-field">
              <label class="field__label" id="employees-field-label">Employees</label>
              <div class="chips-input">
                <div class="tag">Reem Al Otaibi <span class="tag__remove">×</span></div>
                <div class="tag">Aisha Khan <span class="tag__remove">×</span></div>
                <div class="tag">Bilal Anwar <span class="tag__remove">×</span></div>
                <input type="text" placeholder="Search to add more…" style="border:0;outline:0;font-size:13px;min-width:140px;flex:1" />
              </div>
            </div>

            <!-- Company-wide summary — visible only for "all" type -->
            <div class="field field--full" id="all-summary" style="display:none">
              <div class="team-picker-summary">
                ${ICONS.users || ""}<span>This assignment will go to <strong>all 147 active employees</strong>. Consider scheduling for end-of-quarter to avoid overlap with project deadlines.</span>
              </div>
            </div>

            <div class="field field--full">
              <label class="field__label">Training</label>
              <select class="select">
                <option>AWS Cloud Practitioner Essentials</option>
                <option>AWS Solutions Architect Associate</option>
                <option>Security Awareness Training (KnowBe4)</option>
                <option>AWS Well-Architected Framework</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label">Due Date</label>
              <input class="input" type="date" value="2026-05-26" />
            </div>
            <div class="field">
              <label class="field__label">Priority</label>
              <select class="select"><option>Normal</option><option>High</option><option>Urgent</option></select>
            </div>
            <div class="field field--full">
              <label class="field__label">Importance</label>
              <select class="select"><option>Required</option><option>Recommended</option></select>
            </div>
            <div class="field field--full">
              <label class="field__label">Instructions (optional)</label>
              <textarea class="textarea" placeholder="e.g. 'Please complete before client kick-off next month.'"></textarea>
            </div>
            <div class="field field--full">
              <label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Notify employees immediately (in-app + email + Slack)</label>
            </div>
          </div>

          <div class="form-foot">
            <button class="btn btn--secondary">Cancel</button>
            <button class="btn btn--primary" data-action="submit-assignment">Assign Training</button>
          </div>
        </div>
      </div>

      <div class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Recent Assignments</h3>
            <p class="panel__sub">Last 7 days</p>
          </div>
        </header>
        <div class="panel__body">
          <div class="activity-feed">
            <div class="act"><div class="act__dot act__dot--info">${ICONS.send}</div><div class="act__main"><strong>KnowBe4 Security Awareness</strong><br><span>Assigned to 12 employees · Cloud Engineering</span></div><div class="act__time">1h ago</div></div>
            <div class="act"><div class="act__dot act__dot--info">${ICONS.send}</div><div class="act__main"><strong>AWS Cloud Economics</strong><br><span>Assigned to 4 new joiners</span></div><div class="act__time">5h ago</div></div>
            <div class="act"><div class="act__dot act__dot--ok">${ICONS.check}</div><div class="act__main"><strong>AWS Sales Accreditation completed by 7</strong><br><span>Of 9 assigned · 78% completion</span></div><div class="act__time">Yesterday</div></div>
            <div class="act"><div class="act__dot act__dot--info">${ICONS.send}</div><div class="act__main"><strong>AWS Well-Architected Foundation</strong><br><span>Assigned company-wide · 147 employees</span></div><div class="act__time">3 days ago</div></div>
            <div class="act"><div class="act__dot act__dot--warn">${ICONS.alert}</div><div class="act__main"><strong>AWS Cloud Practitioner</strong><br><span>5 reminders auto-sent for overdue completion</span></div><div class="act__time">3 days ago</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Assignments — bulk actions per assignment -->
    <div class="panel" style="margin-top:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Active Assignments</h3>
          <p class="panel__sub">Extend deadlines for an entire team or open the assignment to see individual states</p>
        </div>
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
      </header>
      <div class="panel__body" style="padding:14px">
        <div id="fb-hr-assignments"></div>
        <div id="hr-assignments-results">
        <table class="table">
          <thead>
            <tr>
              <th>Training</th>
              <th>Scope</th>
              <th>Assigned</th>
              <th>Deadline</th>
              <th>State Breakdown</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${DATA.activeAssignments.map(a => {
              const tags = ["all"];
              if (a.overdue) tags.push("has-overdue");
              if (a.awaiting) tags.push("has-awaiting");
              if (a.inProgress) tags.push("has-in-progress");
              const providerSlug = (a.training || "").toLowerCase().includes("aws") ? "aws" :
                                   (a.training || "").toLowerCase().includes("knowbe") ? "knowbe4" :
                                   (a.training || "").toLowerCase().includes("itil") ? "itil" : "other";
              tags.push(providerSlug);
              const searchText = `${a.training} ${a.trainingId} ${a.scope}`.toLowerCase();
              return `
              <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
                <td><div class="table__name">${a.training}</div><div class="table__sub" style="font-family:var(--font-mono);font-size:11px">${a.trainingId}</div></td>
                <td><div style="font-size:12.5px;color:var(--ink-700)">${a.scope}</div></td>
                <td style="font-family:var(--font-mono);font-size:12px">${a.assignedOn}</td>
                <td style="font-family:var(--font-mono);font-size:12px">${a.due}</td>
                <td>
                  <div class="assignment-states">
                    ${a.verified ? `<span class="assignment-state assignment-state--ok">${ICONS.check} ${a.verified} verified</span>` : ''}
                    ${a.awaiting ? `<span class="assignment-state assignment-state--warn">${a.awaiting} awaiting</span>` : ''}
                    ${a.inProgress ? `<span class="assignment-state assignment-state--info">${a.inProgress} in progress</span>` : ''}
                    ${a.overdue ? `<span class="assignment-state assignment-state--danger">${a.overdue} overdue</span>` : ''}
                  </div>
                </td>
                <td style="text-align:right">
                  <button class="btn btn--secondary btn--sm" data-action="extend-deadline" data-training-id="${a.trainingId}">${ICONS.clockPlus || ICONS.clock} Extend deadline</button>
                </td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
        <div class="fb-empty" style="display:none">
          <div style="text-align:center;padding:30px;color:var(--ink-500)">No assignments match these filters</div>
        </div>
        </div>
        <div id="pg-hr-assignments"></div>
      </div>
    </div>`;
}

// =========================================================
// PAGE: Training Verification (3 queues — verify uploads, allow re-uploads, grant extensions)
// =========================================================
function pageTrainingVerifications() {
  const pv = DATA.pendingVerifications;
  const pr = DATA.pendingReuploadRequests;
  const pe = DATA.pendingExtensionRequests;
  const total = pv.length + pr.length + pe.length;

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Training Verification</h2>
        <div class="page-header__sub">${total} items awaiting your action · ${pv.length} certificate verifications · ${pr.length} re-upload requests · ${pe.length} extension requests</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Export queue</button>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.shield}
      <div>
        <strong>How this works.</strong> Employees complete trainings on external platforms (AWS Skill Builder, KnowBe4, etc.) and upload certificates here. Uploads are <strong>locked on submission</strong> — you sign off here, allow re-uploads when needed, and grant extension requests. Every action is audit-logged.
      </div>
    </div>

    <div id="fb-hr-training-verify"></div>

    <!-- Existing legacy tabs kept for now; FilterBar replaces them visually -->
    <div class="tabs" style="display:none">
      <div class="tab tab--active" data-tab="verifications">Certificate Verifications<span class="tab__count">${pv.length}</span></div>
      <div class="tab" data-tab="reuploads">Re-upload Requests<span class="tab__count">${pr.length}</span></div>
      <div class="tab" data-tab="extensions">Extension Requests<span class="tab__count">${pe.length}</span></div>
    </div>


    <div id="hr-training-verify-results">
      <div class="verif-list">

        ${pv.map(v => {
          const providerSlug = (v.provider || "").toLowerCase().replace(/\s+/g, "-");
          const deptSlug = (v.dept || "").toLowerCase().replace(/[^\w]+/g, "-");
          const tags = ["all", "verifications", providerSlug, deptSlug];
          const searchText = (v.employee + " " + v.dept + " " + v.training + " " + v.provider).toLowerCase();
          return `
          <div class="verif-row" data-verif-id="${v.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
            <div class="verif-row__emp">
              <div class="table__avatar">${v.initials}</div>
              <div><div class="table__name">${v.employee}</div><div class="table__sub">${v.dept}</div></div>
            </div>
            <div class="verif-row__main">
              <div class="verif-row__training"><span class="tcard__provider" style="margin-right:6px">${v.provider} · ${v.platform}</span><span class="status status--info">Certificate verification</span></div>
              <div class="verif-row__title">${v.training}</div>
              <div class="verif-row__file">${ICONS.lock}<span class="verif-row__file-name">${v.certFile}</span></div>
              <div class="verif-row__meta">Submitted ${v.submittedAt}</div>
            </div>
            <div class="verif-row__actions">
              <button class="btn btn--ghost btn--sm" data-action="preview-cert" data-verif-id="${v.id}">${ICONS.eye || ICONS.check} Preview</button>
              <button class="btn btn--danger btn--sm" data-action="reject-cert" data-verif-id="${v.id}">${ICONS.xmark} Reject</button>
              <button class="btn btn--ok btn--sm" data-action="verify-cert" data-verif-id="${v.id}">${ICONS.check} Verify</button>
            </div>
          </div>`;
        }).join("")}

        ${pr.map(r => {
          const providerSlug = (r.provider || "").toLowerCase().replace(/\s+/g, "-");
          const deptSlug = (r.dept || "").toLowerCase().replace(/[^\w]+/g, "-");
          const tags = ["all", "reuploads", providerSlug, deptSlug];
          const searchText = (r.employee + " " + r.dept + " " + r.training + " " + r.provider).toLowerCase();
          return `
          <div class="verif-row" data-reupload-id="${r.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
            <div class="verif-row__emp">
              <div class="table__avatar">${r.initials}</div>
              <div><div class="table__name">${r.employee}</div><div class="table__sub">${r.dept}</div></div>
            </div>
            <div class="verif-row__main">
              <span class="tcard__provider" style="margin-right:6px">${r.provider} · ${r.platform}</span><span class="status status--warn">Re-upload request</span>
              <div class="verif-row__title">${r.training}</div>
              <div class="verif-row__file">${ICONS.lock}<span class="verif-row__file-name">${r.lockedFile}</span><span class="verif-row__file-size">· currently locked</span></div>
              <div class="reason-box"><div class="reason-box__label">REASON</div><div class="reason-box__text">${r.reason}</div></div>
              <div class="verif-row__meta">Requested ${r.requestedAt}</div>
            </div>
            <div class="verif-row__actions">
              <button class="btn btn--danger btn--sm" data-action="deny-reupload" data-reupload-id="${r.id}">${ICONS.xmark} Deny</button>
              <button class="btn btn--ok btn--sm" data-action="allow-reupload" data-reupload-id="${r.id}">${ICONS.unlock} Allow re-upload</button>
            </div>
          </div>`;
        }).join("")}

        ${pe.map(ext => {
          const providerSlug = (ext.provider || "").toLowerCase().replace(/\s+/g, "-");
          const deptSlug = (ext.dept || "").toLowerCase().replace(/[^\w]+/g, "-");
          const tags = ["all", "extensions", providerSlug, deptSlug];
          const searchText = (ext.employee + " " + ext.dept + " " + ext.training + " " + ext.provider).toLowerCase();
          return `
          <div class="verif-row" data-extension-id="${ext.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
            <div class="verif-row__emp">
              <div class="table__avatar">${ext.initials}</div>
              <div><div class="table__name">${ext.employee}</div><div class="table__sub">${ext.dept}</div></div>
            </div>
            <div class="verif-row__main">
              <span class="tcard__provider" style="margin-right:6px">${ext.provider} · ${ext.platform}</span><span class="status status--info">Extension request</span>
              <div class="verif-row__title">${ext.training}</div>
              <div class="verif-row__extension-info">
                <div class="ext-pill">${ICONS.clock} Current deadline <strong>${ext.currentDue}</strong></div>
                <div class="ext-pill ext-pill--accent">${ICONS.clockPlus || ICONS.clock} Requesting <strong>+${ext.requestedDays} days</strong></div>
              </div>
              <div class="reason-box"><div class="reason-box__label">REASON</div><div class="reason-box__text">${ext.reason}</div></div>
              <div class="verif-row__meta">Requested ${ext.requestedAt}</div>
            </div>
            <div class="verif-row__actions">
              <button class="btn btn--danger btn--sm" data-action="deny-extension" data-extension-id="${ext.id}">${ICONS.xmark} Deny</button>
              <button class="btn btn--secondary btn--sm" data-action="modify-extension" data-extension-id="${ext.id}">${ICONS.pen} Modify</button>
              <button class="btn btn--ok btn--sm" data-action="grant-extension" data-extension-id="${ext.id}">${ICONS.check} Grant</button>
            </div>
          </div>`;
        }).join("")}

      </div>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No items match these filters</div>
      </div>
    </div>
    <div id="pg-hr-training-verify"></div>`;
}

// =========================================================
// PAGE: Leave Approvals
// =========================================================
function pageLeaveApprovals() {
  const queue = DATA.leaveApprovals;
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Leave Approvals</h2>
        <div class="page-header__sub">${queue.length} leave requests awaiting HR action · final approval after PM endorsement</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Export queue</button>
      </div>
    </div>

    <div class="info-banner">
      ${ICONS.calendar}
      <div>
        <strong>Approval flow.</strong> Employee submits → PM endorses → <strong>you give final approval here</strong>. You can approve or deny PM-endorsed requests. Requests still pending PM are shown for visibility but cannot be approved by HR yet.
      </div>
    </div>

    <div class="verif-list">
      ${queue.map(r => {
        const pmReady = !!r.pmEndorsed;
        return `
        <div class="verif-row">
          <div class="verif-row__emp">
            <div class="table__avatar">${r.initials}</div>
            <div>
              <div class="table__name">${r.emp}</div>
              <div class="table__sub">${r.dept}</div>
            </div>
          </div>
          <div class="verif-row__main">
            <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">
              <span class="tcard__provider">${r.type}</span>
              <span class="status status--muted" style="font-family:var(--font-mono);font-size:10.5px">${r.id}</span>
            </div>
            <div class="verif-row__title">${r.from} → ${r.to} · ${r.days} day${r.days > 1 ? 's' : ''}</div>
            <div class="verif-row__extension-info">
              <div class="ext-pill">${ICONS.calendar} Balance: <strong>${r.balance}</strong></div>
              ${r.hasMedicalCert === false ? '<div class="ext-pill" style="background:var(--warn-bg);color:var(--warn)">' + ICONS.alert + ' Medical cert not attached</div>' : ''}
            </div>
            <div class="reason-box">
              <div class="reason-box__label">EMPLOYEE'S REASON</div>
              <div class="reason-box__text">${r.reason}</div>
            </div>
            ${pmReady ? `
              <div class="reason-box" style="background:var(--ok-bg);border-color:#A8D8B9">
                <div class="reason-box__label" style="color:var(--ok)">PM ENDORSEMENT · ${r.pmEndorsed.name}</div>
                <div class="reason-box__text">${ICONS.check} ${r.pmEndorsed.note} <span style="color:var(--ink-500)">(${r.pmEndorsed.on})</span></div>
              </div>` : `
              <div class="reason-box" style="background:var(--warn-bg);border-color:#F0D7AA">
                <div class="reason-box__label" style="color:var(--warn)">AWAITING PM ENDORSEMENT</div>
                <div class="reason-box__text">${ICONS.clock || ICONS.alert} Cannot approve until PM has endorsed this request.</div>
              </div>
            `}
            <div class="verif-row__meta">Submitted ${r.submittedOn}</div>
          </div>
          <div class="verif-row__actions">
            ${pmReady ? `
              <button class="btn btn--danger btn--sm" data-action="deny-leave" data-leave-id="${r.id}">${ICONS.xmark} Deny</button>
              <button class="btn btn--ok btn--sm" data-action="approve-leave" data-leave-id="${r.id}">${ICONS.check} Approve</button>
            ` : `
              <button class="btn btn--ghost btn--sm" disabled style="opacity:0.5;cursor:not-allowed">Waiting on PM</button>
              <button class="btn btn--secondary btn--sm">${ICONS.send} Nudge PM</button>
            `}
          </div>
        </div>`;
      }).join("")}
    </div>`;
}

// =========================================================
// PAGE: KPI Management (kanban)
// =========================================================
function pageKpiManagement() {
  const cols = Object.entries(DATA.kpis);
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">KPI Management</h2>
        <div class="page-header__sub">Track KPI lifecycle from draft through to close. Click any card to open.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Export KPI Report</button>
        <button class="btn btn--primary">${ICONS.plus} New KPI</button>
      </div>
    </div>

    <div class="filter-bar">
      ${ICONS.search}
      <input type="text" placeholder="Search by employee or KPI ID…" />
      <span class="filter-bar__sep"></span>
      <select><option>All Cycles</option><option>Q2 2026</option><option>Q1 2026</option><option>FY 2025</option></select>
      <select><option>All Departments</option><option>Cloud Engineering</option><option>Advisory</option><option>Delivery</option></select>
    </div>

    <div class="kanban">
      ${cols.map(([colName, cards]) => `
        <div class="kcol">
          <div class="kcol__head">
            <div class="kcol__title">${colName}</div>
            <div class="kcol__count">${cards.length}</div>
          </div>
          ${cards.map(c => `
            <div class="kcard">
              <div class="kcard__name">${c.title}</div>
              <div class="kcard__sub">${c.id}</div>
              <div class="kcard__foot">
                <div style="display:flex;align-items:center;gap:6px"><div class="kcard__avatar">${c.initials}</div><span style="font-size:11.5px;color:var(--ink-500)">${c.emp}</span></div>
                ${c.overdue ? '<span class="status status--danger">Overdue</span>' : ''}
              </div>
            </div>`).join("")}
        </div>`).join("")}
    </div>`;
}

// =========================================================
// PAGE: PM Assignment (split: list + assign panel)
// =========================================================
function pagePmAssignment() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Project Manager Assignment</h2>
        <div class="page-header__sub">Only HR can assign or change a PM. Every change is logged with old PM, new PM, and reason.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.download} Assignment History</button>
      </div>
    </div>

    <div class="split">
      <div class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Active Employees</h3>
            <p class="panel__sub">Click any row to assign or change PM</p>
          </div>
        </header>
        <div class="panel__body" style="padding:0">
          <table class="table">
            <thead><tr><th>Employee</th><th>Current PM</th><th>Department</th><th></th></tr></thead>
            <tbody>
              ${DATA.employees.slice(0, 10).map(e => `
                <tr class="row-clickable">
                  <td>
                    <div class="table__cell-name">
                      <div class="table__avatar">${initials(e.name)}</div>
                      <div><div class="table__name">${e.name}</div><div class="table__sub">${e.title}</div></div>
                    </div>
                  </td>
                  <td>${e.pm === "—" ? '<span class="status status--muted">Unassigned</span>' : e.pm}</td>
                  <td>${e.dept}</td>
                  <td><button class="btn btn--ghost btn--sm">Change PM ${ICONS.arrowRight}</button></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Assign / Change PM</h3>
            <p class="panel__sub">Reem Al Otaibi · Cloud Engineer</p>
          </div>
        </header>
        <div class="panel__body">
          <div class="form-grid form-grid--single">
            <div class="field"><label class="field__label">Current PM</label><div style="padding:9px 12px;border:1px solid var(--ink-200);border-radius:10px;background:var(--ink-100);color:var(--ink-500);font-size:13px">Fatima Al Zaabi</div></div>
            <div class="field"><label class="field__label">New PM</label><select class="select"><option>Select a Project Manager</option><option>Fatima Al Zaabi (current)</option><option>Sara Mitchell</option><option>Khalid Mansour</option></select></div>
            <div class="field"><label class="field__label">Effective Date</label><input class="input" type="date" value="2026-05-15" /></div>
            <div class="field"><label class="field__label">Reason / Notes</label><textarea class="textarea" placeholder="e.g. New project assignment, team rebalancing, employee request..."></textarea></div>
            <div class="field"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Notify new PM</label></div>
            <div class="field"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Notify employee</label></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary">Cancel</button>
            <button class="btn btn--primary" data-action="submit-pm">Confirm Assignment</button>
          </div>
        </div>
      </div>
    </div>`;
}

// =========================================================
// PAGE: Notifications (compose + history)
// =========================================================
function pageNotifications() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Notifications</h2>
        <div class="page-header__sub">Compose, schedule, and track notifications across in-app, email, Slack, and push.</div>
      </div>
    </div>

    <div class="compose">
      <div class="form-grid">
        <div class="field"><label class="field__label">Audience</label><select class="select"><option>Individual employees</option><option>Team / department</option><option>Selected team members</option><option>All active employees (147)</option><option>Employees with pending actions</option><option>Employees with overdue trainings</option><option>Employees with expiring documents</option></select></div>
        <div class="field"><label class="field__label">Template</label><select class="select"><option>Custom message</option><option>Training reminder</option><option>KPI acknowledgement nudge</option><option>Document signature reminder</option><option>Visa/ID expiry alert</option><option>Welcome — onboarding started</option></select></div>
        <div class="field field--full"><label class="field__label">Subject</label><input class="input" placeholder="e.g. Action required: complete your Q2 KPIs" /></div>
        <div class="field field--full"><label class="field__label">Message</label><textarea class="textarea" rows="4" placeholder="Hi {{employee_name}},..."></textarea></div>
        <div class="field field--full">
          <label class="field__label">Channels</label>
          <div class="compose__channels">
            <div class="chan-pill chan-pill--on">${ICONS.bell} In-app</div>
            <div class="chan-pill chan-pill--on">${ICONS.mail} Email</div>
            <div class="chan-pill chan-pill--on">${ICONS.slack} Slack</div>
            <div class="chan-pill">${ICONS.phone} Push</div>
          </div>
          <div class="field__hint">Recipients' personal preferences will override unless this is a mandatory notification.</div>
        </div>
        <div class="field"><label class="checkbox"><span class="checkbox__box">${ICONS.check}</span> Schedule for later</label></div>
        <div class="field"><label class="checkbox"><span class="checkbox__box">${ICONS.check}</span> Mandatory (override preferences)</label></div>
      </div>
      <div class="form-foot">
        <button class="btn btn--secondary">Save as draft</button>
        <button class="btn btn--primary" data-action="send-notif">${ICONS.send} Send notification</button>
      </div>
    </div>

    <div class="panel">
      <header class="panel__head">
        <div><h3 class="panel__title">Recent Notifications</h3><p class="panel__sub">Last 7 days · 5 broadcasts</p></div>
        <a class="panel__link">View all →</a>
      </header>
      <div class="panel__body" style="padding:0">
        <table class="table">
          <thead><tr><th>Subject</th><th>Audience</th><th>Channels</th><th>Sent</th><th>Read</th></tr></thead>
          <tbody>
            ${DATA.notifHistory.map(n => `
              <tr class="row-clickable">
                <td><div class="table__name">${n.title}</div></td>
                <td>${n.audience}</td>
                <td><div style="display:flex;gap:4px">${n.channels.map(ch => `<span class="chan-pill chan-pill--on" style="font-size:10.5px;padding:2px 8px">${ICONS[ch === "in-app" ? "bell" : ch === "email" ? "mail" : ch] || ""} ${ch}</span>`).join("")}</div></td>
                <td>${n.sent}</td>
                <td><span class="status status--ok">${n.read} read</span></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

// =========================================================
// PAGE: Documents
// =========================================================
function pageDocuments() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Documents</h2>
        <div class="page-header__sub">Per-employee vault, e-signature flows, and government document tracking.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary">${ICONS.upload} Upload</button>
        <button class="btn btn--primary">${ICONS.plus} New Document</button>
      </div>
    </div>

    <div class="doc-cats">
      <button class="doc-cat doc-cat--active">All (${DATA.documents.length})</button>
      <button class="doc-cat">Offer Letters</button>
      <button class="doc-cat">Contracts</button>
      <button class="doc-cat">NDAs</button>
      <button class="doc-cat">Confirmation Letters</button>
      <button class="doc-cat">Evaluations</button>
      <button class="doc-cat">Government Docs</button>
      <button class="doc-cat">Pending Signature (6)</button>
    </div>

    <div class="filter-bar">
      ${ICONS.search}
      <input type="text" placeholder="Search documents…" />
      <span class="filter-bar__sep"></span>
      <select><option>All Status</option><option>Signed</option><option>Pending Signature</option><option>Expired</option></select>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Document</th><th>Type</th><th>Date</th><th>Size</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${DATA.documents.map(d => {
            const st = d.status === "Signed" ? "ok" : d.status.startsWith("Pending") ? "warn" : "muted";
            return `
              <tr class="row-clickable">
                <td><div class="table__name">${d.name}</div></td>
                <td>${d.type}</td>
                <td>${d.date}</td>
                <td>${d.size}</td>
                <td><span class="status status--${st}">${d.status}</span></td>
                <td style="text-align:right">
                  <button class="btn btn--ghost btn--sm">${ICONS.download}</button>
                  <button class="btn btn--ghost btn--sm">${ICONS.arrowRight}</button>
                </td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
}

// =========================================================
// PAGE: Reports (tiles grid)
// =========================================================
function pageReports() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Reports &amp; Analytics</h2>
        <div class="page-header__sub">All reports exportable to PDF, Excel, or CSV. Scheduled summaries go out automatically.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary" data-action="reports-custom">${ICONS.plus} Custom report</button>
        <button class="btn btn--secondary" data-action="reports-schedule">${ICONS.calendar} Scheduled reports</button>
      </div>
    </div>

    <div id="fb-hr-reports"></div>

    <div class="rtiles">
      ${DATA.reports.map(r => `
        <div class="rtile" data-report-id="${r.id}">
          <div class="rtile__icon card__icon--${r.color}">${ICONS[r.icon] || ""}</div>
          <div class="rtile__title">${r.title}</div>
          <div class="rtile__desc">${r.desc}</div>
          <div class="rtile__foot">
            ${ICONS.clock}
            <span>${r.updated}</span>
          </div>
          <div class="rtile__formats">
            <button class="rtile__format-btn" data-action="report-download" data-report-id="${r.id}" data-format="pdf"   title="Download PDF">PDF</button>
            <button class="rtile__format-btn" data-action="report-download" data-report-id="${r.id}" data-format="xlsx"  title="Download Excel">XLSX</button>
            <button class="rtile__format-btn" data-action="report-download" data-report-id="${r.id}" data-format="csv"   title="Download CSV">CSV</button>
          </div>
        </div>`).join("")}
    </div>`;
}

// =========================================================
// PAGE: Offboarding
// =========================================================
function pageOffboarding() {
  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Offboarding</h2>
        <div class="page-header__sub">5 active offboardings · Knowledge transfer, asset return, access revocation, final settlement.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--primary">${ICONS.plus} Start offboarding</button>
      </div>
    </div>

    <div class="offb-stages">
      ${DATA.offboardingStages.map(s => `
        <div class="offb-stage">
          <div class="offb-stage__name">${s.name}</div>
          <div class="offb-stage__count">${s.count}</div>
          <div class="offb-stage__sub">${s.count === 1 ? "employee" : "employees"}</div>
        </div>`).join("")}
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Employee</th><th>Stage</th><th>Last day</th><th>Reason</th><th></th></tr></thead>
        <tbody>
          ${DATA.offboarding.map(e => `
            <tr class="row-clickable">
              <td>
                <div class="table__cell-name">
                  <div class="table__avatar">${initials(e.name)}</div>
                  <div><div class="table__name">${e.name}</div><div class="table__sub">${e.title}</div></div>
                </div>
              </td>
              <td><span class="status status--info">${e.stage}</span></td>
              <td>${e.lastDay}</td>
              <td>${e.reason}</td>
              <td><button class="btn btn--ghost btn--sm">View checklist ${ICONS.arrowRight}</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

// =========================================================
// ROUTER
// =========================================================
// =========================================================
// FULL PROFILE HELPER + EMPLOYEE DETAIL PAGE
// =========================================================

/**
 * Return the full profile for an employee. If the employee has a rich
 * fixture in DATA.fullProfiles, use it; otherwise build a minimal default
 * so HR can still navigate to the detail view and start filling things in.
 */
function getFullProfile(emp) {
  const fixed = DATA.fullProfiles[emp.id];
  if (fixed) {
    // Guarantee salary.history exists — fall back to a single "joining" entry.
    if (!fixed.salary.history) {
      const gross = (fixed.salary.basic || 0) + (fixed.salary.housing || 0) + (fixed.salary.transport || 0) + (fixed.salary.other || 0);
      fixed.salary.history = [
        { effective: fixed.salary.effective || emp.joined, basic: fixed.salary.basic, gross, reason: "Initial offer · joining package", note: "—", approvedBy: "M. Farooq (Admin)" },
      ];
    }
    return fixed;
  }
  // Default — minimal so the page renders without crashing
  return {
    personal: { fullName: emp.name, dob: "—", nationality: "—", gender: "—", marital: "—", religion: "—", languages: "—" },
    contact: { personalEmail: "—", phone: "—", addressLine: "—", city: "—", emergencyName: "—", emergencyRel: "—", emergencyPhone: "—" },
    identity: { emiratesId: "—", emiratesIdExpiry: "—", passportNo: "—", passportCountry: "—", passportExpiry: "—", visaType: "—", visaExpiry: "—" },
    banking: { bankName: "—", iban: "—", holder: emp.name, accountType: "—" },
    salary: { basic: 0, housing: 0, transport: 0, other: 0, currency: "AED", effective: emp.joined, nextReview: "—", cycle: "Monthly · last working day",
      history: [{ effective: emp.joined, basic: 0, gross: 0, reason: "Initial offer · joining package", note: "Pending salary data sync from ODOO", approvedBy: "—" }]
    },
    family: { spouse: null, children: [] },
    insurance: { provider: "—", tier: "—", policyNo: "—", validUntil: "—", coverage: "—", family: [] },
    airTickets: { cycle: "Annual", ticketsPerCycle: 1, class: "Economy", route: "—", coversFamily: false, used: 0, remaining: 1, history: [] },
    tag: null,
    audit: [
      { actor: "System", action: "Synced from ODOO · employee record", time: emp.joined },
    ],
  };
}

/**
 * Full employee detail page for HR. Mirrors the employee's own profile
 * structure, with editing controls everywhere (pencil icons on each section
 * header opening the appropriate slide-over dialog).
 */
function pageEmployeeDetail(emp) {
  const p = getFullProfile(emp);
  const gross = (p.salary.basic || 0) + (p.salary.housing || 0) + (p.salary.transport || 0) + (p.salary.other || 0);
  const tag = p.tag;

  return `
    <!-- Hero strip -->
    <section class="emp-detail-hero">
      <div class="emp-detail-hero__avatar">${initials(emp.name)}</div>
      <div class="emp-detail-hero__main">
        <div class="emp-detail-hero__name">
          ${emp.name}
          ${tag ? `<span class="emp-tag" title="Granted by ${tag.grantedBy}">${ICONS.star || ""} ${tag.label}</span>` : ""}
        </div>
        <div class="emp-detail-hero__title">${emp.title} · ${emp.dept}</div>
        <div class="emp-detail-hero__meta">
          <span>${ICONS.briefcase || ""} <strong>${emp.id}</strong></span>
          <span>${ICONS.mail || ""} <strong>${emp.email}</strong></span>
          <span>${ICONS.calendar || ""} Joined <strong>${emp.joined}</strong></span>
          <span>${emp.status === "Confirmed" ? '<span class="status status--ok">Confirmed</span>' : `<span class="status status--info">${emp.status} · ${emp.progress}%</span>`}</span>
        </div>
      </div>
      <div class="emp-detail-hero__actions">
        ${tag ? `
          <button class="btn btn--secondary btn--sm" data-action="emp-edit-tag" data-emp-id="${emp.id}">${ICONS.pen || ICONS.edit} Edit tag</button>
        ` : `
          <button class="btn btn--secondary btn--sm" data-action="emp-grant-tag" data-emp-id="${emp.id}">${ICONS.star || ""} Grant tag</button>
        `}
        <button class="btn btn--secondary btn--sm" data-action="emp-send-message" data-emp-id="${emp.id}">${ICONS.mail || ""} Message</button>
        <button class="btn btn--primary btn--sm" data-action="emp-quick-actions" data-emp-id="${emp.id}">More actions ▾</button>
      </div>
    </section>

    <!-- Tab nav -->
    <div class="emp-detail-tabs">
      <a class="emp-detail-tab emp-detail-tab--active" data-tab="overview">Overview</a>
      <a class="emp-detail-tab" data-tab="compensation">Compensation</a>
      <a class="emp-detail-tab" data-tab="benefits">Benefits</a>
      <a class="emp-detail-tab" data-tab="documents">Documents</a>
      <a class="emp-detail-tab" data-tab="training">Training</a>
      <a class="emp-detail-tab" data-tab="leaves">Leaves</a>
      <a class="emp-detail-tab" data-tab="audit">Audit Log</a>
    </div>

    <!-- ===== OVERVIEW TAB ===== -->
    <div class="emp-detail-tabpane emp-detail-tabpane--active" data-tabpane="overview">
      <div class="info-grid">
        <div class="info-card">
          <div class="info-card__title">${ICONS.user || ""} Personal Information
            <button class="info-card__edit-btn" data-action="emp-edit-personal" data-emp-id="${emp.id}" title="Edit personal information">${ICONS.pen || ICONS.edit}</button>
          </div>
          <div class="info-row"><span class="info-row__label">Full Name</span><span class="info-row__value">${p.personal.fullName}</span></div>
          <div class="info-row"><span class="info-row__label">Date of Birth</span><span class="info-row__value">${p.personal.dob}</span></div>
          <div class="info-row"><span class="info-row__label">Nationality</span><span class="info-row__value">${p.personal.nationality}</span></div>
          <div class="info-row"><span class="info-row__label">Gender</span><span class="info-row__value">${p.personal.gender}</span></div>
          <div class="info-row"><span class="info-row__label">Marital Status</span><span class="info-row__value">${p.personal.marital}</span></div>
          <div class="info-row"><span class="info-row__label">Languages</span><span class="info-row__value">${p.personal.languages}</span></div>
        </div>

        <div class="info-card">
          <div class="info-card__title">${ICONS.mail || ""} Contact
            <button class="info-card__edit-btn" data-action="emp-edit-contact" data-emp-id="${emp.id}" title="Edit contact information">${ICONS.pen || ICONS.edit}</button>
          </div>
          <div class="info-row"><span class="info-row__label">Work Email</span><span class="info-row__value info-row__value--mono">${emp.email}</span></div>
          <div class="info-row"><span class="info-row__label">Personal Email</span><span class="info-row__value info-row__value--mono">${p.contact.personalEmail}</span></div>
          <div class="info-row"><span class="info-row__label">Mobile</span><span class="info-row__value info-row__value--mono">${p.contact.phone}</span></div>
          <div class="info-row"><span class="info-row__label">Address</span><span class="info-row__value">${p.contact.addressLine}<br>${p.contact.city}</span></div>
          <div class="info-row"><span class="info-row__label">Emergency Contact</span><span class="info-row__value">${p.contact.emergencyName} (${p.contact.emergencyRel})<br><span style="font-family:var(--font-mono);font-size:12px;color:var(--ink-500)">${p.contact.emergencyPhone}</span></span></div>
        </div>

        <div class="info-card">
          <div class="info-card__title">${ICONS.briefcase || ""} Employment
            <button class="info-card__edit-btn" data-action="emp-edit-employment" data-emp-id="${emp.id}" title="Edit employment details">${ICONS.pen || ICONS.edit}</button>
          </div>
          <div class="info-row"><span class="info-row__label">Employee ID</span><span class="info-row__value info-row__value--mono">${emp.id}</span></div>
          <div class="info-row"><span class="info-row__label">Department</span><span class="info-row__value">${emp.dept}</span></div>
          <div class="info-row"><span class="info-row__label">Job Title</span><span class="info-row__value">${emp.title}</span></div>
          <div class="info-row"><span class="info-row__label">Line Manager</span><span class="info-row__value">${emp.lm}</span></div>
          <div class="info-row"><span class="info-row__label">Project Manager(s)</span><span class="info-row__value">${emp.pm}</span></div>
          <div class="info-row"><span class="info-row__label">Joined</span><span class="info-row__value">${emp.joined}</span></div>
          <div class="info-row"><span class="info-row__label">Status</span><span class="info-row__value">${emp.status === "Confirmed" ? '<span class="status status--ok">Confirmed</span>' : `<span class="status status--info">${emp.status}</span>`}</span></div>
        </div>

        <div class="info-card">
          <div class="info-card__title">${ICONS.shield || ""} Identity & Visa
            <button class="info-card__edit-btn" data-action="emp-edit-identity" data-emp-id="${emp.id}" title="Edit identity documents">${ICONS.pen || ICONS.edit}</button>
          </div>
          <div class="info-row"><span class="info-row__label">Emirates ID</span><span class="info-row__value info-row__value--mono">${p.identity.emiratesId}</span></div>
          <div class="info-row"><span class="info-row__label">EID Expiry</span><span class="info-row__value">${p.identity.emiratesIdExpiry}</span></div>
          <div class="info-row"><span class="info-row__label">Passport No.</span><span class="info-row__value info-row__value--mono">${p.identity.passportNo}</span></div>
          <div class="info-row"><span class="info-row__label">Passport Country</span><span class="info-row__value">${p.identity.passportCountry}</span></div>
          <div class="info-row"><span class="info-row__label">Passport Expiry</span><span class="info-row__value">${p.identity.passportExpiry}</span></div>
          <div class="info-row"><span class="info-row__label">Visa Type</span><span class="info-row__value">${p.identity.visaType}</span></div>
          <div class="info-row"><span class="info-row__label">Visa Expiry</span><span class="info-row__value">${p.identity.visaExpiry}</span></div>
        </div>

        <div class="info-card">
          <div class="info-card__title">${ICONS.heart || ICONS.user || ""} Family
            <button class="info-card__edit-btn" data-action="emp-add-family" data-emp-id="${emp.id}" title="Add family member">${ICONS.plus || ""}</button>
          </div>
          ${p.family.spouse ? `
            <div class="family-row">
              <div class="family-row__avatar">${initials(p.family.spouse.name)}</div>
              <div class="family-row__main">
                <div class="family-row__name">${p.family.spouse.name}</div>
                <div class="family-row__detail">Spouse · DOB ${p.family.spouse.dob || "—"}</div>
                ${p.family.spouse.visa ? `<div class="family-row__detail">${p.family.spouse.visa}${p.family.spouse.visaExpiry ? ` · expires ${p.family.spouse.visaExpiry}` : ""}</div>` : ""}
              </div>
              <button class="info-card__edit-btn" data-action="emp-edit-family" data-emp-id="${emp.id}" data-family-id="spouse">${ICONS.pen || ICONS.edit}</button>
            </div>
          ` : ""}
          ${p.family.children.map((c, i) => `
            <div class="family-row">
              <div class="family-row__avatar family-row__avatar--child">${initials(c.name)}</div>
              <div class="family-row__main">
                <div class="family-row__name">${c.name}</div>
                <div class="family-row__detail">Child · DOB ${c.dob || "—"}</div>
                ${c.visa ? `<div class="family-row__detail">${c.visa}${c.visaExpiry ? ` · expires ${c.visaExpiry}` : ""}</div>` : ""}
              </div>
              <button class="info-card__edit-btn" data-action="emp-edit-family" data-emp-id="${emp.id}" data-family-id="child-${i}">${ICONS.pen || ICONS.edit}</button>
            </div>
          `).join("")}
          ${!p.family.spouse && p.family.children.length === 0 ? `
            <div class="empty-state" style="padding:16px 12px;font-size:12px">No dependents on file. Click + to add.</div>
          ` : ""}
        </div>

        <div class="info-card">
          <div class="info-card__title">${ICONS.shield || ""} Insurance
            <button class="info-card__edit-btn" data-action="emp-edit-insurance" data-emp-id="${emp.id}" title="Edit insurance">${ICONS.pen || ICONS.edit}</button>
          </div>
          <div class="info-row"><span class="info-row__label">Provider</span><span class="info-row__value">${p.insurance.provider}</span></div>
          <div class="info-row"><span class="info-row__label">Tier</span><span class="info-row__value">${p.insurance.tier}</span></div>
          <div class="info-row"><span class="info-row__label">Policy No.</span><span class="info-row__value info-row__value--mono">${p.insurance.policyNo}</span></div>
          <div class="info-row"><span class="info-row__label">Valid Until</span><span class="info-row__value">${p.insurance.validUntil}</span></div>
          <div class="info-row"><span class="info-row__label">Coverage</span><span class="info-row__value" style="text-align:right;font-size:12px">${p.insurance.coverage}</span></div>
          ${p.insurance.family.length > 0 ? `
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--ink-100)">
              <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--ink-500);margin-bottom:6px">Family coverage</div>
              ${p.insurance.family.map(f => `<div style="font-size:12px;color:var(--ink-700);padding:3px 0">${f.name} (${f.relation}) · ${f.tier}</div>`).join("")}
            </div>
          ` : ""}
        </div>
      </div>
    </div>

    <!-- ===== COMPENSATION TAB ===== -->
    <div class="emp-detail-tabpane" data-tabpane="compensation">
      <div class="info-banner">
        ${ICONS.shield || ""}
        <div><strong>Confidential.</strong> Compensation is visible to HR and Super Admins only. The employee can see their own; PMs and LMs cannot. Changes are audit-logged and trigger ODOO payroll sync.</div>
      </div>

      <div class="info-card" style="margin-bottom:14px">
        <div class="info-card__title">${ICONS.chart || ""} Current Salary
          <button class="info-card__edit-btn" data-action="emp-edit-salary" data-emp-id="${emp.id}" title="Edit salary">${ICONS.pen || ICONS.edit}</button>
        </div>
        <div class="salary-grid">
          <div class="salary-block">
            <div class="salary-block__label">BASIC (MONTHLY)</div>
            <div class="salary-block__amount">${p.salary.currency} <span class="salary-block__amount-num">${p.salary.basic.toLocaleString()}</span></div>
            <div class="salary-block__sub">Effective ${p.salary.effective}</div>
          </div>
          <div class="salary-block">
            <div class="salary-block__label">HOUSING</div>
            <div class="salary-block__amount">${p.salary.currency} <span class="salary-block__amount-num">${p.salary.housing.toLocaleString()}</span></div>
            <div class="salary-block__sub">Monthly</div>
          </div>
          <div class="salary-block">
            <div class="salary-block__label">TRANSPORT</div>
            <div class="salary-block__amount">${p.salary.currency} <span class="salary-block__amount-num">${p.salary.transport.toLocaleString()}</span></div>
            <div class="salary-block__sub">Monthly</div>
          </div>
          <div class="salary-block salary-block--total">
            <div class="salary-block__label">GROSS MONTHLY</div>
            <div class="salary-block__amount">${p.salary.currency} <span class="salary-block__amount-num">${gross.toLocaleString()}</span></div>
            <div class="salary-block__sub">Annual: ${p.salary.currency} ${(gross * 12).toLocaleString()}</div>
          </div>
        </div>
        <div class="salary-meta-row">
          <div class="info-row" style="padding:6px 0"><span class="info-row__label">Payment Cycle</span><span class="info-row__value">${p.salary.cycle}</span></div>
          <div class="info-row" style="padding:6px 0"><span class="info-row__label">Currency</span><span class="info-row__value">${p.salary.currency}</span></div>
          <div class="info-row" style="padding:6px 0"><span class="info-row__label">Effective From</span><span class="info-row__value">${p.salary.effective}</span></div>
          <div class="info-row" style="padding:6px 0"><span class="info-row__label">Next Review</span><span class="info-row__value">${p.salary.nextReview}</span></div>
        </div>
        <div style="display:flex;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid var(--ink-100)">
          <button class="btn btn--secondary btn--sm" data-action="emp-view-payslips" data-emp-id="${emp.id}">${ICONS.download || ""} Payslips (ODOO)</button>
          <button class="btn btn--secondary btn--sm" data-action="emp-issue-cert" data-emp-id="${emp.id}">${ICONS.send || ""} Issue salary certificate</button>
          <button class="btn btn--secondary btn--sm" data-action="emp-comp-history" data-emp-id="${emp.id}">${ICONS.clock || ICONS.calendar || ""} Comp history</button>
          <span style="flex:1"></span>
          <button class="btn btn--primary btn--sm" data-action="emp-schedule-increment" data-emp-id="${emp.id}">${ICONS.plus || ""} Schedule increment</button>
        </div>
      </div>

      <div class="info-card" style="margin-bottom:14px">
        <div class="info-card__title">${ICONS.clock || ICONS.calendar || ""} Past Salaries · Increment History
          <button class="info-card__edit-btn" data-action="emp-comp-history" data-emp-id="${emp.id}" title="View full audit trail">${ICONS.eye || ICONS.arrowRight}</button>
        </div>
        <div style="font-size:11.5px;color:var(--ink-500);margin-bottom:10px;line-height:1.5">
          Every salary change is recorded with the effective date, previous value, new value, the reason, and who approved it. Older entries roll up automatically into the audit log.
        </div>
        <div class="table-wrap" style="border:1px solid var(--ink-100);border-radius:8px">
          <table class="table salary-history-table">
            <thead><tr><th>Effective</th><th>Reason</th><th>Basic</th><th>Gross</th><th>Change</th><th>Approved by</th></tr></thead>
            <tbody>
              ${(p.salary.history || []).map((h, idx, arr) => {
                const prev = arr[idx + 1];
                const delta = prev ? ((h.gross - prev.gross) / prev.gross * 100) : 0;
                const deltaLabel = prev
                  ? (delta > 0 ? `<span style="color:var(--ok);font-weight:700">↑ ${delta.toFixed(1)}%</span>`
                              : delta < 0 ? `<span style="color:var(--danger);font-weight:700">↓ ${Math.abs(delta).toFixed(1)}%</span>`
                              : `<span style="color:var(--ink-500)">no change</span>`)
                  : '<span style="color:var(--ink-500)">baseline</span>';
                return `
                  <tr>
                    <td class="table__mono">${h.effective}</td>
                    <td><strong>${h.reason}</strong>${h.note ? `<div class="table__sub">${h.note}</div>` : ""}</td>
                    <td class="table__mono">${p.salary.currency} ${h.basic.toLocaleString()}</td>
                    <td class="table__mono">${p.salary.currency} ${h.gross.toLocaleString()}</td>
                    <td>${deltaLabel}</td>
                    <td style="font-size:12px;color:var(--ink-700)">${h.approvedBy}</td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.briefcase || ""} Banking
          <button class="info-card__edit-btn" data-action="emp-edit-banking" data-emp-id="${emp.id}" title="Edit banking (Super Admin sign-off required)">${ICONS.pen || ICONS.edit}</button>
        </div>
        <div class="private-notice">${ICONS.shield || ""}<span>Banking changes require Super Admin co-approval. Sensitive — never visible to PM/LM.</span></div>
        <div class="info-row"><span class="info-row__label">Bank</span><span class="info-row__value">${p.banking.bankName}</span></div>
        <div class="info-row"><span class="info-row__label">IBAN</span><span class="info-row__value info-row__value--mono">${p.banking.iban}</span></div>
        <div class="info-row"><span class="info-row__label">Account Type</span><span class="info-row__value">${p.banking.accountType}</span></div>
        <div class="info-row"><span class="info-row__label">Account Holder</span><span class="info-row__value">${p.banking.holder}</span></div>
      </div>
    </div>

    <!-- ===== BENEFITS TAB (Air ticket + family insurance details) ===== -->
    <div class="emp-detail-tabpane" data-tabpane="benefits">
      <div class="info-card" style="margin-bottom:14px">
        <div class="info-card__title">${ICONS.plane || ICONS.briefcase || ""} Air Ticket Entitlement
          <button class="info-card__edit-btn" data-action="emp-edit-ticket-policy" data-emp-id="${emp.id}" title="Edit air ticket policy">${ICONS.pen || ICONS.edit}</button>
        </div>
        <div class="ticket-summary">
          <div class="ticket-summary__main">
            <div class="ticket-summary__title">${p.airTickets.cycle} · ${p.airTickets.ticketsPerCycle} round-trip · ${p.airTickets.class}${p.airTickets.coversFamily ? " · family included" : ""}</div>
            <div class="ticket-summary__route">${p.airTickets.route}</div>
          </div>
          <div class="ticket-summary__counters">
            <div class="ticket-counter">
              <div class="ticket-counter__value" style="color:var(--ok)">${p.airTickets.remaining}</div>
              <div class="ticket-counter__label">Remaining</div>
            </div>
            <div class="ticket-counter">
              <div class="ticket-counter__value">${p.airTickets.used}</div>
              <div class="ticket-counter__label">Used</div>
            </div>
          </div>
        </div>
        ${p.airTickets.history.length > 0 ? `
          <div class="section-header" style="margin:14px 0 8px;font-size:11px">Travel History</div>
          <div class="ticket-history">
            ${p.airTickets.history.map(t => `
              <div class="ticket-history__row">
                <div class="ticket-history__date">${t.date}</div>
                <div class="ticket-history__main">
                  <div class="ticket-history__route">${t.route}</div>
                  <div class="ticket-history__detail">${t.currency} ${t.amount.toLocaleString()}</div>
                </div>
                <span class="status status--ok">${t.status}</span>
              </div>`).join("")}
          </div>
        ` : `<div class="empty-state" style="padding:14px 12px;font-size:12px;margin-top:8px">No travel history yet.</div>`}
        <div style="display:flex;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid var(--ink-100)">
          <button class="btn btn--secondary btn--sm" data-action="emp-process-ticket-claim" data-emp-id="${emp.id}">${ICONS.upload || ""} Process boarding-pass claim</button>
          <button class="btn btn--secondary btn--sm" data-action="emp-book-ticket" data-emp-id="${emp.id}">${ICONS.send || ""} Book ticket on their behalf</button>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card__title">${ICONS.shield || ""} Insurance Policy Details
          <button class="info-card__edit-btn" data-action="emp-edit-insurance" data-emp-id="${emp.id}">${ICONS.pen || ICONS.edit}</button>
        </div>
        <div class="info-row"><span class="info-row__label">Provider</span><span class="info-row__value">${p.insurance.provider}</span></div>
        <div class="info-row"><span class="info-row__label">Tier</span><span class="info-row__value">${p.insurance.tier}</span></div>
        <div class="info-row"><span class="info-row__label">Policy No.</span><span class="info-row__value info-row__value--mono">${p.insurance.policyNo}</span></div>
        <div class="info-row"><span class="info-row__label">Valid Until</span><span class="info-row__value">${p.insurance.validUntil}</span></div>
        <div class="info-row"><span class="info-row__label">Coverage</span><span class="info-row__value" style="text-align:right;font-size:12px">${p.insurance.coverage}</span></div>
        ${p.insurance.family.length > 0 ? `
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--ink-100)">
            <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--ink-500);margin-bottom:8px">Family policies</div>
            ${p.insurance.family.map(f => `
              <div class="family-row" style="background:var(--tint-3)">
                <div class="family-row__avatar">${initials(f.name)}</div>
                <div class="family-row__main">
                  <div class="family-row__name">${f.name}</div>
                  <div class="family-row__detail">${f.relation} · ${f.tier}</div>
                  <div class="family-row__detail" style="font-family:var(--font-mono)">${f.policyNo}</div>
                </div>
              </div>`).join("")}
          </div>
        ` : ""}
        <div style="display:flex;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid var(--ink-100)">
          <button class="btn btn--secondary btn--sm" data-action="emp-add-family-insurance" data-emp-id="${emp.id}">${ICONS.plus || ""} Add family member to policy</button>
          <button class="btn btn--secondary btn--sm" data-action="emp-issue-insurance-card" data-emp-id="${emp.id}">${ICONS.download || ""} Issue insurance card</button>
        </div>
      </div>
    </div>

    <!-- ===== DOCUMENTS TAB ===== -->
    <div class="emp-detail-tabpane" data-tabpane="documents">
      <div class="info-banner">${ICONS.lock || ""}<div><strong>Source of truth.</strong> Offer letter, employment contract, and NDA are managed in ODOO and shown here read-only. Internal documents (evaluations, certificates) are managed in the portal.</div></div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Document</th><th>Type</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            <tr class="row-clickable">
              <td><div class="table__name">Offer Letter</div><span class="odoo-source-pill">${ICONS.external || ""} SOURCE: ODOO</span></td>
              <td>Offer</td>
              <td><span class="status status--ok">Signed</span></td>
              <td class="table__mono">${emp.joined}</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.download || ""}</button></td>
            </tr>
            <tr class="row-clickable">
              <td><div class="table__name">Employment Contract</div><span class="odoo-source-pill">${ICONS.external || ""} SOURCE: ODOO</span></td>
              <td>Contract</td>
              <td><span class="status status--ok">Signed</span></td>
              <td class="table__mono">${emp.joined}</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.download || ""}</button></td>
            </tr>
            <tr class="row-clickable">
              <td><div class="table__name">Non-Disclosure Agreement</div><span class="odoo-source-pill">${ICONS.external || ""} SOURCE: ODOO</span></td>
              <td>NDA</td>
              <td><span class="status status--ok">Signed</span></td>
              <td class="table__mono">${emp.joined}</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.download || ""}</button></td>
            </tr>
            <tr class="row-clickable">
              <td><div class="table__name">Probation Evaluation Form (Step 3)</div></td>
              <td>Evaluation</td>
              <td><span class="status status--warn">Pending employee signature</span></td>
              <td class="table__mono">2026-05-10</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.send || ""}</button></td>
            </tr>
            <tr class="row-clickable">
              <td><div class="table__name">Emirates ID — Front &amp; Back</div></td>
              <td>Government</td>
              <td><span class="status status--ok">Verified</span></td>
              <td class="table__mono">2026-04-05</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.download || ""}</button></td>
            </tr>
            <tr class="row-clickable">
              <td><div class="table__name">Passport copy</div></td>
              <td>Government</td>
              <td><span class="status status--ok">Verified</span></td>
              <td class="table__mono">2026-04-05</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.download || ""}</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="display:flex;gap:6px;margin-top:14px">
        <button class="btn btn--primary" data-action="emp-upload-doc" data-emp-id="${emp.id}">${ICONS.upload || ""} Upload document</button>
        <button class="btn btn--secondary" data-action="emp-request-signature" data-emp-id="${emp.id}">${ICONS.send || ""} Request signature</button>
      </div>
    </div>

    <!-- ===== TRAINING TAB ===== -->
    <div class="emp-detail-tabpane" data-tabpane="training">
      <div class="page-header" style="margin-bottom:14px">
        <div><div style="font-size:14px;font-weight:700;color:var(--ink-900)">Training Assignments</div><div style="font-size:12px;color:var(--ink-500);margin-top:3px">Active and historical trainings for this employee</div></div>
        <div class="page-actions"><button class="btn btn--primary btn--sm" data-action="emp-assign-training" data-emp-id="${emp.id}">${ICONS.plus || ""} Assign training</button></div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Training</th><th>State</th><th>Deadline</th><th>Verified</th><th></th></tr></thead>
          <tbody>
            <tr class="row-clickable"><td>AWS Solutions Architect Associate</td><td><span class="status status--info">In progress</span></td><td class="table__mono">26 May 2026 (extended +7)</td><td>—</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable"><td>KnowBe4 Security Awareness</td><td><span class="status status--info">In progress</span></td><td class="table__mono">19 May 2026</td><td>—</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable"><td>AWS Cloud Economics</td><td><span class="status status--warn">Awaiting verification</span></td><td class="table__mono">26 Apr 2026</td><td>Cert uploaded yesterday</td><td><button class="btn btn--primary btn--sm">Verify</button></td></tr>
            <tr class="row-clickable"><td>AWS Cloud Practitioner Essentials</td><td><span class="status status--ok">Verified</span></td><td class="table__mono">—</td><td>Justine · 9 Apr 2026</td><td><button class="btn btn--ghost btn--sm">${ICONS.download || ""}</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== LEAVES TAB ===== -->
    <div class="emp-detail-tabpane" data-tabpane="leaves">
      ${(() => {
        // Pull this employee's leaves from the shared DB (newest-first)
        const myLeaves = (window.SUDO_DB && SUDO_DB.leaveApprovals || [])
          .filter(l => l.empId === emp.id)
          .sort((a, b) => (b.from || "").localeCompare(a.from || ""));
        // Pull live balance from helpers (falls back to defaults)
        const balance = (window.SUDO_DB_HELPERS && SUDO_DB_HELPERS.leaveBalance(emp.id)) || {
          annual: { entitled: 22, used: 0, remaining: 22, carryOver: 0 },
          sick:          { used: 0, remaining: 14 },
          compassionate: { used: 0, remaining: 5 },
          hajj:          { used: 0, eligible: true },
        };
        // Group leaves by year
        const byYear = {};
        myLeaves.forEach(l => {
          const y = (l.from || "").slice(0, 4) || "Unknown";
          (byYear[y] = byYear[y] || []).push(l);
        });
        const years = Object.keys(byYear).sort().reverse();

        // Compute per-year totals
        function yearTotals(arr) {
          const total = arr.reduce((s, l) => s + (l.days || 0), 0);
          const annual = arr.filter(l => /annual/i.test(l.type)).reduce((s,l) => s + (l.days || 0), 0);
          const sick   = arr.filter(l => /sick/i.test(l.type)).reduce((s,l) => s + (l.days || 0), 0);
          const other  = total - annual - sick;
          const approved = arr.filter(l => l.status === "approved").length;
          const pending  = arr.filter(l => l.status === "pending_pm" || l.status === "pending_hr").length;
          return { total, annual, sick, other, approved, pending };
        }

        return `
          <!-- ── Current balance cards (real data from SUDO_DB_HELPERS) ── -->
          <div class="cards" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px">
            <div class="card" style="cursor:default">
              <div class="card__head"><div class="card__icon card__icon--bright">${ICONS.calendar || ""}</div></div>
              <div class="card__title">Annual Paid</div>
              <div class="card__value">${balance.annual.remaining}<span style="font-size:13px;color:var(--ink-500);font-weight:500"> / ${balance.annual.entitled}</span></div>
              <div class="card__meta">${balance.annual.used || (balance.annual.entitled - balance.annual.remaining)} used${balance.annual.carryOver ? " · " + balance.annual.carryOver + " carried over" : ""}</div>
            </div>
            <div class="card" style="cursor:default">
              <div class="card__head"><div class="card__icon card__icon--ok">${ICONS.calendar || ""}</div></div>
              <div class="card__title">Sick</div>
              <div class="card__value">${balance.sick.remaining}<span style="font-size:13px;color:var(--ink-500);font-weight:500"> / 14</span></div>
              <div class="card__meta">${balance.sick.used || 0} used this year</div>
            </div>
            <div class="card" style="cursor:default">
              <div class="card__head"><div class="card__icon card__icon--muted">${ICONS.calendar || ""}</div></div>
              <div class="card__title">Compassionate</div>
              <div class="card__value">${balance.compassionate.remaining}<span style="font-size:13px;color:var(--ink-500);font-weight:500"> / 5</span></div>
              <div class="card__meta">Bereavement · emergency</div>
            </div>
            <div class="card" style="cursor:default">
              <div class="card__head"><div class="card__icon card__icon--warn">${ICONS.calendar || ""}</div></div>
              <div class="card__title">Hajj</div>
              <div class="card__value">${balance.hajj.eligible ? "Eligible" : "Used"}</div>
              <div class="card__meta">${balance.hajj.eligible ? "Once-per-tenure entitlement" : "Lifetime entitlement consumed"}</div>
            </div>
          </div>

          <div class="info-banner" style="margin-bottom:14px">${ICONS.calendar || ""}<div>Leave history grouped by year (newest first). Each request shows the cascade trail, decision date, and full reason.</div></div>

          ${myLeaves.length === 0 ? `
            <div style="background:var(--paper);border:1px solid var(--ink-100);border-radius:10px;padding:30px;text-align:center;color:var(--ink-500)">
              <div style="font-size:36px;line-height:1">${ICONS.calendar || "📅"}</div>
              <div style="margin-top:10px;font-weight:600;color:var(--ink-700)">No leave history yet</div>
              <div style="margin-top:4px;font-size:12px">This employee hasn't submitted any leave requests.</div>
            </div>
          ` : years.map(y => {
            const t = yearTotals(byYear[y]);
            return `
            <div class="year-block">
              <div class="year-block__header">
                <div class="year-block__title">
                  <span class="year-block__year">${y}</span>
                  <span class="year-block__count">${byYear[y].length} request${byYear[y].length === 1 ? "" : "s"}</span>
                </div>
                <div class="year-block__stats">
                  <span class="year-stat year-stat--total"><strong>${t.total}</strong> days total</span>
                  <span class="year-stat"><strong>${t.annual}</strong> annual</span>
                  <span class="year-stat"><strong>${t.sick}</strong> sick</span>
                  <span class="year-stat year-stat--other"><strong>${t.other}</strong> other</span>
                  ${t.pending ? `<span class="year-stat year-stat--pending"><strong>${t.pending}</strong> pending</span>` : ""}
                </div>
              </div>
              <div class="table-wrap" style="border:1px solid var(--ink-100);border-top:none;border-radius:0 0 10px 10px;margin-bottom:18px">
                <table class="table">
                  <thead><tr><th>ID</th><th>Type</th><th>From → To</th><th>Days</th><th>Status</th><th>Cascade</th><th>Reason</th><th></th></tr></thead>
                  <tbody>
                    ${byYear[y].map(l => {
                      const statusPill =
                        l.status === "approved"   ? '<span class="status status--ok">Approved</span>' :
                        l.status === "pending_pm" ? '<span class="status status--info">Pending PM</span>' :
                        l.status === "pending_hr" ? '<span class="status status--warn">Pending HR</span>' :
                        l.status === "denied"     ? '<span class="status status--danger">Denied</span>' :
                        `<span class="status status--muted">${l.status}</span>`;
                      const cascadeStr = (l.status === "approved" || l.status === "denied")
                        ? `<span class="cascade-mini">${(l.pm||"").split(" ")[0]} ✓ → ${(l.tl||"").split(" ")[0]} ✓ → <strong>HR</strong> ${l.status === "approved" ? "✓" : "✗"}</span>`
                        : `<span class="cascade-mini">${(l.pm||"").split(" ")[0]} ${l.status === "pending_pm" ? "…" : "✓"} → ${(l.tl||"").split(" ")[0]} ${l.status === "pending_pm" ? "" : "✓"} → <strong>HR</strong> ${l.status === "pending_hr" ? "…" : ""}</span>`;
                      return `
                        <tr class="row-clickable">
                          <td class="table__mono">${l.id}</td>
                          <td>${l.type}</td>
                          <td class="table__mono">${l.from} → ${l.to}</td>
                          <td><strong>${l.days}</strong></td>
                          <td>${statusPill}${l.priority === "urgent" ? ' <span class="status status--danger">Urgent</span>' : ""}</td>
                          <td>${cascadeStr}</td>
                          <td style="font-size:12px;color:var(--ink-700);max-width:220px">${l.reason || "—"}</td>
                          <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td>
                        </tr>`;
                    }).join("")}
                  </tbody>
                </table>
              </div>
            </div>`;
          }).join("")}
        `;
      })()}
    </div>

    <!-- ===== AUDIT LOG TAB ===== -->
    <div class="emp-detail-tabpane" data-tabpane="audit">
      <div class="info-banner">${ICONS.lock || ""}<div>Every change to this employee's record is logged. Sensitive views (salary, banking, identity) also produce audit entries even when no change is made.</div></div>
      <div class="activity-feed">
        ${p.audit.map(a => `
          <div class="act">
            <div class="act__dot act__dot--info">${ICONS.clock || ICONS.calendar || ""}</div>
            <div class="act__main"><strong>${a.actor}</strong> · <span>${a.action}</span></div>
            <div class="act__time">${a.time}</div>
          </div>
        `).join("")}
      </div>
    </div>`;
}


// =========================================================
// PAGE: Onboarding V2 — Pipeline view with stages, remarks, and download
// =========================================================
function pageOnboardingV2() {
  const ONB = [
    { id:"E008", name:"Reem Al Otaibi",  joined:"2026-04-01", dept:"Cloud Eng",  stage:"day-30",  progress:32,  status:"on-track", lm:"Khalid Mansour", pm:"Fatima Al Zaabi", lastRemark:"Strong start on documentation track. AWS CP cert in progress." },
    { id:"E015", name:"Yousef Karim",    joined:"2026-04-28", dept:"Advisory",   stage:"day-7",   progress:8,   status:"on-track", lm:"Khalid Mansour", pm:"Fatima Al Zaabi", lastRemark:"Setup complete · onboarding session scheduled" },
    { id:"E019", name:"Hiba Al Khoury",  joined:"2026-05-04", dept:"DevOps",     stage:"day-7",   progress:18,  status:"on-track", lm:"Khalid Mansour", pm:"Sara Mitchell",   lastRemark:"Equipment delivered · AWS account being provisioned" },
    { id:"E021", name:"Junaid Bashir",   joined:"2026-04-14", dept:"Cloud Eng",  stage:"day-30",  progress:42,  status:"needs-attn", lm:"Khalid Mansour", pm:"Fatima Al Zaabi", lastRemark:"Behind on KnowBe4 training · 5d overdue" },
    { id:"E023", name:"Mariam Saleem",   joined:"2026-05-11", dept:"Delivery",   stage:"day-1",   progress:5,   status:"on-track", lm:"Sara Mitchell",  pm:"Sara Mitchell",   lastRemark:"First day today · welcome email sent" },
    { id:"E025", name:"Bilal Anwar",     joined:"2026-04-21", dept:"Cloud Eng",  stage:"day-30",  progress:38,  status:"on-track", lm:"Khalid Mansour", pm:"Fatima Al Zaabi", lastRemark:"Pairing with Lina · making good progress" },
    { id:"E027", name:"Naomi Tanaka",    joined:"2026-04-04", dept:"Advisory",   stage:"day-30",  progress:55,  status:"on-track", lm:"Khalid Mansour", pm:"Omar Siddiqui",   lastRemark:"AWS account provisioned · 1st client shadow scheduled" },
    { id:"E028", name:"Adil Hosseini",   joined:"2026-04-07", dept:"DevOps",     stage:"day-30",  progress:48,  status:"on-track", lm:"Khalid Mansour", pm:"Khalid Mansour",  lastRemark:"Strong technical onboarding · KPIs assigned" },
  ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Onboarding Pipeline</h2>
        <div class="page-header__sub">${ONB.length} active joiners · view by stage, status, or as a list</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Download report</button>
        <button class="btn btn--secondary btn--sm">${ICONS.filter} Filters</button>
        <button class="btn btn--primary btn--sm">${ICONS.plus} Start new joiner</button>
      </div>
    </div>

    <div class="cards" style="margin-bottom:16px">
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--bright">${ICONS.rocket || ICONS["check-circle"]}</div></div>
        <div class="card__title">Active onboardings</div><div class="card__value">${ONB.length}</div><div class="card__meta">Across 4 departments</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check || ICONS["check-circle"]}</div></div>
        <div class="card__title">On track</div><div class="card__value">${ONB.filter(o=>o.status==='on-track').length}</div><div class="card__meta">No intervention needed</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--warn">${ICONS.alert}</div></div>
        <div class="card__title">Needs attention</div><div class="card__value">${ONB.filter(o=>o.status==='needs-attn').length}</div><div class="card__meta">Overdue trainings / blockers</div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card__head"><div class="card__icon card__icon--muted">${ICONS.calendar}</div></div>
        <div class="card__title">Avg time to confirm</div><div class="card__value">76d</div><div class="card__meta">vs 90d target</div>
      </div>
    </div>

    <div id="fb-hr-onboarding"></div>

    <div class="onb-pipeline" id="hr-onboarding-results">
      ${["day-1","day-7","day-30","day-60","day-90"].map(stage => {
        const items = ONB.filter(o => o.stage === stage);
        const label = { "day-1":"Day 1 · Welcome", "day-7":"Day 7 · Setup", "day-30":"Day 30 · Active", "day-60":"Day 60 · Mid-review", "day-90":"Day 90 · Confirmation" }[stage];
        return `
          <div class="onb-column" data-tag="all ${stage}" data-search="${label.toLowerCase()}">
            <div class="onb-column__head">
              <h4>${label}</h4>
              <span class="kanban__count">${items.length}</span>
            </div>
            <div class="onb-column__cards">
              ${items.length ? items.map(o => {
                const deptSlug = o.dept.toLowerCase().replace(/[^\w]+/g, "-");
                const lmSlug = o.lm.toLowerCase().replace(/[^\w]+/g, "-");
                const tags = ["all", o.status, o.stage, deptSlug, lmSlug];
                const searchText = `${o.id} ${o.name} ${o.dept} ${o.lm} ${o.pm} ${o.lastRemark}`.toLowerCase();
                return `
                <div class="onb-card row-clickable" data-emp-id="${o.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
                  <div class="onb-card__head">
                    <div class="emp-avatar emp-avatar--sm" data-status="${o.status==='needs-attn'?'warn':'ok'}">${o.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}</div>
                    <div>
                      <strong>${o.name}</strong>
                      <div class="onb-card__meta">${o.dept} · ${o.id}</div>
                    </div>
                  </div>
                  <div class="onb-card__progress">
                    <div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:${o.progress}%"></div></div><div class="progress-mini__text">${o.progress}%</div></div>
                  </div>
                  <div class="onb-card__remark">${o.lastRemark}</div>
                  <div class="onb-card__foot">
                    <span class="onb-foot-pill">${o.lm.split(' ')[0]}</span>
                    ${o.status==='needs-attn' ? '<span class="status status--warn">Needs attention</span>' : '<span class="status status--ok">On track</span>'}
                  </div>
                </div>`;
              }).join('') : `<div class="onb-empty">No one in this stage</div>`}
            </div>
          </div>
        `;
      }).join("")}
      <div class="fb-empty" style="display:none;grid-column:1/-1">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No onboarding records match these filters</div>
      </div>
    </div>
  `;
}

// =========================================================
// PAGE: Probation Tracking (HR — sees ALL probation cases across TLs/PMs)
// =========================================================
function pageProbationHr() {
  const PROB = [
    { id:"E011", name:"Marcus Wright",   title:"DevOps Engineer",   dept:"Cloud Engineering", started:"2026-01-08", ends:"2026-04-08", tl:"Khalid Mansour",  pm:"Sara Mitchell",   kpiScore:78, projectRating:4.2, status:"Decision pending", risk:"medium", recommendation:"TL recommends: Confirm" },
    { id:"E032", name:"Tomás Rivera",    title:"Junior Cloud Eng.", dept:"Cloud Engineering", started:"2026-02-18", ends:"2026-05-18", tl:"Khalid Mansour",  pm:"Khalid Mansour",  kpiScore:65, projectRating:3.4, status:"At risk · TL recommends extension", risk:"high",   recommendation:"TL recommends: Extend 60 days" },
    { id:"E036", name:"Maya Robinson",   title:"Junior Cloud Eng.", dept:"Cloud Engineering", started:"2026-03-22", ends:"2026-06-22", tl:"Khalid Mansour",  pm:"Fatima Al Zaabi", kpiScore:71, projectRating:3.9, status:"On track", risk:"low", recommendation:null },
    { id:"E041", name:"Hassan Bukhari",  title:"Cloud Engineer",    dept:"Cloud Engineering", started:"2026-02-01", ends:"2026-05-01", tl:"Khalid Mansour",  pm:"Omar Siddiqui",   kpiScore:82, projectRating:4.5, status:"On track · ready to confirm", risk:"low",  recommendation:"TL recommends: Confirm" },
    { id:"E045", name:"Pierre Dubois",   title:"Junior DevOps",     dept:"Cloud Engineering", started:"2026-03-10", ends:"2026-06-10", tl:"Khalid Mansour",  pm:"Khalid Mansour",  kpiScore:74, projectRating:4.0, status:"On track", risk:"low", recommendation:null },
    { id:"E023", name:"Mariam Saleem",   title:"Solutions Consultant", dept:"Pre-sales",      started:"2026-05-02", ends:"2026-08-02", tl:"Khalid Mansour",  pm:"Fatima Al Zaabi", kpiScore:68, projectRating:3.7, status:"Early stage", risk:"low", recommendation:null },
    { id:"E039", name:"Zaynab Sharif",   title:"Junior Consultant", dept:"Advisory",          started:"2026-04-15", ends:"2026-07-15", tl:"Khalid Mansour",  pm:"Fatima Al Zaabi", kpiScore:70, projectRating:3.6, status:"Early stage", risk:"low", recommendation:null },
    { id:"E052", name:"Arjun Mehta",     title:"Cloud Engineer",    dept:"Cloud Engineering", started:"2026-04-25", ends:"2026-07-25", tl:"Khalid Mansour",  pm:"Fatima Al Zaabi", kpiScore:67, projectRating:3.5, status:"Early stage", risk:"low", recommendation:null },
    { id:"E061", name:"Layla Younes",    title:"Junior Cloud Eng.", dept:"Cloud Engineering", started:"2026-03-05", ends:"2026-06-05", tl:"Khalid Mansour",  pm:"Sara Mitchell",   kpiScore:62, projectRating:3.2, status:"At risk · needs review", risk:"high", recommendation:"TL recommends: Extend 30 days" },
    { id:"E062", name:"Vince Hartley",   title:"DevOps Engineer",   dept:"Cloud Engineering", started:"2026-02-12", ends:"2026-05-12", tl:"Khalid Mansour",  pm:"Sara Mitchell",   kpiScore:79, projectRating:4.1, status:"Decision pending", risk:"medium", recommendation:"TL recommends: Confirm" },
    { id:"E063", name:"Ines Lemaitre",   title:"Junior Consultant", dept:"Advisory",          started:"2026-01-20", ends:"2026-04-20", tl:"Khalid Mansour",  pm:"Fatima Al Zaabi", kpiScore:84, projectRating:4.3, status:"Decision pending · ready", risk:"low",   recommendation:"TL recommends: Confirm" },
    { id:"E064", name:"Vikram Mehrotra", title:"Cloud Engineer",    dept:"Cloud Engineering", started:"2026-04-08", ends:"2026-07-08", tl:"Khalid Mansour",  pm:"Fatima Al Zaabi", kpiScore:75, projectRating:4.0, status:"On track", risk:"low", recommendation:null },
  ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Probation Tracking · HR view</h2>
        <div class="page-header__sub">Final decisions land here · TL recommendations + meetings + KPI + ratings · ${PROB.length} active</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Download all reports</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:16px">
      ${ICONS.shield}
      <div>HR has final authority. Configure <strong>auto-decision rules</strong> in Settings (e.g. "auto-confirm if KPI ≥ 80 + TL recommends confirm + no flagged remarks"). Currently <strong>manual review</strong> for all cases.</div>
    </div>

    <div class="cards" style="margin-bottom:18px">
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--bright">${ICONS.shield}</div></div><div class="card__title">Active probations</div><div class="card__value">${PROB.length}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--warn">${ICONS.alert}</div></div><div class="card__title">Decisions pending</div><div class="card__value">${PROB.filter(p=>p.recommendation).length}</div><div class="card__meta">TL has made a recommendation</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--danger">${ICONS.alert}</div></div><div class="card__title">High risk</div><div class="card__value">${PROB.filter(p=>p.risk==='high').length}</div><div class="card__meta">Flagged for HR review</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check}</div></div><div class="card__title">Confirmed this quarter</div><div class="card__value">12</div></div>
    </div>

    <div id="fb-hr-probation"></div>

    <div class="prob-list" id="hr-probation-results">
      ${PROB.map((p, idx) => {
        const months = [
          { n: 1, status: "filed" },
          { n: 2, status: "filed" },
          { n: 3, status: idx === 1 || idx === 8 ? "overdue" : idx === 2 || idx === 4 || idx === 5 || idx === 6 || idx === 7 || idx === 11 ? "due" : "filed" },
        ];
        const overdue = months.filter(m => m.status === "overdue").length;
        const deptSlug = p.dept.toLowerCase().replace(/[^\w]+/g, "-");
        const tags = ["all", p.risk + "-risk", p.risk, deptSlug];
        if (p.recommendation) tags.push("decisions-pending");
        const searchText = `${p.id} ${p.name} ${p.title} ${p.dept} ${p.tl} ${p.pm}`.toLowerCase();
        return `
        <div class="prob-row" data-tag="${tags.join(" ")}" data-search="${searchText}">
          <div class="prob-row__head">
            <div class="prob-row__id">
              <div class="emp-avatar ${p.risk==='high'?'emp-avatar--alert':''}">${p.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}</div>
              <div>
                <div class="prob-row__name">${p.name} <span class="probation-risk probation-risk--${p.risk}">${p.risk} risk</span>${overdue > 0 ? ' <span class="probation-risk probation-risk--high">remark overdue</span>' : ''}</div>
                <div class="prob-row__sub">${p.title} · ${p.id} · TL: ${p.tl} · PM: ${p.pm}</div>
              </div>
            </div>
            <div class="prob-row__actions">
              <button class="btn btn--secondary btn--sm">${ICONS.eye || ""} View full record</button>
              <button class="btn btn--secondary btn--sm">${ICONS.download} Report</button>
              ${p.recommendation ? '<button class="btn btn--primary btn--sm">Approve / Decide</button>' : '<button class="btn btn--ghost btn--sm">Waiting on TL</button>'}
            </div>
          </div>
          <div class="prob-row__stats">
            <div><span class="stat-label">PROBATION ENDS</span><span class="stat-value">${p.ends}</span></div>
            <div><span class="stat-label">KPI</span><span class="stat-value">${p.kpiScore}/100</span></div>
            <div><span class="stat-label">PROJECT RATING</span><span class="stat-value">★ ${p.projectRating}</span></div>
            <div><span class="stat-label">STATUS</span><span class="stat-value">${p.status}</span></div>
          </div>
          <div class="prob-row__monthly">
            <span class="stat-label" style="margin-right:10px">MONTHLY REMARKS</span>
            ${months.map(m => `<span class="m-pill m-pill--${m.status}">M${m.n} · ${m.status === "filed" ? "filed" : m.status === "due" ? "due" : "overdue"}</span>`).join(" ")}
          </div>
          ${p.recommendation ? `
            <div class="prob-row__recommendation">
              <span class="rec-pill">${p.recommendation}</span>
              <button class="btn btn--ghost btn--sm">View TL remarks</button>
            </div>` : ""}
        </div>
      `;}).join("")}
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No probation cases match these filters</div>
      </div>
    </div>
    <div id="pg-hr-probation"></div>
  `;
}


// =========================================================
// PAGE: Background Checks
// =========================================================
function pageBackgroundChecks() {
  const CHECKS = [
    { id:"BC-2026-021", name:"Reem Al Otaibi",  empId:"E008", status:"Verified",           verifiedOn:"2026-04-02", refs:3, gaps:0, source:"Sterling" },
    { id:"BC-2026-022", name:"Yousef Karim",    empId:"E015", status:"In progress",        verifiedOn:null,         refs:1, gaps:0, source:"Manual"   },
    { id:"BC-2026-023", name:"Hiba Al Khoury",  empId:"E019", status:"Pending references", verifiedOn:null,         refs:0, gaps:0, source:"Sterling" },
    { id:"BC-2026-024", name:"Junaid Bashir",   empId:"E021", status:"Verified",           verifiedOn:"2026-04-16", refs:2, gaps:1, source:"Manual"   },
    { id:"BC-2026-025", name:"Mariam Saleem",   empId:"E023", status:"Awaiting upload",    verifiedOn:null,         refs:0, gaps:0, source:"Manual"   },
    { id:"BC-2026-026", name:"Arjun Mehta",     empId:"E052", status:"In progress",        verifiedOn:null,         refs:2, gaps:0, source:"Sterling" },
    { id:"BC-2026-027", name:"Zaynab Sharif",   empId:"E039", status:"Verified",           verifiedOn:"2026-04-22", refs:3, gaps:0, source:"Sterling" },
    { id:"BC-2026-028", name:"Pierre Dubois",   empId:"E025", status:"Verified",           verifiedOn:"2026-03-20", refs:3, gaps:0, source:"Manual"   },
    { id:"BC-2026-029", name:"Hassan Bukhari",  empId:"E024", status:"Verified",           verifiedOn:"2026-02-15", refs:2, gaps:0, source:"Sterling" },
    { id:"BC-2026-030", name:"Tomás Rivera",    empId:"E030", status:"Verified",           verifiedOn:"2026-02-28", refs:2, gaps:1, source:"Manual"   },
    { id:"BC-2026-031", name:"Maya Robinson",   empId:"E031", status:"Pending references", verifiedOn:null,         refs:1, gaps:0, source:"Sterling" },
    { id:"BC-2026-032", name:"Layla Younes",    empId:"E061", status:"In progress",        verifiedOn:null,         refs:0, gaps:0, source:"Sterling" },
  ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Background Checks</h2>
        <div class="page-header__sub">Verify previous employment, education, references</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
        <button class="btn btn--primary btn--sm" data-action="start-bgc">${ICONS.plus} Start new check</button>
      </div>
    </div>

    <div class="cards" style="margin-bottom:16px">
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check}</div></div><div class="card__title">Verified</div><div class="card__value">${CHECKS.filter(c=>c.status==='Verified').length}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--bright">${ICONS.clock}</div></div><div class="card__title">In progress</div><div class="card__value">${CHECKS.filter(c=>c.status==='In progress'||c.status==='Pending references').length}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--warn">${ICONS.upload}</div></div><div class="card__title">Awaiting docs</div><div class="card__value">${CHECKS.filter(c=>c.status==='Awaiting upload').length}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--danger">${ICONS.alert}</div></div><div class="card__title">Employment gaps</div><div class="card__value">${CHECKS.reduce((s,c)=>s+c.gaps,0)}</div></div>
    </div>

    <div id="fb-hr-bgc"></div>

    <div class="table-wrap" id="hr-bgc-results">
      <table class="table">
        <thead><tr><th>Check ID</th><th>Employee</th><th>Status</th><th>References</th><th>Gaps</th><th>Source</th><th>Verified on</th><th></th></tr></thead>
        <tbody>
          ${CHECKS.map(c => {
            const statusSlug = c.status.toLowerCase().replace(/\s+/g, "-");
            const tags = ["all", statusSlug, c.source.toLowerCase()];
            if (c.gaps > 0) tags.push("has-gaps");
            const searchText = `${c.id} ${c.name} ${c.empId} ${c.status} ${c.source}`.toLowerCase();
            return `
              <tr class="row-clickable" data-emp-id="${c.empId}" data-tag="${tags.join(" ")}" data-search="${searchText}">
                <td class="table__mono">${c.id}</td>
                <td>${c.name}</td>
                <td><span class="status status--${c.status==='Verified'?'ok':c.status.includes('Pending')||c.status.includes('Awaiting')?'warn':'info'}">${c.status}</span></td>
                <td>${c.refs > 0 ? `${c.refs} confirmed` : '<span style="color:var(--ink-500)">—</span>'}</td>
                <td>${c.gaps > 0 ? `<span style="color:var(--warn);font-weight:700">${c.gaps}</span>` : '0'}</td>
                <td>${c.source}</td>
                <td class="table__mono">${c.verifiedOn || '—'}</td>
                <td>
                  <button class="btn btn--ghost btn--sm" data-action="bgc-comment" data-bgc-id="${c.id}">${ICONS.message || ICONS.pen} Comment</button>
                  ${c.status !== 'Verified' ? `<button class="btn btn--primary btn--sm" data-action="bgc-complete" data-bgc-id="${c.id}">${ICONS.check} Mark complete</button>` : ''}
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No background checks match these filters</div>
      </div>
    </div>
    <div id="pg-hr-bgc"></div>
  `;
}

// =========================================================
// PAGE: Project Ratings — HR Inbox
// =========================================================
function pageProjectRatingsHr() {
  const RATINGS = [
    { id:"PR-2026-018", project:"Client-Alpha · AWS Migration",  member:"Reem Al Otaibi",  pm:"Fatima Al Zaabi", pmRating:4.3, tl:"Khalid Mansour", tlRating:4.4, status:"pending_hr", autoEligible:true,  forwardedAt:"1d ago",  commentSummary:"Strong delivery; needs more architecture push." },
    { id:"PR-2026-017", project:"Bank-of-Sky · Lift & Shift",    member:"Marcus Wright",   pm:"Sara Mitchell",    pmRating:4.1, tl:"Khalid Mansour", tlRating:4.0, status:"pending_hr", autoEligible:true,  forwardedAt:"2d ago",  commentSummary:"Reliable, some communication delays." },
    { id:"PR-2026-016", project:"TelcoCo · DR Implementation",   member:"Tomás Rivera",    pm:"Khalid Mansour",   pmRating:3.2, tl:"Khalid Mansour", tlRating:3.4, status:"pending_hr", autoEligible:false, forwardedAt:"5d ago",  commentSummary:"Struggles with self-direction; pairing recommended." },
    { id:"PR-2026-015", project:"Retail-Co · Migration",         member:"Ananya Sharma",   pm:"Fatima Al Zaabi", pmRating:4.9, tl:"Khalid Mansour", tlRating:4.8, status:"auto",       autoEligible:true,  decidedAt:"1w ago",     commentSummary:"Exceptional · saved migration timeline." },
    { id:"PR-2026-014", project:"Retail-Co · Migration",         member:"Lina Haddad",     pm:"Fatima Al Zaabi", pmRating:4.7, tl:"Khalid Mansour", tlRating:4.6, status:"auto",       autoEligible:true,  decidedAt:"2w ago",     commentSummary:"Lead role on documentation; flawless execution." },
    { id:"PR-2026-013", project:"FinTech-Co · Hardening",        member:"Karim Salah",     pm:"Omar Siddiqui",    pmRating:4.5, tl:"Khalid Mansour", tlRating:4.6, status:"manual",     autoEligible:false, decidedAt:"3w ago",     commentSummary:"Approved manually due to first cycle on this client." },
    { id:"PR-2026-012", project:"PowerLogis · Data Lake",        member:"Yan Zhang",       pm:"Sara Mitchell",    pmRating:4.4, tl:"Khalid Mansour", tlRating:4.5, status:"manual",     autoEligible:true,  decidedAt:"3w ago",     commentSummary:"Cascade was 0.4★ apart — flagged for HR review." },
    { id:"PR-2026-011", project:"Client-Alpha · AWS Migration",  member:"Hassan Bukhari",  pm:"Omar Siddiqui",    pmRating:2.8, tl:"Khalid Mansour", tlRating:3.0, status:"denied",     autoEligible:false, decidedAt:"4w ago",     commentSummary:"Sent back to PM with HR comments for re-evaluation." },
    { id:"PR-2026-010", project:"Bank-of-Sky · Lift & Shift",    member:"Sami Berkani",    pm:"Sara Mitchell",    pmRating:4.2, tl:"Khalid Mansour", tlRating:4.3, status:"auto",       autoEligible:true,  decidedAt:"5w ago",     commentSummary:"Consistent performance, on-time delivery." },
    { id:"PR-2026-009", project:"TelcoCo · DR Implementation",   member:"Priya Iyer",      pm:"Khalid Mansour",   pmRating:4.5, tl:"Khalid Mansour", tlRating:4.4, status:"auto",       autoEligible:true,  decidedAt:"6w ago",     commentSummary:"Excellent on DR runbook contribution." },
    { id:"PR-2026-008", project:"Retail-Co · Migration",         member:"Hamza Al Mahmoud",pm:"Fatima Al Zaabi", pmRating:4.0, tl:"Khalid Mansour", tlRating:4.1, status:"manual",     autoEligible:true,  decidedAt:"6w ago",     commentSummary:"Solid cycle, approved on schedule." },
    { id:"PR-2026-007", project:"FinTech-Co · Hardening",        member:"Adeel Mahmood",   pm:"Omar Siddiqui",    pmRating:4.6, tl:"Khalid Mansour", tlRating:4.5, status:"auto",       autoEligible:true,  decidedAt:"7w ago",     commentSummary:"Strong advisory contribution." },
  ];

  function pmSlug(name) { return (name || "").toLowerCase().replace(/[^\w]+/g, "-"); }
  function projSlug(p) { return (p || "").toLowerCase().split(" · ")[0].replace(/[^\w]+/g, "-"); }

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Project Ratings · HR Inbox</h2>
        <div class="page-header__sub">Final approval queue from PM→TL→HR cascade. Configure auto-approval rules to reduce manual review.</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm" data-action="leave-auto-rule">${ICONS.cog || ""} Auto-approval rules</button>
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:16px;background:linear-gradient(120deg,#FFF8E1,#FFECB3);border-color:#F5C977">
      ${ICONS.star}
      <div><strong>Auto-approval is OFF.</strong> Enable rules like "auto-approve when PM and TL agree within 0.3 ★ AND no flags" to cut manual review.</div>
    </div>

    <div id="fb-hr-ratings"></div>

    <div id="hr-ratings-results">
    ${RATINGS.map(r => {
      const tags = ["all", r.status];
      tags.push(pmSlug(r.pm));
      tags.push(projSlug(r.project));
      const searchText = `${r.id} ${r.project} ${r.member} ${r.pm} ${r.tl}`.toLowerCase();
      const decisionLabel = r.status === 'pending_hr' ? `forwarded ${r.forwardedAt}`
                          : r.status === 'auto' ? `auto-approved ${r.decidedAt}`
                          : r.status === 'manual' ? `approved manually ${r.decidedAt}`
                          : r.status === 'denied' ? `sent back ${r.decidedAt}` : '';
      return `
      <div class="rating-row" data-tag="${tags.join(" ")}" data-search="${searchText}">
        <div class="rating-row__head">
          <div>
            <div class="rating-row__title">${r.project}</div>
            <div class="rating-row__sub">${r.member} · ${r.id} · ${decisionLabel}</div>
          </div>
          <div class="rating-row__actions">
            <button class="btn btn--secondary btn--sm" data-action="see-full-record" data-rating-id="${r.id}">${ICONS.eye || ""} See full record</button>
            ${r.status === 'pending_hr' ? `
              <button class="btn btn--secondary btn--sm">Send back</button>
              <button class="btn btn--primary btn--sm">${ICONS.check} Approve</button>` : ''}
          </div>
        </div>
        <div class="rating-row__cascade">
          <div class="cascade-step"><div class="cascade-step__role">PM · ${r.pm}</div><div class="cascade-step__rating">★ ${r.pmRating}</div></div>
          <div class="cascade-arrow">→</div>
          <div class="cascade-step"><div class="cascade-step__role">TL · ${r.tl}</div><div class="cascade-step__rating">★ ${r.tlRating}</div></div>
          <div class="cascade-arrow">→</div>
          <div class="cascade-step ${r.status === 'pending_hr' ? 'cascade-step--current' : ''}">
            <div class="cascade-step__role">HR</div>
            <div class="cascade-step__rating">${r.status === 'pending_hr' ? 'awaiting' : r.status === 'auto' ? 'auto-approved' : r.status === 'manual' ? 'approved' : r.status === 'denied' ? 'denied' : ''}</div>
          </div>
          ${r.autoEligible ? '<span class="auto-eligible-pill">Auto-eligible</span>' : '<span class="manual-only-pill">Manual review only</span>'}
        </div>
        <div class="rating-row__summary">"${r.commentSummary}"</div>
      </div>`;
    }).join("")}
    <div class="fb-empty" style="display:none">
      <div style="text-align:center;padding:30px;color:var(--ink-500)">No ratings match these filters</div>
    </div>
    </div>
    <div id="pg-hr-ratings"></div>
  `;
}

// =========================================================
// PAGE: Projects (ODOO-sourced; HR views, can't edit; replaces PM Assignment)
// =========================================================
function pageProjectsView() {
  const PROJECTS = [
    { id:"P-AWSM-001", name:"Client-Alpha · AWS Migration", client:"Client-Alpha",   pm:"Fatima Al Zaabi", stage:"Execution", health:"green",  members:6, started:"2025-11-15", endsExp:"2026-08-15", phase:"Phase 2 · Workload migration" },
    { id:"P-BNKS-002", name:"Bank-of-Sky · Lift & Shift",   client:"Bank-of-Sky",     pm:"Sara Mitchell",    stage:"Execution", health:"amber",  members:4, started:"2026-01-08", endsExp:"2026-07-08", phase:"Phase 1 · Foundation" },
    { id:"P-TLDR-003", name:"TelcoCo · DR Implementation",  client:"TelcoCo",         pm:"Khalid Mansour",   stage:"Execution", health:"green",  members:3, started:"2026-02-01", endsExp:"2026-06-30", phase:"Phase 2 · Failover testing" },
    { id:"P-RETC-004", name:"Retail-Co · Migration",        client:"Retail-Co",       pm:"Fatima Al Zaabi", stage:"Closed",    health:"green",  members:5, started:"2025-08-12", endsExp:"2026-04-30", phase:"Completed", endedAt:"2026-04-28" },
    { id:"P-FINT-005", name:"FinTech · Multi-account",      client:"FinTech-Co",      pm:"Omar Siddiqui",    stage:"Blocked",   health:"red",    members:2, started:"2026-03-01", endsExp:"2026-08-01", phase:"Phase 1 · Awaiting client decisions" },
    { id:"P-PLOG-006", name:"PowerLogis · Data lake",       client:"PowerLogis",      pm:"Fatima Al Zaabi", stage:"Discovery", health:"green",  members:2, started:"2026-04-22", endsExp:"2026-10-22", phase:"Discovery & scoping" },
    { id:"P-HBNK-007", name:"Habib Bank · WAF rollout",     client:"Habib Bank",      pm:"Sara Mitchell",    stage:"Execution", health:"green",  members:3, started:"2026-03-15", endsExp:"2026-09-15", phase:"Phase 1 · Edge config" },
    { id:"P-INRX-008", name:"Innorex · Lake Formation",     client:"Innorex Group",   pm:"Khalid Mansour",   stage:"Execution", health:"amber",  members:4, started:"2026-01-20", endsExp:"2026-07-30", phase:"Phase 2 · Pipeline migration" },
    { id:"P-SHRY-009", name:"Sherwin Retail · POS",         client:"Sherwin Retail",  pm:"Omar Siddiqui",    stage:"Discovery", health:"green",  members:2, started:"2026-05-02", endsExp:"2026-11-02", phase:"Discovery — vendor selection" },
    { id:"P-AGRI-010", name:"AgriTech · IoT Backend",       client:"AgriTech",        pm:"Fatima Al Zaabi", stage:"Execution", health:"green",  members:4, started:"2026-02-22", endsExp:"2026-08-22", phase:"Phase 2 · Telemetry hub" },
    { id:"P-AECO-011", name:"Aecorp · Disaster Recovery",   client:"Aecorp",          pm:"Sara Mitchell",    stage:"Closed",    health:"green",  members:3, started:"2025-09-15", endsExp:"2026-03-15", phase:"Completed", endedAt:"2026-03-10" },
    { id:"P-XPED-012", name:"Xpedio Insurance · Vault",     client:"Xpedio Insurance",pm:"Khalid Mansour",   stage:"Execution", health:"green",  members:3, started:"2026-03-05", endsExp:"2026-09-05", phase:"Phase 1 · Secrets migration" },
    { id:"P-OLCB-013", name:"OilCab Energy · Edge",         client:"OilCab Energy",   pm:"Omar Siddiqui",    stage:"Blocked",   health:"red",    members:2, started:"2026-04-08", endsExp:"2026-10-08", phase:"Phase 1 · Vendor blocker" },
    { id:"P-MNRX-014", name:"MinersRx Pharma · GxP",        client:"MinersRx Pharma", pm:"Fatima Al Zaabi", stage:"Execution", health:"green",  members:5, started:"2026-01-12", endsExp:"2026-07-12", phase:"Phase 2 · Compliance audit" },
    { id:"P-TLDX-015", name:"TLD Express · Data Bus",       client:"TLD Express",     pm:"Sara Mitchell",    stage:"Discovery", health:"green",  members:2, started:"2026-05-09", endsExp:"2026-11-09", phase:"Discovery & roadmap" },
  ];

  const cnt = (s) => PROJECTS.filter(p => p.stage === s).length;

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Projects <span class="odoo-source-pill">${ICONS.external || ""} SYNCED FROM ODOO</span></h2>
        <div class="page-header__sub">Read-only view · last sync 17 min ago · PM assignments managed in ODOO</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.refresh || ICONS.send} Resync now</button>
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
      </div>
    </div>

    <div class="cards" style="margin-bottom:16px">
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--bright">${ICONS.briefcase || ICONS.menu}</div></div><div class="card__title">Total projects</div><div class="card__value">${PROJECTS.length}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check}</div></div><div class="card__title">Active (Execution)</div><div class="card__value">${cnt('Execution')}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--info">${ICONS.calendar}</div></div><div class="card__title">In Discovery</div><div class="card__value">${cnt('Discovery')}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--danger">${ICONS.alert}</div></div><div class="card__title">Blocked</div><div class="card__value">${cnt('Blocked')}</div></div>
    </div>

    <div id="fb-hr-projects"></div>

    <div class="table-wrap" id="hr-projects-results">
      <table class="table">
        <thead><tr><th>Project</th><th>Client</th><th>PM</th><th>Stage</th><th>Phase</th><th>Members</th><th>Window</th><th></th></tr></thead>
        <tbody>
          ${PROJECTS.map(p => {
            const stageSlug = p.stage.toLowerCase();
            const pmSlug = p.pm.toLowerCase().replace(/[^\w]+/g, "-");
            const tags = ["all", stageSlug, pmSlug];
            const searchText = `${p.id} ${p.name} ${p.client} ${p.pm} ${p.stage}`.toLowerCase();
            return `
            <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
              <td><strong>${p.name}</strong><div class="table__mono table__mono--dim">${p.id}</div></td>
              <td>${p.client}</td>
              <td>${p.pm}</td>
              <td><span class="stage-pill stage-pill--${stageSlug}">${p.stage}</span></td>
              <td>${p.phase}</td>
              <td>${p.members}</td>
              <td class="table__mono table__mono--dim">${p.started}<br>→ ${p.endsExp}</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No projects match these filters</div>
      </div>
    </div>
    <div id="pg-hr-projects"></div>
  `;
}

// =========================================================
// PAGE: Leave Approvals V2 — Dashboard with tabs and filters
// =========================================================
function pageLeaveApprovalsV2() {
  // Source from shared DB so the Employee profile + every portal sees the same data
  const LEAVES = (window.SUDO_DB && SUDO_DB.leaveApprovals) || [];

  const cnt = (s) => LEAVES.filter(l => l.status === s).length;
  const urgentCnt = LEAVES.filter(l => l.priority === "urgent" && l.status.startsWith("pending")).length;

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Leave Approvals</h2>
        <div class="page-header__sub">Approval queue · ${cnt('pending_hr')} ready for HR decision · ${cnt('pending_pm')} waiting on PM endorsement</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
        <button class="btn btn--secondary btn--sm">${ICONS.calendar} Open team calendar</button>
        <button class="btn btn--secondary btn--sm" data-action="leave-auto-rule">${ICONS.cog || ""} Auto-approval rules</button>
        <button class="btn btn--primary btn--sm" data-action="manage-leave-balances">${ICONS.plus || ""} Manage balances</button>
      </div>
    </div>

    ${urgentCnt > 0 ? `
      <div class="info-banner" style="margin-bottom:16px;background:var(--danger-bg,#FBEAEC);border-color:var(--danger,#C8333A);color:var(--ink-900)">
        ${ICONS.alert}
        <div><strong>${urgentCnt} urgent request${urgentCnt>1?'s':''}</strong> awaiting your decision · compassionate / emergency leave</div>
      </div>` : ""}

    <div class="cards" style="margin-bottom:16px">
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--warn">${ICONS.calendar}</div></div><div class="card__title">Pending HR</div><div class="card__value">${cnt('pending_hr')}</div><div class="card__meta">Ready for decision</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--info">${ICONS.clock || ICONS.refresh}</div></div><div class="card__title">Pending PM</div><div class="card__value">${cnt('pending_pm')}</div><div class="card__meta">Awaiting endorsement</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check || ICONS["check-circle"]}</div></div><div class="card__title">Approved this month</div><div class="card__value">${cnt('approved')}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--muted">${ICONS.users || ICONS.user}</div></div><div class="card__title">On leave today</div><div class="card__value">4</div><div class="card__meta">3 Annual · 1 Sick</div></div>
    </div>

    <div id="fb-hr-leaves"></div>

    <div class="table-wrap" id="hr-leaves-results">
      <table class="table">
        <thead><tr><th>ID</th><th>Employee</th><th>Type</th><th>From → To</th><th>Days</th><th>Priority</th><th>Cascade</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${LEAVES.map(l => {
            const year = (l.from || "").slice(0, 4);
            const tags = ["all", l.status, year];
            if (l.priority === "urgent") tags.push("urgent");
            tags.push(l.type.toLowerCase().replace(/\s+/g, "-"));
            const searchText = `${l.id} ${l.emp} ${l.empId} ${l.type} ${l.reason} ${year}`.toLowerCase();
            const statusPill =
              l.status === "pending_hr" ? '<span class="status status--warn">Pending HR</span>' :
              l.status === "pending_pm" ? '<span class="status status--info">Pending PM</span>' :
              l.status === "approved"   ? '<span class="status status--ok">Approved</span>' :
              l.status === "denied"     ? '<span class="status status--danger">Denied</span>' :
              `<span class="status status--muted">${l.status}</span>`;
            const actionBtn =
              l.status === "pending_hr" ? '<button class="btn btn--ghost btn--sm" data-action="deny-leave">Deny</button> <button class="btn btn--primary btn--sm" data-action="approve-leave">Approve</button>' :
              l.status === "pending_pm" ? '<button class="btn btn--ghost btn--sm">Waiting on PM</button>' :
              `<button class="btn btn--ghost btn--sm">${l.decidedAt || ''}</button>`;
            return `
            <tr class="row-clickable" data-leave-id="${l.id}" data-tag="${tags.join(" ")}" data-search="${searchText}">
              <td class="table__mono">${l.id}</td>
              <td><strong>${l.emp}</strong><div class="table__mono table__mono--dim">${l.empId}</div></td>
              <td>${l.type}</td>
              <td class="table__mono">${l.from} → ${l.to}</td>
              <td><strong>${l.days}</strong></td>
              <td>${l.priority === 'urgent' ? '<span class="status status--danger">Urgent</span>' : '<span class="status status--info">Normal</span>'}</td>
              <td><span class="cascade-mini">${l.pm.split(' ')[0]} ✓ → ${l.tl.split(' ')[0]} ✓ → <strong>HR</strong></span></td>
              <td>${statusPill}</td>
              <td>${actionBtn}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No leaves match these filters</div>
      </div>
    </div>
    <div id="pg-hr-leaves"></div>
  `;
}

// =========================================================
// PAGE: Recognition Wall (HR-managed, public-facing)
// =========================================================
function pageRecognition() {
  const LEADERBOARD = [
    { rank:1, name:"Karim Salah",       title:"Lead Engineer",      points:840, badges:12, kpi:93, photo:null, medal:"gold"   },
    { rank:2, name:"Ananya Sharma",     title:"Senior Cloud Eng.",   points:765, badges:9,  kpi:91, photo:null, medal:"silver" },
    { rank:3, name:"Yan Zhang",         title:"Senior Cloud Eng.",   points:710, badges:8,  kpi:86, photo:null, medal:"bronze" },
    { rank:4, name:"Khalid Mansour",    title:"Engineering Manager", points:680, badges:11, kpi:88, photo:null },
    { rank:5, name:"Lina Haddad",       title:"Senior Cloud Eng.",   points:640, badges:7,  kpi:88, photo:null },
    { rank:6, name:"Daniyal Habib",     title:"Cloud Engineer",      points:580, badges:5,  kpi:84, photo:null },
    { rank:7, name:"Priya Iyer",        title:"Cloud Engineer",      points:520, badges:4,  kpi:82, photo:null },
    { rank:8, name:"Sami Berkani",      title:"Cloud Engineer",      points:495, badges:3,  kpi:80, photo:null },
    { rank:9, name:"Marcus Wright",     title:"DevOps Engineer",     points:430, badges:3,  kpi:78, photo:null },
    { rank:10,name:"Hamza Al Mahmoud",  title:"Cloud Engineer",      points:380, badges:2,  kpi:75, photo:null },
  ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Recognition · Top Performers</h2>
        <div class="page-header__sub">Visible to everyone in SUDO · this page is the team's celebration wall</div>
      </div>
      <div class="page-actions">
        <select class="select select--sm"><option>This month · May 2026</option><option>This quarter · Q2 2026</option><option>This year · 2026</option><option>All time</option></select>
        <button class="btn btn--secondary btn--sm">${ICONS.cog || ""} Configure</button>
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
      </div>
    </div>

    <div class="recognition-hero">
      ${LEADERBOARD.slice(0,3).map(p => `
        <div class="podium podium--${p.medal}">
          <div class="podium__rank">${p.medal === 'gold' ? '🥇' : p.medal === 'silver' ? '🥈' : '🥉'}</div>
          <div class="podium__avatar">${p.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}</div>
          <div class="podium__name">${p.name}</div>
          <div class="podium__title">${p.title}</div>
          <div class="podium__stats">
            <div><span>${p.points}</span><label>POINTS</label></div>
            <div><span>${p.badges}</span><label>BADGES</label></div>
            <div><span>${p.kpi}</span><label>KPI</label></div>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="panel" style="margin-top:18px">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Full Leaderboard</h3>
          <p class="panel__sub">Transparent · every employee can see this page</p>
        </div>
      </header>
      <div class="panel__body">
        <div class="leaderboard">
          ${LEADERBOARD.map(p => `
            <div class="lb-row ${p.medal ? 'lb-row--top' : ''}">
              <div class="lb-row__rank">#${p.rank}</div>
              <div class="lb-row__avatar">${p.name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}</div>
              <div class="lb-row__main">
                <div class="lb-row__name">${p.name}</div>
                <div class="lb-row__title">${p.title}</div>
              </div>
              <div class="lb-row__stat"><strong>${p.points}</strong><span>points</span></div>
              <div class="lb-row__stat"><strong>${p.badges}</strong><span>badges</span></div>
              <div class="lb-row__stat"><strong>${p.kpi}</strong><span>KPI</span></div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// PAGE: Badges Admin — HR manages badge catalogue
// =========================================================
function pageBadgesAdmin() {
  const BADGES = [
    { id:"b-good",      label:"Good Job",         points:5,  icon:"👍", color:"#94A3B8", grantable_by:["Employee","TL","PM","HR","Admin"], desc:"Peer-to-peer recognition for everyday wins" },
    { id:"b-hands",     label:"Helping Hands",    points:15, icon:"🤝", color:"#1F8A4C", grantable_by:["Employee","TL","PM","HR"],          desc:"For going above & beyond to help a teammate" },
    { id:"b-runbook",   label:"Runbook Hero",     points:30, icon:"📚", color:"#0F7A8A", grantable_by:["TL","PM","HR","Admin"],              desc:"For exceptional contributions to runbooks/docs" },
    { id:"b-debug",     label:"Debug Wizard",     points:35, icon:"🔧", color:"#189CD9", grantable_by:["TL","PM","HR","Admin"],              desc:"For an exceptional debug / RCA contribution" },
    { id:"b-mentor",    label:"Mentor",           points:50, icon:"🎓", color:"#714B8C", grantable_by:["TL","HR","Admin"],                   desc:"For dedicated mentorship of junior staff" },
    { id:"b-above",     label:"Above & Beyond",   points:50, icon:"✨", color:"#E89A1E", grantable_by:["TL","HR","Admin"],                   desc:"For exceptional effort beyond the role" },
    { id:"b-cust",      label:"Customer Hero",    points:60, icon:"🦸", color:"#C8333A", grantable_by:["PM","HR","Admin"],                   desc:"For a notable customer-facing win" },
    { id:"b-innov",     label:"Innovator",        points:75, icon:"💡", color:"#0F7A8A", grantable_by:["HR","Admin"],                        desc:"For a significant process or product innovation" },
  ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Badges Catalogue</h2>
        <div class="page-header__sub">Define badges, point values, and who can grant each · these are tenant-customizable</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
        <button class="btn btn--primary btn--sm" data-action="create-badge">${ICONS.plus} Create new badge</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:16px">
      ${ICONS.award || ICONS.star}
      <div>Per-role grant permissions are <strong>set per badge</strong>. For example: "Good Job" is grantable by anyone (peer-to-peer), while "Innovator" is reserved for HR. Points roll up into the Top Performers leaderboard.</div>
    </div>

    <div class="cards" style="margin-bottom:18px">
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--bright">${ICONS.award || ICONS.star}</div></div><div class="card__title">Active badges</div><div class="card__value">${BADGES.length}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check}</div></div><div class="card__title">Granted this month</div><div class="card__value">47</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--info">${ICONS.user}</div></div><div class="card__title">Unique recipients</div><div class="card__value">28</div><div class="card__meta">of 147 employees</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--muted">${ICONS.menu}</div></div><div class="card__title">Total points distributed</div><div class="card__value">1,455</div></div>
    </div>

    <div id="fb-hr-badges"></div>

    <div class="badge-grid" id="hr-badges-results">
      ${BADGES.map(b => {
        const tags = ["all"];
        b.grantable_by.forEach(r => tags.push(r.toLowerCase()));
        // Points-range tag
        const ptsTag = b.points <= 15 ? "1-15-pts"
                     : b.points <= 40 ? "16-40-pts"
                     : b.points <= 75 ? "41-75-pts" : "76-pts";
        tags.push(ptsTag);
        const searchText = `${b.label} ${b.desc} ${b.points}`.toLowerCase();
        return `
        <div class="badge-tile" style="--badge-color:${b.color}" data-tag="${tags.join(" ")}" data-search="${searchText}">
          <div class="badge-tile__icon">${b.icon}</div>
          <div class="badge-tile__title">${b.label}</div>
          <div class="badge-tile__points">+${b.points} points</div>
          <div class="badge-tile__desc">${b.desc}</div>
          <div class="badge-tile__permissions">
            <span class="dim">Grantable by:</span>
            ${b.grantable_by.map(r => `<span class="badge-role-pill">${r}</span>`).join(' ')}
          </div>
          <div class="badge-admin-actions">
            <button class="btn btn--secondary btn--sm" data-action="edit-badge" data-badge-id="${b.id}">${ICONS.pen || ICONS.edit} Edit</button>
            <button class="btn btn--ghost btn--sm" data-action="view-grants" data-badge-id="${b.id}">View grants</button>
          </div>
        </div>`;
      }).join("")}
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No badges match these filters</div>
      </div>
    </div>
  `;
}


// =========================================================
// PAGE: KPI Management V2 (HR — the central control surface)
// =========================================================
function pageKpiManagementV2() {
  const CYCLES = [
    { id:"q2-2026", label:"Q2 2026", starts:"2026-04-01", ends:"2026-06-30", status:"active",   kpis:42, employees:38, avgScore:81.4, topPerformer:"Karim Salah · 93",  flagged:5 },
    { id:"q1-2026", label:"Q1 2026", starts:"2026-01-01", ends:"2026-03-31", status:"closed",   kpis:39, employees:35, avgScore:78.2, topPerformer:"Ananya Sharma · 91",flagged:4 },
    { id:"q4-2025", label:"Q4 2025", starts:"2025-10-01", ends:"2025-12-31", status:"closed",   kpis:36, employees:33, avgScore:76.8, topPerformer:"Yan Zhang · 89",   flagged:6 },
    { id:"q3-2025", label:"Q3 2025", starts:"2025-07-01", ends:"2025-09-30", status:"closed",   kpis:32, employees:30, avgScore:74.5, topPerformer:"Karim Salah · 88",  flagged:5 },
    { id:"q2-2025", label:"Q2 2025", starts:"2025-04-01", ends:"2025-06-30", status:"closed",   kpis:30, employees:28, avgScore:73.1, topPerformer:"Ananya Sharma · 87",flagged:7 },
    { id:"q1-2025", label:"Q1 2025", starts:"2025-01-01", ends:"2025-03-31", status:"closed",   kpis:28, employees:26, avgScore:71.8, topPerformer:"Lina Haddad · 86",  flagged:6 },
    { id:"q4-2024", label:"Q4 2024", starts:"2024-10-01", ends:"2024-12-31", status:"closed",   kpis:25, employees:24, avgScore:70.2, topPerformer:"Karim Salah · 84",  flagged:8 },
    { id:"q3-2026", label:"Q3 2026", starts:"2026-07-01", ends:"2026-09-30", status:"upcoming", kpis:0,  employees:0,  avgScore:null, topPerformer:"—",                 flagged:0 },
  ];

  // Weighting config (drives the composite KPI score)
  const WEIGHTS = [
    { key:"cycle_progress",  label:"Cycle progress (KPI completion %)",   weight:40 },
    { key:"project_ratings", label:"Project ratings · PM→TL→HR cascade",   weight:30 },
    { key:"peer_tl_ratings", label:"Peer & Team Lead ratings",              weight:20 },
    { key:"badges_earned",   label:"Badges earned (points)",                weight:10 },
  ];

  const KPI_TEMPLATES = [
    { id:"t-cert",    label:"Achieve [cert name] certification",                category:"Learning",       defaultWeight:20, usedIn:6, owner:"HR",                  example:"AWS Solutions Architect Associate by 30 Jun" },
    { id:"t-perf",    label:"Reduce [metric] by [X]%",                          category:"Performance",    defaultWeight:30, usedIn:4, owner:"HR",                  example:"Reduce p95 latency on Service-X by 25%" },
    { id:"t-deliv",   label:"Deliver [milestone] by [date]",                    category:"Delivery",       defaultWeight:30, usedIn:8, owner:"HR",                  example:"Migrate 3 customer workloads to AWS by Q2 end" },
    { id:"t-mentor",  label:"Mentor [N] junior engineers through [milestone]",  category:"Leadership",     defaultWeight:15, usedIn:3, owner:"HR",                  example:"Mentor 3 junior PMs through their first cycle" },
    { id:"t-bd",      label:"Contribute [N] hours to BD / pre-sales support",   category:"Business Dev",   defaultWeight:10, usedIn:2, owner:"HR",                  example:"Contribute 40 hours of pre-sales support" },
    { id:"t-arch",    label:"Architecture review for [N] client projects",      category:"Delivery",       defaultWeight:35, usedIn:2, owner:"Khalid Mansour (TL)", example:"Architecture review for 4 client projects" },
    { id:"t-content", label:"Produce [N] knowledge-base articles / blog posts", category:"Leadership",     defaultWeight:10, usedIn:1, owner:"HR",                  example:"Write 2 internal architecture posts per quarter" },
    { id:"t-rev",     label:"Migrate [N] modules to [framework/tool]",          category:"Delivery",       defaultWeight:25, usedIn:1, owner:"Sara Mitchell (TL)",  example:"Refactor 5 legacy modules to Terraform" },
    { id:"t-nps",     label:"Lift client engagement NPS by [N] points",         category:"Performance",    defaultWeight:25, usedIn:2, owner:"HR",                  example:"Lift Bank-of-Sky NPS by 10 points" },
    { id:"t-sla",     label:"Resolve [N] tickets per cycle, ≤[X]h SLA",         category:"Delivery",       defaultWeight:30, usedIn:3, owner:"HR",                  example:"Resolve 30 tickets per cycle, ≤24h SLA" },
  ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">KPI Management</h2>
        <div class="page-header__sub">The control surface · cycles, weighting, templates, performance tracking, AI insights</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export full report</button>
        <button class="btn btn--primary btn--sm">${ICONS.plus} Start new cycle</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:18px;background:linear-gradient(120deg,#FFF8E1,#FFECB3);border-color:#F5C977">
      ${ICONS.star}
      <div><strong>KPI is critical:</strong> composite score blends cycle progress, project ratings (PM→TL→HR), peer & TL ratings, and badges. Every weighting and rule is HR-configurable. AI generates insights from the resulting data.</div>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div style="font-size:11px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px">Tabs (drag to reorder)</div>
      <button class="btn btn--ghost btn--sm" data-action="customize-kpi-tabs" title="Reorder KPI Management tabs">⚙ Reorder tabs</button>
    </div>
    <div class="tabs" style="margin-bottom:16px">
      ${(function(){
        const pendAck = SUDO_DB.kpiAssignments.filter(a => a.status === "pending_validation" && a.approvalDirection === "tl_to_hr").length;
        const pendValid = SUDO_DB.kpiAssignments.filter(a => a.status === "progress_pending_validation" && (SUDO_DB_HELPERS.templateByKrn(a.templateKrn)||{}).validatorRole === "hr").length;
        const aqCount = pendAck + pendValid;
        const arCount = (function(){
          const reds = SUDO_DB.kpiAssignments.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "red");
          const empSet = new Set(reds.map(r => r.empId));
          return empSet.size;
        })();

        // Tab definitions — IDs match data-tab and data-tabpane attributes.
        // Order is overridable via SUDO_LAYOUT("hr-kpi-tabs").
        window.HR_KPI_TABS = [
          { id: "active-cycle",  label: `Active Cycle · Q2 2026` },
          { id: "approval-queue",label: `Approval Queue ${aqCount > 0 ? `<span class="tab__count">${aqCount}</span>` : ''}` },
          { id: "assign-kpi",    label: "Assign KPI" },
          { id: "at-risk",       label: `At-Risk Tracker ${arCount > 0 ? `<span class="tab__count" style="background:#FCA5A5;color:#7F1D1D">${arCount}</span>` : ''}` },
          { id: "dept-reports",  label: "Department Reports" },
          { id: "all-cycles",    label: `All Cycles <span class="tab__count">${CYCLES.length}</span>` },
          { id: "performance",   label: "Performance Tracking" },
          { id: "weighting",     label: "Weighting & Rules" },
          { id: "templates",     label: "KPI Templates" },
          { id: "ai-insights",   label: "AI Insights ✨" },
        ];
        const defaultOrder = window.HR_KPI_TABS.map(t => t.id);
        const prefs = (window.SUDO_LAYOUT)
          ? SUDO_LAYOUT.getPrefs("hr-kpi-tabs", defaultOrder)
          : { order: defaultOrder, hidden: [] };
        const tabMap = {};
        window.HR_KPI_TABS.forEach(t => { tabMap[t.id] = t; });
        const visibleOrder = prefs.order.filter(id => !prefs.hidden.includes(id));
        return visibleOrder.map((id, i) => {
          const t = tabMap[id];
          if (!t) return '';
          return `<button class="tab ${i === 0 ? 'tab--active' : ''}" data-tab="${t.id}">${t.label}</button>`;
        }).join("");
      })()}
    </div>

    <!-- ACTIVE CYCLE TAB -->
    <div class="tabpane tabpane--active" data-tabpane="active-cycle">
      <div class="cards" style="margin-bottom:16px">
        <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--bright">${ICONS.chart}</div></div><div class="card__title">Active KPIs</div><div class="card__value">42</div><div class="card__meta">across 38 employees</div></div>
        <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check || ICONS["check-circle"]}</div></div><div class="card__title">Cycle avg score</div><div class="card__value">81.4</div><div class="card__meta">+3.2 vs Q1</div></div>
        <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--warn">${ICONS.alert}</div></div><div class="card__title">At risk</div><div class="card__value">5</div><div class="card__meta">KPIs flagged for review</div></div>
        <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--muted">${ICONS.calendar}</div></div><div class="card__title">Days remaining</div><div class="card__value">47</div><div class="card__meta">cycle ends 30 Jun</div></div>
      </div>

      <div id="fb-hr-kpis"></div>

      <div class="table-wrap" id="hr-kpis-results">
        <table class="table">
          <thead><tr><th>Employee</th><th>KPI</th><th>Category</th><th>Weight</th><th>Progress</th><th>Status</th><th>Composite</th><th></th></tr></thead>
          <tbody>
            <tr class="row-clickable" data-tag="all active on-track q2-2026 performance cloud-engineering" data-search="ananya sharma reduce p95 latency service-x performance"><td>Ananya Sharma</td><td>Reduce p95 latency on Service-X by 25%</td><td>Performance</td><td>30%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:85%"></div></div><div class="progress-mini__text">85%</div></div></td><td><span class="status status--info">On track</span></td><td><strong>91</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active on-track q2-2026 delivery cloud-engineering" data-search="daniyal habib migrate aws workloads delivery"><td>Daniyal Habib</td><td>Migrate 3 customer workloads to AWS</td><td>Delivery</td><td>40%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:60%"></div></div><div class="progress-mini__text">60%</div></div></td><td><span class="status status--info">On track</span></td><td><strong>84</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active at-risk q2-2026 learning cloud-engineering" data-search="reem al otaibi achieve aws sa associate certification learning"><td>Reem Al Otaibi</td><td>Achieve AWS SA Associate certification</td><td>Learning</td><td>20%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:40%;background:var(--warn)"></div></div><div class="progress-mini__text">40%</div></div></td><td><span class="status status--warn">At risk</span></td><td><strong>—</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all achieved q2-2026 leadership cloud-engineering" data-search="lina haddad knowledge-shares leadership"><td>Lina Haddad</td><td>Lead 2 internal knowledge-shares</td><td>Leadership</td><td>20%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:100%;background:var(--ok)"></div></div><div class="progress-mini__text">100%</div></div></td><td><span class="status status--ok">Achieved</span></td><td><strong>88</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active on-track q2-2026 delivery cloud-engineering" data-search="marcus wright devops maturity assessment delivery"><td>Marcus Wright</td><td>Complete DevOps maturity assessment</td><td>Delivery</td><td>30%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:50%"></div></div><div class="progress-mini__text">50%</div></div></td><td><span class="status status--info">On track</span></td><td><strong>78</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active on-track q2-2026 delivery cloud-engineering" data-search="karim salah architecture review client projects delivery"><td>Karim Salah</td><td>Architecture review for 4 client projects</td><td>Delivery</td><td>35%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:75%"></div></div><div class="progress-mini__text">75%</div></div></td><td><span class="status status--info">On track</span></td><td><strong>93</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active on-track q2-2026 delivery cloud-engineering" data-search="yan zhang refactor legacy modules terraform delivery"><td>Yan Zhang</td><td>Refactor legacy modules to Terraform</td><td>Delivery</td><td>30%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:80%"></div></div><div class="progress-mini__text">80%</div></div></td><td><span class="status status--info">On track</span></td><td><strong>86</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active on-track q2-2026 performance advisory" data-search="omar siddiqui client engagement nps advisory performance"><td>Omar Siddiqui</td><td>Lift client engagement NPS by 10 points</td><td>Performance</td><td>25%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:70%"></div></div><div class="progress-mini__text">70%</div></div></td><td><span class="status status--info">On track</span></td><td><strong>82</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all achieved q2-2026 learning advisory" data-search="adeel mahmood aws partner accreditation advisory learning"><td>Adeel Mahmood</td><td>Earn AWS Partner Accreditation</td><td>Learning</td><td>15%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:100%;background:var(--ok)"></div></div><div class="progress-mini__text">100%</div></div></td><td><span class="status status--ok">Achieved</span></td><td><strong>90</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active at-risk q2-2026 delivery cloud-engineering" data-search="hassan bukhari close 5 tickets cloud-engineering delivery"><td>Hassan Bukhari</td><td>Resolve 30 tickets per cycle, ≤24h SLA</td><td>Delivery</td><td>35%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:45%;background:var(--warn)"></div></div><div class="progress-mini__text">45%</div></div></td><td><span class="status status--warn">At risk</span></td><td><strong>68</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active on-track q2-2026 leadership delivery" data-search="fatima al zaabi mentor pms delivery leadership"><td>Fatima Al Zaabi</td><td>Mentor 3 junior PMs through their first cycle</td><td>Leadership</td><td>25%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:67%"></div></div><div class="progress-mini__text">67%</div></div></td><td><span class="status status--info">On track</span></td><td><strong>85</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
            <tr class="row-clickable" data-tag="all active on-track q2-2026 bd pre-sales" data-search="anand kapoor pre-sales support hours bd pre-sales"><td>Anand Kapoor</td><td>Contribute 40 hours of pre-sales support</td><td>BD</td><td>20%</td><td><div class="progress-mini"><div class="progress-mini__bar"><div class="progress-mini__fill" style="width:60%"></div></div><div class="progress-mini__text">60%</div></div></td><td><span class="status status--info">On track</span></td><td><strong>80</strong>/100</td><td><button class="btn btn--ghost btn--sm">${ICONS.arrowRight || "→"}</button></td></tr>
          </tbody>
        </table>
        <div class="fb-empty" style="display:none">
          <div style="text-align:center;padding:30px;color:var(--ink-500)">No KPIs match these filters</div>
        </div>
      </div>
      <div id="pg-hr-kpis"></div>
    </div>

    <!-- ALL CYCLES TAB -->
    <div class="tabpane" data-tabpane="all-cycles">
      <div class="cards" style="margin-bottom:14px">
        <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--bright">${ICONS.calendar}</div></div><div class="card__title">Total cycles</div><div class="card__value">${CYCLES.length}</div><div class="card__meta">${CYCLES.filter(c=>c.status==='closed').length} closed · ${CYCLES.filter(c=>c.status==='active').length} active · ${CYCLES.filter(c=>c.status==='upcoming').length} upcoming</div></div>
        <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--ok">${ICONS.chart}</div></div><div class="card__title">Trailing avg score</div><div class="card__value">${(CYCLES.filter(c=>c.avgScore!==null).reduce((s,c)=>s+c.avgScore,0)/CYCLES.filter(c=>c.avgScore!==null).length).toFixed(1)}</div><div class="card__meta">across closed cycles</div></div>
        <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--info">${ICONS.users || ICONS.user}</div></div><div class="card__title">Latest cycle population</div><div class="card__value">${CYCLES[0].employees}</div><div class="card__meta">${CYCLES[0].kpis} KPIs tracked</div></div>
        <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--warn">${ICONS.alert}</div></div><div class="card__title">Latest cycle flags</div><div class="card__value">${CYCLES[0].flagged}</div><div class="card__meta">KPIs flagged for HR review</div></div>
      </div>

      <div id="fb-hr-cycles"></div>

      <div class="table-wrap" id="hr-cycles-results">
        <table class="table">
          <thead><tr><th>Cycle</th><th>Period</th><th>KPIs</th><th>Employees</th><th>Avg score</th><th>Top performer</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${CYCLES.map(c => {
              const tags = ["all", c.status];
              const yearTag = (c.starts || "").slice(0, 4);
              if (yearTag) tags.push(yearTag);
              const searchText = `${c.label} ${c.starts} ${c.ends} ${c.status} ${c.topPerformer || ""}`.toLowerCase();
              return `
                <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
                  <td><strong>${c.label}</strong></td>
                  <td class="table__mono">${c.starts} → ${c.ends}</td>
                  <td>${c.kpis || '—'}</td>
                  <td>${c.employees || '—'}</td>
                  <td>${c.avgScore !== null ? `<strong>${c.avgScore}</strong>` : '—'}</td>
                  <td style="font-size:12px;color:var(--ink-700)">${c.topPerformer || '—'}</td>
                  <td><span class="status status--${c.status==='active'?'ok':c.status==='upcoming'?'info':'muted'}">${c.status}</span></td>
                  <td>
                    ${c.status === 'closed'   ? '<button class="btn btn--ghost btn--sm" data-action="kpi-view-cycle" data-cycle="' + c.id + '">View report</button>' : ''}
                    ${c.status === 'active'   ? '<button class="btn btn--secondary btn--sm" data-action="kpi-close-cycle" data-cycle="' + c.id + '">Close cycle</button>' : ''}
                    ${c.status === 'upcoming' ? '<button class="btn btn--primary btn--sm" data-action="kpi-start-cycle" data-cycle="' + c.id + '">Start cycle</button>' : ''}
                  </td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
        <div class="fb-empty" style="display:none">
          <div style="text-align:center;padding:30px;color:var(--ink-500)">No cycles match these filters</div>
        </div>
      </div>
      <div id="pg-hr-cycles"></div>
    </div>

    <!-- PERFORMANCE TRACKING TAB -->
    <div class="tabpane" data-tabpane="performance">
      <div class="info-banner" style="margin-bottom:14px">${ICONS.chart}<div>Per-person and per-team trend analysis. Click any row to see the full performance history.</div></div>
      <div class="view-bar">
        <div class="view-switch">
          <button class="view-switch__btn view-switch__btn--active">Per person</button>
          <button class="view-switch__btn">Per team</button>
          <button class="view-switch__btn">Per department</button>
        </div>
        <div class="view-filters">
          <select class="select select--sm"><option>Q2 2026</option><option>All cycles</option><option>Trailing 12 months</option></select>
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Employee</th><th>Current cycle</th><th>Last cycle</th><th>Trend</th><th>Project ratings</th><th>Badges</th><th>Composite</th></tr></thead>
          <tbody>
            <tr class="row-clickable"><td>Karim Salah</td><td>93</td><td>91</td><td>↑ +2</td><td>★ 4.9</td><td>12</td><td><strong>93</strong>/100</td></tr>
            <tr class="row-clickable"><td>Ananya Sharma</td><td>91</td><td>89</td><td>↑ +2</td><td>★ 4.8</td><td>9</td><td><strong>91</strong>/100</td></tr>
            <tr class="row-clickable"><td>Lina Haddad</td><td>88</td><td>87</td><td>↑ +1</td><td>★ 4.6</td><td>7</td><td><strong>88</strong>/100</td></tr>
            <tr class="row-clickable"><td>Yan Zhang</td><td>86</td><td>85</td><td>↑ +1</td><td>★ 4.7</td><td>8</td><td><strong>86</strong>/100</td></tr>
            <tr class="row-clickable"><td>Daniyal Habib</td><td>84</td><td>81</td><td>↑ +3</td><td>★ 4.4</td><td>5</td><td><strong>84</strong>/100</td></tr>
            <tr class="row-clickable"><td>Priya Iyer</td><td>82</td><td>80</td><td>↑ +2</td><td>★ 4.5</td><td>4</td><td><strong>82</strong>/100</td></tr>
            <tr class="row-clickable"><td>Sami Berkani</td><td>80</td><td>79</td><td>↑ +1</td><td>★ 4.3</td><td>3</td><td><strong>80</strong>/100</td></tr>
            <tr class="row-clickable"><td>Marcus Wright</td><td>78</td><td>—</td><td>—</td><td>★ 4.2</td><td>3</td><td><strong>78</strong>/100</td></tr>
            <tr class="row-clickable"><td>Hamza Al Mahmoud</td><td>75</td><td>72</td><td>↑ +3</td><td>★ 4.1</td><td>2</td><td><strong>75</strong>/100</td></tr>
            <tr class="row-clickable"><td>Tomás Rivera</td><td>65</td><td>—</td><td>—</td><td>★ 3.4</td><td>0</td><td><strong style="color:var(--warn)">65</strong>/100</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- WEIGHTING & RULES TAB -->
    <div class="tabpane" data-tabpane="weighting">
      <div class="info-banner" style="margin-bottom:16px">${ICONS.cog || ICONS.lock}<div>Composite KPI score is a weighted blend. Weights must sum to 100%. Changes take effect at the start of the next cycle.</div></div>

      <div class="panel" style="margin-bottom:16px">
        <header class="panel__head"><div><h3 class="panel__title">Score weighting</h3><p class="panel__sub">Drag sliders to rebalance. Save applies at next cycle start.</p></div></header>
        <div class="panel__body">
          ${WEIGHTS.map(w => `
            <div class="weight-row" data-weight-key="${w.key}">
              <div class="weight-row__label">${w.label}</div>
              <div class="weight-row__input">
                <input type="range" min="0" max="100" value="${w.weight}" data-weight-slider="${w.key}" />
                <div class="weight-row__pct"><strong data-weight-pct="${w.key}">${w.weight}</strong>%</div>
              </div>
            </div>
          `).join("")}
          <div class="weight-row weight-row--total">
            <div class="weight-row__label"><strong>Total</strong></div>
            <div class="weight-row__pct"><strong id="weights-total">100</strong>%</div>
          </div>
          <div style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end">
            <button class="btn btn--secondary btn--sm" data-action="kpi-weights-reset">Reset to defaults</button>
            <button class="btn btn--primary btn--sm" data-action="kpi-weights-save">${ICONS.check} Save weighting</button>
          </div>
        </div>
      </div>

      <div class="panel">
        <header class="panel__head"><div><h3 class="panel__title">Decision rules</h3><p class="panel__sub">Automated thresholds and HR alerts</p></div></header>
        <div class="panel__body">
          <div class="rule-row"><span class="rule-row__when">When composite ≥</span><input class="input input--sm" type="number" value="85" style="width:80px"><span class="rule-row__then">→ flag as <strong>Top performer</strong></span></div>
          <div class="rule-row"><span class="rule-row__when">When composite &lt;</span><input class="input input--sm" type="number" value="70" style="width:80px"><span class="rule-row__then">→ flag <strong>for HR review</strong></span></div>
          <div class="rule-row"><span class="rule-row__when">When KPI progress &lt;</span><input class="input input--sm" type="number" value="50" style="width:80px"><span class="rule-row__then">% with &lt;30 days left → mark <strong>At risk</strong></span></div>
          <div class="rule-row"><span class="rule-row__when">When cycle ends → auto-close KPIs and email PM + TL</span></div>
          <div class="rule-row"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Send weekly digest to TLs and PMs</label></div>
          <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
            <button class="btn btn--primary btn--sm" data-action="kpi-rules-save">${ICONS.check} Save rules</button>
          </div>
        </div>
      </div>
    </div>

    <!-- TEMPLATES TAB -->
    <div class="tabpane" data-tabpane="templates">
      <div class="info-banner" style="margin-bottom:14px">${ICONS.menu}<div>Reusable KPI templates speed up cycle setup. HR and TLs can apply them to multiple employees with one click. <strong>${KPI_TEMPLATES.length} templates</strong> currently configured · used in ${KPI_TEMPLATES.reduce((s,t)=>s+t.usedIn,0)} active KPIs.</div></div>

      <div id="fb-hr-kpi-templates"></div>

      <div class="table-wrap" id="hr-kpi-templates-results">
        <table class="table">
          <thead><tr><th>Template</th><th>Category</th><th>Default weight</th><th>Example wording</th><th>Used in</th><th>Owner</th><th></th></tr></thead>
          <tbody>
            ${KPI_TEMPLATES.map(t => {
              const catSlug = t.category.toLowerCase().replace(/[^\w]+/g, "-");
              const tags = ["all", catSlug];
              if (t.owner.startsWith("HR")) tags.push("owner-hr");
              else                          tags.push("owner-tl");
              const searchText = `${t.label} ${t.category} ${t.example} ${t.owner}`.toLowerCase();
              return `
                <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
                  <td><strong>${t.label}</strong></td>
                  <td><span class="status status--info">${t.category}</span></td>
                  <td><strong>${t.defaultWeight}%</strong></td>
                  <td style="font-size:12px;color:var(--ink-700);max-width:280px;font-style:italic">"${t.example}"</td>
                  <td>${t.usedIn} KPI${t.usedIn === 1 ? "" : "s"}</td>
                  <td style="font-size:12px;color:var(--ink-700)">${t.owner}</td>
                  <td>
                    <button class="btn btn--secondary btn--sm" data-action="kpi-template-clone" data-template="${t.id}">${ICONS.copy || ""} Clone</button>
                    <button class="btn btn--ghost btn--sm" data-action="kpi-template-edit" data-template="${t.id}">${ICONS.pen || ICONS.edit} Edit</button>
                  </td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
        <div class="fb-empty" style="display:none">
          <div style="text-align:center;padding:30px;color:var(--ink-500)">No templates match these filters</div>
        </div>
      </div>
      <div id="pg-hr-kpi-templates"></div>

      <div class="page-actions" style="margin-top:14px;justify-content:flex-end">
        <button class="btn btn--primary" data-action="kpi-template-create">${ICONS.plus} Create template</button>
      </div>
    </div>

    <!-- APPROVAL QUEUE TAB -->
    <div class="tabpane" data-tabpane="approval-queue">
      ${(function(){
        const allAssigns = SUDO_DB.kpiAssignments;
        const pendingHrAck = allAssigns.filter(a => a.status === "pending_validation" && a.approvalDirection === "tl_to_hr");
        const pendingHrValidation = allAssigns.filter(a => a.status === "progress_pending_validation" && (SUDO_DB_HELPERS.templateByKrn(a.templateKrn)||{}).validatorRole === "hr");
        const queueCount = pendingHrAck.length + pendingHrValidation.length;
        return `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.send}
            <div><strong>${queueCount} item${queueCount===1?'':'s'} awaiting HR action.</strong> ${pendingHrAck.length} new KPIs to acknowledge · ${pendingHrValidation.length} progress updates to validate (training/cert KPIs).</div>
          </div>

          ${pendingHrAck.length > 0 ? `
            <h4 style="font-size:13px;margin:18px 0 10px;color:var(--ink-700)">TL-drafted KPIs awaiting HR acknowledgement (${pendingHrAck.length})</h4>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>ID</th><th>KPI</th><th>Assigned to</th><th>Drafted by</th><th>When</th><th>Action</th></tr></thead>
                <tbody>
                  ${pendingHrAck.map(a => {
                    const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
                    const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
                    const drafter = SUDO_DB_HELPERS.findEmployee(a.draftedBy);
                    return `
                      <tr>
                        <td class="table__mono" style="font-size:11px">${a.id}</td>
                        <td><strong>${tpl ? tpl.krn : a.templateKrn}</strong> · ${tpl ? tpl.label : '—'}<div class="table__sub" style="font-size:11px">Target: ${tpl ? tpl.target : '—'}</div></td>
                        <td>${emp ? emp.name : a.empId} <span class="table__sub" style="font-size:11px">(${a.scopeLabel})</span></td>
                        <td>${drafter ? drafter.name : a.draftedBy}</td>
                        <td class="table__mono" style="font-size:11px">${a.draftedAt}</td>
                        <td><button class="btn btn--primary btn--sm" data-action="hr-approve-assignment" data-id="${a.id}">${ICONS.check} Acknowledge</button>
                            <button class="btn btn--ghost btn--sm" data-action="hr-reject-assignment" data-id="${a.id}">Reject</button></td>
                      </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${pendingHrValidation.length > 0 ? `
            <h4 style="font-size:13px;margin:22px 0 10px;color:var(--ink-700)">Progress updates needing HR validation (${pendingHrValidation.length})</h4>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>ID</th><th>KPI</th><th>Employee</th><th>Submitted value</th><th>Target</th><th>Action</th></tr></thead>
                <tbody>
                  ${pendingHrValidation.map(a => {
                    const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
                    const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
                    return `
                      <tr>
                        <td class="table__mono" style="font-size:11px">${a.id}</td>
                        <td><strong>${tpl ? tpl.krn : a.templateKrn}</strong> · ${tpl ? tpl.label : '—'}</td>
                        <td>${emp ? emp.name : a.empId}</td>
                        <td><strong>${a.empSubmittedValue}</strong></td>
                        <td>${tpl ? tpl.target : '—'}</td>
                        <td><button class="btn btn--primary btn--sm" data-action="hr-validate-progress" data-id="${a.id}" data-confirm="1">${ICONS.check} Confirm value</button>
                            <button class="btn btn--secondary btn--sm" data-action="hr-validate-progress" data-id="${a.id}" data-confirm="0">Revise</button></td>
                      </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${queueCount === 0 ? `
            <div style="padding:40px;text-align:center;color:var(--ink-500);background:var(--ink-50);border-radius:8px">
              <div style="font-size:34px;margin-bottom:8px">✓</div>
              <div style="font-size:14px;font-weight:600;color:var(--ink-700)">Approval queue is clear</div>
              <div style="font-size:12px;margin-top:4px">No pending acknowledgements or progress validations.</div>
            </div>
          ` : ''}
        `;
      })()}
    </div>

    <!-- ASSIGN KPI TAB (HR drafts → routes to TL for approval) -->
    <div class="tabpane" data-tabpane="assign-kpi">
      <div class="info-banner" style="margin-bottom:14px">${ICONS.send}
        <div><strong>HR-drafted KPIs</strong> route to the relevant Team Lead for approval, then activate on the employee's portal. Use this for company-wide compliance KPIs (certifications, mandatory training) or to escalate specific KPIs to a team.</div>
      </div>

      <article class="panel" style="max-width:920px">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Draft new KPI assignment</h3>
            <p class="panel__sub">All fields required unless marked optional</p>
          </div>
        </header>
        <div class="panel__body">
          <div class="form-grid">
            <div class="field">
              <label class="field__label">1. Pick a team</label>
              <select class="select" id="hr-assign-team">
                <option value="">— select team —</option>
                ${(SUDO_DB.teams || []).map(t => `<option value="${t.id}">${t.short} · ${t.name}</option>`).join("")}
              </select>
            </div>

            <div class="field">
              <label class="field__label">2. Pick a KPI template</label>
              <select class="select" id="hr-assign-template" disabled>
                <option value="">— pick a team first —</option>
              </select>
              <div style="font-size:11px;color:var(--ink-500);margin-top:4px" id="hr-assign-template-hint"></div>
            </div>

            <div class="field">
              <label class="field__label">3. Assignment scope</label>
              <select class="select" id="hr-assign-scope">
                <option value="team">Whole team</option>
                <option value="individual">Individual employee</option>
              </select>
            </div>

            <div class="field" id="hr-assign-emp-field" style="display:none">
              <label class="field__label">Employee</label>
              <select class="select" id="hr-assign-emp"></select>
            </div>

            <div class="field">
              <label class="field__label">4. Cycle</label>
              <select class="select" id="hr-assign-cycle">
                <option value="q2-2026">Q2 2026 · current</option>
                <option value="q3-2026">Q3 2026 · upcoming</option>
                <option value="q4-2026">Q4 2026 · upcoming</option>
              </select>
            </div>

            <div class="field">
              <label class="field__label">5. Weight (% of composite)</label>
              <input class="input" id="hr-assign-weight" type="number" min="1" max="50" value="5">
              <div style="font-size:11px;color:var(--ink-500);margin-top:4px">Auto-fills from template default on select</div>
            </div>

            <div class="field field--full">
              <label class="field__label">6. HR note (visible to TL and Employee)</label>
              <textarea class="textarea" id="hr-assign-note" rows="2" placeholder="e.g. 'Compliance KPI — mandatory for all engineers in Q2'"></textarea>
            </div>
          </div>

          <div id="hr-assign-preview" style="margin-top:16px;padding:14px;background:var(--ink-50);border-radius:8px;border:1px dashed var(--ink-200);display:none">
            <div style="font-size:11px;color:var(--ink-500);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px">Preview</div>
            <div id="hr-assign-preview-content"></div>
          </div>

          <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
            <button class="btn btn--secondary" id="hr-assign-cancel">Reset</button>
            <button class="btn btn--primary" id="hr-assign-submit">${ICONS.send} Submit · routes to Team Lead</button>
          </div>
        </div>
      </article>

      <article class="panel" style="margin-top:18px;background:linear-gradient(120deg,#FEF3C7,#FDE68A);border-color:#F59E0B">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">⚡ Bulk Apply Team Scorecard</h3>
            <p class="panel__sub">Apply a team's full KPI catalogue (all templates at once) to a single employee or all team members. Saves drafting 25 KPIs one-by-one.</p>
          </div>
        </header>
        <div class="panel__body">
          <div class="form-grid">
            <div class="field">
              <label class="field__label">Source team</label>
              <select class="select" id="hr-bulk-team">
                <option value="">— select team —</option>
                ${(SUDO_DB.teams || []).map(t => `<option value="${t.id}">${t.short} · ${t.name}</option>`).join("")}
              </select>
              <div style="font-size:11px;color:var(--ink-700);margin-top:4px" id="hr-bulk-team-info"></div>
            </div>
            <div class="field">
              <label class="field__label">Apply to</label>
              <select class="select" id="hr-bulk-scope">
                <option value="team">All team members</option>
                <option value="individual">One specific employee</option>
              </select>
            </div>
            <div class="field" id="hr-bulk-emp-field" style="display:none">
              <label class="field__label">Employee</label>
              <select class="select" id="hr-bulk-emp"></select>
            </div>
            <div class="field">
              <label class="field__label">Cycle</label>
              <select class="select" id="hr-bulk-cycle">
                <option value="q2-2026">Q2 2026 · current</option>
                <option value="q3-2026">Q3 2026 · upcoming</option>
              </select>
            </div>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
            <button class="btn btn--primary" id="hr-bulk-apply">${ICONS.send} Apply full scorecard</button>
          </div>
        </div>
      </article>

      <article class="panel" style="margin-top:18px">
        <header class="panel__head">
          <div>
            <h3 class="panel__title">Recent HR-drafted assignments</h3>
            <p class="panel__sub">Where they are in the pipeline</p>
          </div>
        </header>
        <div class="panel__body" style="padding:0">
          ${(function(){
            const hrDrafts = SUDO_DB.kpiAssignments.filter(a => a.approvalDirection === "hr_to_tl");
            if (hrDrafts.length === 0) {
              return `<div style="padding:24px;text-align:center;color:var(--ink-500);font-size:12.5px">No HR-drafted KPIs yet. Use the form above.</div>`;
            }
            return `
              <table class="table">
                <thead><tr><th>ID</th><th>KPI</th><th>Employee</th><th>Cycle</th><th>Status</th></tr></thead>
                <tbody>
                  ${hrDrafts.slice(0, 10).map(a => {
                    const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
                    const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
                    const statusPill = ({
                      "pending_validation":         '<span class="status status--warn">Pending TL approval</span>',
                      "active":                     '<span class="status status--ok">Active</span>',
                      "progress_pending_validation":'<span class="status status--info">Progress submitted</span>',
                      "draft":                      '<span class="status status--muted">Draft (sent back)</span>',
                    })[a.status] || `<span class="status status--muted">${a.status}</span>`;
                    return `
                      <tr>
                        <td class="table__mono" style="font-size:11px">${a.id}</td>
                        <td><strong>${tpl ? tpl.krn : a.templateKrn}</strong> · ${tpl ? tpl.label : '—'}</td>
                        <td>${emp ? emp.name : a.empId}</td>
                        <td class="table__mono">${a.cycleId}</td>
                        <td>${statusPill}</td>
                      </tr>`;
                  }).join("")}
                </tbody>
              </table>`;
          })()}
        </div>
      </article>
    </div>

    <!-- AT-RISK TRACKER TAB -->
    <div class="tabpane" data-tabpane="at-risk">
      ${(function(){
        const reds = SUDO_DB.kpiAssignments.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "red");
        // Group by employee
        const byEmp = {};
        reds.forEach(a => { (byEmp[a.empId] = byEmp[a.empId] || []).push(a); });
        const empIds = Object.keys(byEmp);
        return `
          <div class="info-banner" style="margin-bottom:14px;background:#FEF2F2;border-color:#FCA5A5">${ICONS.alert || ''}
            <div><strong style="color:#B91C1C">${empIds.length} employee${empIds.length===1?'':'s'} flagged at risk</strong> · ${reds.length} RED KPIs across teams. Reach out to their Team Lead and consider 1:1 intervention.</div>
          </div>

          <article class="panel" style="margin-bottom:14px">
            <header class="panel__head">
              <div>
                <h3 class="panel__title">RED KPIs by team</h3>
                <p class="panel__sub">Where the at-risk concentration lives</p>
              </div>
            </header>
            <div class="panel__body" id="hr-atrisk-chart"></div>
          </article>

          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Employee</th><th>Team</th><th>RED KPIs</th><th>Composite</th><th>Last KPI activity</th><th>Action</th></tr></thead>
              <tbody>
                ${empIds.map(eid => {
                  const emp = SUDO_DB_HELPERS.findEmployee(eid);
                  if (!emp) return '';
                  const team = SUDO_DB_HELPERS.findTeam(emp.teamId);
                  const reds = byEmp[eid];
                  const composite = SUDO_DB_HELPERS.compositeScore(eid, "q2-2026");
                  const lastActivity = reds.map(r => r.empSubmittedAt || r.validatedAt || r.draftedAt).filter(Boolean).sort().pop();
                  return `
                    <tr>
                      <td><strong>${emp.name}</strong><div class="table__sub" style="font-size:11px">${emp.title}</div></td>
                      <td>${team ? team.name : '—'}</td>
                      <td><span class="status status--danger">${reds.length}</span> · ${reds.map(r => (SUDO_DB_HELPERS.templateByKrn(r.templateKrn)||{}).krn).filter(Boolean).join(', ')}</td>
                      <td>${composite !== null ? `<strong>${composite.toFixed(0)}%</strong>` : '—'}</td>
                      <td class="table__mono" style="font-size:11px">${lastActivity || '—'}</td>
                      <td>
                        <button class="btn btn--primary btn--sm" data-action="hr-nudge-employee" data-emp-id="${emp.id}">${ICONS.send} Send nudge</button>
                        <button class="btn btn--ghost btn--sm" data-action="hr-open-emp" data-emp-id="${emp.id}">View profile</button>
                      </td>
                    </tr>`;
                }).join('')}
                ${empIds.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--ink-500)">No at-risk employees · all KPIs on target.</td></tr>` : ''}
              </tbody>
            </table>
          </div>
        `;
      })()}
    </div>

    <!-- DEPARTMENT REPORTS TAB -->
    <div class="tabpane" data-tabpane="dept-reports">
      ${(function(){
        const teams = SUDO_DB.teams || [];
        return `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.chart}
            <div>Per-team KPI rollup for Q2 2026. Use this for management reviews and Continuous Quality Improvement (CQI) decisions. Click any card to drill into the team's roster.</div>
          </div>

          <article class="panel" style="margin-bottom:14px">
            <header class="panel__head">
              <div>
                <h3 class="panel__title">Composite scores · ranked</h3>
                <p class="panel__sub">Higher is better · colour reflects health</p>
              </div>
            </header>
            <div class="panel__body" id="hr-dept-bar-chart"></div>
          </article>

          <div class="cards" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">
            ${teams.map(t => {
              const members = SUDO_DB.employees.filter(e => e.teamId === t.id);
              const assigns = SUDO_DB.kpiAssignments.filter(a => members.some(m => m.id === a.empId) && a.cycleId === "q2-2026");
              const reds = assigns.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "red");
              const greens = assigns.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "green");
              const pending = assigns.filter(a => a.status === "pending_validation" || a.status === "progress_pending_validation");
              // Average composite across team members who have a composite
              const composites = members.map(m => SUDO_DB_HELPERS.compositeScore(m.id, "q2-2026")).filter(c => c !== null);
              const avgComposite = composites.length > 0 ? (composites.reduce((s,v)=>s+v,0) / composites.length).toFixed(0) : "—";
              const healthColor = composites.length === 0 ? "muted" : avgComposite >= 95 ? "ok" : avgComposite >= 80 ? "warn" : "danger";
              return `
                <article class="card" data-action="hr-team-drill" data-team-id="${t.id}" style="cursor:pointer;border-top:4px solid ${t.color}">
                  <div class="card__head">
                    <div class="card__icon" style="background:${t.color}20;color:${t.color}">${ICONS[t.icon] || ICONS.briefcase}</div>
                    <span class="status status--${healthColor}">${avgComposite}${avgComposite!=='—'?'%':''}</span>
                  </div>
                  <div class="card__title">${t.short} · ${t.name}</div>
                  <div class="card__value" style="font-size:18px">${assigns.length} <span style="font-size:12px;color:var(--ink-500);font-weight:400">KPIs</span></div>
                  <div class="card__meta" style="font-size:11.5px;margin-top:8px;display:flex;gap:10px;flex-wrap:wrap">
                    <span style="color:var(--ok)">● ${greens.length} on target</span>
                    <span style="color:var(--danger)">● ${reds.length} below</span>
                    ${pending.length > 0 ? `<span style="color:var(--warn)">● ${pending.length} pending</span>` : ''}
                  </div>
                  <div style="margin-top:10px;font-size:11px;color:var(--ink-500)">${members.length} member${members.length===1?'':'s'} · Lead: ${(SUDO_DB_HELPERS.findEmployee(t.leadEmpId)||{}).name || '—'}</div>
                </article>
              `;
            }).join('')}
          </div>
        `;
      })()}
    </div>

    <!-- AI INSIGHTS TAB -->
    <div class="tabpane" data-tabpane="ai-insights">
      <div class="ai-panel" style="background:linear-gradient(135deg,#F0F9FF,#E0F2FE);border:1px solid #BAE6FD;border-radius:12px;padding:22px">
        <div style="margin-bottom:14px">
          <h3 style="font-size:16px;margin:0">AI-Generated Cycle Insights</h3>
          <p class="dim" style="margin-top:3px">Powered by Claude · Configured in Admin Portal · Last generated 2 days ago</p>
        </div>
        <div style="display:grid;gap:10px;margin-bottom:14px">
          <div style="background:white;border-left:4px solid #1F8A4C;padding:14px 16px;border-radius:0 8px 8px 0;font-size:13px;line-height:1.55">
            <strong>Top performer pattern:</strong> Karim, Ananya, and Yan have all consistently scored 85+ for three quarters. Recommend formal recognition or progression review at end of cycle.
          </div>
          <div style="background:white;border-left:4px solid #C77A00;padding:14px 16px;border-radius:0 8px 8px 0;font-size:13px;line-height:1.55">
            <strong>Support flag:</strong> Tomás Rivera scoring 65 with project rating 3.4 and zero badges · probation decision in 12 days. Recommend immediate 1:1 and pairing intervention.
          </div>
          <div style="background:white;border-left:4px solid #189CD9;padding:14px 16px;border-radius:0 8px 8px 0;font-size:13px;line-height:1.55">
            <strong>Cohort gap:</strong> 7 of 38 employees in this cycle lack AWS SA Associate certification. Aligns with Q3 client work demand — consider cohort training campaign.
          </div>
          <div style="background:white;border-left:4px solid #189CD9;padding:14px 16px;border-radius:0 8px 8px 0;font-size:13px;line-height:1.55">
            <strong>Recognition imbalance:</strong> Daniyal and Sami have above-average scores (84, 80) but only 5 and 3 badges. Consider encouraging more peer recognition in their teams.
          </div>
          <div style="background:white;border-left:4px solid #714B8C;padding:14px 16px;border-radius:0 8px 8px 0;font-size:13px;line-height:1.55">
            <strong>Trend:</strong> Average composite score up +3.2 from Q1 — primarily driven by training completion gains. KPI categorization has shifted: more "Learning" KPIs than last quarter.
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn--primary">${ICONS.send} Regenerate insights</button>
          <button class="btn btn--secondary">${ICONS.download} Export as PDF</button>
        </div>
      </div>
    </div>
  `;
}


// =========================================================
// PAGE: Notification Templates (HR — manage subject/body + audience routing)
// =========================================================
function pageNotificationTemplates() {
  const TEMPLATES = [
    { key:"onboarding.welcome",        category:"onboarding", label:"Welcome new hire",                    channels:["email","in_app"],         lastEdited:"2 weeks ago",  subject:"Welcome to SUDO Consultants, {{employee.first_name}}!",
      body: `Hi {{employee.first_name}},

Welcome to the SUDO Consultants team! We're delighted to have you join us as {{employee.title}} in the {{employee.dept}} team starting {{employee.start_date}}.

Your manager, {{manager.name}}, will reach out shortly to set up your first-week schedule. In the meantime, you can complete your portal onboarding here: {{portal_link}}.

If you have any questions before your first day, please reply to this email or reach out to People Operations.

Looking forward to meeting you,
SUDO People Operations` },

    { key:"training.assigned",         category:"training", label:"Training assigned — high priority",      channels:["email","in_app","slack"], lastEdited:"1 month ago",  subject:"Action needed: {{training.name}} due {{training.deadline}}",
      body: `Hi {{employee.first_name}},

You've been assigned a new training: {{training.name}}. Please complete it by {{training.deadline}}.

You can start now from your portal: {{training.link}}. The deadline countdown starts today — no acceptance needed.

Need help? Reply to this email or message {{hr_contact.name}}.

— SUDO People Operations` },

    { key:"training.deadline_3d",      category:"training", label:"Training deadline approaching (3 days)", channels:["email","slack"],          lastEdited:"3 months ago", subject:"⏰ Reminder: {{training.name}} due in 3 days",
      body: `Hi {{employee.first_name}},

Friendly reminder — your assigned training "{{training.name}}" is due on {{training.deadline}} (in 3 days).

Open your portal: {{training.link}}

— SUDO People Operations` },

    { key:"training.deadline_1d",      category:"training", label:"Training deadline tomorrow",             channels:["email","slack","in_app"], lastEdited:"3 months ago", subject:"⚠️ {{training.name}} is due tomorrow",
      body: `Hi {{employee.first_name}},

This is your final reminder: "{{training.name}}" is due tomorrow ({{training.deadline}}).

If you've already completed it, please upload your certificate now: {{training.link}}.

— SUDO People Operations` },

    { key:"leave.endorsed_by_pm",      category:"leave", label:"Leave endorsed by PM",                channels:["in_app"],                 lastEdited:"2 months ago", subject:"Your leave was endorsed by {{pm.name}} — now with HR",
      body: `Hi {{employee.first_name}},

Good news — your leave request {{leave.id}} ({{leave.from}} → {{leave.to}}, {{leave.days}} days) was endorsed by {{pm.name}} and is now with HR for final approval.

You'll receive a decision within 1 business day.

— SUDO People Operations` },

    { key:"leave.approved",            category:"leave", label:"Leave approved",                       channels:["email","in_app"],         lastEdited:"1 month ago",  subject:"✅ Leave approved: {{leave.from}} → {{leave.to}}",
      body: `Hi {{employee.first_name}},

Your leave request has been approved.

  • Type: {{leave.type}}
  • Dates: {{leave.from}} → {{leave.to}} ({{leave.days}} days)
  • Approved by: {{hr.name}}

Enjoy your time off. Your team is already informed.

— SUDO People Operations` },

    { key:"leave.denied",              category:"leave", label:"Leave decision · needs revision",         channels:["email","in_app"],         lastEdited:"2 months ago", subject:"Your leave request needs attention",
      body: `Hi {{employee.first_name}},

Your leave request {{leave.id}} for {{leave.from}} → {{leave.to}} could not be approved as submitted. Reason: {{hr.note}}.

Please open your portal to revise the dates or contact {{hr_contact.name}} to discuss alternatives: {{portal_link}}

— SUDO People Operations` },

    { key:"payslip.available",         category:"payroll", label:"Payslip available",                    channels:["email","in_app"],         lastEdited:"6 months ago", subject:"Your {{period}} payslip is available",
      body: `Hi {{employee.first_name}},

Your payslip for {{period}} is now available in your portal: {{payslip.link}}.

Salary deposit date: {{payslip.deposit_date}}.

If you spot any discrepancies, please reply to this email within 5 business days.

— SUDO Finance & Admin` },

    { key:"badge.granted",             category:"recognition", label:"Badge granted",                        channels:["email","in_app","slack"], lastEdited:"3 weeks ago",  subject:"🏆 You earned the {{badge.name}} badge!",
      body: `Hi {{employee.first_name}},

Congratulations — {{granter.name}} just granted you the "{{badge.name}}" badge.

> "{{granter.note}}"

This adds {{badge.points}} points to your recognition score. See your Recognition Wall: {{portal_link}}

Keep it up,
SUDO People Operations` },

    { key:"kpi.cycle_started",         category:"kpi", label:"KPI cycle opened",                    channels:["email","slack","teams"],  lastEdited:"1 month ago",  subject:"KPIs for {{cycle.label}} are now live",
      body: `Hi {{employee.first_name}},

The {{cycle.label}} KPI cycle is now open ({{cycle.starts}} → {{cycle.ends}}). Your draft KPIs are visible in your portal — please review with {{manager.name}} and acknowledge by {{cycle.acknowledge_by}}.

Open your portal: {{portal_link}}

— SUDO People Operations` },

    { key:"cert.auto_verified_credly", category:"training", label:"Certificate auto-verified",            channels:["email","slack","in_app"], lastEdited:"2 weeks ago",  subject:"🎉 {{cert.name}} verified automatically",
      body: `Hi {{employee.first_name}},

Your certificate "{{cert.name}}" was auto-verified via Credly — nice work! It's been added to your profile and counts towards {{cycle.label}} KPIs.

View your profile: {{portal_link}}

— SUDO People Operations` },

    { key:"probation.review_due",      category:"training", label:"Probation monthly remark due (TL alert)", channels:["email","teams"],          lastEdited:"1 month ago",  subject:"Probation remark due: {{employee.name}} · {{remark.month}}",
      body: `Hi {{tl.first_name}},

Reminder — the {{remark.month}} probation remark for {{employee.name}} is due {{remark.due_date}}. Monthly remarks are mandatory and visible to HR.

File the remark here: {{portal_link}}

— SUDO People Operations` },

    { key:"project_rating.tl_pending", category:"recognition", label:"Project rating awaiting TL review",    channels:["email","slack"],          lastEdited:"3 weeks ago",  subject:"PM rating ready for your review — {{member.name}} on {{project.name}}",
      body: `Hi {{tl.first_name}},

A new project rating for {{member.name}} ({{project.name}}) has been submitted by PM {{pm.name}} and is ready for your endorsement.

Open the rating: {{portal_link}}

— SUDO People Operations` },
  ];

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Notification Templates</h2>
        <div class="page-header__sub">Subject, body, channel routing · ${TEMPLATES.length} templates · all editable without code</div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm">${ICONS.download} Export</button>
        <button class="btn btn--primary btn--sm" data-action="add-template">${ICONS.plus} Add template</button>
      </div>
    </div>

    <div class="info-banner" style="margin-bottom:16px">
      ${ICONS.send || ICONS.menu}
      <div>Templates use Handlebars · <code>{{variable}}</code> placeholders. Channel routing decides where each notification goes (email · in-app · Slack · Teams).</div>
    </div>

    <div id="fb-hr-notifs"></div>

    <div class="table-wrap" id="hr-notifs-results">
      <table class="table">
        <thead><tr><th>Template key</th><th>Label</th><th>Subject</th><th>Channels</th><th>Last edited</th><th></th></tr></thead>
        <tbody>
          ${TEMPLATES.map(t => {
            const tags = ["all", t.category];
            t.channels.forEach(c => tags.push(c.replace('_','-')));
            const searchText = `${t.key} ${t.label} ${t.subject} ${t.category}`.toLowerCase();
            return `
            <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
              <td class="table__mono table__mono--dim">${t.key}</td>
              <td><strong>${t.label}</strong></td>
              <td style="font-size:12px;color:var(--ink-700);max-width:300px">${t.subject}</td>
              <td>${t.channels.map(c => `<span class="channel-pill channel-pill--${c}">${c.replace('_',' ')}</span>`).join(' ')}</td>
              <td class="table__mono table__mono--dim">${t.lastEdited}</td>
              <td><button class="btn btn--secondary btn--sm">${ICONS.pen || ICONS.edit} Edit</button></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No templates match these filters</div>
      </div>
    </div>
    <div id="pg-hr-notifs"></div>

    <div class="panel" style="margin-top:18px">
      <header class="panel__head"><div><h3 class="panel__title">CV / Resume Templates</h3><p class="panel__sub">Standard layouts HR can use to download employee CVs in different formats</p></div></header>
      <div class="panel__body">
        <div class="badge-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
          <div class="badge-tile" style="--badge-color:#204D9B">
            <div class="badge-tile__icon">📄</div>
            <div class="badge-tile__title">SUDO Standard</div>
            <div class="badge-tile__desc">Single-page · brand-themed · for client proposals</div>
            <button class="btn btn--secondary btn--sm" style="margin-top:8px">${ICONS.download} Preview / Use</button>
          </div>
          <div class="badge-tile" style="--badge-color:#189CD9">
            <div class="badge-tile__icon">📋</div>
            <div class="badge-tile__title">AWS Partner Format</div>
            <div class="badge-tile__desc">For AWS Partner Tier submissions · highlights certs</div>
            <button class="btn btn--secondary btn--sm" style="margin-top:8px">${ICONS.download} Preview / Use</button>
          </div>
          <div class="badge-tile" style="--badge-color:#5BB2E0">
            <div class="badge-tile__icon">📑</div>
            <div class="badge-tile__title">Detailed CV</div>
            <div class="badge-tile__desc">Multi-page · projects, certs, training history</div>
            <button class="btn btn--secondary btn--sm" style="margin-top:8px">${ICONS.download} Preview / Use</button>
          </div>
          <div class="badge-tile" style="--badge-color:#E89A1E">
            <div class="badge-tile__icon">📜</div>
            <div class="badge-tile__title">Compact Resume</div>
            <div class="badge-tile__desc">Single page · external job applications</div>
            <button class="btn btn--secondary btn--sm" style="margin-top:8px">${ICONS.download} Preview / Use</button>
          </div>
        </div>
      </div>
    </div>
  `;
}


// =========================================================
// PAGE: Documents V2 — dashboard with filters and views
// =========================================================
function pageDocumentsV2() {
  const DOCS = [
    { id:"D-2026-118", name:"Reem Al Otaibi · Offer Letter",        emp:"Reem Al Otaibi",  type:"Offer Letter",     status:"Signed",     source:"ODOO",     uploaded:"2026-04-01" },
    { id:"D-2026-117", name:"Reem Al Otaibi · Employment Contract", emp:"Reem Al Otaibi",  type:"Contract",         status:"Signed",     source:"ODOO",     uploaded:"2026-04-01" },
    { id:"D-2026-116", name:"Reem Al Otaibi · NDA",                  emp:"Reem Al Otaibi",  type:"NDA",              status:"Signed",     source:"ODOO",     uploaded:"2026-04-01" },
    { id:"D-2026-115", name:"Marcus Wright · Probation Eval",        emp:"Marcus Wright",   type:"Evaluation",       status:"Pending",    source:"Portal",   uploaded:"2026-05-10" },
    { id:"D-2026-114", name:"Tomás Rivera · Probation Eval",         emp:"Tomás Rivera",    type:"Evaluation",       status:"Pending",    source:"Portal",   uploaded:"2026-05-08" },
    { id:"D-2026-113", name:"Yousef Karim · Emirates ID copy",       emp:"Yousef Karim",    type:"Government",       status:"Verified",   source:"Portal",   uploaded:"2026-04-29" },
    { id:"D-2026-112", name:"Hiba Al Khoury · Passport copy",        emp:"Hiba Al Khoury",  type:"Government",       status:"Awaiting",   source:"Portal",   uploaded:null },
    { id:"D-2026-111", name:"Junaid Bashir · AWS CP Certificate",    emp:"Junaid Bashir",   type:"Certificate",      status:"Verified",   source:"Portal",   uploaded:"2026-04-30" },
    { id:"D-2026-110", name:"Ananya Sharma · Promotion Letter",      emp:"Ananya Sharma",   type:"Letter",           status:"Signed",     source:"ODOO",     uploaded:"2026-04-15" },
    { id:"D-2026-109", name:"Karim Salah · Salary Cert (May)",       emp:"Karim Salah",     type:"Letter",           status:"Verified",   source:"Portal",   uploaded:"2026-05-04" },
    { id:"D-2026-108", name:"Lina Haddad · Annual Eval 2025",        emp:"Lina Haddad",     type:"Evaluation",       status:"Signed",     source:"ODOO",     uploaded:"2026-01-10" },
    { id:"D-2026-107", name:"Pierre Dubois · Bank Letter",           emp:"Pierre Dubois",   type:"Letter",           status:"Verified",   source:"Portal",   uploaded:"2026-04-22" },
  ];

  const REQUESTS = [
    { id:"DR-2026-024", emp:"Reem Al Otaibi",   docType:"Salary Certificate",       purpose:"Emirates NBD — credit card application", language:"English",  urgency:"standard", submitted:"2 days ago",  status:"awaiting-hr" },
    { id:"DR-2026-023", emp:"Marcus Wright",    docType:"NOC (No Objection Cert.)", purpose:"GDRFA visa file",                          language:"English + Arabic", urgency:"urgent", submitted:"5 hours ago", status:"awaiting-hr" },
    { id:"DR-2026-022", emp:"Daniel Chen",      docType:"Bank Letter",              purpose:"HSBC — account opening",                   language:"English",  urgency:"standard", submitted:"yesterday",   status:"awaiting-hr" },
    { id:"DR-2026-021", emp:"Aisha Khan",       docType:"Experience Letter",        purpose:"University application — Masters program", language:"English",  urgency:"standard", submitted:"3 days ago",  status:"awaiting-hr" },
    { id:"DR-2026-020", emp:"Junaid Bashir",    docType:"Visa Stamping Letter",     purpose:"Spouse residency renewal",                 language:"Arabic",   urgency:"standard", submitted:"1 week ago",  status:"completed" },
    { id:"DR-2026-019", emp:"Yousef Karim",     docType:"Employment Letter",        purpose:"Personal records",                          language:"English",  urgency:"standard", submitted:"1 week ago",  status:"completed" },
  ];

  const DOC_TYPES = [
    { name:"Salary Certificate",   addressedTo:"Bank / Authority", autoTemplate:true,  defaultLang:"English",  sla:"1 business day",  enabled:true },
    { name:"No Objection Cert.",   addressedTo:"Embassy / Govt.",  autoTemplate:true,  defaultLang:"English",  sla:"2 business days", enabled:true },
    { name:"Employment Letter",    addressedTo:"Open",             autoTemplate:true,  defaultLang:"English",  sla:"1 business day",  enabled:true },
    { name:"Experience Letter",    addressedTo:"Open",             autoTemplate:false, defaultLang:"English",  sla:"3 business days", enabled:true },
    { name:"Bank Letter",          addressedTo:"Bank",             autoTemplate:true,  defaultLang:"English",  sla:"1 business day",  enabled:true },
    { name:"Visa Stamping Letter", addressedTo:"GDRFA",            autoTemplate:true,  defaultLang:"Arabic",   sla:"2 business days", enabled:true },
    { name:"Promotion Letter",     addressedTo:"Internal",         autoTemplate:false, defaultLang:"English",  sla:"3 business days", enabled:true },
    { name:"Family Visa Letter",   addressedTo:"GDRFA",            autoTemplate:true,  defaultLang:"Arabic",   sla:"2 business days", enabled:false },
  ];

  const cnt = (s) => DOCS.filter(d => d.status === s).length;
  const pendingRequests = REQUESTS.filter(r => r.status === "awaiting-hr").length;

  return `
    <div class="page-header">
      <div>
        <h2 class="page-header__h">Documents</h2>
        <div class="page-header__sub">All HR documents · ODOO-synced + portal-uploaded · ${DOCS.length} total · <strong>${pendingRequests} employee requests pending</strong></div>
      </div>
      <div class="page-actions">
        <button class="btn btn--secondary btn--sm" data-action="manage-doc-types">${ICONS.cog || ICONS.menu} Manage doc types</button>
        <button class="btn btn--secondary btn--sm">${ICONS.download} Bulk export</button>
        <button class="btn btn--primary btn--sm">${ICONS.upload || ICONS.send} Upload document</button>
      </div>
    </div>

    <div class="cards" style="margin-bottom:16px">
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--warn">${ICONS.alert}</div></div><div class="card__title">Employee requests</div><div class="card__value">${pendingRequests}</div><div class="card__meta">awaiting your review</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--ok">${ICONS.check}</div></div><div class="card__title">Signed / verified</div><div class="card__value">${cnt('Signed')+cnt('Verified')}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--info">${ICONS.external}</div></div><div class="card__title">From ODOO</div><div class="card__value">${DOCS.filter(d=>d.source==='ODOO').length}</div></div>
      <div class="card" style="cursor:default"><div class="card__head"><div class="card__icon card__icon--muted">${ICONS.menu}</div></div><div class="card__title">Portal-uploaded</div><div class="card__value">${DOCS.filter(d=>d.source==='Portal').length}</div></div>
    </div>

    <div id="fb-hr-docs"></div>

    <div class="table-wrap" id="hr-docs-results">
      <table class="table">
        <thead><tr><th>ID</th><th>Document / Request</th><th>Employee</th><th>Type</th><th>Status</th><th>Source</th><th>Date</th><th></th></tr></thead>
        <tbody>
          ${REQUESTS.map(r => {
            const tags = ["all", "requests"];
            if (r.status === "awaiting-hr") tags.push("needs-action");
            const typeSlug = r.docType.toLowerCase().replace(/[^\w]+/g, "-");
            tags.push(typeSlug);
            const searchText = `${r.id} ${r.emp} ${r.docType} ${r.purpose}`.toLowerCase();
            const stClass = r.status === "awaiting-hr" ? "warn" : "ok";
            const stLabel = r.status === "awaiting-hr" ? "Awaiting HR" : "Completed";
            return `
            <tr class="row-clickable doc-request-row" data-tag="${tags.join(" ")}" data-search="${searchText}" data-action="review-doc-request" data-request-id="${r.id}">
              <td class="table__mono table__mono--dim">${r.id}</td>
              <td><strong>${r.docType}</strong><div class="table__sub">Purpose: ${r.purpose}</div></td>
              <td>${r.emp}</td>
              <td><span class="status status--info">${r.docType.split(' ')[0]}</span></td>
              <td><span class="status status--${stClass}">${stLabel}</span>${r.urgency === "urgent" ? ' <span class="status status--danger">Urgent</span>' : ''}</td>
              <td><span class="dim">Employee request</span></td>
              <td class="table__mono table__mono--dim">${r.submitted}</td>
              <td>${r.status === "awaiting-hr" ? `<button class="btn btn--primary btn--sm" data-action="review-doc-request" data-request-id="${r.id}">${ICONS.eye || ICONS.check} Review</button>` : `<button class="btn btn--ghost btn--sm">${ICONS.download}</button>`}</td>
            </tr>`;
          }).join("")}
          ${DOCS.map(d => {
            const tags = ["all"];
            if (d.source === 'ODOO') tags.push("odoo");
            if (d.source === 'Portal') tags.push("portal");
            if (d.status === 'Pending' || d.status === 'Awaiting') tags.push("needs-action");
            const typeSlug = d.type.toLowerCase().replace(/[^\w]+/g, "-");
            tags.push(typeSlug);
            const statusSlug = d.status.toLowerCase();
            tags.push(statusSlug);
            const searchText = `${d.id} ${d.name} ${d.emp} ${d.type} ${d.status}`.toLowerCase();
            return `
            <tr class="row-clickable" data-tag="${tags.join(" ")}" data-search="${searchText}">
              <td class="table__mono table__mono--dim">${d.id}</td>
              <td><strong>${d.name}</strong></td>
              <td>${d.emp}</td>
              <td>${d.type}</td>
              <td><span class="status status--${d.status==='Signed'||d.status==='Verified'?'ok':'warn'}">${d.status}</span></td>
              <td>${d.source === 'ODOO' ? '<span class="odoo-source-pill">'+ICONS.external+' ODOO</span>' : '<span class="dim">Portal</span>'}</td>
              <td class="table__mono table__mono--dim">${d.uploaded || '—'}</td>
              <td><button class="btn btn--ghost btn--sm">${ICONS.download}</button></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="fb-empty" style="display:none">
        <div style="text-align:center;padding:30px;color:var(--ink-500)">No documents match these filters</div>
      </div>
    </div>
    <div id="pg-hr-docs"></div>

    <!-- Document Types Admin (HR controls what employees can request) -->
    <div class="panel" style="margin-top:18px" id="doc-types-panel">
      <header class="panel__head">
        <div>
          <h3 class="panel__title">Document Types · what employees can request</h3>
          <p class="panel__sub">Toggle availability. Disabled types disappear from the employee's request form across all portals.</p>
        </div>
        <button class="btn btn--secondary btn--sm" data-action="add-doc-type">${ICONS.plus} Add document type</button>
      </header>
      <div class="panel__body" style="padding:0">
        <table class="table">
          <thead><tr><th>Document type</th><th>Addressed to</th><th>Auto template</th><th>Default language</th><th>SLA</th><th>Available to employees</th></tr></thead>
          <tbody>
            ${DOC_TYPES.map(t => `
              <tr>
                <td><strong>${t.name}</strong></td>
                <td>${t.addressedTo}</td>
                <td>${t.autoTemplate ? '<span class="status status--ok">Yes</span>' : '<span class="status status--muted">Manual</span>'}</td>
                <td>${t.defaultLang}</td>
                <td>${t.sla}</td>
                <td><span class="toggle ${t.enabled ? "toggle--on" : ""}" data-doc-type-toggle="${t.name}"><span class="toggle__knob"></span></span></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


const ROUTES = {
  "dashboard": pageDashboard,
  "employees": pageEmployees,
  "onboarding": pageOnboardingV2,
  "probation": pageProbationHr,
  "background-checks": pageBackgroundChecks,
  "training-catalogue": pageTrainingCatalogue,
  "assign-trainings": pageAssignTrainings,
  "training-verifications": pageTrainingVerifications,
  "kpi-management": pageKpiManagementV2,
  "project-ratings": pageProjectRatingsHr,
  "projects": pageProjectsView,
  "leave-approvals": pageLeaveApprovalsV2,
  "recognition": pageRecognition,
  "badges-admin": pageBadgesAdmin,
  "notifications": pageNotificationTemplates,
  "documents": pageDocumentsV2,
  "reports": pageReports,
  "offboarding": pageOffboarding,
};

function route() {
  const rawHash = location.hash.replace(/^#/, "") || "dashboard";

  // Sub-route pattern: "employee-detail/E008"
  if (rawHash.startsWith("employee-detail/")) {
    const empId = rawHash.split("/")[1];
    const emp = DATA.employees.find(e => e.id === empId);
    if (!emp) {
      location.hash = "#employees";
      return;
    }
    $("#page-title").textContent = emp.name;
    $("#page-breadcrumb").innerHTML = `<span>HR</span><span class="dot-sep">›</span><a href="#employees" style="color:var(--bright);cursor:pointer">Employees</a><span class="dot-sep">›</span><span>${emp.name}</span>`;
    $("#page-content").innerHTML = pageEmployeeDetail(emp);
    renderNav("employees");
    bindPageEvents("employee-detail");
    closeSlideover();
    window.scrollTo(0, 0);
    return;
  }

  const id = ROUTES[rawHash] ? rawHash : "dashboard";
  const meta = NAV_ITEMS.find(n => n.id === id);

  $("#page-title").textContent = meta.title;
  $("#page-breadcrumb").innerHTML = id === "dashboard"
    ? `<span>Tuesday, 12 May 2026</span><span class="dot-sep">•</span><span>Week 20</span>`
    : `<span>HR</span><span class="dot-sep">›</span><span>${meta.label}</span>`;
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
  // Page-specific re-wiring
  if (pageId === "kpi-management") {
    // The HR Assign KPI form lives inside this page; wire it whenever the
    // page renders since DOM elements are freshly created each route.
    setTimeout(() => { if (window.wireHrAssignWizard) window.wireHrAssignWizard(); }, 100);

    // Ensure the FIRST tab (in user-preferred order) is the active one.
    // The hardcoded "active-cycle" might no longer be first after reorder.
    setTimeout(() => {
      const tabs = document.querySelectorAll('.tabs .tab');
      if (tabs.length === 0) return;
      const firstId = tabs[0].dataset.tab;
      tabs.forEach(t => t.classList.remove("tab--active"));
      tabs[0].classList.add("tab--active");
      document.querySelectorAll(".tabpane").forEach(p => {
        p.classList.toggle("tabpane--active", p.dataset.tabpane === firstId);
      });
    }, 60);

    // Wire the "Reorder tabs" button
    document.querySelectorAll('[data-action="customize-kpi-tabs"]').forEach(btn => {
      btn.addEventListener("click", () => {
        if (!window.SUDO_LAYOUT || !window.HR_KPI_TABS) {
          window.__toast && window.__toast("Layout helper not available", "warn");
          return;
        }
        // Build section defs from HR_KPI_TABS — strip HTML from label for the customizer
        const stripHtml = s => (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        const defs = window.HR_KPI_TABS.map(t => ({ id: t.id, label: stripHtml(t.label) }));
        const defaultOrder = window.HR_KPI_TABS.map(t => t.id);
        SUDO_LAYOUT.openCustomizer({
          pageKey: "hr-kpi-tabs",
          label: "KPI Management Tabs",
          sections: defs,
          defaultOrder,
          onSave: () => {
            window.__toast && window.__toast("Tab order saved — reloading", "success");
            setTimeout(() => location.reload(), 500);
          },
        });
      });
    });
  }

  // Render KPI analytics charts on the dashboard, with click-to-drill handlers
  if (pageId === "dashboard" && window.SUDO_CHARTS && window.SUDO_DB_HELPERS) {
    setTimeout(() => {
      // ── Status distribution donut ─────────────────────────────
      const all = SUDO_DB.kpiAssignments.filter(a => a.cycleId === "q2-2026" && a.status === "active");
      const bucketed = {
        green: all.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "green"),
        amber: all.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "amber"),
        red:   all.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "red"),
        grey:  all.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "grey"),
      };
      const statusSegments = [
        { label: "On target",    value: bucketed.green.length, color: SUDO_CHARTS.COLORS.green, tone: "green", assigns: bucketed.green },
        { label: "At risk",      value: bucketed.amber.length, color: SUDO_CHARTS.COLORS.amber, tone: "amber", assigns: bucketed.amber },
        { label: "Below target", value: bucketed.red.length,   color: SUDO_CHARTS.COLORS.red,   tone: "red",   assigns: bucketed.red   },
        { label: "No data",      value: bucketed.grey.length,  color: SUDO_CHARTS.COLORS.grey,  tone: "grey",  assigns: bucketed.grey  },
      ];
      SUDO_CHARTS.donut("hr-dash-status-donut", statusSegments, {
        centerTop: all.length.toString(),
        centerBottom: "active KPIs",
        onClick: (seg) => {
          if (!seg.assigns || seg.assigns.length === 0) return;
          openSlideover({
            title: `${seg.label} · ${seg.assigns.length} active KPI${seg.assigns.length === 1 ? '' : 's'}`,
            body: `
              <div class="info-banner" style="margin-bottom:14px;background:${seg.tone === 'red' ? '#FEF2F2' : seg.tone === 'amber' ? '#FFFBEB' : seg.tone === 'green' ? '#F0FDF4' : '#F9FAFB'};border-color:${seg.color}">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${seg.color};margin-right:6px"></span>
                <div>All KPIs currently in <strong>${seg.label}</strong> status across the organisation. Click a row to open the employee profile.</div>
              </div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>KPI</th><th>Employee</th><th>Team</th><th>Current</th><th>Target</th><th>Weight</th></tr></thead>
                  <tbody>
                    ${seg.assigns.map(a => {
                      const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn) || {};
                      const emp = SUDO_DB_HELPERS.findEmployee(a.empId) || {};
                      const team = emp.teamId ? SUDO_DB_HELPERS.findTeam(emp.teamId) : null;
                      return `
                        <tr class="row-clickable" data-action="hr-open-emp" data-emp-id="${a.empId}">
                          <td><code style="font-size:11px">${a.templateKrn}</code><br><span class="table__sub" style="font-size:11px">${tpl.title || '—'}</span></td>
                          <td><strong>${emp.name || a.empId}</strong></td>
                          <td>${team ? team.short : '—'}</td>
                          <td>${a.currentValue || '—'}</td>
                          <td>${tpl.target || '—'}</td>
                          <td>${a.weight}%</td>
                        </tr>`;
                    }).join("")}
                  </tbody>
                </table>
              </div>
              <div class="form-foot">
                <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
              </div>`,
          });
        },
      });

      // ── Team composite scores — horizontal bar ─────────────────
      const teamRows = (SUDO_DB.teams || []).map(t => {
        const members = SUDO_DB.employees.filter(e => e.teamId === t.id);
        const composites = members.map(m => SUDO_DB_HELPERS.compositeScore(m.id, "q2-2026")).filter(c => c !== null);
        const avg = composites.length > 0 ? composites.reduce((s,v)=>s+v,0) / composites.length : 0;
        const tone = avg >= 95 ? "green" : avg >= 80 ? "amber" : avg > 0 ? "red" : "grey";
        return { label: t.short, value: Math.round(avg), color: SUDO_CHARTS.COLORS[tone], team: t };
      }).filter(r => r.value > 0).sort((a, b) => b.value - a.value);
      SUDO_CHARTS.hbar("hr-dash-team-bars", teamRows, {
        max: 100, unit: "%",
        onClick: (row) => {
          // Reuse the team-drill slideover from Dept Reports
          const teamDrillBtn = document.querySelector(`[data-action="hr-team-drill"][data-team-id="${row.team.id}"]`);
          // Simulate click on a hidden team-drill anchor or directly trigger the same logic.
          // The handler exists on document level; dispatch a click on a synthetic button.
          const tmp = document.createElement("button");
          tmp.dataset.action = "hr-team-drill";
          tmp.dataset.teamId = row.team.id;
          tmp.style.display = "none";
          document.body.appendChild(tmp);
          tmp.click();
          tmp.remove();
        },
      });

      // ── KPI lifecycle funnel ─────────────────────────────────
      const draftedList  = SUDO_DB.kpiAssignments.filter(a => a.cycleId === "q2-2026");
      const pendingList  = SUDO_DB.kpiAssignments.filter(a => a.status === "pending_validation");
      const activeList   = SUDO_DB.kpiAssignments.filter(a => a.status === "active" || a.status === "progress_pending_validation");
      const progressList = SUDO_DB.kpiAssignments.filter(a => a.status === "progress_pending_validation");
      const ackList      = SUDO_DB.kpiAcknowledgements || [];

      function renderFunnelDrill(stageLabel, items, columns) {
        if (!items || items.length === 0) return;
        openSlideover({
          title: `${stageLabel} · ${items.length} item${items.length === 1 ? '' : 's'}`,
          body: `
            <div class="info-banner" style="margin-bottom:14px">
              <div>All assignments currently at the <strong>${stageLabel}</strong> stage of the lifecycle.</div>
            </div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr>${columns.map(c => `<th>${c.label}</th>`).join("")}</tr></thead>
                <tbody>
                  ${items.map(item => `
                    <tr class="row-clickable" ${item.empId ? `data-action="hr-open-emp" data-emp-id="${item.empId}"` : ''}>
                      ${columns.map(c => `<td>${c.cell(item)}</td>`).join("")}
                    </tr>`).join("")}
                </tbody>
              </table>
            </div>
            <div class="form-foot"><button class="btn btn--secondary" onclick="closeSlideover()">Close</button></div>`,
        });
      }

      const assignmentCols = [
        { label: "KPI", cell: a => `<code style="font-size:11px">${a.templateKrn}</code>` },
        { label: "Employee", cell: a => `<strong>${(SUDO_DB_HELPERS.findEmployee(a.empId)||{}).name || a.empId}</strong>` },
        { label: "Status", cell: a => `<span class="status status--${SUDO_DB_HELPERS.kpiStatusColor(a) === 'green' ? 'ok' : SUDO_DB_HELPERS.kpiStatusColor(a) === 'amber' ? 'warn' : SUDO_DB_HELPERS.kpiStatusColor(a) === 'red' ? 'danger' : 'info'}">${a.status}</span>` },
        { label: "Weight", cell: a => `${a.weight}%` },
      ];

      SUDO_CHARTS.funnel("hr-dash-funnel", [
        { label: "Drafted",            value: draftedList.length,  color: SUDO_CHARTS.COLORS.info,   items: draftedList,  cols: assignmentCols },
        { label: "Pending validation", value: pendingList.length,  color: SUDO_CHARTS.COLORS.amber,  items: pendingList,  cols: assignmentCols },
        { label: "Active",             value: activeList.length,   color: SUDO_CHARTS.COLORS.cyan,   items: activeList,   cols: assignmentCols },
        { label: "Progress submitted", value: progressList.length, color: SUDO_CHARTS.COLORS.purple, items: progressList, cols: assignmentCols },
        { label: "Acknowledged",       value: ackList.length,      color: SUDO_CHARTS.COLORS.green,  items: ackList,
          cols: [
            { label: "Employee", cell: ack => `<strong>${(SUDO_DB_HELPERS.findEmployee(ack.empId)||{}).name || ack.empId}</strong>` },
            { label: "Cycle",    cell: ack => ack.cycleId },
            { label: "Signed",   cell: ack => ack.signedAt },
            { label: "Via",      cell: ack => ack.signedVia || '—' },
          ] },
      ], {
        onClick: (stage) => renderFunnelDrill(stage.label, stage.items, stage.cols),
      });
    }, 50);
  }

  // Cards on dashboard → drill-down
  $$("[data-card-id]").forEach(el => el.addEventListener("click", () => {
    const id = el.dataset.cardId;
    const card = DATA.kpiCards.find(c => c.id === id);
    if (!card) return;
    // Build drill-down list lazily from related data
    const drill = drilldownFor(id);
    openSlideover(drill);
  }));

  // Attention list filters
  $$("[data-attn-filters] .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $$("[data-attn-filters] .chip").forEach(c => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");
      $("#attention-list").innerHTML = renderAttention(chip.dataset.filter);
    });
  });

  // Quick actions on dashboard
  $$("[data-quick]").forEach(b => b.addEventListener("click", () => {
    const map = { "assign-trainings": "assign-trainings", "add-employee": "employees", "notifications": "notifications" };
    location.hash = "#" + (map[b.dataset.quick] || "dashboard");
  }));

  // ===== EMPLOYEE DETAIL — tab switching + dialog wiring =====
  if (pageId === "employee-detail") {
    // Tab switching
    $$(".emp-detail-tab").forEach(tab => tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      $$(".emp-detail-tab").forEach(t => t.classList.remove("emp-detail-tab--active"));
      tab.classList.add("emp-detail-tab--active");
      $$(".emp-detail-tabpane").forEach(p => p.classList.remove("emp-detail-tabpane--active"));
      const pane = document.querySelector(`[data-tabpane="${target}"]`);
      if (pane) pane.classList.add("emp-detail-tabpane--active");
    }));

    // Helper to look up the employee from the current hash
    const empIdFromHash = () => (location.hash.split("/")[1] || "");
    const empNow = () => DATA.employees.find(e => e.id === empIdFromHash());

    // ---- Salary edit ----
    document.addEventListener("click", function salaryHandler(ev) {
      const btn = ev.target.closest('[data-action="emp-edit-salary"]');
      if (!btn) return;
      const emp = empNow();
      if (!emp) return;
      const s = getFullProfile(emp).salary;
      openSlideover({
        title: `Edit salary · ${emp.name}`,
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.shield || ""}<div><strong>Audit-logged.</strong> Salary changes appear in the Audit Log tab and trigger an ODOO payroll sync within 1 hour.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Currency</label>
              <select class="select"><option ${s.currency === "AED" ? "selected" : ""}>AED</option><option ${s.currency === "SAR" ? "selected" : ""}>SAR</option><option ${s.currency === "USD" ? "selected" : ""}>USD</option></select>
            </div>
            <div class="field"><label class="field__label">Effective from</label><input class="input" type="date" value="${s.effective}" /></div>
            <div class="field"><label class="field__label">Basic salary (monthly)</label><input class="input" type="number" value="${s.basic}" /></div>
            <div class="field"><label class="field__label">Housing allowance</label><input class="input" type="number" value="${s.housing}" /></div>
            <div class="field"><label class="field__label">Transport allowance</label><input class="input" type="number" value="${s.transport}" /></div>
            <div class="field"><label class="field__label">Other allowances</label><input class="input" type="number" value="${s.other}" /></div>
            <div class="field field--full"><label class="field__label">Reason for change (required)</label>
              <select class="select"><option>Annual review increment</option><option>Promotion</option><option>Cost-of-living adjustment</option><option>Role change</option><option>Correction</option></select>
            </div>
            <div class="field field--full"><label class="field__label">Notes</label><textarea class="textarea" placeholder="Internal HR notes (visible to HR + Super Admin only)"></textarea></div>
            <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Notify employee by email</label></div>
            <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Sync to ODOO payroll immediately</label></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Salary saved · ODOO sync queued', 'success')">${ICONS.check} Save changes</button>
          </div>`,
      });
    }, { once: false });

    // ---- Family member add ----
    document.addEventListener("click", function familyAddHandler(ev) {
      const btn = ev.target.closest('[data-action="emp-add-family"]');
      if (!btn) return;
      const emp = empNow();
      if (!emp) return;
      openSlideover({
        title: `Add family member · ${emp.name}`,
        body: `
          <div class="form-grid">
            <div class="field"><label class="field__label">Relationship</label>
              <select class="select"><option>Spouse</option><option>Child</option></select>
            </div>
            <div class="field"><label class="field__label">Date of birth</label><input class="input" type="date" /></div>
            <div class="field field--full"><label class="field__label">Full legal name</label><input class="input" placeholder="As shown on passport" /></div>
            <div class="field"><label class="field__label">Nationality</label><input class="input" /></div>
            <div class="field"><label class="field__label">Gender</label><select class="select"><option>Female</option><option>Male</option><option>Prefer not to say</option></select></div>
            <div class="field field--full"><label class="field__label">Passport number</label><input class="input" /></div>
            <div class="field"><label class="field__label">Visa status</label>
              <select class="select"><option>Dependent visa (sponsored)</option><option>Independent visa</option><option>Visa pending</option><option>N/A</option></select>
            </div>
            <div class="field"><label class="field__label">Visa expiry</label><input class="input" type="date" /></div>
            <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Add to family insurance policy if entitlement allows</label></div>
            <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Add to air ticket entitlement (if covered)</label></div>
            <div class="field field--full"><label class="field__label">Supporting document (birth/marriage certificate)</label>
              <div class="input" style="padding:18px;text-align:center;border-style:dashed;color:var(--ink-500)">${ICONS.upload || ""} Drop file here or click to browse · PDF or JPG</div>
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Family member added · pending document verification', 'success')">${ICONS.plus} Add member</button>
          </div>`,
      });
    });

    // ---- Air ticket policy edit ----
    document.addEventListener("click", function ticketPolicyHandler(ev) {
      const btn = ev.target.closest('[data-action="emp-edit-ticket-policy"]');
      if (!btn) return;
      const emp = empNow();
      if (!emp) return;
      const t = getFullProfile(emp).airTickets;
      openSlideover({
        title: `Edit air ticket policy · ${emp.name}`,
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.shield || ""}<div>Policy changes apply to <strong>future cycles</strong>. Tickets already used in the current cycle are not affected.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Cycle</label>
              <select class="select"><option ${t.cycle === "Annual" ? "selected" : ""}>Annual</option><option ${t.cycle === "Biennial" ? "selected" : ""}>Biennial (every 2 years)</option></select>
            </div>
            <div class="field"><label class="field__label">Tickets per cycle</label><input class="input" type="number" min="0" max="6" value="${t.ticketsPerCycle}" /></div>
            <div class="field"><label class="field__label">Travel class</label>
              <select class="select"><option ${t.class === "Economy" ? "selected" : ""}>Economy</option><option ${t.class === "Business" ? "selected" : ""}>Business</option><option ${t.class === "First" ? "selected" : ""}>First</option></select>
            </div>
            <div class="field"><label class="field__label">Family included?</label>
              <select class="select"><option ${!t.coversFamily ? "selected" : ""}>No · employee only</option><option ${t.coversFamily ? "selected" : ""}>Yes · spouse + children</option></select>
            </div>
            <div class="field field--full"><label class="field__label">Route</label><input class="input" value="${t.route}" placeholder="e.g. Dubai (DXB) ↔ Riyadh (RUH)" /></div>
            <div class="field field--full"><label class="field__label">Policy notes (shown to employee)</label><textarea class="textarea" placeholder="Reimbursement terms, booking method, time-of-year restrictions, etc."></textarea></div>
            <div class="field field--full"><label class="field__label">Reason for change</label>
              <select class="select"><option>Onboarding default</option><option>Promotion · upgraded class</option><option>Role change</option><option>Annual policy review</option><option>Manual adjustment</option></select>
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Air ticket policy updated · employee notified', 'success')">${ICONS.check} Save policy</button>
          </div>`,
      });
    });

    // ---- Grant tag ----
    document.addEventListener("click", function grantTagHandler(ev) {
      const btn = ev.target.closest('[data-action="emp-grant-tag"]');
      if (!btn) return;
      const emp = empNow();
      if (!emp) return;
      openSlideover({
        title: `Grant tag · ${emp.name}`,
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.star || ""}<div>Tags are visible on the employee's profile. PMs can recommend; HR / Super Admin grant.</div></div>
          <div class="form-grid">
            <div class="field field--full"><label class="field__label">Tag</label>
              <select class="select"><option>Rising Star</option><option>Top Performer</option><option>Customer Hero</option><option>Above &amp; Beyond</option><option>Mentor</option><option>Trusted Advisor</option><option>Innovator</option></select>
            </div>
            <div class="field field--full"><label class="field__label">Reason (required)</label><textarea class="textarea" placeholder="Specific, observable examples — visible to the employee."></textarea></div>
            <div class="field"><label class="field__label">Validity</label>
              <select class="select"><option>Permanent (until revoked)</option><option>This quarter</option><option>This calendar year</option><option>Until next review</option></select>
            </div>
            <div class="field"><label class="field__label">Visible to</label>
              <select class="select"><option>Everyone on the team</option><option>Only the employee</option><option>Employee + LM + PMs</option></select>
            </div>
            <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Announce in the team Slack channel</label></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Tag granted · ' + '${emp.name.split(' ')[0]}' + ' has been notified', 'success')">${ICONS.star} Grant tag</button>
          </div>`,
      });
    });

    // ---- Banking edit (Super Admin co-approval) ----
    document.addEventListener("click", function bankingHandler(ev) {
      const btn = ev.target.closest('[data-action="emp-edit-banking"]');
      if (!btn) return;
      const emp = empNow();
      if (!emp) return;
      const b = getFullProfile(emp).banking;
      openSlideover({
        title: `Edit banking · ${emp.name}`,
        body: `
          <div class="info-banner" style="margin-bottom:14px;background:var(--warn-bg);border-color:var(--warn);color:var(--ink-900)">${ICONS.shield || ""}<div><strong>Two-person rule.</strong> Banking changes require a Super Admin to co-approve. This change is queued for the next Super Admin sign-in.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Bank name</label><input class="input" value="${b.bankName}" /></div>
            <div class="field"><label class="field__label">Account type</label>
              <select class="select"><option ${b.accountType === "Salary Account" ? "selected" : ""}>Salary Account</option><option>Current Account</option><option>Savings Account</option></select>
            </div>
            <div class="field field--full"><label class="field__label">IBAN</label><input class="input" value="${b.iban}" style="font-family:var(--font-mono)" /></div>
            <div class="field field--full"><label class="field__label">Account holder name</label><input class="input" value="${b.holder}" /></div>
            <div class="field field--full"><label class="field__label">Reason for change (required)</label>
              <select class="select"><option>Employee request</option><option>New bank · old account closed</option><option>Correction</option><option>Compliance</option></select>
            </div>
            <div class="field field--full"><label class="field__label">Supporting document (bank letter / IBAN proof)</label>
              <div class="input" style="padding:18px;text-align:center;border-style:dashed;color:var(--ink-500)">${ICONS.upload || ""} Drop file here · PDF only</div>
            </div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Banking change submitted · awaiting Super Admin co-approval', 'info')">${ICONS.send} Submit for approval</button>
          </div>`,
      });
    });
  }  // end if (pageId === "employee-detail")

    // ─────────────────────────────────────────────────────────────────────
    //  KPI Management actions — HR validates / acknowledges TL-drafted KPIs,
    //  validates employee progress updates for HR-validated KPIs, and sends
    //  nudges to at-risk employees.
    //  These use document-level event delegation, so they only need to be
    //  registered once for the page's lifetime — guard against duplicate
    //  registration in case bindPageEvents fires multiple times.
    // ─────────────────────────────────────────────────────────────────────
    if (!window.__hrKpiHandlersBound) {
      window.__hrKpiHandlersBound = true;
    document.addEventListener("click", function hrKpiHandler(ev) {
      const aBtn = ev.target.closest('[data-action="hr-approve-assignment"]');
      const rBtn = ev.target.closest('[data-action="hr-reject-assignment"]');
      const vBtn = ev.target.closest('[data-action="hr-validate-progress"]');
      const nBtn = ev.target.closest('[data-action="hr-nudge-employee"]');
      const oBtn = ev.target.closest('[data-action="hr-open-emp"]');
      const dBtn = ev.target.closest('[data-action="hr-team-drill"]');

      if (dBtn) {
        const teamId = dBtn.dataset.teamId;
        const team = SUDO_DB_HELPERS.findTeam(teamId);
        if (!team) return;
        const members = SUDO_DB.employees.filter(e => e.teamId === teamId);
        const rows = members.map(m => {
          const composite = SUDO_DB_HELPERS.compositeScore(m.id, "q2-2026");
          const assigns = SUDO_DB_HELPERS.assignmentsForEmployee(m.id, "q2-2026");
          const reds = assigns.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "red").length;
          const greens = assigns.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "green").length;
          return { emp: m, composite, total: assigns.length, reds, greens };
        }).sort((a, b) => (b.composite || 0) - (a.composite || 0));
        openSlideover({
          title: `${team.name} · Team Breakdown`,
          body: `
            <div class="info-banner" style="margin-bottom:14px">${ICONS.chart}
              <div>${members.length} members · Lead: ${(SUDO_DB_HELPERS.findEmployee(team.leadEmpId)||{}).name || '—'} · Manager: ${(SUDO_DB_HELPERS.findEmployee(team.managerEmpId)||{}).name || '—'}</div>
            </div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Employee</th><th>Title</th><th>KPIs</th><th>On target</th><th>Below</th><th>Composite</th></tr></thead>
                <tbody>
                  ${rows.map(r => `
                    <tr>
                      <td><strong>${r.emp.name}</strong></td>
                      <td><span class="table__sub" style="font-size:11.5px">${r.emp.title || '—'}</span></td>
                      <td>${r.total}</td>
                      <td><span class="status status--ok">${r.greens}</span></td>
                      <td>${r.reds > 0 ? `<span class="status status--danger">${r.reds}</span>` : '<span class="table__sub">0</span>'}</td>
                      <td><strong>${r.composite !== null ? r.composite.toFixed(0) + '%' : '—'}</strong></td>
                    </tr>`).join("")}
                  ${rows.length === 0 ? `<tr><td colspan="6" style="text-align:center;padding:18px;color:var(--ink-500)">No members.</td></tr>` : ''}
                </tbody>
              </table>
            </div>
            <div class="form-foot">
              <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
            </div>`,
        });
        return;
      }

      if (aBtn) {
        const id = aBtn.dataset.id;
        const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
        if (!a) return;
        const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
        SUDO_DB_OVERRIDES.updateAssignment(id, { status: "active", hrAckBy: "E004", hrAckAt: new Date().toISOString().slice(0,10) });
        SUDO_DB_OVERRIDES.audit("Justine (HR)", "kpi.assignment.acknowledged", id, `${tpl ? tpl.krn : ''} now active`);
        SUDO_DB_OVERRIDES.notify({ title: "KPI acknowledged by HR", desc: `${tpl ? tpl.krn : id} is now active for the employee`, color: "ok", icon: "check" });
        window.__toast("Acknowledged · KPI is now active", "success");
        setTimeout(() => location.reload(), 600);
        return;
      }

      if (rBtn) {
        const id = rBtn.dataset.id;
        const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
        if (!a) return;
        openSlideover({
          title: "Reject KPI Assignment",
          body: `
            <div class="info-banner" style="margin-bottom:14px;background:#FEF2F2;border-color:#FCA5A5">${ICONS.alert || ''}
              <div>Rejecting sends this back to the Team Lead with your note. Status reverts to draft.</div>
            </div>
            <div class="form-grid">
              <div class="field field--full">
                <label class="field__label">Rejection reason</label>
                <textarea class="textarea" id="hr-reject-reason" rows="3" placeholder="e.g. 'Weight too high for first cycle'"></textarea>
              </div>
            </div>
            <div class="form-foot">
              <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
              <button class="btn btn--danger" id="hr-confirm-reject">${ICONS.alert || ''} Reject and send back</button>
            </div>`,
        });
        setTimeout(() => {
          const btn = document.getElementById("hr-confirm-reject");
          if (!btn) return;
          btn.addEventListener("click", () => {
            const reason = (document.getElementById("hr-reject-reason").value || "").trim();
            if (!reason) { window.__toast("Provide a reason", "warn"); return; }
            SUDO_DB_OVERRIDES.updateAssignment(id, { status: "draft", rejectionReason: reason, rejectedBy: "E004", rejectedAt: new Date().toISOString().slice(0,10) });
            SUDO_DB_OVERRIDES.audit("Justine (HR)", "kpi.assignment.rejected", id, reason);
            closeSlideover();
            window.__toast("Sent back to Team Lead", "info");
            setTimeout(() => location.reload(), 600);
          });
        }, 60);
        return;
      }

      if (vBtn) {
        const id = vBtn.dataset.id;
        const confirm = vBtn.dataset.confirm === "1";
        const a = SUDO_DB.kpiAssignments.find(x => x.id === id);
        if (!a) return;
        const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn);
        if (confirm) {
          SUDO_DB_OVERRIDES.updateAssignment(id, {
            status: "active",
            validatedValue: a.empSubmittedValue,
            validatedBy: "E004",
            validatedAt: new Date().toISOString().slice(0,10),
          });
          SUDO_DB_OVERRIDES.audit("Justine (HR)", "kpi.progress.validated", id, `Confirmed ${a.empSubmittedValue}`);
          window.__toast("Validated · employee scorecard updated", "success");
          setTimeout(() => location.reload(), 600);
        } else {
          openSlideover({
            title: "Revise Submitted Value",
            body: `
              <div class="info-banner" style="margin-bottom:14px">${ICONS.pen}
                <div>${tpl ? tpl.krn : id} · employee submitted <strong>${a.empSubmittedValue}</strong>. Enter the validated value HR considers accurate.</div>
              </div>
              <div class="form-grid">
                <div class="field"><label class="field__label">Submitted value</label><input class="input" value="${a.empSubmittedValue}" disabled style="background:var(--ink-50)"></div>
                <div class="field"><label class="field__label">Validated value</label><input class="input" type="number" step="0.1" id="hr-revised-value" value="${a.empSubmittedValue}"></div>
                <div class="field field--full"><label class="field__label">Note</label><textarea class="textarea" id="hr-validate-note" rows="2"></textarea></div>
              </div>
              <div class="form-foot">
                <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
                <button class="btn btn--primary" id="hr-confirm-revise">${ICONS.check} Save validated value</button>
              </div>`,
          });
          setTimeout(() => {
            const btn = document.getElementById("hr-confirm-revise");
            if (!btn) return;
            btn.addEventListener("click", () => {
              const val = parseFloat(document.getElementById("hr-revised-value").value);
              const note = (document.getElementById("hr-validate-note").value || "").trim();
              if (isNaN(val)) { window.__toast("Enter numeric value", "warn"); return; }
              SUDO_DB_OVERRIDES.updateAssignment(id, {
                status: "active",
                validatedValue: val,
                validatedBy: "E004",
                validatedAt: new Date().toISOString().slice(0,10),
                statusRemarks: note,
              });
              SUDO_DB_OVERRIDES.audit("Justine (HR)", "kpi.progress.revised", id, `Revised ${a.empSubmittedValue} → ${val}`);
              closeSlideover();
              window.__toast("Revised and validated", "success");
              setTimeout(() => location.reload(), 600);
            });
          }, 60);
        }
        return;
      }

      if (nBtn) {
        const empId = nBtn.dataset.empId;
        const emp = SUDO_DB_HELPERS.findEmployee(empId);
        if (!emp) return;
        openSlideover({
          title: `Send nudge to ${emp.name}`,
          body: `
            <div class="info-banner" style="margin-bottom:14px">${ICONS.send}
              <div>Sends a notification to ${emp.name} and copies their Team Lead. Use for at-risk KPIs that need attention.</div>
            </div>
            <div class="form-grid">
              <div class="field field--full">
                <label class="field__label">Message</label>
                <textarea class="textarea" id="hr-nudge-msg" rows="4">Hi ${emp.name.split(' ')[0]}, your Q2 KPI scorecard shows ${(SUDO_DB.kpiAssignments.filter(a => a.empId === empId && SUDO_DB_HELPERS.kpiStatusColor(a) === 'red')).length} item(s) below target. Could you connect with your Team Lead this week to plan corrective actions?</textarea>
              </div>
              <div class="field field--full">
                <label class="field__label">Schedule 1:1 with TL</label>
                <select class="select"><option>Yes — auto-create 30 min slot this week</option><option>No — message only</option></select>
              </div>
            </div>
            <div class="form-foot">
              <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
              <button class="btn btn--primary" id="hr-send-nudge">${ICONS.send} Send nudge</button>
            </div>`,
        });
        setTimeout(() => {
          const btn = document.getElementById("hr-send-nudge");
          if (!btn) return;
          btn.addEventListener("click", () => {
            const msg = (document.getElementById("hr-nudge-msg").value || "").trim();
            SUDO_DB_OVERRIDES.notify({
              title: `HR nudge sent to ${emp.name}`,
              desc: msg.slice(0, 80) + (msg.length > 80 ? '…' : ''),
              forEmpId: emp.id, icon: "send", color: "info",
            });
            SUDO_DB_OVERRIDES.audit("Justine (HR)", "at_risk.nudge_sent", emp.id, msg.slice(0, 200));
            closeSlideover();
            window.__toast(`Nudge sent to ${emp.name} · TL copied`, "success");
          });
        }, 60);
        return;
      }

      if (oBtn) {
        location.hash = "#employee-detail/" + oBtn.dataset.empId;
        return;
      }
    });

    // ─────────────────────────────────────────────────────────────────────
    //  HR Assign KPI wizard — uses event delegation so it survives tab
    //  switches and page re-renders.
    // ─────────────────────────────────────────────────────────────────────
    function wireHrAssignWizard() {
      const teamSel = document.getElementById("hr-assign-team");
      if (!teamSel) return;  // form not in DOM yet
      const tplSel  = document.getElementById("hr-assign-template");
      const tplHint = document.getElementById("hr-assign-template-hint");
      const scopeSel = document.getElementById("hr-assign-scope");
      const empField = document.getElementById("hr-assign-emp-field");
      const empSel   = document.getElementById("hr-assign-emp");
      const cycleSel = document.getElementById("hr-assign-cycle");
      const wInp     = document.getElementById("hr-assign-weight");
      const noteInp  = document.getElementById("hr-assign-note");
      const preview  = document.getElementById("hr-assign-preview");
      const previewC = document.getElementById("hr-assign-preview-content");
      const submitBtn = document.getElementById("hr-assign-submit");
      const cancelBtn = document.getElementById("hr-assign-cancel");
      if (!teamSel || teamSel.dataset.wired) return;
      teamSel.dataset.wired = "1";

      function rebuildTemplates() {
        const teamId = teamSel.value;
        if (!teamId) {
          tplSel.innerHTML = '<option value="">— pick a team first —</option>';
          tplSel.disabled = true;
          tplHint.textContent = "";
          empSel.innerHTML = "";
          return;
        }
        const tpls = SUDO_DB_HELPERS.templatesForTeam(teamId);
        const members = SUDO_DB_HELPERS.teamMembers(teamId).filter(m => m.teamRole === "member");
        tplSel.disabled = false;
        tplSel.innerHTML = '<option value="">— pick a template —</option>' +
          tpls.map(t => `<option value="${t.krn}">${t.krn} · ${t.label}</option>`).join("");
        tplHint.textContent = `${tpls.length} templates available for this team`;
        empSel.innerHTML = members.map(m => `<option value="${m.id}">${m.name} · ${m.title}</option>`).join("");
        updatePreview();
      }

      function toggleEmpField() {
        empField.style.display = scopeSel.value === "individual" ? "" : "none";
        updatePreview();
      }

      function updatePreview() {
        const tpl = SUDO_DB_HELPERS.templateByKrn(tplSel.value);
        if (!tpl) { preview.style.display = "none"; return; }
        if (!wInp.dataset.userTouched) wInp.value = tpl.defaultWeight;
        const team = SUDO_DB_HELPERS.findTeam(teamSel.value);
        const scope = scopeSel.value;
        let scopeLabel;
        if (scope === "team") {
          const memCount = SUDO_DB_HELPERS.teamMembers(teamSel.value).filter(m => m.teamRole === "member").length;
          scopeLabel = `All ${team ? team.name : ''} members (${memCount})`;
        } else {
          const emp = SUDO_DB_HELPERS.findEmployee(empSel.value);
          scopeLabel = emp ? `${emp.name} only` : "—";
        }
        const validatorLabel = ({ tl: "Team Lead", pm: "Project Manager", hr: "HR (you)", auto: "Auto-computed" })[tpl.validatorRole] || "Validator";
        preview.style.display = "block";
        previewC.innerHTML = `
          <div style="font-size:14px;font-weight:600;color:var(--ink-900);margin-bottom:8px">${tpl.krn} · ${tpl.label}</div>
          <div style="font-size:12px;color:var(--ink-700);line-height:1.7">
            <div><strong>Target:</strong> ${tpl.target} · <strong>Frequency:</strong> ${tpl.frequency} · <strong>Validator:</strong> ${validatorLabel}</div>
            <div><strong>Means of Validation:</strong> ${tpl.mov}</div>
            <div><strong>Will be assigned to:</strong> ${scopeLabel}</div>
            <div><strong>Cycle:</strong> ${cycleSel.options[cycleSel.selectedIndex].text} · <strong>Weight:</strong> ${wInp.value}%</div>
            <div style="margin-top:6px;color:var(--info)"><strong>After submit:</strong> routes to ${team ? team.name : 'team'} Lead for approval → activates on employee portal.</div>
          </div>`;
      }

      teamSel.addEventListener("change", rebuildTemplates);
      tplSel.addEventListener("change", () => { delete wInp.dataset.userTouched; updatePreview(); });
      scopeSel.addEventListener("change", toggleEmpField);
      empSel.addEventListener("change", updatePreview);
      cycleSel.addEventListener("change", updatePreview);
      wInp.addEventListener("input", () => { wInp.dataset.userTouched = "1"; updatePreview(); });

      cancelBtn.addEventListener("click", () => {
        teamSel.value = ""; tplSel.value = ""; scopeSel.value = "team";
        wInp.value = 5; noteInp.value = "";
        delete wInp.dataset.userTouched;
        rebuildTemplates();
        empField.style.display = "none";
        preview.style.display = "none";
        window.__toast("Form reset", "info");
      });

      submitBtn.addEventListener("click", () => {
        const teamId = teamSel.value;
        const tpl = SUDO_DB_HELPERS.templateByKrn(tplSel.value);
        if (!teamId || !tpl) return window.__toast("Pick a team and template", "warn");
        const scope = scopeSel.value;
        const cycleId = cycleSel.value;
        const weight = parseInt(wInp.value, 10) || 5;
        const note = noteInp.value.trim();
        const team = SUDO_DB_HELPERS.findTeam(teamId);

        let targets = [];
        let scopeLabel = "";
        if (scope === "team") {
          targets = SUDO_DB_HELPERS.teamMembers(teamId).filter(m => m.teamRole === "member").map(m => m.id);
          scopeLabel = "All " + (team ? team.name : 'team') + " members";
        } else {
          if (!empSel.value) return window.__toast("Pick an employee", "warn");
          targets = [empSel.value];
          const emp = SUDO_DB_HELPERS.findEmployee(empSel.value);
          scopeLabel = (emp ? emp.name : empSel.value) + " only";
        }

        if (targets.length === 0) return window.__toast("No employees in scope", "warn");

        const created = [];
        targets.forEach(empId => {
          const a = SUDO_DB_OVERRIDES.addAssignment({
            templateKrn: tpl.krn,
            empId, cycleId, scope, scopeLabel, weight,
            draftedBy: "E004",                 // Justine (HR)
            approvalDirection: "hr_to_tl",
            status: "pending_validation",
            hrNote: note,
          });
          created.push(a);
        });

        SUDO_DB_OVERRIDES.audit("Justine (HR)", "kpi.assignment.hr_drafted",
          `${tpl.krn} → ${targets.length} ${scope === "team" ? "team members" : "employee"}`,
          note || `${tpl.label} · ${scopeLabel}`);
        SUDO_DB_OVERRIDES.notify({
          title: `${targets.length} new KPI${targets.length === 1 ? '' : 's'} awaiting your approval`,
          desc: `HR drafted ${tpl.krn} for ${scopeLabel}`,
          icon: "send", color: "info", kind: "kpi_assignment",
        });
        window.__toast(`${created.length} KPI${created.length === 1 ? '' : 's'} sent to ${team ? team.short : ''} Lead for approval`, "success");
        setTimeout(() => location.reload(), 800);
      });

      // Initial render
      rebuildTemplates();
      toggleEmpField();

      // Bulk Apply Team Scorecard
      const bulkTeam = document.getElementById("hr-bulk-team");
      const bulkScope = document.getElementById("hr-bulk-scope");
      const bulkEmpField = document.getElementById("hr-bulk-emp-field");
      const bulkEmp = document.getElementById("hr-bulk-emp");
      const bulkCycle = document.getElementById("hr-bulk-cycle");
      const bulkInfo = document.getElementById("hr-bulk-team-info");
      const bulkApply = document.getElementById("hr-bulk-apply");

      if (bulkTeam && !bulkTeam.dataset.wired) {
        bulkTeam.dataset.wired = "1";
        function rebuildBulkEmps() {
          const t = bulkTeam.value;
          if (!t) {
            bulkInfo.textContent = "";
            bulkEmp.innerHTML = "";
            return;
          }
          const tpls = SUDO_DB_HELPERS.templatesForTeam(t);
          const members = SUDO_DB_HELPERS.teamMembers(t).filter(m => m.teamRole === "member");
          bulkInfo.textContent = `${tpls.length} templates · ${members.length} members in team`;
          bulkEmp.innerHTML = members.map(m => `<option value="${m.id}">${m.name} · ${m.title}</option>`).join("");
        }
        bulkTeam.addEventListener("change", rebuildBulkEmps);
        bulkScope.addEventListener("change", () => {
          bulkEmpField.style.display = bulkScope.value === "individual" ? "" : "none";
        });
        bulkApply.addEventListener("click", () => {
          const teamId = bulkTeam.value;
          if (!teamId) { window.__toast("Pick a team first", "warn"); return; }
          const team = SUDO_DB_HELPERS.findTeam(teamId);
          const tpls = SUDO_DB_HELPERS.templatesForTeam(teamId);
          if (tpls.length === 0) { window.__toast("This team has no templates", "warn"); return; }

          let targets = [];
          let scopeLabel = "";
          if (bulkScope.value === "team") {
            targets = SUDO_DB_HELPERS.teamMembers(teamId).filter(m => m.teamRole === "member").map(m => m.id);
            scopeLabel = `All ${team.name} members (${targets.length})`;
          } else {
            if (!bulkEmp.value) { window.__toast("Pick an employee", "warn"); return; }
            targets = [bulkEmp.value];
            const e = SUDO_DB_HELPERS.findEmployee(bulkEmp.value);
            scopeLabel = `${e ? e.name : bulkEmp.value} only`;
          }

          if (targets.length === 0) { window.__toast("No employees in scope", "warn"); return; }

          const total = targets.length * tpls.length;
          if (!confirm(`This will create ${total} KPI assignments (${tpls.length} templates × ${targets.length} employees). Each goes to ${team.name} Lead for approval. Continue?`)) return;

          const cycleId = bulkCycle.value;
          let created = 0;
          targets.forEach(empId => {
            tpls.forEach(tpl => {
              SUDO_DB_OVERRIDES.addAssignment({
                templateKrn: tpl.krn,
                empId, cycleId,
                scope: bulkScope.value, scopeLabel,
                weight: tpl.defaultWeight,
                draftedBy: "E004",
                approvalDirection: "hr_to_tl",
                status: "pending_validation",
                hrNote: `Bulk-applied from ${team.name} scorecard`,
              });
              created++;
            });
          });

          SUDO_DB_OVERRIDES.audit("Justine (HR)", "kpi.bulk_assign",
            `${team.name} scorecard → ${targets.length} ${bulkScope.value === "team" ? "team members" : "employee"}`,
            `${created} assignments created`);
          SUDO_DB_OVERRIDES.notify({
            title: `${created} new KPIs awaiting your approval`,
            desc: `HR bulk-applied ${team.name} scorecard to ${scopeLabel}`,
            icon: "send", color: "info",
          });
          window.__toast(`Created ${created} assignments · ${team.short} Lead notified`, "success");
          setTimeout(() => location.reload(), 1000);
        });
      }
    }

    // Wire whenever the Assign KPI tab gets shown (tabs in HR page use generic
    // class-toggle; the form exists in DOM at render time so we can wire once).
    window.wireHrAssignWizard = wireHrAssignWizard;  // exposed for route changes
    setTimeout(wireHrAssignWizard, 100);
    // Also re-wire when user clicks the tab in case fields weren't there
    document.addEventListener("click", function(ev){
      const t = ev.target.closest('button.tab[data-tab="assign-kpi"]');
      if (t) setTimeout(wireHrAssignWizard, 60);
      const tDept = ev.target.closest('button.tab[data-tab="dept-reports"]');
      if (tDept) setTimeout(renderDeptReportChart, 80);
      const tAR = ev.target.closest('button.tab[data-tab="at-risk"]');
      if (tAR) setTimeout(renderAtRiskChart, 80);
    });

    function renderDeptReportChart() {
      if (!window.SUDO_CHARTS || !document.getElementById("hr-dept-bar-chart")) return;
      const teamRows = (SUDO_DB.teams || []).map(t => {
        const members = SUDO_DB.employees.filter(e => e.teamId === t.id);
        const composites = members.map(m => SUDO_DB_HELPERS.compositeScore(m.id, "q2-2026")).filter(c => c !== null);
        const avg = composites.length > 0 ? composites.reduce((s,v)=>s+v,0) / composites.length : 0;
        const tone = avg >= 95 ? "green" : avg >= 80 ? "amber" : avg > 0 ? "red" : "grey";
        return { label: `${t.short} · ${t.name}`, value: Math.round(avg), color: SUDO_CHARTS.COLORS[tone], sub: `${members.length} members`, team: t };
      }).sort((a, b) => b.value - a.value);
      SUDO_CHARTS.hbar("hr-dept-bar-chart", teamRows, {
        max: 100, unit: "%",
        onClick: (row) => {
          // Trigger the existing team-drill slideover
          const tmp = document.createElement("button");
          tmp.dataset.action = "hr-team-drill";
          tmp.dataset.teamId = row.team.id;
          tmp.style.display = "none";
          document.body.appendChild(tmp);
          tmp.click();
          tmp.remove();
        },
      });
    }

    function renderAtRiskChart() {
      if (!window.SUDO_CHARTS || !document.getElementById("hr-atrisk-chart")) return;
      const reds = SUDO_DB.kpiAssignments.filter(a => SUDO_DB_HELPERS.kpiStatusColor(a) === "red");
      const byTeam = {};
      reds.forEach(a => {
        const emp = SUDO_DB_HELPERS.findEmployee(a.empId);
        if (!emp || !emp.teamId) return;
        if (!byTeam[emp.teamId]) byTeam[emp.teamId] = [];
        byTeam[emp.teamId].push(a);
      });
      const rows = (SUDO_DB.teams || [])
        .filter(t => byTeam[t.id] && byTeam[t.id].length > 0)
        .map(t => ({ label: t.short, value: byTeam[t.id].length, color: SUDO_CHARTS.COLORS.red, team: t, assigns: byTeam[t.id] }))
        .sort((a, b) => b.value - a.value);
      SUDO_CHARTS.vbar("hr-atrisk-chart", rows, {
        unit: "",
        onClick: (row) => {
          openSlideover({
            title: `${row.team.name} · ${row.value} RED KPI${row.value === 1 ? '' : 's'}`,
            body: `
              <div class="info-banner" style="margin-bottom:14px;background:#FEF2F2;border-color:#FCA5A5">
                <div>All KPIs currently below target in the <strong>${row.team.name}</strong> team. Click an employee to open their profile and consider a 1:1.</div>
              </div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Employee</th><th>KPI</th><th>Current</th><th>Target</th><th>Weight</th></tr></thead>
                  <tbody>
                    ${row.assigns.map(a => {
                      const tpl = SUDO_DB_HELPERS.templateByKrn(a.templateKrn) || {};
                      const emp = SUDO_DB_HELPERS.findEmployee(a.empId) || {};
                      return `
                        <tr class="row-clickable" data-action="hr-open-emp" data-emp-id="${a.empId}">
                          <td><strong>${emp.name}</strong><br><span class="table__sub" style="font-size:11px">${emp.title || ''}</span></td>
                          <td><code style="font-size:11px">${a.templateKrn}</code><br><span class="table__sub" style="font-size:11px">${tpl.title || ''}</span></td>
                          <td>${a.currentValue || '—'}</td>
                          <td>${tpl.target || '—'}</td>
                          <td>${a.weight}%</td>
                        </tr>`;
                    }).join("")}
                  </tbody>
                </table>
              </div>
              <div class="form-foot"><button class="btn btn--secondary" onclick="closeSlideover()">Close</button></div>`,
          });
        },
      });
    }

    setTimeout(renderDeptReportChart, 200);
    setTimeout(renderAtRiskChart, 200);
    }  // end if (!window.__hrKpiHandlersBound)

    // ─────────────────────────────────────────────────────────────────────
    // Each entry returns { title, body, successToast }. The body is the
    // slideover HTML. Forms are visually-realistic with prefilled values
    // from the actual profile; saving runs window.__toast and closes the
    // dialog. (Persistence to SUDO_DB would be next; today these are demo
    // mutations only.)
    //
    // Note: empNow helpers re-declared here because they're used by the
    // delegated handlers which now register on every page (not just
    // employee-detail). Safe on non-detail pages — empNow() returns null
    // and the handler short-circuits.
    // ─────────────────────────────────────────────────────────────────────
    const stubEmpIdFromHash = () => (location.hash.split("/")[1] || "");
    const stubEmpNow = () => DATA.employees.find(e => e.id === stubEmpIdFromHash());
    const stubMap = {
      "emp-edit-personal": (emp, p) => ({
        title: "Edit personal information",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.lock || ""}<div>Personal details (name, DOB, marital status). Changes are <strong>audit-logged</strong> and propagate to ODOO on save.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Full name (as on Emirates ID)</label><input class="input" value="${p.personal.fullName || emp.name}"></div>
            <div class="field"><label class="field__label">Preferred name</label><input class="input" value="${(emp.name || "").split(" ")[0]}"></div>
            <div class="field"><label class="field__label">Date of birth</label><input class="input" type="date" value="${p.personal.dob !== "—" ? p.personal.dob : ""}"></div>
            <div class="field"><label class="field__label">Nationality</label><select class="select"><option ${p.personal.nationality==='UAE'?'selected':''}>UAE</option><option ${p.personal.nationality==='India'?'selected':''}>India</option><option ${p.personal.nationality==='Pakistan'?'selected':''}>Pakistan</option><option ${p.personal.nationality==='Saudi Arabia'?'selected':''}>Saudi Arabia</option><option ${p.personal.nationality==='Egypt'?'selected':''}>Egypt</option><option ${p.personal.nationality==='Jordan'?'selected':''}>Jordan</option><option ${p.personal.nationality==='Lebanon'?'selected':''}>Lebanon</option><option ${p.personal.nationality==='Philippines'?'selected':''}>Philippines</option><option>Other</option></select></div>
            <div class="field"><label class="field__label">Gender</label><select class="select"><option ${p.personal.gender==='Male'?'selected':''}>Male</option><option ${p.personal.gender==='Female'?'selected':''}>Female</option><option>Prefer not to say</option></select></div>
            <div class="field"><label class="field__label">Marital status</label><select class="select"><option ${p.personal.marital==='Single'?'selected':''}>Single</option><option ${p.personal.marital==='Married'?'selected':''}>Married</option><option ${p.personal.marital==='Divorced'?'selected':''}>Divorced</option><option ${p.personal.marital==='Widowed'?'selected':''}>Widowed</option></select></div>
            <div class="field"><label class="field__label">Religion (optional · for holiday calendar)</label><select class="select"><option ${p.personal.religion==='Muslim'?'selected':''}>Muslim</option><option ${p.personal.religion==='Christian'?'selected':''}>Christian</option><option ${p.personal.religion==='Hindu'?'selected':''}>Hindu</option><option ${p.personal.religion==='Sikh'?'selected':''}>Sikh</option><option ${p.personal.religion==='Buddhist'?'selected':''}>Buddhist</option><option>Other / Prefer not to say</option></select></div>
            <div class="field field--full"><label class="field__label">Languages spoken</label><input class="input" value="${p.personal.languages || ""}" placeholder="e.g. English, Arabic, Hindi"></div>
            <div class="field field--full"><label class="field__label">Reason for change (visible in audit log)</label><input class="input" placeholder="e.g. Marriage certificate received · Mariam Al Rashid"></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Personal details updated · ODOO sync queued','success')">${ICONS.check} Save changes</button>
          </div>`,
      }),

      "emp-edit-contact": (emp, p) => ({
        title: "Edit contact information",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.lock || ""}<div>Personal email, phone, address. Work email is synced from Entra ID — read-only here.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Work email (Entra · locked)</label><input class="input" value="${emp.email}" disabled style="background:var(--ink-50);color:var(--ink-500)"></div>
            <div class="field"><label class="field__label">Personal email</label><input class="input" value="${p.contact.personalEmail || ""}"></div>
            <div class="field"><label class="field__label">Mobile number</label><input class="input" value="${p.contact.phone || ""}" placeholder="+971 50 ●●● ●●●●"></div>
            <div class="field"><label class="field__label">City</label><select class="select"><option ${p.contact.city==='Dubai'?'selected':''}>Dubai</option><option ${p.contact.city==='Abu Dhabi'?'selected':''}>Abu Dhabi</option><option ${p.contact.city==='Sharjah'?'selected':''}>Sharjah</option><option ${p.contact.city==='Riyadh'?'selected':''}>Riyadh</option><option ${p.contact.city==='Jeddah'?'selected':''}>Jeddah</option></select></div>
            <div class="field field--full"><label class="field__label">Address line</label><input class="input" value="${p.contact.addressLine || ""}"></div>
            <div class="field"><label class="field__label">Emergency contact name</label><input class="input" value="${p.contact.emergencyName || ""}"></div>
            <div class="field"><label class="field__label">Emergency contact relationship</label><select class="select"><option ${p.contact.emergencyRel==='Spouse'?'selected':''}>Spouse</option><option ${p.contact.emergencyRel==='Parent'?'selected':''}>Parent</option><option ${p.contact.emergencyRel==='Sibling'?'selected':''}>Sibling</option><option ${p.contact.emergencyRel==='Friend'?'selected':''}>Friend</option><option>Other</option></select></div>
            <div class="field field--full"><label class="field__label">Emergency contact phone</label><input class="input" value="${p.contact.emergencyPhone || ""}"></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Contact details updated','success')">${ICONS.check} Save changes</button>
          </div>`,
      }),

      "emp-edit-employment": (emp, p) => ({
        title: "Edit employment",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.lock || ""}<div>Title, department, line manager. Changes here affect KPI cycles, reporting lines, and access groups in Entra. Salary changes use the <strong>Schedule increment</strong> action instead.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Employee ID (locked)</label><input class="input" value="${emp.id}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Status</label><select class="select"><option ${emp.status==='Confirmed'?'selected':''}>Confirmed</option><option ${emp.status==='Onboarding'?'selected':''}>Onboarding</option><option ${emp.status==='Probation'?'selected':''}>Probation</option><option ${emp.status==='Notice'?'selected':''}>Notice period</option></select></div>
            <div class="field"><label class="field__label">Title</label><input class="input" value="${emp.title || ""}"></div>
            <div class="field"><label class="field__label">Department</label><select class="select"><option ${emp.dept==='Cloud Engineering'?'selected':''}>Cloud Engineering</option><option ${emp.dept==='Advisory'?'selected':''}>Advisory</option><option ${emp.dept==='Delivery'?'selected':''}>Delivery</option><option ${emp.dept==='Pre-sales'?'selected':''}>Pre-sales</option><option ${emp.dept==='People Operations'?'selected':''}>People Operations</option><option ${emp.dept==='Finance &amp; Admin'?'selected':''}>Finance &amp; Admin</option></select></div>
            <div class="field"><label class="field__label">Line manager (TL)</label><select class="select"><option ${emp.lm==='Khalid Mansour'?'selected':''}>Khalid Mansour</option><option ${emp.lm==='Sara Mitchell'?'selected':''}>Sara Mitchell</option><option ${emp.lm==='Omar Siddiqui'?'selected':''}>Omar Siddiqui</option></select></div>
            <div class="field"><label class="field__label">Current PM (read · set on Projects)</label><input class="input" value="${emp.pm || '—'}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Joined date (locked)</label><input class="input" value="${emp.joined || ""}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Work location</label><select class="select"><option>Dubai HQ · DIFC</option><option>Riyadh Office</option><option>Remote · UAE</option><option>Remote · KSA</option><option>Hybrid</option></select></div>
            <div class="field field--full"><label class="field__label">Effective date</label><input class="input" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
            <div class="field field--full"><label class="field__label">Reason for change</label><select class="select"><option>Promotion · with HR + Admin co-sign</option><option>Internal transfer</option><option>Lateral move / re-org</option><option>Correction · data fix</option></select></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Employment record updated · ODOO + Entra sync queued','success')">${ICONS.check} Save changes</button>
          </div>`,
      }),

      "emp-edit-identity": (emp, p) => ({
        title: "Edit identity &amp; visa documents",
        body: `
          <div class="info-banner" style="margin-bottom:14px;background:#FCE9C2;border-color:#E89A1E;color:#854F0B">${ICONS.shield || ICONS.alert || ""}<div><strong>Sensitive area.</strong> Government ID changes require uploading a clear photo of the new document. HR will manually verify before the change applies.</div></div>
          <div class="form-grid">
            <div class="field field--full"><label class="field__label">Emirates ID number</label><input class="input" value="${p.identity.emiratesId || ""}" placeholder="784-YYYY-XXXXXXX-X"></div>
            <div class="field"><label class="field__label">Emirates ID expiry</label><input class="input" type="date" value="${p.identity.emiratesIdExpiry !== "—" ? p.identity.emiratesIdExpiry : ""}"></div>
            <div class="field"><label class="field__label">Visa type</label><select class="select"><option ${p.identity.visaType==='Employment Residence'?'selected':''}>Employment Residence</option><option ${p.identity.visaType==='Mission'?'selected':''}>Mission</option><option ${p.identity.visaType==='Family'?'selected':''}>Family (sponsored)</option><option>Other</option></select></div>
            <div class="field"><label class="field__label">Visa expiry</label><input class="input" type="date" value="${p.identity.visaExpiry !== "—" ? p.identity.visaExpiry : ""}"></div>
            <div class="field"><label class="field__label">Passport number</label><input class="input" value="${p.identity.passportNo || ""}"></div>
            <div class="field"><label class="field__label">Passport country</label><input class="input" value="${p.identity.passportCountry || ""}"></div>
            <div class="field"><label class="field__label">Passport expiry</label><input class="input" type="date" value="${p.identity.passportExpiry !== "—" ? p.identity.passportExpiry : ""}"></div>
            <div class="field field--full"><label class="field__label">Upload supporting document (PDF / JPG · max 10 MB)</label>
              <div class="logo-upload"><button class="btn btn--secondary btn--sm">${ICONS.upload || ICONS.send} Choose file</button><span style="font-size:11.5px;color:var(--ink-500)">Required if any ID number changes</span></div>
            </div>
            <div class="field field--full"><label class="field__label">HR note (audit log)</label><textarea class="textarea" rows="2" placeholder="e.g. 'Visa renewal · stamping completed 12 May 2026'"></textarea></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Identity documents updated · manual verification queued','success')">${ICONS.check} Save &amp; queue for verification</button>
          </div>`,
      }),

      "emp-edit-insurance": (emp, p) => ({
        title: "Edit insurance policy",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.shield || ""}<div>Provider, tier, coverage. Family dependents are managed separately via <strong>Add family member to insurance</strong>.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Provider</label><select class="select"><option ${p.insurance.provider==='Daman Premium'?'selected':''}>Daman Premium</option><option ${p.insurance.provider==='Daman Standard'?'selected':''}>Daman Standard</option><option ${p.insurance.provider==='AXA Gulf'?'selected':''}>AXA Gulf</option><option ${p.insurance.provider==='Bupa Arabia'?'selected':''}>Bupa Arabia</option><option ${p.insurance.provider==='Now Health'?'selected':''}>Now Health</option></select></div>
            <div class="field"><label class="field__label">Tier</label><select class="select"><option ${p.insurance.tier && p.insurance.tier.includes('Tier 1')?'selected':''}>Tier 1 · Comprehensive + Family</option><option ${p.insurance.tier && p.insurance.tier.includes('Tier 2')?'selected':''}>Tier 2 · Comprehensive</option><option ${p.insurance.tier && p.insurance.tier.includes('Tier 3')?'selected':''}>Tier 3 · Basic</option></select></div>
            <div class="field"><label class="field__label">Policy number</label><input class="input" value="${p.insurance.policyNo || ""}"></div>
            <div class="field"><label class="field__label">Valid until</label><input class="input" type="date" value="${p.insurance.validUntil !== "—" ? p.insurance.validUntil : ""}"></div>
            <div class="field field--full"><label class="field__label">Coverage details</label><textarea class="textarea" rows="3">${p.insurance.coverage || ""}</textarea></div>
            <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Auto-renew at policy expiry (same tier)</label></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Insurance policy updated · employee notified','success')">${ICONS.check} Save policy</button>
          </div>`,
      }),

      "emp-edit-family": (emp, p) => ({
        title: "Edit family member",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.users || ICONS.user || ""}<div>Adding or updating a family member triggers re-validation of insurance dependents and air ticket entitlements.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Relationship</label><select class="select"><option>Spouse</option><option>Child</option><option>Parent (sponsored)</option></select></div>
            <div class="field"><label class="field__label">Status</label><select class="select"><option>Active dependent</option><option>Sponsored (no insurance)</option><option>Removed (record kept for audit)</option></select></div>
            <div class="field"><label class="field__label">Full name</label><input class="input" placeholder="As on passport"></div>
            <div class="field"><label class="field__label">Date of birth</label><input class="input" type="date"></div>
            <div class="field"><label class="field__label">Nationality</label><select class="select"><option>UAE</option><option>India</option><option>Pakistan</option><option>Saudi Arabia</option><option>Other</option></select></div>
            <div class="field"><label class="field__label">Passport number</label><input class="input"></div>
            <div class="field"><label class="field__label">Visa status</label><select class="select"><option>Sponsored by employee</option><option>Sponsored externally</option><option>UAE national · no visa</option></select></div>
            <div class="field"><label class="field__label">Insurance dependency</label><select class="select"><option>Add to policy</option><option>Not on policy</option><option>External policy</option></select></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--secondary" onclick="closeSlideover(); window.__toast('Family member removed','info')" style="color:var(--danger);margin-right:auto">${ICONS.lock || ""} Remove</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Family member updated · benefits re-validated','success')">${ICONS.check} Save member</button>
          </div>`,
      }),

      "emp-edit-tag": (emp, p) => ({
        title: "Edit / revoke tag",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.star || ""}<div>Tags are visible on the employee's profile and Recognition Wall. Revoking removes the tag and logs the reason.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Tag</label><input class="input" value="${(p.tag && p.tag.label) || "Senior Anchor"}"></div>
            <div class="field"><label class="field__label">Granted by</label><input class="input" value="${(p.tag && p.tag.grantedBy) || "Khalid Mansour (TL)"}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Granted on</label><input class="input" value="${(p.tag && p.tag.grantedOn) || ""}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">Visibility</label><select class="select"><option selected>Public · profile + recognition wall</option><option>HR + Manager only</option><option>HR only</option></select></div>
            <div class="field field--full"><label class="field__label">Reason / citation</label><textarea class="textarea" rows="2">${(p.tag && p.tag.reason) || ""}</textarea></div>
            <div class="field field--full"><label class="field__label">Expiry (optional · auto-revoke)</label><input class="input" type="date"></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--ghost" style="color:var(--danger);margin-right:auto" onclick="closeSlideover(); window.__toast('Tag revoked','info')">${ICONS.lock || ""} Revoke tag</button>
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Tag updated','success')">${ICONS.check} Save tag</button>
          </div>`,
      }),

      "emp-add-family-insurance": (emp, p) => ({
        title: "Add family member to insurance",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.shield || ""}<div>Adds a dependent to the active policy. Premiums adjust at the start of next billing cycle. Requires Super Admin co-approval if tier changes.</div></div>
          <div class="form-grid">
            <div class="field field--full"><label class="field__label">Family member</label><select class="select">${(p.family && p.family.children || []).concat(p.family && p.family.spouse ? [p.family.spouse] : []).map(m => `<option>${m.name}</option>`).join("")}<option>+ Add new family member first</option></select></div>
            <div class="field"><label class="field__label">Policy tier for this dependent</label><select class="select"><option>Same as employee (Tier 1)</option><option>Tier 2 · Comprehensive</option><option>Tier 3 · Basic</option></select></div>
            <div class="field"><label class="field__label">Effective date</label><input class="input" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
            <div class="field field--full"><label class="field__label">Premium uplift (auto-calculated)</label><div style="padding:10px 12px;background:var(--ink-50);border-radius:6px;font-size:13px"><strong>AED 1,250 / month</strong> · effective next billing cycle</div></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Family member added to policy · provider notified','success')">${ICONS.check} Add to policy</button>
          </div>`,
      }),

      "emp-issue-insurance-card": (emp, p) => ({
        title: "Issue insurance card",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.send || ""}<div>Re-issues the digital insurance card (PDF). Emailed to the employee + all dependents on the policy.</div></div>
          <div class="form-grid">
            <div class="field field--full"><label class="field__label">Issue for</label>
              <div style="background:var(--ink-50);padding:10px 12px;border-radius:6px;font-size:13px">
                <div><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> ${emp.name} (employee)</label></div>
                ${(p.insurance.family || []).map(f => `<div style="margin-top:6px"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> ${f.name} (${f.rel})</label></div>`).join("")}
              </div>
            </div>
            <div class="field"><label class="field__label">Reason for re-issue</label><select class="select"><option>Lost or damaged card</option><option>Annual refresh</option><option>Personal info changed</option><option>Tier upgrade</option></select></div>
            <div class="field"><label class="field__label">Deliver via</label><select class="select"><option>Email PDF only</option><option>Email PDF + physical card by courier</option></select></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Insurance card issued · ' + ${(p.insurance.family || []).length + 1} + ' recipients emailed','success')">${ICONS.check} Issue card</button>
          </div>`,
      }),

      "emp-view-payslips": (emp, p) => ({
        title: "Payslips · ODOO source",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.external || ""}<div>Payslips are generated in ODOO and proxy-downloaded here. <strong>${emp.name}</strong> sees their own; HR sees all.</div></div>
          <div class="table-wrap" style="border:1px solid var(--ink-100);border-radius:8px">
            <table class="table">
              <thead><tr><th>Period</th><th>Gross</th><th>Net</th><th>Issued</th><th>Status</th><th></th></tr></thead>
              <tbody>
                ${["2026-04", "2026-03", "2026-02", "2026-01", "2025-12", "2025-11"].map((m, i) => `
                  <tr>
                    <td class="table__mono"><strong>${m}</strong></td>
                    <td class="table__mono">${p.salary.currency} ${(p.salary.basic + p.salary.housing + p.salary.transport + p.salary.other).toLocaleString()}</td>
                    <td class="table__mono">${p.salary.currency} ${((p.salary.basic + p.salary.housing + p.salary.transport + p.salary.other) * 0.92).toFixed(0)}</td>
                    <td class="table__mono table__mono--dim">${m}-28</td>
                    <td><span class="status status--ok">Issued</span></td>
                    <td><button class="btn btn--ghost btn--sm">${ICONS.download} PDF</button></td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Bulk PDF export queued · email sent when ready','info')">${ICONS.download} Export all (ZIP)</button>
          </div>`,
      }),

      "emp-comp-history": (emp, p) => ({
        title: "Compensation history · audit trail",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.clock || ICONS.calendar || ""}<div>Every salary change for <strong>${emp.name}</strong> · reason, approver, delta, ODOO sync state.</div></div>
          <div class="table-wrap" style="border:1px solid var(--ink-100);border-radius:8px">
            <table class="table">
              <thead><tr><th>Effective</th><th>Basic</th><th>Gross</th><th>Δ</th><th>Reason</th><th>Approved by</th><th>ODOO</th></tr></thead>
              <tbody>
                ${(p.salary.history || []).map((h, idx, arr) => {
                  const prev = arr[idx + 1];
                  const delta = prev ? ((h.gross - prev.gross) / prev.gross * 100) : 0;
                  const deltaLabel = prev ? (delta > 0 ? `<span style="color:var(--ok);font-weight:700">↑ ${delta.toFixed(1)}%</span>` : `<span style="color:var(--danger);font-weight:700">↓ ${Math.abs(delta).toFixed(1)}%</span>`) : '<span style="color:var(--ink-500)">baseline</span>';
                  return `
                    <tr>
                      <td class="table__mono">${h.effective}</td>
                      <td class="table__mono">${p.salary.currency} ${h.basic.toLocaleString()}</td>
                      <td class="table__mono">${p.salary.currency} ${h.gross.toLocaleString()}</td>
                      <td>${deltaLabel}</td>
                      <td><strong>${h.reason}</strong>${h.note ? `<div class="table__sub">${h.note}</div>` : ""}</td>
                      <td style="font-size:12px">${h.approvedBy}</td>
                      <td><span class="status status--ok">Synced</span></td>
                    </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Compensation audit exported · check Downloads','info')">${ICONS.download} Export as CSV</button>
          </div>`,
      }),

      "emp-schedule-increment": (emp, p) => ({
        title: "Schedule increment",
        body: `
          <div class="info-banner" style="margin-bottom:14px;background:#FCE9C2;border-color:#E89A1E;color:#854F0B">${ICONS.alert || ""}<div><strong>Sensitive action.</strong> Salary changes require Super Admin co-sign and are audit-logged. The increment applies on the effective date with auto-email to the employee.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Current basic (locked)</label><input class="input" value="${p.salary.currency} ${p.salary.basic.toLocaleString()}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">New basic</label><input class="input" type="number" value="${Math.round(p.salary.basic * 1.08)}" placeholder="${p.salary.basic}"></div>
            <div class="field"><label class="field__label">Current housing</label><input class="input" value="${p.salary.currency} ${p.salary.housing.toLocaleString()}" disabled style="background:var(--ink-50)"></div>
            <div class="field"><label class="field__label">New housing</label><input class="input" type="number" value="${p.salary.housing}"></div>
            <div class="field"><label class="field__label">Effective date</label><input class="input" type="date" value="${new Date(Date.now() + 30*24*3600*1000).toISOString().slice(0,10)}"></div>
            <div class="field"><label class="field__label">Reason</label><select class="select"><option>Annual increment</option><option>Mid-cycle market adjustment</option><option>Promotion · with title change</option><option>Confirmation increment (post-probation)</option><option>Cost-of-living adjustment</option><option>Retention offer</option></select></div>
            <div class="field field--full"><label class="field__label">Justification (audit log + Admin co-sign view)</label><textarea class="textarea" rows="3" placeholder="e.g. 'Performance KPI 89/100 in 2025 · top 10% of cohort · external offer matched'"></textarea></div>
            <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Notify employee on effective date (auto-email with new package)</label></div>
            <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Trigger ODOO payroll re-run for the new effective month</label></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Increment scheduled · Super Admin co-sign requested','success')">${ICONS.check} Schedule increment</button>
          </div>`,
      }),

      "emp-issue-cert": (emp, p) => ({
        title: "Issue salary certificate",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.send || ""}<div>Generates a SUDO-stamped PDF for visa / lease / loan purposes. Auto-template fills in employee + salary data; HR can edit before sending.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Addressed to</label><select class="select"><option>To whom it may concern</option><option>Specific bank</option><option>Specific embassy</option><option>Specific landlord</option><option>Other</option></select></div>
            <div class="field"><label class="field__label">Language</label><select class="select"><option>English</option><option>Arabic</option><option>English + Arabic (bilingual)</option></select></div>
            <div class="field"><label class="field__label">Include gross salary</label><select class="select"><option>Yes · full breakdown</option><option>Yes · gross only</option><option>No · "as per company policy"</option></select></div>
            <div class="field"><label class="field__label">Validity period</label><select class="select"><option>30 days</option><option>60 days</option><option>90 days (max)</option></select></div>
            <div class="field field--full"><label class="field__label">Additional context (optional)</label><textarea class="textarea" rows="2" placeholder="e.g. 'For HSBC mortgage application reference #2026-XX'"></textarea></div>
            <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Apply company stamp + HR Director e-signature</label></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--secondary" onclick="window.__toast('Preview generated','info')">${ICONS.eye || ""} Preview</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Salary certificate issued · emailed to ' + ${"'" + emp.name + "'"},'success')">${ICONS.check} Issue &amp; email</button>
          </div>`,
      }),

      "emp-process-ticket-claim": (emp, p) => ({
        title: "Process boarding-pass claim",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.send || ""}<div>Verify uploaded boarding passes, set the reimbursement amount, route through Finance.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Travel cycle</label><select class="select"><option>2026 annual entitlement</option><option>2025 annual entitlement</option></select></div>
            <div class="field"><label class="field__label">Number of tickets claimed</label><input class="input" type="number" value="${p.airTickets.used || 1}" min="1" max="${p.airTickets.ticketsPerCycle || 4}"></div>
            <div class="field"><label class="field__label">Reimbursement amount</label><input class="input" type="number" value="2140"></div>
            <div class="field"><label class="field__label">Currency</label><select class="select"><option>AED</option><option>USD</option><option>SAR</option></select></div>
            <div class="field field--full"><label class="field__label">Boarding passes (uploaded by employee)</label>
              <div style="background:var(--ink-50);padding:10px 12px;border-radius:6px;font-size:12.5px">
                <div>📎 boarding-pass-DXB-BAH-15apr2026.pdf <span style="color:var(--ink-500)">· 412 KB</span></div>
                <div style="margin-top:4px">📎 boarding-pass-BAH-DXB-22apr2026.pdf <span style="color:var(--ink-500)">· 388 KB</span></div>
              </div>
            </div>
            <div class="field field--full"><label class="field__label">HR note</label><textarea class="textarea" rows="2" placeholder="e.g. 'Boarding passes verified · matches entitled route'"></textarea></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--ghost" style="color:var(--danger);margin-right:auto" onclick="closeSlideover(); window.__toast('Claim sent back to employee','info')">Send back</button>
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Claim approved · forwarded to Finance for payment','success')">${ICONS.check} Approve &amp; pay</button>
          </div>`,
      }),

      "emp-book-ticket": (emp, p) => ({
        title: "Book ticket on behalf",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.send || ""}<div>Opens SUDO's travel partner (TravelPort) with employee pre-filled. Charges go to the company account.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Trip type</label><select class="select"><option>Round trip</option><option>One way</option><option>Multi-city</option></select></div>
            <div class="field"><label class="field__label">Cabin class</label><select class="select"><option>Economy (entitled)</option><option>Premium economy (with approval)</option><option>Business (with approval)</option></select></div>
            <div class="field"><label class="field__label">From</label><input class="input" value="Dubai (DXB)"></div>
            <div class="field"><label class="field__label">To</label><input class="input" placeholder="e.g. Manama (BAH)"></div>
            <div class="field"><label class="field__label">Departure</label><input class="input" type="date"></div>
            <div class="field"><label class="field__label">Return</label><input class="input" type="date"></div>
            <div class="field"><label class="field__label">Travellers</label><input class="input" type="number" value="1" min="1" max="6"></div>
            <div class="field"><label class="field__label">Cycle to charge</label><select class="select"><option>2026 entitlement (${p.airTickets.remaining}/${p.airTickets.ticketsPerCycle} tickets remaining)</option></select></div>
            <div class="field field--full"><label class="field__label">Special instructions (meals, seat preference)</label><input class="input" placeholder="Optional"></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Opening TravelPort with employee pre-filled…','info')">${ICONS.external || ""} Open TravelPort &amp; book</button>
          </div>`,
      }),

      "emp-upload-doc": (emp, p) => ({
        title: "Upload document",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.upload || ICONS.send || ""}<div>Adds a document to <strong>${emp.name}</strong>'s portal record. ODOO-managed documents (offer letter, contract) are uploaded in ODOO itself.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Document type</label><select class="select"><option>Letter of recognition</option><option>Promotion letter</option><option>Internal transfer notice</option><option>Tuition reimbursement approval</option><option>Confidential note (HR-only)</option><option>Other</option></select></div>
            <div class="field"><label class="field__label">Visibility</label><select class="select"><option>Visible to employee</option><option>HR only (private)</option><option>HR + Manager</option></select></div>
            <div class="field field--full"><label class="field__label">Choose file</label>
              <div class="logo-upload"><button class="btn btn--secondary btn--sm">${ICONS.upload || ICONS.send} Browse</button><span style="font-size:11.5px;color:var(--ink-500)">PDF or DOCX · max 10 MB</span></div>
            </div>
            <div class="field field--full"><label class="field__label">Note (visible alongside the document)</label><textarea class="textarea" rows="2"></textarea></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Document uploaded to ' + ${"'" + emp.name + "'"} + ' record','success')">${ICONS.check} Upload</button>
          </div>`,
      }),

      "emp-request-signature": (emp, p) => ({
        title: "Request e-signature",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.send || ""}<div>Sends a DocuSign request to <strong>${emp.name}</strong>. The signed document is automatically filed in their portal record.</div></div>
          <div class="form-grid">
            <div class="field field--full"><label class="field__label">Document to sign</label><select class="select"><option>Promotion letter · awaiting upload</option><option>Probation confirmation letter</option><option>Annual increment letter</option><option>Policy amendment acknowledgement</option><option>Equipment receipt</option><option>Confidentiality agreement renewal</option></select></div>
            <div class="field"><label class="field__label">Signing deadline</label><input class="input" type="date" value="${new Date(Date.now() + 7*24*3600*1000).toISOString().slice(0,10)}"></div>
            <div class="field"><label class="field__label">Reminder cadence</label><select class="select"><option>3 days · 1 day · day of</option><option>1 day · day of</option><option>None</option></select></div>
            <div class="field field--full"><label class="field__label">Message to ${emp.name.split(" ")[0]}</label><textarea class="textarea" rows="3">Hi ${emp.name.split(" ")[0]}, please review and sign the attached document by the deadline. Reach out if you have any questions.</textarea></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('DocuSign request sent to ' + ${"'" + emp.email + "'"},'success')">${ICONS.send} Send for signature</button>
          </div>`,
      }),

      "emp-assign-training": (emp, p) => ({
        title: "Assign training",
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.book || ICONS.send || ""}<div>Assigns a training to <strong>${emp.name}</strong>. Auto-accepted on assignment · deadline countdown starts immediately.</div></div>
          <div class="form-grid">
            <div class="field field--full"><label class="field__label">Training</label><select class="select"><option>AWS Solutions Architect Associate (SAA-C03)</option><option>AWS Cloud Practitioner Essentials</option><option>AWS DevOps Engineer Professional</option><option>AWS Security Specialty</option><option>AWS Well-Architected Framework</option><option>KnowBe4 · Security Awareness</option><option>ITIL 4 Foundation</option><option>HashiCorp Terraform Associate</option></select></div>
            <div class="field"><label class="field__label">Deadline</label><input class="input" type="date" value="${new Date(Date.now() + 45*24*3600*1000).toISOString().slice(0,10)}"></div>
            <div class="field"><label class="field__label">Priority</label><select class="select"><option>Required (high)</option><option>Recommended</option><option>Optional</option></select></div>
            <div class="field field--full"><label class="field__label">HR note (visible to employee)</label><textarea class="textarea" rows="2" placeholder="e.g. 'Required for the upcoming Bank-of-Sky engagement · cert needed by 30 June'"></textarea></div>
            <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Send 7/3/1-day reminders before deadline</label></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Training assigned to ' + ${"'" + emp.name + "'"} + ' · countdown started','success')">${ICONS.check} Assign training</button>
          </div>`,
      }),

      "emp-quick-actions": (emp, p) => ({
        title: "More actions · " + emp.name,
        body: `
          <div class="info-banner" style="margin-bottom:14px;background:#FCE9C2;border-color:#E89A1E;color:#854F0B">${ICONS.alert || ""}<div>Sensitive actions. Each requires confirmation and is audit-logged. Some need Super Admin co-sign.</div></div>
          <div style="display:grid;gap:8px">
            <button class="btn btn--secondary" style="justify-content:flex-start;text-align:left" onclick="closeSlideover(); window.__toast('Probation review triggered','info')">${ICONS.shield || ICONS.clock} Trigger probation review</button>
            <button class="btn btn--secondary" style="justify-content:flex-start;text-align:left" onclick="closeSlideover(); window.__toast('Offboarding workflow started · 8-step checklist created','info')">${ICONS.send} Start offboarding</button>
            <button class="btn btn--secondary" style="justify-content:flex-start;text-align:left" onclick="closeSlideover(); window.__toast('Password reset link sent via Entra','info')">${ICONS.refresh} Force password reset (Entra)</button>
            <button class="btn btn--secondary" style="justify-content:flex-start;text-align:left" onclick="closeSlideover(); window.__toast('All employee sessions revoked','info')">${ICONS.unlink || ICONS.lock} Revoke all sessions</button>
            <button class="btn btn--secondary" style="justify-content:flex-start;text-align:left;color:var(--danger)" onclick="closeSlideover(); window.__toast('Impersonation requires Super Admin co-sign · request sent','info')">${ICONS.lock} Impersonate · Super Admin only</button>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
          </div>`,
      }),

      "emp-send-message": (emp, p) => ({
        title: "Send message · " + emp.name,
        body: `
          <div class="info-banner" style="margin-bottom:14px">${ICONS.send || ""}<div>Email, Slack, or Teams. All messages are threaded back into the audit log on the employee's record.</div></div>
          <div class="form-grid">
            <div class="field"><label class="field__label">Channel</label><select class="select"><option>Email (${emp.email})</option><option>Slack DM</option><option>Microsoft Teams DM</option><option>All three (broadcast)</option></select></div>
            <div class="field"><label class="field__label">Priority</label><select class="select"><option>Normal</option><option>High</option><option>Urgent</option></select></div>
            <div class="field field--full"><label class="field__label">Subject</label><input class="input" placeholder="e.g. Q2 KPI acknowledgement reminder"></div>
            <div class="field field--full"><label class="field__label">Message</label><textarea class="textarea" rows="5" placeholder="Hi ${(emp.name||"").split(" ")[0]},\n\n…"></textarea></div>
            <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Request acknowledgement (read receipt + reply prompt)</label></div>
          </div>
          <div class="form-foot">
            <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
            <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Message sent to ' + ${"'" + emp.name + "'"} + ' · logged','success')">${ICONS.send} Send</button>
          </div>`,
      }),
    };

    if (!window.__hrStubMapBound) {
      window.__hrStubMapBound = true;
      Object.keys(stubMap).forEach(action => {
        document.addEventListener("click", ev => {
          const btn = ev.target.closest(`[data-action="${action}"]`);
          if (!btn) return;
          const emp = stubEmpNow();
          if (!emp) return;
          const dialog = stubMap[action](emp, getFullProfile(emp));
          openSlideover({ title: dialog.title, body: dialog.body });
        });
      });
    }

  // Panel "View all" / "Open report" cross-nav
  $$("[data-nav]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    location.hash = "#" + a.dataset.nav;
  }));

  // Assign trainings — radio selector toggles which audience fields are visible
  function applyAssignmentType(type) {
    const teamField = document.getElementById("team-picker-field");
    const empField = document.getElementById("employees-field");
    const allSummary = document.getElementById("all-summary");
    const empLabel = document.getElementById("employees-field-label");
    if (!teamField || !empField || !allSummary) return;

    // Reset visibility
    teamField.style.display = "none";
    empField.style.display = "none";
    allSummary.style.display = "none";

    if (type === "individuals") {
      empField.style.display = "";
      if (empLabel) empLabel.textContent = "Employees";
    } else if (type === "team") {
      teamField.style.display = "";
    } else if (type === "selected") {
      teamField.style.display = "";
      empField.style.display = "";
      if (empLabel) empLabel.textContent = "Members from the selected team";
    } else if (type === "all") {
      allSummary.style.display = "";
    }
  }

  $$("#assignment-type .radio").forEach(r => r.addEventListener("click", () => {
    $$("#assignment-type .radio").forEach(x => x.classList.remove("radio--selected"));
    r.classList.add("radio--selected");
    applyAssignmentType(r.dataset.type);
  }));

  // Team picker — show a small summary line on selection
  const teamPicker = document.getElementById("team-picker");
  if (teamPicker) {
    teamPicker.addEventListener("change", () => {
      const opt = teamPicker.options[teamPicker.selectedIndex];
      const summary = document.getElementById("team-picker-summary");
      const text = document.getElementById("team-picker-summary-text");
      if (!summary || !text) return;
      if (!opt || !opt.value) {
        summary.style.display = "none";
        return;
      }
      const count = opt.getAttribute("data-count") || "?";
      const name = opt.textContent.split(" · ")[0];
      text.textContent = `This assignment will go to ${count} members of ${name}.`;
      summary.style.display = "";
    });
  }

  // Tag remove (chips-input)
  $$(".tag__remove").forEach(x => x.addEventListener("click", e => {
    e.target.closest(".tag").remove();
  }));

  // Document categories
  $$(".doc-cat").forEach(c => c.addEventListener("click", () => {
    $$(".doc-cat").forEach(x => x.classList.remove("doc-cat--active"));
    c.classList.add("doc-cat--active");
  }));

  // Channel pills toggle
  $$(".chan-pill").forEach(p => p.addEventListener("click", () => p.classList.toggle("chan-pill--on")));

  // Checkboxes toggle
  $$(".checkbox").forEach(cb => cb.addEventListener("click", e => {
    e.preventDefault();
    cb.classList.toggle("checkbox--checked");
  }));

  // Page-level action buttons (toasts)
  $$("[data-action]").forEach(b => b.addEventListener("click", async () => {
    const action = b.dataset.action;

    // ── Real API-backed workflow actions ──────────────────────────────────
    // These call the backend, then refresh the affected dataset + re-render.
    if (window.api) {
      try {
        // Leave approve / deny
        if (action === "approve-leave" || action === "deny-leave") {
          const id = b.dataset.leaveId;
          if (id) {
            b.disabled = true;
            const decision = action === "approve-leave" ? "APPROVED" : "REJECTED";
            await api.leave.decide(id, decision);
            toast(decision === "APPROVED"
              ? "Leave approved ✓ · Employee notified · Audit entry created"
              : "Leave denied · Employee notified");
            await refreshAndRerender("leaveRequests");
            fadeRow(b);
            return;
          }
        }
        // KPI assignment approve / reject (HR side)
        if (action === "hr-approve-assignment" || action === "hr-reject-assignment") {
          const id = b.dataset.id;
          if (id) {
            b.disabled = true;
            if (action === "hr-approve-assignment") {
              await api.kpi.approve(id);
              toast("KPI assignment approved ✓ · Employee notified");
            } else {
              await api.kpi.reject(id, { reason: "Returned by HR for revision" });
              toast("KPI assignment rejected · Sent back for revision");
            }
            await refreshAndRerender("kpiAssignments");
            fadeRow(b);
            return;
          }
        }
        // Certificate / training verification
        if (action === "verify-cert" || action === "reject-cert") {
          const id = b.dataset.verifId;
          if (id) {
            b.disabled = true;
            if (action === "verify-cert") {
              await api.training.verify(id);
              toast("Certificate verified ✓ · Training closed · Audit entry created");
            } else {
              await api.training.reject(id, "Certificate rejected — please re-upload");
              toast("Certificate rejected · Employee notified to re-upload");
            }
            fadeRow(b);
            return;
          }
        }
        // Background check start
        if (action === "start-bgc") {
          const empId = b.dataset.empId;
          if (empId) {
            b.disabled = true;
            await api.lifecycle.requestBgCheck({ empId, type: "EMPLOYMENT_VERIFICATION" });
            toast("Background check requested · Vendor notified");
            b.disabled = false;
            return;
          }
        }
      } catch (e) {
        toast("Action failed: " + (e.message || "unknown error"));
        b.disabled = false;
        return;
      }
    }

    // ── UI-only / not-yet-backed actions: keep the informative toast ───────
    const messages = {
      "submit-assignment": "Training assigned to 3 employees · Notifications sent",
      "submit-pm": "PM assignment recorded · Notifications sent · Audit log entry created",
      "send-notif": "Notification queued · 147 recipients",
      "add-employee": "Add Employee form would open in a real environment",
      "add-training": "Add Training form would open in a real environment",
      "new-onboarding": "Onboarding wizard would open in a real environment",
      "export-csv": "Export started · CSV will download when ready",
      "preview-cert": "Opening certificate preview…",
      "verify-cert": "Certificate verified ✓ · Training closed for this employee · Audit log entry created",
      "reject-cert": "Certificate rejected · Employee notified to re-upload",
      "allow-reupload": "Re-upload allowed · Employee can replace the file once · They have been notified",
      "deny-reupload": "Re-upload denied · Employee notified",
      "grant-extension": "Deadline extended · Employee notified · Audit log entry created",
      "deny-extension": "Extension denied · Employee notified",
      "modify-extension": "Opens a dialog to enter a custom number of days",
      "extend-assignment": "Bulk deadline extension applied · Notifications queued for all affected employees",
      "approve-leave": "Leave approved ✓ · Employee notified · Calendar updated · Audit log entry created",
      "deny-leave": "Leave denied · Employee notified with HR's note",
    };
    toast(messages[action] || "Action completed");

    // For verification actions, remove the row from view so the queue shrinks
    if (["verify-cert", "reject-cert"].includes(action)) {
      const row = b.closest(".verif-row");
      if (row) {
        row.style.transition = "opacity 240ms, transform 240ms";
        row.style.opacity = "0";
        row.style.transform = "translateX(20px)";
        setTimeout(() => row.remove(), 240);
      }
    }
    if (["allow-reupload", "deny-reupload"].includes(action)) {
      const row = b.closest(".verif-row");
      if (row) {
        row.style.transition = "opacity 240ms, transform 240ms";
        row.style.opacity = "0";
        row.style.transform = "translateX(20px)";
        setTimeout(() => row.remove(), 240);
      }
    }
    if (["grant-extension", "deny-extension", "approve-leave", "deny-leave"].includes(action)) {
      const row = b.closest(".verif-row");
      if (row) {
        row.style.transition = "opacity 240ms, transform 240ms";
        row.style.opacity = "0";
        row.style.transform = "translateX(20px)";
        setTimeout(() => row.remove(), 240);
      }
    }
  }));

  // Tab switching for Training Verification page
  $$("[data-tab]").forEach(t => t.addEventListener("click", () => {
    const target = t.dataset.tab;
    // Activate this tab, deactivate siblings
    const parent = t.parentElement;
    $$(".tab", parent).forEach(x => x.classList.remove("tab--active"));
    t.classList.add("tab--active");
    // Show matching tab content, hide others
    $$("[data-tab-content]").forEach(c => {
      c.style.display = c.dataset.tabContent === target ? "" : "none";
    });
  }));

  // Row-clickable rows → slide-over with employee detail
  $$(".row-clickable[data-emp-id]").forEach(tr => tr.addEventListener("click", () => {
    const id = tr.dataset.empId;
    const emp = DATA.employees.find(e => e.id === id);
    if (!emp) return;
    // Go straight to the full detail page — much more useful than the cramped slide-over
    location.hash = "#employee-detail/" + emp.id;
  }));

  // Training cards click
  $$("[data-training-id]").forEach(t => t.addEventListener("click", () => {
    const id = t.dataset.trainingId;
    const tr = DATA.trainings.find(x => x.id === id);
    if (!tr) return;
    openSlideover({
      title: tr.title,
      body: `
        <div style="margin-bottom:18px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:var(--bright);font-weight:700;margin-bottom:6px">${tr.provider}</div>
          <div style="font-size:13px;color:var(--ink-500);line-height:1.6">Duration: ${tr.duration} · Required for: ${tr.required}</div>
        </div>
        <div class="form-grid">
          <div class="field"><label class="field__label">Currently Enrolled</label><div style="font-size:22px;font-weight:700;color:var(--ink-900)">${tr.enrolled}</div></div>
          <div class="field"><label class="field__label">Completion Rate</label><div style="font-size:22px;font-weight:700;color:var(--ok)">${tr.completion}%</div></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary">${ICONS.edit} Edit</button>
          <button class="btn btn--primary">${ICONS.send} Assign</button>
        </div>`,
    });
  }));

  // Report tiles
  $$("[data-report-id]").forEach(t => t.addEventListener("click", () => {
    const r = DATA.reports.find(x => x.id === t.dataset.reportId);
    openSlideover({
      title: r.title,
      body: `
        <p style="font-size:13px;color:var(--ink-700);line-height:1.6;margin:0 0 18px">${r.desc}</p>
        <div style="background:var(--ink-100);border-radius:10px;padding:40px 20px;text-align:center;color:var(--ink-500);font-size:13px;margin-bottom:16px">
          📊  Report preview would render here<br>
          <span style="font-size:11.5px;color:var(--ink-400)">Live charts, tables, and filters</span>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary">${ICONS.download} Export PDF</button>
          <button class="btn btn--secondary">${ICONS.download} Export Excel</button>
          <button class="btn btn--primary">Open full report ${ICONS.arrowRight}</button>
        </div>`,
    });
  }));

  // ── Generic page-level tab switching ─────────────────────
  // Any page with `<button class="tab" data-tab="X">` and matching
  // `<div class="tabpane" data-tabpane="X">` siblings will switch
  // on click. The first tab+pane stay active by default.
  $$(".tab[data-tab]").forEach(t => t.addEventListener("click", () => {
    const target = t.dataset.tab;
    // Find the tab group this button belongs to (its parent .tabs)
    const group = t.closest(".tabs");
    if (!group) return;
    group.querySelectorAll(".tab").forEach(x => x.classList.remove("tab--active"));
    t.classList.add("tab--active");
    // Find sibling tabpanes that follow this tabs group
    const container = group.parentElement;
    container.querySelectorAll(":scope > .tabpane[data-tabpane]").forEach(p => {
      p.classList.toggle("tabpane--active", p.dataset.tabpane === target);
    });
  }));

  // ── FilterBar mounts (HR pages) ─────────────────────────
  if (window.FilterBar) {
    const fb = (id, opts) => document.getElementById(id) && FilterBar.mount(id, opts);
    const pg = (id, opts) => document.getElementById(id) && Pagination.mount(id, opts);

    // ── Employees ────────────────────────────────────────
    function empCount(tag) {
      return document.querySelectorAll(`#hr-employees-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-hr-employees", {
      targetContainer: "hr-employees-results",
      tabs: [
        { id: "all",         label: "All",         count: empCount("all")         },
        { id: "confirmed",   label: "Confirmed",   count: empCount("confirmed")   },
        { id: "onboarding",  label: "Onboarding",  count: empCount("onboarding")  },
        { id: "probation",   label: "Probation",   count: empCount("probation")   },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "dept",   label: "Department", options: ["All departments", "Cloud Engineering", "Advisory", "Delivery", "People Operations", "Pre-sales", "Finance & Admin"] },
        { id: "status", label: "Status",     options: ["All status", "Confirmed", "Onboarding", "Probation"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-employees", { targetContainer: "hr-employees-results", itemSelector: "tbody tr[data-tag]", pageSize: 10 });

    function hrLeaveCount(tag) {
      return document.querySelectorAll(`#hr-leaves-results tbody tr[data-tag~="${tag}"]`).length;
    }

    // ── Leaves (item 11) — year filter + tabs ─────────────
    fb("fb-hr-leaves", {
      targetContainer: "hr-leaves-results",
      tabs: [
        { id: "pending_hr", label: "Pending HR",        count: hrLeaveCount("pending_hr") },
        { id: "pending_pm", label: "Pending PM",        count: hrLeaveCount("pending_pm") },
        { id: "approved",   label: "Approved",          count: hrLeaveCount("approved")   },
        { id: "denied",     label: "Denied/cancelled",  count: hrLeaveCount("denied")     },
        { id: "all",        label: "All",               count: hrLeaveCount("all")        },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "year",     label: "Year",      options: ["All years", "2026", "2025", "2024"] },
        { id: "type",     label: "Type",      options: ["All types", "Annual", "Sick", "Compassionate", "Hajj", "Unpaid", "Maternity"] },
        { id: "priority", label: "Priority",  options: ["All priorities", "Urgent", "Normal"] },
        { id: "dept",     label: "Department",options: ["All depts", "Cloud Engineering", "Advisory", "Delivery"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-leaves", { targetContainer: "hr-leaves-results", itemSelector: "tbody tr[data-tag]", pageSize: 8 });

    // ── KPI Management (item 8) — list-only ───────────────
    fb("fb-hr-kpis", {
      targetContainer: "hr-kpis-results",
      tabs: [
        { id: "active",   label: "Active KPIs",  count: 42 },
        { id: "at-risk",  label: "At risk",       count: 5 },
        { id: "achieved", label: "Achieved"               },
        { id: "all",      label: "All cycles"             },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "dept",     label: "Department", options: ["All depts", "Cloud Engineering", "Advisory", "Delivery"] },
        { id: "status",   label: "Status",     options: ["All statuses", "On track", "At risk", "Achieved", "Missed"] },
        { id: "category", label: "Category",   options: ["All categories", "Learning", "Performance", "Delivery", "Leadership", "BD"] },
        { id: "cycle",    label: "Cycle",      options: ["All cycles", "Q2 2026", "Q1 2026"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-kpis", { targetContainer: "hr-kpis-results", itemSelector: "tbody tr[data-tag], .kpi-card[data-tag]", pageSize: 10 });

    // ── KPI Management · All Cycles tab ───────────────────
    function cyCount(tag) {
      return document.querySelectorAll(`#hr-cycles-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-hr-cycles", {
      targetContainer: "hr-cycles-results",
      tabs: [
        { id: "all",      label: "All",      count: cyCount("all") },
        { id: "active",   label: "Active",   count: cyCount("active") },
        { id: "closed",   label: "Closed",   count: cyCount("closed") },
        { id: "upcoming", label: "Upcoming", count: cyCount("upcoming") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "year",   label: "Year",   options: ["All years", "2026", "2025", "2024"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-cycles", { targetContainer: "hr-cycles-results", itemSelector: "tbody tr[data-tag]", pageSize: 6 });

    // ── KPI Management · Templates tab ────────────────────
    function tplCount(tag) {
      return document.querySelectorAll(`#hr-kpi-templates-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-hr-kpi-templates", {
      targetContainer: "hr-kpi-templates-results",
      tabs: [
        { id: "all",          label: "All",          count: tplCount("all") },
        { id: "learning",     label: "Learning",     count: tplCount("learning") },
        { id: "performance",  label: "Performance",  count: tplCount("performance") },
        { id: "delivery",     label: "Delivery",     count: tplCount("delivery") },
        { id: "leadership",   label: "Leadership",   count: tplCount("leadership") },
        { id: "business-dev", label: "Business Dev", count: tplCount("business-dev") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "owner", label: "Owner", options: ["All owners", "HR", "Team Leads"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-kpi-templates", { targetContainer: "hr-kpi-templates-results", itemSelector: "tbody tr[data-tag]", pageSize: 6 });

    // ── Project Ratings (item 9) — list-only ──────────────
    fb("fb-hr-ratings", {
      targetContainer: "hr-ratings-results",
      tabs: [
        { id: "pending_hr",  label: "Pending HR",       count: 3 },
        { id: "auto",        label: "Auto-approved",    count: 2 },
        { id: "manual",      label: "Approved manually"          },
        { id: "denied",      label: "Denied/sent back"           },
        { id: "all",         label: "All history"                },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "project", label: "Project", options: ["All projects", "Client-Alpha", "Bank-of-Sky", "TelcoCo", "Retail-Co"] },
        { id: "pm",      label: "PM",      options: ["All PMs", "Fatima Al Zaabi", "Sara Mitchell", "Khalid Mansour", "Omar Siddiqui"] },
        { id: "tl",      label: "TL",      options: ["All TLs", "Khalid Mansour"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-ratings", { targetContainer: "hr-ratings-results", itemSelector: ".rating-row[data-tag]", pageSize: 8 });

    // ── Projects (ODOO, item 10) — list-only ──────────────
    fb("fb-hr-projects", {
      targetContainer: "hr-projects-results",
      tabs: [
        { id: "all",      label: "All"                  },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "stage",  label: "Stage",  options: ["All stages", "Discovery", "Execution", "Closed", "Blocked"] },
        { id: "pm",     label: "PM",     options: ["All PMs", "Fatima Al Zaabi", "Sara Mitchell", "Khalid Mansour", "Omar Siddiqui"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-projects", { targetContainer: "hr-projects-results", itemSelector: "tbody tr[data-tag], .project-row[data-tag]", pageSize: 10 });

    function obCount(tag) {
      return document.querySelectorAll(`#hr-onboarding-results .onb-card[data-tag~="${tag}"]`).length;
    }
    fb("fb-hr-onboarding", {
      targetContainer: "hr-onboarding-results",
      tabs: [
        { id: "all",        label: "All",            count: obCount("all") },
        { id: "needs-attn", label: "Needs attention",count: obCount("needs-attn") },
        { id: "on-track",   label: "On track",       count: obCount("on-track") },
        { id: "day-1",      label: "Day 1",          count: obCount("day-1") },
        { id: "day-30",     label: "Day 30",         count: obCount("day-30") },
        { id: "day-90",     label: "Day 90",         count: obCount("day-90") },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "dept",    label: "Department", options: ["All depts", "Cloud Eng", "DevOps", "Advisory", "Delivery"] },
        { id: "manager", label: "Manager",    options: ["All managers", "Khalid Mansour", "Sara Mitchell"] },
      ],
      search: true,
      download: true,
    });

    function pCount(tag) {
      return document.querySelectorAll(`#hr-probation-results > .prob-row[data-tag~="${tag}"]`).length;
    }
    fb("fb-hr-probation", {
      targetContainer: "hr-probation-results",
      tabs: [
        { id: "all",                label: "All",                 count: pCount("all") },
        { id: "high",               label: "High risk",           count: pCount("high") },
        { id: "decisions-pending",  label: "Decisions pending",   count: pCount("decisions-pending") },
        { id: "medium",             label: "Medium risk",         count: pCount("medium") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "risk",  label: "Risk",       options: ["All risk", "High risk", "Medium risk", "Low risk"] },
        { id: "dept",  label: "Department", options: ["All depts", "Cloud Engineering", "Advisory", "Pre-sales", "Delivery"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-probation", { targetContainer: "hr-probation-results", itemSelector: ".prob-row[data-tag]", pageSize: 5 });

    function bgcCount(tag) {
      return document.querySelectorAll(`#hr-bgc-results tbody tr[data-tag~="${tag}"]`).length;
    }
    fb("fb-hr-bgc", {
      targetContainer: "hr-bgc-results",
      tabs: [
        { id: "all",                 label: "All",            count: bgcCount("all") },
        { id: "verified",            label: "Verified",       count: bgcCount("verified") },
        { id: "in-progress",         label: "In progress",    count: bgcCount("in-progress") },
        { id: "pending-references",  label: "Pending refs",   count: bgcCount("pending-references") },
        { id: "awaiting-upload",     label: "Awaiting docs",  count: bgcCount("awaiting-upload") },
        { id: "has-gaps",            label: "Has gaps",       count: bgcCount("has-gaps") },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "source", label: "Source", options: ["All sources", "Sterling", "Manual"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-bgc", { targetContainer: "hr-bgc-results", itemSelector: "tbody tr[data-tag]", pageSize: 10 });

    // ── Training Catalogue (item 5) — list-only ───────────
    fb("fb-hr-catalogue", {
      targetContainer: "hr-catalogue-results",
      views: ["list"],
      period: false,
      filters: [
        { id: "provider", label: "Provider", options: ["All providers", "AWS", "KnowBe4", "Udemy", "ITIL", "Internal", "HashiCorp"] },
        { id: "audience", label: "Audience", options: ["All audiences", "All staff", "Technical", "DevOps", "Specialist"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-catalogue", { targetContainer: "hr-catalogue-results", itemSelector: ".tcard[data-tag]", pageSize: 9 });

    // ── Assign Trainings · Active Assignments (item 6) ────
    fb("fb-hr-assignments", {
      targetContainer: "hr-assignments-results",
      tabs: [
        { id: "all",            label: "All" },
        { id: "has-overdue",    label: "Has overdue" },
        { id: "has-awaiting",   label: "Has awaiting" },
        { id: "has-in-progress",label: "Has in-progress" },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "provider", label: "Provider", options: ["All providers", "AWS", "KnowBe4", "ITIL", "Internal"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-assignments", { targetContainer: "hr-assignments-results", itemSelector: "tbody tr[data-tag]", pageSize: 5 });

    // ── Training Verification (item 7) — list-only ────────
    function tvCount(tag) {
      return document.querySelectorAll(`#hr-training-verify-results [data-tag~="${tag}"]`).length;
    }
    fb("fb-hr-training-verify", {
      targetContainer: "hr-training-verify-results",
      tabs: [
        { id: "all",            label: "All",                       count: tvCount("all")            },
        { id: "verifications",  label: "Certificate verifications", count: tvCount("verifications")  },
        { id: "reuploads",      label: "Re-upload requests",        count: tvCount("reuploads")      },
        { id: "extensions",     label: "Extension requests",        count: tvCount("extensions")     },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "provider", label: "Provider", options: ["All providers", "AWS", "KnowBe4", "Udemy", "ITIL"] },
        { id: "dept",     label: "Department", options: ["All depts", "Cloud Engineering", "Advisory", "Delivery"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-training-verify", { targetContainer: "hr-training-verify-results", itemSelector: ".verif-row[data-tag]", pageSize: 5 });

    fb("fb-hr-badges", {
      targetContainer: "hr-badges-results",
      views: ["tiles", "list"],
      period: false,
      filters: [
        { id: "role",  label: "Grantable by", options: ["Any role", "Employee", "PM", "TL", "HR", "Admin"] },
        { id: "points",label: "Point range",  options: ["All points", "1-15 pts", "16-40 pts", "41-75 pts", "76+ pts"] },
      ],
      search: true,
      download: true,
    });

    // ── Notification Templates (item 14) — list-only ──────
    fb("fb-hr-notifs", {
      targetContainer: "hr-notifs-results",
      tabs: [
        { id: "all",         label: "All templates" },
        { id: "training",    label: "Training" },
        { id: "leave",       label: "Leave" },
        { id: "kpi",         label: "KPI" },
        { id: "recognition", label: "Recognition" },
      ],
      views: ["list"],
      period: false,
      filters: [
        { id: "channel",  label: "Channel",  options: ["All channels", "Email", "In-app", "Slack", "Teams"] },
        { id: "audience", label: "Audience", options: ["All audiences", "Individual", "Team", "Department", "Role"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-notifs", { targetContainer: "hr-notifs-results", itemSelector: "tbody tr[data-tag]", pageSize: 8 });

    // ── Documents (item 15) — list-only ───────────────────
    fb("fb-hr-docs", {
      targetContainer: "hr-docs-results",
      tabs: [
        { id: "all",          label: "All" },
        { id: "needs-action", label: "Needs action" },
        { id: "requests",     label: "Employee requests" },
        { id: "odoo",         label: "From ODOO" },
        { id: "portal",       label: "Portal-uploaded" },
      ],
      views: ["list"],
      period: true,
      filters: [
        { id: "type",   label: "Type",   options: ["All types", "Offer Letter", "Contract", "NDA", "Evaluation", "Government", "Certificate"] },
        { id: "status", label: "Status", options: ["All status", "Signed", "Verified", "Pending", "Awaiting"] },
      ],
      search: true,
      download: true,
    });
    pg("pg-hr-docs", { targetContainer: "hr-docs-results", itemSelector: "tbody tr[data-tag]", pageSize: 10 });

    fb("fb-hr-reports", {
      views: ["tiles", "list"],
      period: true,
      filters: [
        { id: "category", label: "Category", options: ["All categories", "HR Operations", "KPI & Performance", "Training", "Recognition", "Leave", "Payroll"] },
        { id: "format",   label: "Format",   options: ["All formats", "PDF only", "Excel only", "CSV only"] },
      ],
      search: true,
      download: false,
    });
  }

  // ── Badge create/edit modal ─────────────────────────────
  function wireSlideoverCheckboxes() {
    setTimeout(() => {
      document.querySelectorAll('.so-body .checkbox').forEach(cb => {
        cb.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          cb.classList.toggle("checkbox--checked");
          const box = cb.querySelector(".checkbox__box");
          if (box) {
            const checked = cb.classList.contains("checkbox--checked");
            box.innerHTML = checked ? (ICONS.check || "✓") : "";
          }
        });
      });
    }, 50);
  }
  document.querySelectorAll('[data-action="create-badge"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({ title: "Create new badge", body: badgeFormHtml(null) });
    wireSlideoverCheckboxes();
  }));
  document.querySelectorAll('[data-action="edit-badge"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({ title: "Edit badge", body: badgeFormHtml(b.dataset.badgeId) });
    wireSlideoverCheckboxes();
  }));
  document.querySelectorAll('[data-action="view-grants"]').forEach(b => b.addEventListener("click", () => {
    window.__toast && window.__toast("Loading grant history…", "info");
  }));

  // ── Report download buttons ────────────────────────────
  document.querySelectorAll('[data-action="report-download"]').forEach(b => b.addEventListener("click", () => {
    const fmt = b.dataset.format.toUpperCase();
    const id  = b.dataset.reportId;
    window.__toast && window.__toast(`Generating ${fmt} for report ${id}… download will start shortly.`, "info");
  }));

  // ── Customize dashboard sections (reorder rows on HR Dashboard) ──
  document.querySelectorAll('[data-action="customize-dashboard"]').forEach(b => b.addEventListener("click", () => {
    if (!window.SUDO_LAYOUT) {
      window.__toast && window.__toast("Layout helper not loaded — try refreshing", "warn");
      return;
    }
    SUDO_LAYOUT.openCustomizer({
      pageKey: "hr-dashboard",
      label: "HR Dashboard",
      sections: HR_DASHBOARD_SECTIONS,
      defaultOrder: HR_DASHBOARD_DEFAULT_ORDER,
      onSave: () => {
        window.__toast && window.__toast("Layout saved — reloading", "success");
        setTimeout(() => location.reload(), 500);
      },
    });
  }));

  // ── Background Checks ─────────────────────────────────
  document.querySelectorAll('[data-action="start-bgc"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: "Start new background check",
      body: startBgcDialogHtml(),
    });
  }));
  document.querySelectorAll('[data-action="bgc-comment"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: `Add comment · ${b.dataset.bgcId}`,
      body: `
        <div class="info-banner" style="margin-bottom:14px">${ICONS.message || ICONS.pen}<div>Comments are stored on the check record and audit-logged. Only HR can see them.</div></div>
        <div class="field"><label class="field__label">Comment</label><textarea class="textarea" rows="4" placeholder="e.g. Vendor confirmed dates match. Awaiting reference 2 of 3."></textarea></div>
        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Comment added to ${b.dataset.bgcId}','success')">${ICONS.send} Save comment</button>
        </div>`,
    });
  }));
  document.querySelectorAll('[data-action="bgc-complete"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: `Mark check complete · ${b.dataset.bgcId}`,
      body: `
        <div class="info-banner" style="margin-bottom:14px">${ICONS.check}<div>Mark this background check as <strong>Verified</strong>. This will close the check and update the employee's record.</div></div>
        <div class="form-grid">
          <div class="field"><label class="field__label">Outcome</label><select class="select"><option>Verified — clean</option><option>Verified — minor discrepancy</option><option>Verified with gaps disclosed</option></select></div>
          <div class="field"><label class="field__label">Verified on</label><input class="input" type="date" value="2026-05-17" /></div>
          <div class="field field--full"><label class="field__label">Final note</label><textarea class="textarea" rows="2" placeholder="Optional summary visible on the employee record"></textarea></div>
        </div>
        <div class="form-foot">
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('${b.dataset.bgcId} marked Verified','success')">${ICONS.check} Confirm complete</button>
        </div>`,
    });
  }));

  // ── Leave: Auto-approval rule ─────────────────────────
  document.querySelectorAll('[data-action="leave-auto-rule"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: "Configure auto-approval rule",
      body: autoApprovalRuleHtml(),
    });
  }));

  document.querySelectorAll('[data-action="manage-leave-balances"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: "Manage leave balances",
      body: manageLeaveBalancesHtml(),
    });
    // Wire mode-toggle (Single vs Bulk)
    setTimeout(() => {
      document.querySelectorAll('.mlb-mode-btn').forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll('.mlb-mode-btn').forEach(b => b.classList.remove('mlb-mode-btn--active'));
          btn.classList.add('mlb-mode-btn--active');
          const single = document.querySelector('.mlb-single');
          const bulk   = document.querySelector('.mlb-bulk');
          if (btn.dataset.mode === 'single') { single.style.display = ''; bulk.style.display = 'none'; }
          else                                 { single.style.display = 'none'; bulk.style.display = ''; }
        });
      });
      // +/- stepper buttons
      document.querySelectorAll('.mlb-step').forEach(s => {
        s.addEventListener("click", () => {
          const input = document.querySelector(`#${s.dataset.target}`);
          if (!input) return;
          const cur = parseInt(input.value || "0", 10);
          const delta = parseInt(s.dataset.delta, 10);
          input.value = cur + delta;
        });
      });
    }, 50);
  }));

  // ── Trainings: New assignment ─────────────────────────
  document.querySelectorAll('[data-action="new-training-assignment"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: "Assign new training",
      body: newAssignmentDialogHtml(),
    });
  }));
  document.querySelectorAll('[data-action="extend-deadline"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: "Extend deadline",
      body: extendDeadlineDialogHtml(b.dataset.trainingId),
    });
  }));

  // ── Notification templates: Add template ──────────────
  document.querySelectorAll('[data-action="add-template"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: "Create notification template",
      body: addTemplateDialogHtml(),
    });
  }));

  // ── Project Ratings: See full record ──────────────────
  document.querySelectorAll('[data-action="see-full-record"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: `Project rating · ${b.dataset.ratingId || ""}`,
      body: seeFullRecordHtml(b.dataset.ratingId),
    });
  }));

  // ── Documents: review employee request + manage doc types ─────
  document.querySelectorAll('[data-action="review-doc-request"]').forEach(b => b.addEventListener("click", (e) => {
    e.stopPropagation();
    openSlideover({
      title: `Review document request · ${b.dataset.requestId}`,
      body: docRequestReviewHtml(b.dataset.requestId),
    });
  }));
  document.querySelectorAll('[data-action="manage-doc-types"]').forEach(b => b.addEventListener("click", () => {
    document.getElementById('doc-types-panel')?.scrollIntoView({behavior: "smooth", block: "start"});
    window.__toast && window.__toast("Scrolled to Document Types — toggle availability below","info");
  }));
  document.querySelectorAll('[data-action="add-doc-type"]').forEach(b => b.addEventListener("click", () => {
    openSlideover({
      title: "Add document type",
      body: addDocTypeHtml(),
    });
  }));
  // Wire doc-type toggles
  document.querySelectorAll('[data-doc-type-toggle]').forEach(t => t.addEventListener("click", (e) => {
    e.stopPropagation();
    const name = t.dataset.docTypeToggle;
    t.classList.toggle("toggle--on");
    const enabled = t.classList.contains("toggle--on");
    window.__toast && window.__toast(`${name} is now ${enabled ? "available" : "disabled"} for employees`, "success");
  }));
}

// =========================================================
// DIALOG HTML FUNCTIONS
// =========================================================
function startBgcDialogHtml() {
  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.shield}<div>Choose the vendor and the employee(s). Clicking <strong>Send request</strong> drafts an email to the vendor's case email and records the check as <em>Awaiting report</em>.</div></div>
    <div class="form-grid">
      <div class="field"><label class="field__label">Check type</label><select class="select"><option>Single employee</option><option>Multiple employees (bulk request)</option></select></div>
      <div class="field"><label class="field__label">Vendor / agency</label><select class="select"><option>Sterling Background Check</option><option>HireRight</option><option>First Advantage</option><option>Manual / in-house</option><option>Other — specify below</option></select></div>
      <div class="field field--full"><label class="field__label">Vendor company name</label><input class="input" placeholder="e.g. Sterling Talent Solutions" value="Sterling Talent Solutions" /></div>
      <div class="field field--full"><label class="field__label">Vendor case email</label><input class="input" type="email" placeholder="cases@sterlingcheck.com" value="cases@sterlingcheck.com" /></div>
      <div class="field field--full"><label class="field__label">Employee(s) to check</label>
        <select class="select" multiple size="5" style="height:auto">
          <option>E061 · Layla Younes — Junior Cloud Eng.</option>
          <option>E062 · Vince Hartley — DevOps Engineer</option>
          <option>E063 · Ines Lemaitre — Junior Consultant</option>
          <option>E064 · Vikram Mehrotra — Cloud Engineer</option>
          <option>E065 · Diana Petrov — Solutions Consultant</option>
        </select>
        <div class="field__hint">Hold ⌘/Ctrl to select multiple. For bulk requests, the vendor will get one consolidated email.</div>
      </div>
      <div class="field field--full"><label class="field__label">Checks requested</label>
        <div class="role-checks">
          <label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Employment verification (past 5 years)</label>
          <label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Education verification</label>
          <label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Criminal record</label>
          <label class="checkbox"><span class="checkbox__box"></span> Reference checks (3 minimum)</label>
          <label class="checkbox"><span class="checkbox__box"></span> Credit check</label>
          <label class="checkbox"><span class="checkbox__box"></span> Drug screening</label>
        </div>
      </div>
      <div class="field field--full"><label class="field__label">Special instructions (optional)</label><textarea class="textarea" rows="2" placeholder="e.g. Priority — pre-employment, need by 25 May 2026"></textarea></div>
    </div>
    <div class="form-foot">
      <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
      <button class="btn btn--secondary" onclick="closeSlideover(); window.__toast('Saved as draft — open from BGC list to send later','info')">${ICONS.download} Save draft</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Email drafted in Outlook · check recorded as Awaiting report','success')">${ICONS.send} Open Outlook &amp; send</button>
    </div>`;
}

function autoApprovalRuleHtml() {
  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.cog || ICONS.shield}<div>Rules that match are auto-approved without HR review. Toggle off any rule to require manual approval again.</div></div>

    <div class="rule-list">
      <div class="rule-row">
        <div class="rule-row__main">
          <div class="rule-row__title">Annual leave — manager-approved &amp; ≤5 days</div>
          <div class="rule-row__desc">Auto-approve when PM has approved AND duration ≤ 5 days AND not flagged as urgent</div>
          <div class="rule-row__meta">12 leaves auto-approved this month · 0 reversed</div>
        </div>
        <span class="toggle toggle--on" data-rule="annual-short"><span class="toggle__knob"></span></span>
      </div>
      <div class="rule-row">
        <div class="rule-row__main">
          <div class="rule-row__title">Sick leave — 1–2 days with cert uploaded</div>
          <div class="rule-row__desc">Auto-approve when duration ≤ 2 days AND medical certificate is attached</div>
          <div class="rule-row__meta">8 leaves auto-approved this month · 0 reversed</div>
        </div>
        <span class="toggle toggle--on" data-rule="sick-cert"><span class="toggle__knob"></span></span>
      </div>
      <div class="rule-row">
        <div class="rule-row__main">
          <div class="rule-row__title">Compassionate leave — 1–3 days</div>
          <div class="rule-row__desc">Auto-approve when duration ≤ 3 days regardless of cascade</div>
          <div class="rule-row__meta">Disabled — requires manual review</div>
        </div>
        <span class="toggle" data-rule="compassionate"><span class="toggle__knob"></span></span>
      </div>
      <div class="rule-row">
        <div class="rule-row__main">
          <div class="rule-row__title">Hajj leave — first-time applicants</div>
          <div class="rule-row__desc">Auto-approve up to 30 days for an employee's first Hajj request</div>
          <div class="rule-row__meta">Disabled — requires manual review</div>
        </div>
        <span class="toggle" data-rule="hajj-first"><span class="toggle__knob"></span></span>
      </div>
    </div>

    <div class="form-foot" style="margin-top:18px">
      <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
      <button class="btn btn--secondary" onclick="window.__toast('New rule builder — coming next iteration','info')">${ICONS.plus} Add custom rule</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Auto-approval rules saved · audit entry created','success')">${ICONS.check} Save changes</button>
    </div>`;
}

function manageLeaveBalancesHtml() {
  // Sample current balances for top employees (in real app these come from SUDO_DB_HELPERS.leaveBalance)
  const SAMPLE = [
    { id:"E001", name:"Ahmed Al Rashid",   annual:{ remaining:18, entitled:22 }, sick:{ remaining:12 }, compassionate:{ remaining:5 }, hajj:{ used:0, eligible:true } },
    { id:"E008", name:"Reem Al Otaibi",    annual:{ remaining:21, entitled:22 }, sick:{ remaining:14 }, compassionate:{ remaining:5 }, hajj:{ used:0, eligible:true } },
    { id:"E011", name:"Marcus Wright",     annual:{ remaining:15, entitled:22 }, sick:{ remaining:11 }, compassionate:{ remaining:5 }, hajj:{ used:0, eligible:true } },
    { id:"E020", name:"Ananya Sharma",     annual:{ remaining:8,  entitled:22 }, sick:{ remaining:11 }, compassionate:{ remaining:5 }, hajj:{ used:0, eligible:true } },
    { id:"E031", name:"Lina Haddad",       annual:{ remaining:11, entitled:22 }, sick:{ remaining:14 }, compassionate:{ remaining:5 }, hajj:{ used:0, eligible:true } },
  ];

  const balanceTableRows = SAMPLE.map(e => `
    <tr>
      <td><strong>${e.name}</strong><div class="table__mono table__mono--dim">${e.id}</div></td>
      <td class="table__mono"><strong>${e.annual.remaining}</strong> / ${e.annual.entitled}</td>
      <td class="table__mono"><strong>${e.sick.remaining}</strong> / 14</td>
      <td class="table__mono"><strong>${e.compassionate.remaining}</strong> / 5</td>
      <td>${e.hajj.eligible ? '<span class="status status--ok">Eligible</span>' : '<span class="status status--muted">Used</span>'}</td>
    </tr>
  `).join("");

  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.shield || ICONS.cog || ""}<div>Adjust an employee's leave balance, or apply a company-wide change (annual roll-over, one-time grant). Every change is audit-logged with the reason.</div></div>

    <div class="mlb-mode-toggle" style="display:inline-flex;gap:4px;background:var(--ink-50,#F8FAFC);padding:4px;border-radius:8px;margin-bottom:14px">
      <button class="mlb-mode-btn mlb-mode-btn--active" data-mode="single" style="padding:7px 14px;border:0;background:white;border-radius:6px;font-weight:600;font-size:12.5px;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.05)">Single employee</button>
      <button class="mlb-mode-btn" data-mode="bulk" style="padding:7px 14px;border:0;background:transparent;border-radius:6px;font-weight:600;font-size:12.5px;color:var(--ink-500);cursor:pointer">Bulk · all employees</button>
    </div>

    <!-- ===== SINGLE EMPLOYEE ADJUSTMENT ===== -->
    <div class="mlb-single">
      <div class="record-section">
        <div class="record-section__title">Current balances · all employees</div>
        <div class="table-wrap" style="border:1px solid var(--ink-100);border-radius:8px;max-height:260px;overflow-y:auto;margin-bottom:12px">
          <table class="table" style="font-size:12.5px">
            <thead><tr><th>Employee</th><th>Annual</th><th>Sick</th><th>Compassionate</th><th>Hajj</th></tr></thead>
            <tbody>${balanceTableRows}</tbody>
          </table>
        </div>
        <div style="font-size:11px;color:var(--ink-500)">Showing 5 of 60 employees. Use the dropdown below to adjust any employee.</div>
      </div>

      <div class="record-section">
        <div class="record-section__title">Adjust an individual</div>
        <div class="form-grid">
          <div class="field field--full"><label class="field__label">Employee</label>
            <select class="select">
              <option>E001 · Ahmed Al Rashid — Solutions Architect</option>
              <option>E008 · Reem Al Otaibi — Cloud Engineer</option>
              <option>E011 · Marcus Wright — DevOps Engineer</option>
              <option>E020 · Ananya Sharma — Senior Cloud Eng.</option>
              <option>E031 · Lina Haddad — Senior Cloud Eng.</option>
              <option>(60 total — type to search)</option>
            </select>
          </div>
          <div class="field"><label class="field__label">Leave type</label>
            <select class="select"><option>Annual</option><option>Sick</option><option>Compassionate</option><option>Hajj</option></select>
          </div>
          <div class="field"><label class="field__label">Adjustment</label>
            <div style="display:flex;gap:4px;align-items:center">
              <button class="btn btn--secondary btn--sm mlb-step" data-target="mlb-delta-single" data-delta="-1">−</button>
              <input class="input" id="mlb-delta-single" type="number" value="0" style="text-align:center;width:80px" />
              <button class="btn btn--secondary btn--sm mlb-step" data-target="mlb-delta-single" data-delta="1">+</button>
              <span style="font-size:11px;color:var(--ink-500);margin-left:6px">days · positive grants, negative deducts</span>
            </div>
          </div>
          <div class="field"><label class="field__label">Effective date</label><input class="input" type="date" value="2026-05-17" /></div>
          <div class="field"><label class="field__label">Reason</label>
            <select class="select">
              <option>Annual roll-over (carry-over from prior year)</option>
              <option>One-time grant (managerial discretion)</option>
              <option>New joiner pro-rated entitlement</option>
              <option>Correction (data fix)</option>
              <option>Negotiated package (offer-letter amendment)</option>
              <option>Disciplinary deduction</option>
              <option>Other — specify in note</option>
            </select>
          </div>
          <div class="field field--full"><label class="field__label">Note (visible in audit log)</label><textarea class="textarea" rows="2" placeholder="Optional context, e.g. 'Carry-over from unused 2025 entitlement'"></textarea></div>
        </div>
      </div>

      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Balance adjusted · audit entry created','success')">${ICONS.check || ""} Apply adjustment</button>
      </div>
    </div>

    <!-- ===== BULK / COLLECTIVE ADJUSTMENT ===== -->
    <div class="mlb-bulk" style="display:none">
      <div class="info-banner" style="margin-bottom:14px;background:#FCE9C2;border-color:#E89A1E;color:#854F0B">
        ${ICONS.alert || ""}
        <div><strong>Bulk adjustments affect every employee in scope.</strong> Always preview the impact before applying. Use the Audit Log to roll back if needed.</div>
      </div>

      <div class="record-section">
        <div class="record-section__title">Who to apply to</div>
        <div class="form-grid">
          <div class="field field--full"><label class="field__label">Scope</label>
            <select class="select">
              <option>All confirmed employees (45)</option>
              <option>All confirmed + probation employees (49)</option>
              <option>All employees including onboarding (60)</option>
              <option>Specific department only</option>
              <option>Specific manager's team only</option>
            </select>
          </div>
          <div class="field"><label class="field__label">Department (if scoped)</label>
            <select class="select"><option>—</option><option>Cloud Engineering</option><option>Advisory</option><option>Delivery</option><option>People Operations</option><option>Pre-sales</option><option>Finance &amp; Admin</option></select>
          </div>
          <div class="field"><label class="field__label">Tenure filter</label>
            <select class="select"><option>No filter</option><option>1+ year of service</option><option>2+ years of service</option><option>5+ years of service</option></select>
          </div>
        </div>
      </div>

      <div class="record-section">
        <div class="record-section__title">Adjustment</div>
        <div class="form-grid">
          <div class="field"><label class="field__label">Leave type</label>
            <select class="select"><option>Annual</option><option>Sick</option><option>Compassionate</option><option>Hajj</option></select>
          </div>
          <div class="field"><label class="field__label">Adjustment</label>
            <div style="display:flex;gap:4px;align-items:center">
              <button class="btn btn--secondary btn--sm mlb-step" data-target="mlb-delta-bulk" data-delta="-1">−</button>
              <input class="input" id="mlb-delta-bulk" type="number" value="0" style="text-align:center;width:80px" />
              <button class="btn btn--secondary btn--sm mlb-step" data-target="mlb-delta-bulk" data-delta="1">+</button>
              <span style="font-size:11px;color:var(--ink-500);margin-left:6px">days per employee</span>
            </div>
          </div>
          <div class="field"><label class="field__label">Effective date</label><input class="input" type="date" value="2026-05-17" /></div>
          <div class="field"><label class="field__label">Reason</label>
            <select class="select">
              <option>Annual roll-over (Jan 1st company-wide)</option>
              <option>Policy change (entitlement increase)</option>
              <option>One-time grant (e.g. National Day, Eid bonus days)</option>
              <option>Year-end reset</option>
              <option>Pro-rating correction</option>
              <option>Other — specify in note</option>
            </select>
          </div>
          <div class="field field--full"><label class="field__label">Note (visible in audit log)</label><textarea class="textarea" rows="2" placeholder="Optional context, e.g. 'Policy update Q3 2026 — annual entitlement increased from 22 to 25 days for all 1y+ employees'"></textarea></div>
        </div>
      </div>

      <div class="record-section">
        <div class="record-section__title">Preview impact</div>
        <div class="info-banner" style="background:var(--tint-3,#E5F0FB);color:var(--ink-900)">
          ${ICONS.eye || ICONS.check || ""}
          <div>Applies to <strong>45 employees</strong>. Total entitlement change: <strong>+0 days × 45 = 0 days</strong>. All 45 will receive an in-app notification. <a href="#" style="color:var(--bright);font-weight:600">Download impact CSV</a></div>
        </div>
      </div>

      <div class="form-foot">
        <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
        <button class="btn btn--secondary" onclick="window.__toast('Dry-run complete · 45 employees would be affected','info')">Dry run</button>
        <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Bulk adjustment applied to 45 employees · notifications sent','success')">${ICONS.check || ""} Apply to all</button>
      </div>
    </div>`;
}

function newAssignmentDialogHtml() {
  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.book || ICONS.send}<div>Pick a training, choose recipients, and set the deadline. The training is <strong>auto-accepted</strong> on assignment — the recipient's countdown starts immediately.</div></div>
    <div class="form-grid">
      <div class="field field--full"><label class="field__label">Training</label>
        <select class="select">
          <option>AWS Solutions Architect Associate (SAA-C03)</option>
          <option>AWS Cloud Practitioner Essentials</option>
          <option>AWS Security Specialty</option>
          <option>AWS DevOps Engineer Professional</option>
          <option>KnowBe4 — Security Awareness Training</option>
          <option>KnowBe4 — Phishing Simulation Module</option>
          <option>ITIL 4 Foundation</option>
          <option>Udemy — Effective Communication for Engineers</option>
        </select>
      </div>
      <div class="field"><label class="field__label">Priority</label><select class="select"><option>Required (counts toward probation)</option><option>Recommended</option><option>Optional</option></select></div>
      <div class="field"><label class="field__label">Deadline</label><input class="input" type="date" value="2026-06-15" /></div>
      <div class="field field--full"><label class="field__label">Assign to</label>
        <select class="select" multiple size="6" style="height:auto">
          <option>Whole department: Cloud Engineering (37 people)</option>
          <option>Whole department: Advisory (12 people)</option>
          <option>Whole department: Delivery (8 people)</option>
          <option>Status: all in Onboarding (11 people)</option>
          <option>Status: all in Probation (4 people)</option>
          <option>E008 · Reem Al Otaibi</option>
          <option>E011 · Marcus Wright</option>
          <option>E024 · Hassan Bukhari</option>
        </select>
        <div class="field__hint">Mix individuals and groups — duplicates are resolved automatically.</div>
      </div>
      <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Notify by email + in-app on assignment</label></div>
      <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Send 7-day, 3-day, and 1-day reminders before deadline</label></div>
    </div>
    <div class="form-foot">
      <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Training assigned · recipients notified','success')">${ICONS.send} Assign</button>
    </div>`;
}

function extendDeadlineDialogHtml(trainingId) {
  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.clock}<div>Extending a deadline is logged on the training record and visible to the employee, their TL, and HR.</div></div>
    <div class="form-grid">
      <div class="field"><label class="field__label">Current deadline</label><input class="input" type="date" value="2026-05-30" disabled /></div>
      <div class="field"><label class="field__label">New deadline</label><input class="input" type="date" value="2026-06-15" /></div>
      <div class="field field--full"><label class="field__label">Reason for extension</label>
        <select class="select"><option>Exam slot unavailability</option><option>Medical leave overlap</option><option>Project urgency conflict</option><option>HR-approved exception</option><option>Other — specify below</option></select>
      </div>
      <div class="field field--full"><label class="field__label">Notes (visible to employee + TL)</label><textarea class="textarea" rows="2" placeholder="Optional — e.g. AWS exam slots booked through end of May"></textarea></div>
    </div>
    <div class="form-foot">
      <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Deadline extended · employee and TL notified','success')">${ICONS.check} Extend deadline</button>
    </div>`;
}

function addTemplateDialogHtml() {
  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.message || ICONS.send}<div>Templates are reusable notification messages. Use <code>{{employee_name}}</code>, <code>{{training_title}}</code>, <code>{{deadline}}</code>, and similar tokens — they're filled in at send time.</div></div>
    <div class="form-grid">
      <div class="field"><label class="field__label">Template name</label><input class="input" placeholder="e.g. Training assigned — high priority" /></div>
      <div class="field"><label class="field__label">Category</label><select class="select"><option>Training</option><option>Leave</option><option>KPI</option><option>Probation</option><option>Recognition</option><option>Documents</option><option>Onboarding</option></select></div>
      <div class="field"><label class="field__label">Channels</label><select class="select" multiple size="3" style="height:auto"><option selected>Email</option><option selected>In-app</option><option>Slack</option><option>Teams</option><option>SMS</option></select></div>
      <div class="field"><label class="field__label">Trigger</label><select class="select"><option>Training assigned</option><option>Training deadline approaching</option><option>Training overdue</option><option>Leave decision</option><option>KPI cycle opened</option><option>Custom — sent manually only</option></select></div>
      <div class="field field--full"><label class="field__label">Subject line (email)</label><input class="input" value="Action needed: {{training_title}} due {{deadline}}" /></div>
      <div class="field field--full"><label class="field__label">Body</label><textarea class="textarea" rows="6" placeholder="Write the message here…">Hi {{employee_first_name}},

You've been assigned a new training: {{training_title}}. Please complete it by {{deadline}}.

You can start it now from your portal: {{portal_link}}

Need help? Reply to this email or message {{hr_contact}}.

— SUDO People Operations</textarea></div>
      <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Make this the default for the selected trigger (replaces current default)</label></div>
    </div>
    <div class="form-foot">
      <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
      <button class="btn btn--secondary" onclick="window.__toast('Sending test message to you (justine@sudoconsultants.com)','info')">${ICONS.send} Send test</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Template saved · available immediately','success')">${ICONS.check} Save template</button>
    </div>`;
}

function seeFullRecordHtml(ratingId) {
  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.star}<div>Full rating record · ${ratingId || "—"} · all approvals, comments, and cascade history.</div></div>

    <div class="record-section">
      <div class="record-section__title">Employee</div>
      <div class="record-row"><span>Name</span><strong>Reem Al Otaibi · E008</strong></div>
      <div class="record-row"><span>Title</span><strong>Cloud Engineer · Cloud Engineering</strong></div>
      <div class="record-row"><span>On project</span><strong>Client-Alpha · AWS Migration</strong></div>
      <div class="record-row"><span>Duration on project</span><strong>4 months</strong></div>
    </div>

    <div class="record-section">
      <div class="record-section__title">Cascade</div>
      <div class="record-cascade">
        <div class="cascade-step cascade-step--done">
          <div class="cascade-step__num">1</div>
          <div class="cascade-step__main">
            <div class="cascade-step__who">Fatima Al Zaabi · PM</div>
            <div class="cascade-step__rating">★ 4.3</div>
            <div class="cascade-step__comment">"Strong delivery on the data migration phase — owned the cutover plan end-to-end and unblocked the team twice. Could push more on architecture decisions next quarter."</div>
            <div class="cascade-step__when">Submitted 12 May 2026 · 14:23</div>
          </div>
        </div>
        <div class="cascade-step cascade-step--done">
          <div class="cascade-step__num">2</div>
          <div class="cascade-step__main">
            <div class="cascade-step__who">Khalid Mansour · TL</div>
            <div class="cascade-step__rating">★ 4.4</div>
            <div class="cascade-step__comment">"Endorse. Reem's growth trajectory is among the strongest on the team. The architectural feedback from Fatima aligns with our 1:1 development plan."</div>
            <div class="cascade-step__when">Endorsed 13 May 2026 · 09:11</div>
          </div>
        </div>
        <div class="cascade-step cascade-step--current">
          <div class="cascade-step__num">3</div>
          <div class="cascade-step__main">
            <div class="cascade-step__who">HR · Awaiting your decision</div>
            <div class="cascade-step__comment">Auto-approval eligible: PM and TL ratings within 0.3★, no flags.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="record-section">
      <div class="record-section__title">Context</div>
      <div class="record-row"><span>Previous project ratings</span><strong>★ 4.1 (Bank-of-Sky, 3 months ago) · ★ 3.9 (TelcoCo, 6 months ago)</strong></div>
      <div class="record-row"><span>Current KPI score</span><strong>91/100 · On track</strong></div>
      <div class="record-row"><span>Probation status</span><strong>Confirmed (April 2026)</strong></div>
      <div class="record-row"><span>Active flags</span><strong>None</strong></div>
    </div>

    <div class="form-foot">
      <button class="btn btn--ghost" style="color:var(--danger);margin-right:auto" onclick="closeSlideover(); window.__toast('Sent back to PM with note','info')">Send back</button>
      <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
      <button class="btn btn--secondary" onclick="closeSlideover(); window.__toast('Rating denied · cascade closed','info')">Deny</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Rating approved · contributes 30% to KPI composite','success')">${ICONS.check} Approve</button>
    </div>`;
}

function docRequestReviewHtml(requestId) {
  // Hardcoded sample for visual feedback — pulls from the same DR-2026-024 data
  const REQ_MAP = {
    "DR-2026-024": { emp:"Reem Al Otaibi", empId:"E008", title:"Cloud Engineer", dept:"Cloud Engineering", docType:"Salary Certificate", purpose:"Emirates NBD — credit card application", language:"English", urgency:"standard", submitted:"2 days ago", notes:"Need by end of week if possible. Bank requested original PDF with signature." },
    "DR-2026-023": { emp:"Marcus Wright", empId:"E011", title:"DevOps Engineer", dept:"Cloud Engineering", docType:"NOC (No Objection Cert.)", purpose:"GDRFA visa file", language:"English + Arabic", urgency:"urgent", submitted:"5 hours ago", notes:"Visa renewal appointment is on 22 May. NOC must be addressed to GDRFA-Dubai." },
    "DR-2026-022": { emp:"Daniel Chen", empId:"E009", title:"Solutions Architect", dept:"Cloud Engineering", docType:"Bank Letter", purpose:"HSBC — account opening", language:"English", urgency:"standard", submitted:"yesterday", notes:"HSBC requires standard salary letter format with company stamp." },
    "DR-2026-021": { emp:"Aisha Khan", empId:"E010", title:"Junior Consultant", dept:"Advisory", docType:"Experience Letter", purpose:"University application — Masters program", language:"English", urgency:"standard", submitted:"3 days ago", notes:"University deadline is 30 May. Letter should include start date, role, key responsibilities." },
  };
  const r = REQ_MAP[requestId] || REQ_MAP["DR-2026-024"];

  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.send || ICONS.menu}<div>Review the employee's request, then either approve and upload the document, or send it back with a note. Approved documents appear in the employee's <strong>My Documents</strong> page with a download link.</div></div>

    <div class="record-section">
      <div class="record-section__title">Request from</div>
      <div class="record-row"><span>Employee</span><strong>${r.emp} · ${r.empId}</strong></div>
      <div class="record-row"><span>Title</span><strong>${r.title} · ${r.dept}</strong></div>
      <div class="record-row"><span>Submitted</span><strong>${r.submitted}</strong></div>
      <div class="record-row"><span>Request ID</span><strong>${requestId}</strong></div>
    </div>

    <div class="record-section">
      <div class="record-section__title">Request details</div>
      <div class="record-row"><span>Document type</span><strong>${r.docType}</strong></div>
      <div class="record-row"><span>Purpose</span><strong>${r.purpose}</strong></div>
      <div class="record-row"><span>Language</span><strong>${r.language}</strong></div>
      <div class="record-row"><span>Urgency</span><strong>${r.urgency === 'urgent' ? '<span style="color:var(--danger)">Urgent</span>' : 'Standard (1–2 business days)'}</strong></div>
    </div>

    ${r.notes ? `
      <div class="record-section">
        <div class="record-section__title">Notes from employee</div>
        <div style="background:var(--ink-50,#F8FAFC);padding:12px 14px;border-radius:8px;font-size:12.5px;color:var(--ink-700);font-style:italic;line-height:1.5">"${r.notes}"</div>
      </div>` : ""}

    <div class="record-section">
      <div class="record-section__title">Approve &amp; upload document</div>
      <div class="form-grid">
        <div class="field"><label class="field__label">Template</label><select class="select"><option>Auto-generated (recommended)</option><option>Use custom template</option><option>Upload externally signed file</option></select></div>
        <div class="field"><label class="field__label">Language</label><select class="select"><option>English</option><option>Arabic</option><option>English + Arabic (bilingual)</option></select></div>
        <div class="field field--full">
          <label class="field__label">Attach signed file</label>
          <div class="logo-upload">
            <button class="btn btn--secondary btn--sm">${ICONS.upload || ICONS.send} Choose file</button>
            <span style="font-size:11.5px;color:var(--ink-500)">PDF or DOCX · max 10 MB</span>
          </div>
        </div>
        <div class="field field--full"><label class="field__label">Internal note (visible to employee)</label><textarea class="textarea" rows="2" placeholder="Optional — e.g. 'Ready for collection at the front desk on 19 May.'"></textarea></div>
      </div>
    </div>

    <div class="form-foot">
      <button class="btn btn--ghost" style="color:var(--danger);margin-right:auto" onclick="closeSlideover(); window.__toast('Request sent back to ${r.emp} with a note','info')">Send back</button>
      <button class="btn btn--secondary" onclick="closeSlideover()">Close</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Document approved &amp; uploaded · mirrored to ${r.emp}\\'s My Documents','success')">${ICONS.check} Approve &amp; upload</button>
    </div>`;
}

function addDocTypeHtml() {
  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.plus}<div>Adding a new document type makes it available on the employee's request form across all portals.</div></div>
    <div class="form-grid">
      <div class="field"><label class="field__label">Document type name</label><input class="input" placeholder="e.g. Pension Statement Letter" /></div>
      <div class="field"><label class="field__label">Default addressee</label><select class="select"><option>Open</option><option>Bank</option><option>Embassy / Govt.</option><option>Internal</option><option>GDRFA</option></select></div>
      <div class="field"><label class="field__label">Default language</label><select class="select"><option>English</option><option>Arabic</option><option>English + Arabic (bilingual)</option></select></div>
      <div class="field"><label class="field__label">SLA</label><select class="select"><option>1 business day</option><option>2 business days</option><option>3 business days</option><option>1 week</option></select></div>
      <div class="field field--full"><label class="checkbox"><span class="checkbox__box"></span> Has auto-template (generated from employee data)</label></div>
      <div class="field field--full"><label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Available to employees immediately</label></div>
    </div>
    <div class="form-foot">
      <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Document type added · employees can now request it','success')">${ICONS.check} Add type</button>
    </div>`;
}

// Dashboard customize form — toggles for each card visible on HR dashboard
function dashboardCustomizeHtml() {
  const ALL_CARDS = [
    { id: "active-employees",      label: "Active Employees",       desc: "Headcount and onboarding ratio",       on: true },
    { id: "in-onboarding",         label: "In Onboarding",          desc: "Active onboarding pipeline with progress bar", on: true },
    { id: "probation-due",         label: "Probation Due",          desc: "Probation reviews coming up within 14 days", on: true },
    { id: "expiring-certs",        label: "Expiring Certifications",desc: "Certs expiring in the next 90 days",   on: true },
    { id: "expiring-visas",        label: "Expiring Visas / IDs",   desc: "Visas and Emirates IDs needing renewal", on: true },
    { id: "kpi-completion",        label: "KPI Cycle Completion",   desc: "Aggregate progress across the current cycle", on: true },
    { id: "training-overdue",      label: "Training Overdue",       desc: "Overdue verifications and self-paced",  on: false },
    { id: "leave-pending",         label: "Leave Approvals Pending",desc: "Awaiting HR decision",                   on: false },
    { id: "project-ratings-queue", label: "Project Ratings Queue",  desc: "PM→TL→HR cascade awaiting your call",   on: false },
    { id: "badges-this-month",     label: "Badges Granted",         desc: "Recognition activity this month",       on: false },
    { id: "recent-signins",        label: "Recent Sign-ins",        desc: "Auth activity (last 24h)",              on: false },
    { id: "ai-health",             label: "AI Insights Summary",    desc: "Top 3 cross-portal insights this week", on: false },
  ];

  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.cog || ""}<div>Pick which cards appear on your dashboard. Changes apply immediately — drag-to-reorder coming next iteration. Toggle off cards you don't use to reduce clutter.</div></div>

    <div class="customize-list">
      ${ALL_CARDS.map(c => `
        <label class="customize-row">
          <div class="customize-row__main">
            <div class="customize-row__label">${c.label}</div>
            <div class="customize-row__desc">${c.desc}</div>
          </div>
          <span class="toggle ${c.on ? "toggle--on" : ""}" data-card="${c.id}">
            <span class="toggle__knob"></span>
          </span>
        </label>
      `).join("")}
    </div>

    <div class="form-foot">
      <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('Dashboard updated · ' + document.querySelectorAll('.toggle--on').length + ' cards visible', 'success')">${ICONS.check} Save changes</button>
    </div>
  `;
}

// Badge create/edit form (used by Badges Admin)
function badgeFormHtml(badgeId) {
  const isEdit = !!badgeId;
  return `
    <div class="info-banner" style="margin-bottom:14px">${ICONS.award || ICONS.star}<div>${isEdit ? "Edit this badge's name, points, description, and which roles can grant it." : "Define a new recognition badge. It becomes immediately available in all portals based on the role permissions you set."}</div></div>
    <div class="form-grid">
      <div class="field"><label class="field__label">Badge name</label><input class="input" placeholder="e.g. Customer Hero" value="${isEdit ? "Customer Hero" : ""}" /></div>
      <div class="field"><label class="field__label">Icon</label><input class="input" placeholder="🦸 (emoji)" value="${isEdit ? "🦸" : ""}" /></div>
      <div class="field"><label class="field__label">Point value</label><input class="input" type="number" placeholder="e.g. 50" value="${isEdit ? "60" : ""}" min="1" max="200" /></div>
      <div class="field"><label class="field__label">Accent color</label><input class="input" type="color" value="${isEdit ? "#C8333A" : "#189CD9"}" style="height:38px" /></div>
      <div class="field field--full"><label class="field__label">Description (shown when granting)</label><textarea class="textarea" rows="2" placeholder="What does this badge recognise?">${isEdit ? "For a notable customer-facing win" : ""}</textarea></div>
      <div class="field field--full"><label class="field__label">Grantable by (multi-select)</label>
        <div class="role-checks">
          <label class="checkbox ${isEdit ? "" : ""}"><span class="checkbox__box"></span> Employee · peer to peer</label>
          <label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Team Lead</label>
          <label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Project Manager</label>
          <label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> HR</label>
          <label class="checkbox checkbox--checked"><span class="checkbox__box">${ICONS.check}</span> Super Admin</label>
        </div>
      </div>
      <div class="field field--full"><label class="field__label">Status</label>
        <select class="select"><option>Active (immediately available)</option><option>Draft (not yet live)</option><option>Archived (hidden but kept for history)</option></select>
      </div>
    </div>
    <div class="form-foot">
      ${isEdit ? '<button class="btn btn--ghost" style="color:var(--danger);margin-right:auto" onclick="closeSlideover(); window.__toast(\'Badge archived\', \'info\')">Archive</button>' : ""}
      <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
      <button class="btn btn--primary" onclick="closeSlideover(); window.__toast('${isEdit ? "Badge updated · changes live immediately" : "Badge created · now available in all portals"}', 'success')">${isEdit ? "Save changes" : "Create badge"}</button>
    </div>`;
}

// Build a drill-down list for any KPI card
function drilldownFor(cardId) {
  switch (cardId) {
    case "active-employees":
      return { title: "Active Employees · 147",
        list: DATA.employees.slice(0, 10).map(e => ({ name: e.name, desc: `${e.title} · ${e.dept}`, meta: `Joined ${e.joined.slice(0,7)}` })) };
    case "in-onboarding":
      return { title: "In Onboarding · 8",
        list: DATA.employees.filter(e => e.status === "Onboarding").map(e => ({ name: e.name, desc: e.title, meta: `${e.progress}%` })) };
    case "probation-due":
      return { title: "Probation Due · Next 14 days",
        list: [
          { name: "Marcus Wright", desc: "DevOps Engineer · PM endorsed (pending LM)", meta: "In 3 days" },
          { name: "Sara Mitchell", desc: "Project Manager · Final feedback scheduled", meta: "In 8 days" },
          { name: "Reem Al Otaibi", desc: "Cloud Engineer · Awaiting Step 5 completion", meta: "In 12 days" },
        ] };
    case "expiring-certs":
      return { title: "Expiring Certifications · 12 (next 90 days)",
        list: [
          { name: "AWS Solutions Architect Pro", desc: "Ahmed Al Rashid", meta: "8 days" },
          { name: "AWS Cloud Practitioner", desc: "Khalid Mansour", meta: "22 days" },
          { name: "AWS DevOps Engineer Pro", desc: "Priya Sharma", meta: "31 days" },
          { name: "AWS Security Specialty", desc: "Tariq Hassan", meta: "45 days" },
          { name: "AWS Solutions Architect Assoc", desc: "Daniel Chen", meta: "52 days" },
        ] };
    case "expiring-visas":
      return { title: "Expiring Visas / Emirates IDs · 2",
        list: [
          { name: "Priya Sharma", desc: "Employment visa · Renewal not yet started", meta: "18 days" },
          { name: "Daniel Chen", desc: "Emirates ID · Documents pending", meta: "27 days" },
        ] };
    case "training-compliance":
      return { title: "Training Compliance · 87%",
        list: DATA.compliance.map(c => ({ name: c.name, desc: `${c.count} hold required certs`, meta: `${c.pct}%` })) };
    case "kpi-pending":
      return { title: "KPIs Pending Acknowledgement · 5",
        list: [
          { name: "Noor Faisal", desc: "Q2 KPIs · 2 days overdue", meta: "OVERDUE" },
          { name: "Bilal Anwar", desc: "Q2 KPIs · 1 day overdue", meta: "OVERDUE" },
          { name: "Aisha Khan", desc: "Onboarding KPIs · Due Friday", meta: "3 days" },
          { name: "Yousef Karim", desc: "Onboarding KPIs · Due next Tuesday", meta: "7 days" },
          { name: "Reem Al Otaibi", desc: "Q2 KPIs · Due in 2 weeks", meta: "14 days" },
        ] };
    case "pending-signatures":
      return { title: "Pending Document Signatures · 6",
        list: DATA.documents.filter(d => d.status.startsWith("Pending")).map(d => ({ name: d.name, desc: d.type, meta: d.status })) };
    case "open-requests":
      return { title: "Open HR Requests · 14",
        list: [
          { name: "Ahmed Al Rashid", desc: "Salary certificate · For visa renewal", meta: "2h ago" },
          { name: "Priya Sharma", desc: "NOC · Bank account opening", meta: "3h ago" },
          { name: "Khalid Mansour", desc: "Employment letter · Loan application", meta: "5h ago" },
          { name: "Layla Ibrahim", desc: "Query · Insurance claim process", meta: "7h ago" },
          { name: "Tariq Hassan", desc: "Salary certificate · Apartment lease", meta: "1d ago" },
        ] };
    case "notifications-sent":
      return { title: "Notifications This Week · 326 sent",
        list: DATA.notifHistory.map(n => ({ name: n.title, desc: n.audience, meta: n.sent })) };
    default:
      return { title: "Detail", list: [] };
  }
}

// =========================================================
// GLOBAL EVENTS (topbar, notifications, slide-over close)
// =========================================================
function renderNotifDropdown() {
  // Merge local DATA.notifications with cross-portal SUDO_DB.notifications.
  // SUDO_DB ones come first (newest first since notify() unshifts).
  const sudoNotifs = (window.SUDO_DB && Array.isArray(SUDO_DB.notifications)) ? SUDO_DB.notifications : [];
  const localNotifs = DATA.notifications || [];
  const merged = [...sudoNotifs, ...localNotifs];
  $("#notif-body").innerHTML = merged.map(n => `
    <div class="notif ${n.unread ? "notif--unread" : ""}">
      <div class="notif__icon card__icon--${n.color || 'info'}">${ICONS[n.icon] || ICONS.bell || ""}</div>
      <div class="notif__main">
        <div class="notif__title">${n.title}</div>
        <div class="notif__desc">${n.desc}</div>
        <div class="notif__time">${n.time || ''}</div>
      </div>
    </div>`).join("");

  // Update bell badge with live unread count
  const unread = merged.filter(n => n.unread).length;
  const badge = document.querySelector("#notif-btn .badge");
  if (badge) {
    if (unread > 0) {
      badge.textContent = unread > 99 ? "99+" : unread;
      badge.style.display = "";
    } else {
      badge.style.display = "none";
    }
  }
}

function bindGlobalEvents() {
  // Slide-over close
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

  // Notifications dropdown
  $("#notif-btn").addEventListener("click", e => {
    e.stopPropagation();
    $("#notif-dropdown").classList.toggle("open");
  });
  document.addEventListener("click", e => {
    const dd = $("#notif-dropdown");
    if (!dd.contains(e.target) && !$("#notif-btn").contains(e.target)) dd.classList.remove("open");
  });

  // New Request
  $("#new-request-btn").addEventListener("click", () => {
    openSlideover({
      title: "Create New Request",
      list: [
        { name: "Employee Letter", desc: "Salary certificate, NOC, employment letter", meta: "→" },
        { name: "Document Upload Request", desc: "Ask employee to upload visa, ID, or passport", meta: "→" },
        { name: "HR Query Reply", desc: "Reply to an outstanding employee query", meta: "→" },
        { name: "Custom Notification", desc: "Send custom message to employees or teams", meta: "→" },
      ],
    });
  });

  // Role switch — return to the welcome page so user can pick a different role
  $("#role-switch-btn").addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  // Hash router

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
SUDO_INIT("hr", () => {
  renderNotifDropdown();
  bindGlobalEvents();
  route();
});

// ── Role switcher — only shows if user actually has multiple role assignments ───
// In this prototype Justine is HR only (single role). She won't see the switcher
// unless someone deliberately demos by setting ?from=admin on the URL.
// Mount the role switcher. The HR demo user Justine (E004) has both `hr` AND
// `employee` roles, so the switcher appears and lets her hop to the Employee
// portal to check her own training / KPIs.
if (window.RoleSwitcher) {
  const meId = "E004";  // Justine — the HR demo user
  const myRoles = (window.SUDO_DB_OVERRIDES && SUDO_DB_OVERRIDES.getRoles)
    ? SUDO_DB_OVERRIDES.getRoles(meId)
    : ["hr", "employee"];
  RoleSwitcher.mount({
    currentRole: "hr",
    basePath: "..",
    hasMultipleRoles: myRoles.length > 1,
    userRoles: myRoles,
    userId: meId,
  });
}
