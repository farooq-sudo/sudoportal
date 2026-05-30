/**
 * SUDO Portal — Role Switcher (top-right header)
 *
 * REVERSIBLE PREVIEW MODEL:
 *   Each user has a "home role" (their actual highest role). From home they
 *   can preview any DOWNSTREAM role. While previewing, the switcher offers a
 *   "Back to home" link AND a persistent banner at the top of the page.
 *
 * Hierarchy:
 *   Admin → can preview HR / PM / TL / Employee
 *   HR    → can preview Employee
 *   PM    → can preview Employee
 *   TL    → can preview Employee
 *   Employee (true) → no switcher
 *
 * PREVIEW STATE TRANSPORT:
 *   The "home role" the user came from is encoded in the URL as `?from=<role>`.
 *   This works reliably across file:// origins and HTTP origins alike, unlike
 *   sessionStorage which is per-origin (and Chrome treats each file:// URL as
 *   a SEPARATE origin so sessionStorage doesn't survive cross-portal nav).
 *
 *   Outbound link from HR → Employee:   employee_dashboard/index.html?from=hr
 *   Inbound on Employee page:            location.search has from=hr → preview!
 *   "Back to HR" link:                   hr_dashboard/index.html  (no ?from)
 *
 *   sessionStorage is also written as a belt-and-braces fallback for any
 *   browser that ever does honour cross-file sessionStorage.
 *
 * USAGE — call once after the page header renders:
 *   RoleSwitcher.mount({ currentRole: 'hr', basePath: '..' });
 */
