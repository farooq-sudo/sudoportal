/**
 * ============================================================================
 *  SUDO Portal · Data Hydration Layer
 * ============================================================================
 *
 *  THE BRIDGE STRATEGY
 *  -------------------
 *  The prototype's 18K lines of page code read from `window.SUDO_DB`
 *  (e.g. `DATA.employees`, `DATA.trainings`). Rewriting every page to call
 *  the API directly would be a massive, risky change.
 *
 *  Instead, this layer fetches real data from the API and POPULATES
 *  `window.SUDO_DB` with it BEFORE the page renders. Pages keep reading
 *  `DATA.employees` — but now that array came from Postgres via the API,
 *  not from the hardcoded seed.
 *
 *  This gives us a working, API-backed portal immediately, then individual
 *  pages can be migrated to live calls (create/update/delete) incrementally
 *  without breaking the read path.
 *
 *  WHAT GETS HYDRATED
 *  ------------------
 *  Per portal we only fetch what that portal needs (keeps it fast). The
 *  `hydrateFor(portal)` function maps each portal to its required datasets.
 *
 *  WRITES
 *  ------
 *  Reads go through hydration; writes (approve leave, draft KPI, etc.) should
 *  call `api.*` directly and then re-hydrate the affected dataset. Helper
 *  `rehydrate(key)` re-fetches a single dataset and re-renders.
 *
 *  USAGE in index.html:
 *    <script>
 *      SUDO_AUTH.bootstrap()
 *        .then(user => SUDO_HYDRATE.hydrateFor('hr'))
 *        .then(() => initPortal());   // page's existing entry point
 *    </script>
 * ============================================================================
 */

