/**
 * ============================================================================
 *  SUDO Portal · API Client
 * ============================================================================
 *
 *  The single bridge between the frontend portals and the backend API.
 *  Replaces the in-memory `window.SUDO_DB` with real HTTP calls to
 *  /api/v1/* endpoints.
 *
 *  USAGE
 *  -----
 *    // Old (in-memory):
 *    const emps = SUDO_DB.employees;
 *
 *    // New (API):
 *    const { rows } = await api.employees.list();
 *
 *  AUTH
 *  ----
 *  The JWT is stored in memory (and mirrored to sessionStorage so a page
 *  refresh keeps you logged in). Every request sends it as a Bearer token.
 *  On 401, the client redirects to the login flow.
 *
 *  CONFIG
 *  ------
 *  window.SUDO_API_BASE can override the base URL (default: same origin
 *  + /api/v1). In the docker-compose setup, nginx proxies /api/* to the
 *  api container, so same-origin works out of the box.
 * ============================================================================
 */

(function () {
  "use strict";

  const API_BASE = window.SUDO_API_BASE || "/api/v1";
  const TOKEN_KEY = "sudo_jwt";

  // ── Token management ──────────────────────────────────────────────────────
  let _token = null;
  try {
    _token = sessionStorage.getItem(TOKEN_KEY);
  } catch (e) {
    // sessionStorage blocked (private mode) — fall back to in-memory only
  }

  function setToken(token) {
    _token = token;
    try {
      if (token) sessionStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) { /* ignore */ }
  }

  function getToken() {
    return _token;
  }

  // ── Core fetch wrapper ──────────────────────────────────────────────────
  async function request(method, path, body, opts) {
    opts = opts || {};
    const headers = { "Content-Type": "application/json" };
    if (_token) headers["Authorization"] = "Bearer " + _token;

    const url = path.startsWith("http") ? path : API_BASE + path;
    let res;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body != null ? JSON.stringify(body) : undefined,
        credentials: "same-origin",
      });
    } catch (networkErr) {
      throw new ApiError(0, "network_error", "Could not reach the server. Check your connection.", null);
    }

    // 204 No Content
    if (res.status === 204) return null;

    let payload = null;
    const text = await res.text();
    if (text) {
      try { payload = JSON.parse(text); } catch (e) { payload = text; }
    }

    if (!res.ok) {
      // Auth expired / missing → bounce to login (unless caller opts out)
      if (res.status === 401 && !opts.noRedirectOn401) {
        setToken(null);
        if (!opts.silent) {
          // Preserve where we were so we can come back
          const here = window.location.pathname + window.location.search;
          window.location.href = API_BASE + "/auth/login?redirectTo=" + encodeURIComponent(here);
        }
      }
      const errCode = (payload && payload.error) || "error";
      const errMsg = (payload && payload.message) || res.statusText;
      throw new ApiError(res.status, errCode, errMsg, payload && payload.details);
    }

    return payload;
  }

  class ApiError extends Error {
    constructor(status, code, message, details) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.code = code;
      this.details = details;
    }
  }

  // Build a querystring from an object (skips null/undefined)
  function qs(params) {
    if (!params) return "";
    const parts = [];
    for (const k in params) {
      const v = params[k];
      if (v == null || v === "") continue;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return parts.length ? "?" + parts.join("&") : "";
  }

  const http = {
    get: (path, params, opts) => request("GET", path + qs(params), null, opts),
    post: (path, body, opts) => request("POST", path, body, opts),
    patch: (path, body, opts) => request("PATCH", path, body, opts),
    put: (path, body, opts) => request("PUT", path, body, opts),
    del: (path, opts) => request("DELETE", path, null, opts),
  };

  // ════════════════════════════════════════════════════════════════════════
  //  RESOURCE MODULES — one per API route group
  // ════════════════════════════════════════════════════════════════════════

  const api = {
    // Expose low-level helpers + token controls
    _http: http,
    ApiError,
    setToken,
    getToken,
    isAuthenticated: () => !!_token,
    baseUrl: API_BASE,

    // ── Auth ────────────────────────────────────────────────────────────
    auth: {
      me: () => http.get("/auth/me"),
      logout: async () => {
        try { await http.post("/auth/logout", {}); } catch (e) { /* ignore */ }
        setToken(null);
      },
      loginUrl: (redirectTo) =>
        API_BASE + "/auth/login" + (redirectTo ? "?redirectTo=" + encodeURIComponent(redirectTo) : ""),
      // Dev-only: get a token without Microsoft (works when NODE_ENV != production)
      devLogin: async (empId) => {
        const r = await http.post("/auth/dev-login", { empId }, { noRedirectOn401: true });
        if (r && r.token) setToken(r.token);
        return r;
      },
    },

    // ── Employees ───────────────────────────────────────────────────────
    employees: {
      list: (params) => http.get("/employees", params),
      get: (id) => http.get("/employees/" + id),
      create: (data) => http.post("/employees", data),
      update: (id, data) => http.patch("/employees/" + id, data),
      remove: (id) => http.del("/employees/" + id),
      setPhoto: (id, photoUrl) => http.patch("/employees/" + id + "/photo", { photoUrl }),
      clearPhoto: (id) => http.del("/employees/" + id + "/photo"),
    },

    // ── Employee profile (PII) ──────────────────────────────────────────
    profiles: {
      get: (empId) => http.get("/profiles/" + empId),
      update: (empId, data) => http.patch("/profiles/" + empId, data),
    },

    // ── Org ─────────────────────────────────────────────────────────────
    org: {
      departments: () => http.get("/org/departments"),
      createDepartment: (data) => http.post("/org/departments", data),
      positions: () => http.get("/org/positions"),
      createPosition: (data) => http.post("/org/positions", data),
      employmentHistory: (empId) => http.get("/org/employment-history/" + empId),
      addEmploymentRecord: (empId, data) => http.post("/org/employment-history/" + empId, data),
    },

    // ── Teams ───────────────────────────────────────────────────────────
    teams: {
      list: (params) => http.get("/teams", params),
      get: (id) => http.get("/teams/" + id),
      create: (data) => http.post("/teams", data),
      update: (id, data) => http.patch("/teams/" + id, data),
    },

    // ── KPI ─────────────────────────────────────────────────────────────
    kpi: {
      cycles: () => http.get("/kpi/cycles"),
      createCycle: (data) => http.post("/kpi/cycles", data),
      closeCycle: (id) => http.post("/kpi/cycles/" + id + "/close", {}),
      sections: (params) => http.get("/kpi/sections", params),
      templates: (params) => http.get("/kpi/templates", params),
      createTemplate: (data) => http.post("/kpi/templates", data),
      assignments: (params) => http.get("/kpi/assignments", params),
      createAssignment: (data) => http.post("/kpi/assignments", data),
      approve: (id, data) => http.post("/kpi/assignments/" + id + "/approve", data || {}),
      reject: (id, data) => http.post("/kpi/assignments/" + id + "/reject", data || {}),
      progress: (id, data) => http.post("/kpi/assignments/" + id + "/progress", data),
      validate: (id, data) => http.post("/kpi/assignments/" + id + "/validate", data),
      acknowledge: (data) => http.post("/kpi/acknowledgements", data),
      history: (empId) => http.get("/kpi/history/" + empId),
    },

    // ── Leave ───────────────────────────────────────────────────────────
    leave: {
      policies: () => http.get("/leave/policies"),
      balances: (empId, year) => http.get("/leave/balances/" + empId, { year }),
      requests: (params) => http.get("/leave/requests", params),
      createRequest: (data) => http.post("/leave/requests", data),
      submitRequest: (id) => http.post("/leave/requests/" + id + "/submit", {}),
      decide: (id, decision, comment) => http.post("/leave/requests/" + id + "/decide", { decision, comment }),
      withdraw: (id) => http.post("/leave/requests/" + id + "/withdraw", {}),
    },

    // ── Training ────────────────────────────────────────────────────────
    training: {
      catalogue: (params) => http.get("/training/catalogue", params),
      createCatalogue: (data) => http.post("/training/catalogue", data),
      assignments: (params) => http.get("/training/assignments", params),
      assign: (data) => http.post("/training/assignments", data),
      start: (id) => http.post("/training/assignments/" + id + "/start", {}),
      complete: (id, data) => http.post("/training/assignments/" + id + "/complete", data),
      verify: (id) => http.post("/training/assignments/" + id + "/verify", {}),
      reject: (id, reason) => http.post("/training/assignments/" + id + "/reject", { reason }),
      certifications: (empId) => http.get("/training/certifications/" + empId),
    },

    // ── Onboarding ──────────────────────────────────────────────────────
    onboarding: {
      steps: (empId) => http.get("/onboarding/steps/" + empId),
      addStep: (data) => http.post("/onboarding/steps", data),
      updateStep: (id, data) => http.patch("/onboarding/steps/" + id, data),
      completeStep: (id) => http.post("/onboarding/steps/" + id + "/complete", {}),
      plan: (empId) => http.get("/system/onboarding-plan/" + empId),
      setPlan: (empId, data) => http.put("/system/onboarding-plan/" + empId, data),
    },

    // ── Probation ───────────────────────────────────────────────────────
    probation: {
      cases: (params) => http.get("/probation/cases", params),
      get: (empId) => http.get("/probation/cases/" + empId),
      endorsePm: (empId, data) => http.post("/probation/cases/" + empId + "/endorse-pm", data),
      endorseTl: (empId, data) => http.post("/probation/cases/" + empId + "/endorse-tl", data),
      decide: (empId, data) => http.post("/probation/cases/" + empId + "/decide", data),
    },

    // ── Project ratings ─────────────────────────────────────────────────
    projectRatings: {
      list: (params) => http.get("/project-ratings", params),
      create: (data) => http.post("/project-ratings", data),
      endorseTl: (id, data) => http.post("/project-ratings/" + id + "/endorse-tl", data),
      finaliseHr: (id, data) => http.post("/project-ratings/" + id + "/finalise-hr", data),
    },

    // ── Projects ────────────────────────────────────────────────────────
    projects: {
      list: (params) => http.get("/projects", params),
      get: (id) => http.get("/projects/" + id),
      assign: (projectId, data) => http.post("/projects/" + projectId + "/assignments", data),
      unassign: (projectId, empId) => http.del("/projects/" + projectId + "/assignments/" + empId),
      timesheets: (params) => http.get("/projects/timesheets", params),
      logTime: (data) => http.post("/projects/timesheets", data),
    },

    // ── Documents ───────────────────────────────────────────────────────
    documents: {
      list: (params) => http.get("/documents", params),
      get: (id) => http.get("/documents/" + id),
      upload: (data) => http.post("/documents", data),
      sign: (id, data) => http.post("/documents/" + id + "/sign", data || {}),
      revoke: (id, reason) => http.post("/documents/" + id + "/revoke", { reason }),
      remove: (id) => http.del("/documents/" + id),
    },

    // ── Requests (unified) ──────────────────────────────────────────────
    requests: {
      list: (params) => http.get("/requests", params),
      get: (id) => http.get("/requests/" + id),
      create: (data) => http.post("/requests", data),
      submit: (id) => http.post("/requests/" + id + "/submit", {}),
      decide: (id, decision, comment) => http.post("/requests/" + id + "/decide", { decision, comment }),
      cancel: (id) => http.post("/requests/" + id + "/cancel", {}),
    },

    // ── Data exports ────────────────────────────────────────────────────
    exports: {
      list: (params) => http.get("/exports", params),
      get: (id) => http.get("/exports/" + id),
      request: (data) => http.post("/exports", data),
      markDownloaded: (id) => http.post("/exports/" + id + "/downloaded", {}),
    },

    // ── Compensation ────────────────────────────────────────────────────
    compensation: {
      salary: (empId) => http.get("/compensation/salary/" + empId),
      addSalary: (empId, data) => http.post("/compensation/salary/" + empId, data),
      adjustments: (empId, params) => http.get("/compensation/adjustments/" + empId, params),
      addAdjustment: (data) => http.post("/compensation/adjustments", data),
      bank: (empId) => http.get("/compensation/bank/" + empId),
      addBank: (empId, data) => http.post("/compensation/bank/" + empId, data),
      verifyBank: (id) => http.post("/compensation/bank/" + id + "/verify", {}),
    },

    // ── Family & insurance ──────────────────────────────────────────────
    family: {
      members: (empId) => http.get("/family/members/" + empId),
      addMember: (empId, data) => http.post("/family/members/" + empId, data),
      updateMember: (id, data) => http.patch("/family/members/" + id, data),
      removeMember: (id) => http.del("/family/members/" + id),
      insurance: (empId) => http.get("/family/insurance/" + empId),
      addInsurance: (empId, data) => http.post("/family/insurance/" + empId, data),
    },

    // ── People (recognition / feedback / badges) ────────────────────────
    people: {
      recognitions: (params) => http.get("/people/recognitions", params),
      giveRecognition: (data) => http.post("/people/recognitions", data),
      feedbackSessions: (params) => http.get("/people/feedback-sessions", params),
      scheduleFeedback: (data) => http.post("/people/feedback-sessions", data),
      updateFeedback: (id, data) => http.patch("/people/feedback-sessions/" + id, data),
      notes: (subjectEmpId) => http.get("/people/notes/" + subjectEmpId),
      addNote: (data) => http.post("/people/notes", data),
      badges: () => http.get("/people/badges"),
      createBadge: (data) => http.post("/people/badges", data),
      awardBadge: (badgeId, data) => http.post("/people/badges/" + badgeId + "/award", data),
      badgeAwards: (empId) => http.get("/people/badges/awards/" + empId),
    },

    // ── Lifecycle (air tickets / offboarding / bg checks) ───────────────
    lifecycle: {
      airTickets: (empId) => http.get("/lifecycle/air-tickets/" + empId),
      setAirTicketAllowance: (empId, data) => http.put("/lifecycle/air-tickets/" + empId + "/allowance", data),
      addAirTicketUsage: (empId, data) => http.post("/lifecycle/air-tickets/" + empId + "/usage", data),
      offboarding: (empId) => http.get("/lifecycle/offboarding/" + empId),
      initiateOffboarding: (data) => http.post("/lifecycle/offboarding", data),
      updateOffboarding: (empId, data) => http.patch("/lifecycle/offboarding/" + empId, data),
      bgChecks: (empId) => http.get("/lifecycle/bg-checks/" + empId),
      requestBgCheck: (data) => http.post("/lifecycle/bg-checks", data),
      updateBgCheck: (id, data) => http.patch("/lifecycle/bg-checks/" + id, data),
    },

    // ── Holidays ────────────────────────────────────────────────────────
    holidays: {
      list: (params) => http.get("/holidays", params),
      next: (params) => http.get("/holidays/next", params),
      create: (data) => http.post("/holidays", data),
      import: (data) => http.post("/holidays/import", data),
    },

    // ── Assets ──────────────────────────────────────────────────────────
    assets: {
      list: (params) => http.get("/assets", params),
      get: (id) => http.get("/assets/" + id),
      create: (data) => http.post("/assets", data),
      assign: (id, data) => http.post("/assets/" + id + "/assign", data),
      acknowledge: (assignmentId) => http.post("/assets/assignments/" + assignmentId + "/acknowledge", {}),
      returnAsset: (assignmentId, data) => http.post("/assets/assignments/" + assignmentId + "/return", data),
      mine: () => http.get("/assets/me"),
      forEmployee: (empId) => http.get("/assets/employee/" + empId),
    },

    // ── Announcements ───────────────────────────────────────────────────
    announcements: {
      list: (params) => http.get("/announcements", params),
      get: (id) => http.get("/announcements/" + id),
      publish: (data) => http.post("/announcements", data),
      update: (id, data) => http.patch("/announcements/" + id, data),
      remove: (id) => http.del("/announcements/" + id),
      acknowledge: (id) => http.post("/announcements/" + id + "/acknowledge", {}),
    },

    // ── Comments ────────────────────────────────────────────────────────
    comments: {
      list: (entityType, entityId) => http.get("/comments/" + entityType + "/" + entityId),
      add: (entityType, entityId, data) => http.post("/comments/" + entityType + "/" + entityId, data),
      edit: (id, body) => http.patch("/comments/" + id, { body }),
      pin: (id) => http.post("/comments/" + id + "/pin", {}),
      remove: (id) => http.del("/comments/" + id),
    },

    // ── Notifications ───────────────────────────────────────────────────
    notifications: {
      list: (params) => http.get("/notifications", params),
      markRead: (id) => http.post("/notifications/" + id + "/read", {}),
      markAllRead: () => http.post("/notifications/mark-all-read", {}),
      broadcast: (data) => http.post("/notifications/broadcast", data),
    },

    // ── Audit ───────────────────────────────────────────────────────────
    audit: {
      list: (params) => http.get("/audit", params),
    },

    // ── Sessions & security ─────────────────────────────────────────────
    sessions: {
      mine: () => http.get("/sessions/me"),
      list: (params) => http.get("/sessions", params),
      revoke: (id) => http.post("/sessions/" + id + "/revoke", {}),
      revokeAll: (empId) => http.post("/sessions/employee/" + empId + "/revoke-all", {}),
      loginAttempts: (params) => http.get("/sessions/login-attempts", params),
    },
    security: {
      apiKeys: () => http.get("/security/api-keys"),
      createApiKey: (data) => http.post("/security/api-keys", data),
      revokeApiKey: (id) => http.post("/security/api-keys/" + id + "/revoke", {}),
      mfaDevices: () => http.get("/security/mfa/devices"),
      enrollMfa: (data) => http.post("/security/mfa/devices", data),
      removeMfa: (id) => http.del("/security/mfa/devices/" + id),
    },

    // ── Permissions ─────────────────────────────────────────────────────
    permissions: {
      list: () => http.get("/permissions/permissions"),
      createPermission: (data) => http.post("/permissions/permissions", data),
      roles: () => http.get("/permissions/roles"),
      createRole: (data) => http.post("/permissions/roles", data),
      grant: (roleKey, permissionKey) => http.post("/permissions/roles/" + roleKey + "/permissions", { permissionKey }),
      revoke: (roleKey, permKey) => http.del("/permissions/roles/" + roleKey + "/permissions/" + permKey),
    },

    // ── System / admin ──────────────────────────────────────────────────
    system: {
      notificationTemplates: () => http.get("/system/notification-templates"),
      jobs: (params) => http.get("/system/jobs", params),
      backups: () => http.get("/system/backups"),
      triggerBackup: (data) => http.post("/system/backups", data),
      syncLogs: (params) => http.get("/system/sync-logs", params),
      triggerSync: (integrationId) => http.post("/system/integrations/" + integrationId + "/sync", {}),
    },
    admin: {
      config: () => http.get("/admin/config"),
      setConfig: (key, value) => http.patch("/admin/config/" + key, { value }),
      integrations: () => http.get("/admin/integrations"),
    },

    // ── M365 / Entra diagnostics ────────────────────────────────────────
    m365: {
      status: () => http.get("/m365/status"),
      myGroups: () => http.get("/m365/me/groups"),
      syncMe: () => http.post("/m365/sync/me", {}),
    },
  };

  // Expose globally
  window.SUDO_API = api;
  // Convenience alias used throughout pages
  window.api = api;
})();
