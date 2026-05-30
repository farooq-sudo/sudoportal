/**
 * ============================================================================
 *  SUDO Portal · Auth Bootstrap
 * ============================================================================
 *
 *  Runs before each portal's dashboard.js. Responsibilities:
 *
 *    1. Capture the JWT after an Entra login redirect.
 *       The callback redirects to  <portal>/?token=<jwt>  — we grab it,
 *       store it via api.setToken(), and clean the URL.
 *
 *    2. Bootstrap the current user (api.auth.me()) and expose it as
 *       window.SUDO_USER so pages can role-gate UI.
 *
 *    3. Guard: if no token and not in dev mode, redirect to login.
 *
 *  DEV MODE
 *  --------
 *  If window.SUDO_DEV_LOGIN_EMAIL is set (e.g. on a local dev page), the
 *  bootstrap will dev-login that user automatically. Never use in prod.
 *
 *  USAGE in each portal's index.html, BEFORE dashboard.js:
 *    <script src="../shared/api.js"></script>
 *    <script src="../shared/auth.js"></script>
 *    <script>SUDO_AUTH.bootstrap().then(() => initPortal());</script>
 * ============================================================================
 */

(function () {
  "use strict";

  const api = window.SUDO_API;
  if (!api) {
    console.error("[auth] api.js must load before auth.js");
    return;
  }

  // ── 1. Capture token from redirect (?token=...) ──────────────────────────
  function captureTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      api.setToken(token);
      // Strip token from the URL so it isn't bookmarked / logged
      params.delete("token");
      const clean =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "") +
        window.location.hash;
      window.history.replaceState({}, document.title, clean);
      return true;
    }
    return false;
  }

  // ── 2 & 3. Bootstrap current user / guard ────────────────────────────────
  async function bootstrap(opts) {
    opts = opts || {};
    captureTokenFromUrl();

    // Dev auto-login (staging/dev only). The launcher sets a chosen demo
    // employee id in sessionStorage; we also accept a global for convenience.
    let devEmpId = window.SUDO_DEV_LOGIN_EMPID || null;
    try {
      if (!devEmpId) devEmpId = sessionStorage.getItem("sudo_demo_empid");
    } catch (e) { /* ignore */ }
    if (devEmpId) {
      // A demo persona was chosen — (re)issue a token for them, overriding
      // any previous demo session so role switching from the launcher works.
      try {
        await api.auth.devLogin(devEmpId);
        try { sessionStorage.removeItem("sudo_demo_empid"); } catch (e) {}
      } catch (e) {
        console.warn("[auth] dev-login failed:", e.message);
      }
    }

    // No token at all → go to login (unless page is public)
    if (!api.isAuthenticated() && !opts.public) {
      const here = window.location.pathname + window.location.search;
      window.location.href = api.auth.loginUrl(here);
      return null;
    }

    // Fetch current user
    try {
      const me = await api.auth.me();
      window.SUDO_USER = me;
      document.dispatchEvent(new CustomEvent("sudo:user-ready", { detail: me }));
      return me;
    } catch (e) {
      if (e.status === 401) {
        const here = window.location.pathname + window.location.search;
        window.location.href = api.auth.loginUrl(here);
        return null;
      }
      console.error("[auth] failed to load current user:", e);
      throw e;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function hasRole(role) {
    const u = window.SUDO_USER;
    return !!(u && u.roles && u.roles.indexOf(role) !== -1);
  }

  function hasAnyRole() {
    const roles = Array.prototype.slice.call(arguments);
    return roles.some(hasRole);
  }

  async function logout() {
    await api.auth.logout();
    window.location.href = api.auth.loginUrl();
  }

  window.SUDO_AUTH = {
    bootstrap,
    hasRole,
    hasAnyRole,
    logout,
    currentUser: () => window.SUDO_USER || null,
  };
})();