(function () {
  "use strict";

  const api = window.SUDO_API;

  // Ensure SUDO_DB exists (db.js may or may not have loaded seed data)
  window.SUDO_DB = window.SUDO_DB || {};
  const DB = window.SUDO_DB;

  // Track which datasets are loaded + any load errors (for UI badges)
  const state = { loaded: {}, errors: {} };

  // ── Individual dataset loaders ───────────────────────────────────────────
  // Each returns a promise that populates a SUDO_DB key. Failures are caught
  // so one failed dataset doesn't blank the whole portal.

  // Normalize any list response to an array. Endpoints variously return a
  // bare array, {items:[...]}, or {rows:[...]} — tolerate all three so a
  // shape mismatch never silently yields an empty list.
  function toArray(r) {
    if (Array.isArray(r)) return r;
    if (r && Array.isArray(r.items)) return r.items;
    if (r && Array.isArray(r.rows)) return r.rows;
    return [];
  }

  const loaders = {
    employees: async () => {
      const r = await api.employees.list({ limit: 500 });
      DB.employees = toArray(r);
    },
    teams: async () => {
      const r = await api.teams.list();
      DB.teams = toArray(r).map(normalizeTeam);
    },
    notifications: async () => {
      const r = await api.notifications.list({ limit: 50 });
      DB.notifications = toArray(r);
    },
    kpiCycles: async () => {
      const r = await api.kpi.cycles();
      DB.kpiCycles = toArray(r);
    },
    kpiSections: async () => {
      const r = await api.kpi.sections();
      DB.kpiSections = toArray(r);
    },
    kpiTemplates: async () => {
      const r = await api.kpi.templates({ limit: 500 });
      DB.kpiTemplates = toArray(r);
    },
    kpiAssignments: async () => {
      const r = await api.kpi.assignments({ limit: 500 });
      DB.kpiAssignments = toArray(r);
    },
    trainings: async () => {
      const r = await api.training.catalogue({ limit: 200 });
      DB.trainings = toArray(r);
    },
    leaveRequests: async () => {
      const r = await api.leave.requests({ limit: 200 });
      DB.leaveApprovals = toArray(r);
    },
    holidays: async () => {
      const r = await api.holidays.list({ year: new Date().getFullYear(), country: "AE" });
      DB.holidays = toArray(r);
    },
    announcements: async () => {
      const r = await api.announcements.list({ limit: 30 });
      DB.announcements = toArray(r);
    },
    audit: async () => {
      const r = await api.audit.list({ limit: 100 });
      DB.audit = toArray(r);
      DB.auditLog = DB.audit;
    },
    documents: async () => {
      const r = await api.documents.list({ limit: 200 });
      DB.documents = toArray(r);
    },
    backups: async () => {
      const r = await api.system.backups();
      DB.backups = toArray(r);
    },
    exports: async () => {
      const r = await api.exports.list({ mineOnly: false });
      DB.exports = toArray(r);
      DB.reports = DB.exports;   // pageReports reads DATA.reports
    },
    roles: async () => {
      const r = await api.permissions.roles();
      DB.roles = toArray(r);
    },
    permissions: async () => {
      const r = await api.permissions.list();
      DB.permissions = toArray(r);
    },
  };

  function normalizeTeam(t) {
    // Frontend expects teams[].members (array) in some views; the API gives
    // memberCount. Keep both so old code doesn't crash.
    return Object.assign({}, t, {
      members: t.members || [],
      memberCount: t.memberCount != null ? t.memberCount : (t.members ? t.members.length : 0),
    });
  }

  // ── Per-portal dataset requirements ──────────────────────────────────────
  const PORTAL_DATASETS = {
    admin:     ["employees", "teams", "notifications", "audit", "announcements",
                "backups", "exports", "roles", "permissions"],
    hr:        ["employees", "teams", "notifications", "kpiCycles", "kpiSections",
                "kpiTemplates", "kpiAssignments", "trainings", "leaveRequests",
                "documents", "announcements", "exports"],
    pm:        ["employees", "teams", "notifications", "kpiAssignments"],
    team_lead: ["employees", "teams", "notifications", "kpiAssignments", "kpiTemplates", "exports"],
    employee:  ["notifications", "kpiAssignments", "trainings", "leaveRequests",
                "holidays", "announcements"],
  };

  // ── Public API ────────────────────────────────────────────────────────────

  // Maps a loader key → the SUDO_DB key(s) it populates, so we can guarantee
  // a safe [] default even if the loader fails (pages do DATA.x.map(...)).
  const DB_KEYS = {
    employees: ["employees"], teams: ["teams"], notifications: ["notifications"],
    kpiCycles: ["kpiCycles"], kpiSections: ["kpiSections"], kpiTemplates: ["kpiTemplates"],
    kpiAssignments: ["kpiAssignments"], trainings: ["trainings"], leaveRequests: ["leaveApprovals"],
    holidays: ["holidays"], announcements: ["announcements"], audit: ["audit", "auditLog"],
    documents: ["documents"], backups: ["backups"], exports: ["exports", "reports"],
    roles: ["roles"], permissions: ["permissions"],
  };

  async function load(key) {
    if (!loaders[key]) {
      console.warn("[hydrate] no loader for", key);
      return;
    }
    // Guarantee the target keys exist as arrays up front so a failed load
    // never leaves DATA.<key> undefined (pages call .map/.length on them).
    (DB_KEYS[key] || []).forEach(function (k) {
      if (!Array.isArray(DB[k])) DB[k] = DB[k] || [];
    });
    try {
      await loaders[key]();
      state.loaded[key] = true;
      delete state.errors[key];
    } catch (e) {
      state.errors[key] = e.message || String(e);
      console.error("[hydrate] failed to load " + key + ":", e.message);
      // Ensure defaults remain arrays so pages render empty rather than crash
      (DB_KEYS[key] || []).forEach(function (k) {
        if (!Array.isArray(DB[k])) DB[k] = [];
      });
    }
  }

  async function hydrateFor(portal) {
    const keys = PORTAL_DATASETS[portal] || ["employees", "notifications"];
    // Load in parallel — independent datasets
    await Promise.all(keys.map(load));
    document.dispatchEvent(new CustomEvent("sudo:hydrated", {
      detail: { portal: portal, loaded: state.loaded, errors: state.errors },
    }));
    return state;
  }

  async function rehydrate(key) {
    await load(key);
    document.dispatchEvent(new CustomEvent("sudo:rehydrated", { detail: { key: key } }));
  }

  window.SUDO_HYDRATE = {
    hydrateFor,
    rehydrate,
    load,
    state,
    loaders,        // exposed for ad-hoc loads
  };

  /**
   * SUDO_INIT(portal, startFn)
   * ──────────────────────────
   * The single entry point each portal calls instead of running its
   * render/route logic directly on DOMContentLoaded.
   *
   * Sequence:
   *   1. Wait for DOM ready
   *   2. Auth bootstrap (capture token, load current user, guard)
   *   3. Hydrate the datasets this portal needs from the API
   *   4. Run the portal's original start function (route/render)
   *
   * If the API is unreachable, we still call startFn so the portal renders
   * from whatever seed data db.js provided — degraded but not blank. A
   * banner is shown so the user knows data may be stale.
   *
   * Set window.SUDO_SKIP_AUTH = true to bypass auth+hydrate entirely
   * (useful for viewing the static prototype with seed data only).
   */
  function SUDO_INIT(portal, startFn) {
    const run = function () {
      // Escape hatch: pure prototype mode (no backend)
      if (window.SUDO_SKIP_AUTH) {
        try { startFn(); } catch (e) { console.error(e); }
        return;
      }

      const auth = window.SUDO_AUTH;
      if (!auth) {
        console.warn("[init] auth.js not loaded — running in seed-only mode");
        try { startFn(); } catch (e) { console.error(e); }
        return;
      }

      auth.bootstrap()
        .then(function (user) {
          if (!user) return null; // bootstrap redirected to login
          return hydrateFor(portal).then(function () {
            try { startFn(); } catch (e) { console.error("[init] startFn error:", e); }
            maybeShowHydrationBanner();
          });
        })
        .catch(function (e) {
          console.error("[init] bootstrap failed:", e);
          // Render anyway from seed data
          try { startFn(); } catch (err) { console.error(err); }
          maybeShowHydrationBanner(true);
        });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
  }

  function maybeShowHydrationBanner(forceError) {
    var errs = Object.keys(state.errors);
    if (!forceError && errs.length === 0) return;
    if (document.getElementById("sudo-hydrate-banner")) return;
    var bar = document.createElement("div");
    bar.id = "sudo-hydrate-banner";
    bar.style.cssText =
      "position:fixed;bottom:0;left:0;right:0;z-index:9999;" +
      "background:#B45309;color:#fff;font:13px/1.4 system-ui,sans-serif;" +
      "padding:8px 16px;text-align:center;";
    bar.textContent = forceError
      ? "⚠ Could not reach the server — showing cached data. Some actions may not work."
      : "⚠ Some data could not be loaded: " + errs.join(", ") + ". Showing what's available.";
    document.body.appendChild(bar);
  }

  window.SUDO_INIT = SUDO_INIT;
})();