(function (global) {
'use strict';

  const PORTALS = {
    employee: { label: "Employee view",     href: "employee/index.html",   pill: "EMP", key: "employee" },
    tl:       { label: "Team Lead view",    href: "team_lead/index.html",  pill: "TL",  key: "tl" },
    pm:       { label: "PM view",           href: "pm/index.html",         pill: "PM",  key: "pm" },
    hr:       { label: "HR view",           href: "hr/index.html",         pill: "HR",  key: "hr" },
    admin:    { label: "Super Admin view",  href: "admin/index.html",      pill: "ADM", key: "admin" },
  };

  // What each role can preview (downstream only) — used when the page doesn't
  // pass an explicit userRoles list (i.e. only for legacy preview-from-higher
  // navigation). When userRoles IS passed, those override this hierarchy.
  const ALLOWED_TARGETS = {
    admin:    ["hr", "pm", "tl", "employee"],
    hr:       ["employee"],
    pm:       ["employee"],
    tl:       ["employee"],
    employee: [],
  };

  // Pretty labels for the user's actual roles, in the order they're shown.
  const ROLE_ORDER = ["admin", "hr", "pm", "tl", "employee"];

  // -- Preview state transport -------------------------------------------------
  const HOME_KEY = "sudo:preview-home";

  function getPreviewHome(currentRole) {
    // 1) URL query string ?from=<role>  (primary, survives file:// cross-doc nav)
    try {
      const params = new URLSearchParams(location.search);
      const fromUrl = params.get("from");
      if (fromUrl && PORTALS[fromUrl] && fromUrl !== currentRole) return fromUrl;
    } catch (e) { /* ignore */ }
    // 2) sessionStorage fallback (works on http, sometimes on file://)
    try {
      const fromSs = sessionStorage.getItem(HOME_KEY);
      if (fromSs && PORTALS[fromSs] && fromSs !== currentRole) return fromSs;
    } catch (e) { /* ignore */ }
    return null;
  }
  function setPreviewHome(role) {
    try { sessionStorage.setItem(HOME_KEY, role); } catch (e) {}
  }
  function clearPreviewHome() {
    try { sessionStorage.removeItem(HOME_KEY); } catch (e) {}
  }

  // ── Cross-portal identity carrier ───────────────────────────────────────
  // When real-role-switching from HR → Employee (i.e. Justine clicks "Switch
  // to Employee" on the HR portal), we need the Employee portal to know that
  // it's still Justine — so it can show her other roles in the switcher and
  // let her go back to HR.
  //
  // We carry that across portals via URL params (?as=<source-role>&user=<empId>)
  // because file:// origins don't share sessionStorage across paths, and
  // localStorage *does* persist across reloads of the same file URL but not
  // across different file URLs reliably in every browser. URL params just work.
  //
  // We also write to localStorage as a fallback so refreshing the destination
  // portal preserves the switched identity.
  const IDENTITY_KEY = "sudo:switch-identity";

  function readSwitchIdentity(currentRole) {
    try {
      const params = new URLSearchParams(location.search);
      const asRole = params.get("as");
      const userId = params.get("user");
      if (asRole && PORTALS[asRole] && asRole !== currentRole && userId) {
        const identity = { sourceRole: asRole, userId };
        // Persist for refresh-survival
        try { localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity)); } catch (e) {}
        return identity;
      }
    } catch (e) { /* ignore */ }
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) {
        const id = JSON.parse(raw);
        // If the user navigated back to their home portal, clear the identity
        if (id && id.sourceRole === currentRole) {
          localStorage.removeItem(IDENTITY_KEY);
          return null;
        }
        if (id && id.sourceRole && id.userId && PORTALS[id.sourceRole]) return id;
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  function clearSwitchIdentity() {
    try { localStorage.removeItem(IDENTITY_KEY); } catch (e) {}
  }

  // Build href to another portal.
  //   - For preview navigation: opts.fromRole adds ?from=<role>
  //   - For real role-switching: opts.asRole + opts.userId add ?as=<role>&user=<id>
  function buildHref(opts, targetPortal, params) {
    let href = (opts.basePath || "..") + "/" + targetPortal.href;
    const qs = [];
    if (params && params.fromRole) qs.push("from=" + params.fromRole);
    if (params && params.asRole)   qs.push("as=" + params.asRole);
    if (params && params.userId)   qs.push("user=" + params.userId);
    if (qs.length > 0) {
      href += (href.includes("?") ? "&" : "?") + qs.join("&");
    }
    return href;
  }

  // -- Icons -------------------------------------------------------------------
  const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ARROW = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" class="role-switcher__arrow"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SWAP  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 16h13M7 16l4-4M7 16l4 4M17 8H4m13 0l-4-4m4 4l-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const BACK  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function mount(opts) {
    const current = PORTALS[opts.currentRole];
    if (!current) return;

    const previewHome  = getPreviewHome(opts.currentRole);
    const isPreviewing = !!previewHome;
    const homeRole     = isPreviewing ? previewHome : opts.currentRole;

    // While previewing, also write sessionStorage so subsequent in-portal
    // navigation (without ?from in the new URL) is still recognised as preview.
    if (isPreviewing) setPreviewHome(previewHome);

    // ── Read incoming-switch identity ─────────────────────────────────────
    // If the user arrived here via "Switch to Employee" from another portal
    // (e.g. Justine clicked "Switch to Employee" on her HR portal), the URL
    // carries ?as=hr&user=E004. That tells us: this is Justine, she's now in
    // the Employee portal, her other role is HR.
    const switchIdentity = readSwitchIdentity(opts.currentRole);

    // Determine the full role set for this user (used for switcher options).
    // We merge:
    //   - opts.userRoles (this portal's local view of the user's roles)
    //   - switchIdentity.sourceRole (the role they came FROM, if any)
    //   - any *other* roles the source user has, if we can look them up via
    //     SUDO_DB_OVERRIDES (so Fatima switching PM → Employee can also see
    //     TL as a switch option in the Employee portal)
    let effectiveRoles = Array.isArray(opts.userRoles) ? opts.userRoles.slice() : [];
    if (switchIdentity) {
      if (!effectiveRoles.includes(switchIdentity.sourceRole)) {
        effectiveRoles.push(switchIdentity.sourceRole);
      }
      // Try to enrich with the full role list of the switched-in user
      try {
        if (window.SUDO_DB_OVERRIDES && typeof window.SUDO_DB_OVERRIDES.getRoles === "function") {
          const realRoles = SUDO_DB_OVERRIDES.getRoles(switchIdentity.userId) || [];
          realRoles.forEach(r => {
            if (!effectiveRoles.includes(r) && PORTALS[r]) effectiveRoles.push(r);
          });
        }
      } catch (e) { /* fallback to the carried role only */ }
    }
    const usingRealRoles = effectiveRoles.length > 0;

    // Determine which other portals this user can switch to:
    //   - If effectiveRoles has entries (the user's actual role assignments),
    //     use those: a HR+Employee user can swap between HR and Employee
    //     freely. This is the real-world "I'm wearing different hats" model.
    //   - Otherwise fall back to ALLOWED_TARGETS, the downstream-preview model
    //     (Admin previews HR, HR previews Employee, etc.) for backwards compat.
    let targets;
    if (usingRealRoles) {
      targets = effectiveRoles
        .filter(r => r !== opts.currentRole && PORTALS[r])
        .sort((a, b) => ROLE_ORDER.indexOf(a) - ROLE_ORDER.indexOf(b));
    } else {
      targets = ALLOWED_TARGETS[homeRole] || [];
    }

    // ── Visibility gates ────────────────────────────────────────────────────
    // Show the switcher when:
    //  1. The user is previewing (downstream preview from a higher role).
    //  2. The user arrived here via a real role switch (switchIdentity present).
    //  3. The user has multiple assigned roles (hasMultipleRoles: true).
    //  4. The user has at least one possible switch target.
    const hasSwitchTargets = targets.length > 0;
    const hasSwitchedIn    = !!switchIdentity;
    const shouldShow = isPreviewing
                    || hasSwitchedIn
                    || (opts.hasMultipleRoles === true && hasSwitchTargets);
    if (!shouldShow) return;

    const topbar = document.querySelector(".topbar__right") ||
                   document.querySelector(".topbar-actions") ||
                   document.querySelector(".header__right") ||
                   document.querySelector(".topbar") ||
                   document.querySelector("header");
    if (!topbar) return;

    const homePortal = PORTALS[homeRole];

    // Build menu items: optional Back, current marker, other downstream targets
    const menuItems = [];

    if (isPreviewing) {
      menuItems.push({ type: "back", role: homeRole, portal: homePortal });
    }
    menuItems.push({ type: "current", role: opts.currentRole, portal: current });
    targets.forEach(r => {
      if (r === opts.currentRole) return;
      if (isPreviewing && r === homeRole) return;
      menuItems.push({ type: "target", role: r, portal: PORTALS[r] });
    });

    const wrapper = document.createElement("div");
    wrapper.className = "role-switcher role-switcher--top" + (isPreviewing ? " role-switcher--previewing" : "");
    // usingRealRoles was computed above based on effectiveRoles (merges
    // opts.userRoles with any switch-identity carrier from the URL). Don't
    // redeclare it here — would shadow the value the visibility gate used.
    const triggerLabel = isPreviewing ? "Previewing " + current.pill : (usingRealRoles ? "Switch role" : "View as");
    const triggerTitle = isPreviewing ? "Previewing as " + current.label.replace(" view","") + " · click to switch back" : (usingRealRoles ? "Switch to one of your other portals" : "View as another role");

    // For the header text, count the effective roles (including the carried
    // source role from a switch-identity URL).
    const roleCount = (effectiveRoles && effectiveRoles.length) || (opts.userRoles ? opts.userRoles.length : 0);

    // The empId for outgoing real-role-switching links. Prefer the carried
    // identity (if we got switched in), else fall back to opts.userId.
    const outgoingUserId = (switchIdentity && switchIdentity.userId) || opts.userId || null;

    wrapper.innerHTML = `
      <button class="role-switcher__btn" id="rs-btn" title="${triggerTitle}">
        ${isPreviewing ? BACK : SWAP}
        <span>${triggerLabel}</span>
        ${ARROW}
      </button>
      <div class="role-switcher__menu">
        <div class="role-switcher__hdr">
          ${isPreviewing
            ? "You're previewing as <strong>" + current.label.replace(" view","") + "</strong>. Your home role is <strong>" + homePortal.label.replace(" view","") + "</strong>."
            : (usingRealRoles
                ? "You currently have <strong>" + roleCount + " role" + (roleCount === 1 ? "" : "s") + "</strong>. Click any to switch."
                : "You're currently in <strong>" + current.label.replace(" view","") + "</strong>")}
        </div>
        <div class="role-switcher__sep"></div>
        ${menuItems.map(item => {
          if (item.type === "current") {
            return `<a class="role-switcher__item role-switcher__item--current">
              <span class="role-switcher__pill">${item.portal.pill}</span>
              <span class="role-switcher__lbl">${item.portal.label}</span>
              ${CHECK}
            </a>`;
          } else if (item.type === "back") {
            // Back to home → clean URL, no params
            const href = buildHref(opts, item.portal, null);
            return `<a class="role-switcher__item role-switcher__item--back" data-action="rs-go-home" href="${href}">
              <span class="role-switcher__back-icon">${BACK}</span>
              <span class="role-switcher__pill">${item.portal.pill}</span>
              <span class="role-switcher__lbl">Back to ${item.portal.label}</span>
            </a>`;
          } else {
            // For real role-switching:
            //   - If the target IS the source portal of an active switch
            //     identity, we're going home: clean URL, no params. The
            //     destination's readSwitchIdentity will see sourceRole ===
            //     currentRole and clear the localStorage carrier.
            //   - Otherwise carry ?as=<currentRole>&user=<empId> so the
            //     destination knows who switched in and can show the back link.
            //
            // For downstream preview (Admin), attach ?from=<homeRole>.
            let hrefParams;
            if (usingRealRoles) {
              if (switchIdentity && item.role === switchIdentity.sourceRole) {
                hrefParams = null;   // going home — clean URL
              } else {
                hrefParams = { asRole: opts.currentRole, userId: outgoingUserId };
              }
            } else {
              hrefParams = { fromRole: homeRole };
            }
            const href = buildHref(opts, item.portal, hrefParams);
            return `<a class="role-switcher__item" data-action="${usingRealRoles ? 'rs-switch' : 'rs-preview'}" data-target-role="${item.role}" href="${href}">
              <span class="role-switcher__pill">${item.portal.pill}</span>
              <span class="role-switcher__lbl">${item.portal.label}</span>
            </a>`;
          }
        }).join("")}
        <div class="role-switcher__sep"></div>
        <div class="role-switcher__foot">
          ${isPreviewing
            ? "You're seeing this junior view as a preview. Click back to return to your home role."
            : (usingRealRoles
                ? "These are your assigned portals. Switching takes you to that portal as yourself, not as a preview."
                : "Preview a junior view to see exactly what they see. You can always switch back.")}
        </div>
      </div>
    `;

    if (topbar.firstChild) topbar.insertBefore(wrapper, topbar.firstChild);
    else                   topbar.appendChild(wrapper);

    const btn = wrapper.querySelector("#rs-btn");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.toggle("role-switcher--open");
    });
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) wrapper.classList.remove("role-switcher--open");
    });

    // Going home → clear preview state
    wrapper.querySelectorAll('[data-action="rs-go-home"]').forEach(a => {
      a.addEventListener("click", () => clearPreviewHome());
    });
    // Going to a real role switch → clear any preview state. If the target IS
    // the source portal of an active switch identity, also clear the
    // localStorage carrier so the destination portal starts clean.
    wrapper.querySelectorAll('[data-action="rs-switch"]').forEach(a => {
      a.addEventListener("click", () => {
        clearPreviewHome();
        const target = a.dataset.targetRole;
        if (switchIdentity && target === switchIdentity.sourceRole) {
          clearSwitchIdentity();
        }
      });
    });
    // Going to a new preview → set home if we're not already previewing
    wrapper.querySelectorAll('[data-action="rs-preview"]').forEach(a => {
      a.addEventListener("click", () => {
        if (!isPreviewing) setPreviewHome(opts.currentRole);
      });
    });

    // ── Persistent preview banner ───────────────────────────────────────────
    if (isPreviewing) {
      const banner = document.createElement("div");
      banner.className = "rs-preview-banner";
      const backHref = buildHref(opts, homePortal, null);
      banner.innerHTML = `
        <div class="rs-preview-banner__inner">
          <span class="rs-preview-banner__icon">${BACK}</span>
          <span class="rs-preview-banner__text">
            You are previewing the <strong>${current.label.replace(" view","")}</strong> portal as
            <strong>${homePortal.label.replace(" view","")}</strong>.
            All data is shown read-only-style for preview purposes.
          </span>
          <a class="rs-preview-banner__btn" href="${backHref}" data-action="rs-go-home-banner">
            ${BACK} <span>Back to ${homePortal.label.replace(" view","")}</span>
          </a>
        </div>`;
      document.body.insertBefore(banner, document.body.firstChild);
      document.body.classList.add("rs-preview-active");
      banner.querySelector('[data-action="rs-go-home-banner"]').addEventListener("click", () => {
        clearPreviewHome();
      });
    }
  }

  global.RoleSwitcher = { mount };
})(window);
