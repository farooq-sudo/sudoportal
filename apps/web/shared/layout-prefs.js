// ============================================================================
//  shared/layout-prefs.js — per-user layout customization
// ============================================================================
//  Lets each user reorder AND hide sections within a page (or tabs within a
//  tab-strip). Preferences are persisted to localStorage so they survive
//  page reloads.
//
//  Storage format (localStorage key sudo:prefs:layout:<pageKey>):
//    Newer format:  { order: ["a","b","c"], hidden: ["c"] }
//    Legacy format: ["a","b","c"]       — order only, no hidden support
//  The reader normalises both into { order, hidden } at runtime.
//
//  Usage from a page:
//    const { order, hidden } = SUDO_LAYOUT.getPrefs("hr-dashboard", DEFAULT_ORDER);
//    order.forEach(id => {
//      if (hidden.includes(id)) return;
//      renderSection(id);
//    });
//
//    SUDO_LAYOUT.openCustomizer({
//      pageKey: "hr-dashboard",
//      label: "HR Dashboard",
//      sections: SECTION_DEFS,           // [{ id, label, hint, alwaysVisible? }]
//      defaultOrder: DEFAULT_ORDER,
//      onSave: () => location.reload(),
//    });
// ============================================================================

(function (global) {

  const STORAGE_PREFIX = "sudo:prefs:layout:";

  function key(pageKey) { return STORAGE_PREFIX + pageKey; }

  /**
   * Read prefs, normalising old (array-only) and new ({order, hidden}) formats.
   * Returns { order, hidden } where:
   *   - order is the full ordered list of IDs (saved preferences + appended
   *     defaults for IDs the user hasn't seen yet, with stale IDs dropped)
   *   - hidden is the list of IDs the user has chosen to hide
   */
  function getPrefs(pageKey, defaultOrder) {
    let saved = null;
    try {
      const raw = localStorage.getItem(key(pageKey));
      if (raw) saved = JSON.parse(raw);
    } catch (e) { saved = null; }

    // Normalise to {order, hidden}
    let savedOrder, savedHidden;
    if (Array.isArray(saved)) {           // legacy: bare array
      savedOrder = saved;
      savedHidden = [];
    } else if (saved && Array.isArray(saved.order)) {
      savedOrder = saved.order;
      savedHidden = Array.isArray(saved.hidden) ? saved.hidden : [];
    } else {
      return { order: defaultOrder.slice(), hidden: [] };
    }

    // Drop unknown IDs (stale entries from a previous code version)
    const validOrder = savedOrder.filter(id => defaultOrder.includes(id));
    // Append default IDs that aren't in the saved list (new sections)
    const missing = defaultOrder.filter(id => !validOrder.includes(id));
    const order = validOrder.concat(missing);
    const hidden = savedHidden.filter(id => defaultOrder.includes(id));
    return { order, hidden };
  }

  /**
   * Backwards-compatible: returns just the order array. Hidden IDs are not
   * filtered out — callers that want the visible-only list should call
   * getPrefs() and filter hidden themselves.
   */
  function getOrder(pageKey, defaultOrder) {
    return getPrefs(pageKey, defaultOrder).order;
  }

  function setPrefs(pageKey, prefs) {
    try {
      const payload = { order: prefs.order || [], hidden: prefs.hidden || [] };
      localStorage.setItem(key(pageKey), JSON.stringify(payload));
    } catch (e) { /* localStorage full / disabled — ignore */ }
  }

  function setOrder(pageKey, order) {
    const prefs = getPrefs(pageKey, order);
    setPrefs(pageKey, { order, hidden: prefs.hidden });
  }

  function reset(pageKey) {
    try { localStorage.removeItem(key(pageKey)); }
    catch (e) { /* ignore */ }
  }

  /**
   * Open the customizer slideover. Uses the host page's openSlideover()
   * and closeSlideover() globals — they exist in every portal.
   *
   * sections: [{ id, label, hint, alwaysVisible? }]
   *   - alwaysVisible: true on a section disables the hide checkbox for it
   *     (e.g. core metrics rows that should always render)
   */
  function openCustomizer({ pageKey, label, sections, defaultOrder, onSave }) {
    if (typeof window.openSlideover !== "function") {
      console.warn("SUDO_LAYOUT: openSlideover not available on this page");
      return;
    }

    const initial = getPrefs(pageKey, defaultOrder);
    const defMap = {};
    sections.forEach(s => { defMap[s.id] = s; });

    let pendingOrder = initial.order.slice();
    let pendingHidden = initial.hidden.slice();

    function isHidden(id)    { return pendingHidden.includes(id); }
    function isAlwaysVis(id) { return !!(defMap[id] && defMap[id].alwaysVisible); }

    function rowFor(sectionId, idx, total) {
      const s = defMap[sectionId] || { id: sectionId, label: sectionId };
      const hidden = isHidden(sectionId);
      const lockedVisible = isAlwaysVis(sectionId);
      const opacity = hidden ? "opacity:.55" : "";
      return `
        <li data-id="${sectionId}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid ${hidden ? '#FCA5A5' : 'var(--ink-200)'};border-radius:8px;background:${hidden ? '#FEF2F2' : '#fff'};margin-bottom:6px;${opacity}">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:var(--ink-100);border-radius:50%;font-size:11px;font-weight:700;color:var(--ink-700);flex-shrink:0">${idx + 1}</span>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;color:var(--ink-900);font-size:13px">${s.label}${hidden ? ' <span style="font-size:10px;color:#B91C1C;font-weight:700;text-transform:uppercase;letter-spacing:.5px">· hidden</span>' : ''}</div>
            ${s.hint ? `<div style="font-size:11px;color:var(--ink-500)">${s.hint}</div>` : ""}
          </div>
          <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:${lockedVisible ? 'var(--ink-400)' : 'var(--ink-700)'};cursor:${lockedVisible ? 'not-allowed' : 'pointer'};user-select:none" title="${lockedVisible ? 'This section cannot be hidden' : 'Show / hide this section'}">
            <input type="checkbox" data-layout-action="toggle-vis" data-id="${sectionId}" ${!hidden ? 'checked' : ''} ${lockedVisible ? 'disabled' : ''}>
            visible
          </label>
          <button class="btn btn--ghost btn--sm" data-layout-action="up" data-id="${sectionId}" ${idx === 0 ? "disabled style=\"opacity:.3\"" : ""}>▲</button>
          <button class="btn btn--ghost btn--sm" data-layout-action="down" data-id="${sectionId}" ${idx === total - 1 ? "disabled style=\"opacity:.3\"" : ""}>▼</button>
        </li>`;
    }

    function renderList() {
      return `<ol id="sudo-layout-list" style="list-style:none;padding:0;margin:0">
        ${pendingOrder.map((id, i) => rowFor(id, i, pendingOrder.length)).join("")}
      </ol>`;
    }

    window.openSlideover({
      title: `Customize layout · ${label}`,
      body: `
        <div class="info-banner" style="margin-bottom:14px;background:#EFF6FF;border-color:#BFDBFE">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <div>Use the arrows to move sections up or down. Untick "visible" to hide a section from your dashboard. Your preference is saved locally and persists across sessions.</div>
        </div>

        <div id="sudo-layout-host">${renderList()}</div>

        <div class="form-foot">
          <button class="btn btn--secondary" data-layout-action="reset">Reset to default</button>
          <div style="flex:1"></div>
          <button class="btn btn--secondary" onclick="closeSlideover()">Cancel</button>
          <button class="btn btn--primary" data-layout-action="save">Save & apply</button>
        </div>`,
    });

    function rerender() {
      const host = document.getElementById("sudo-layout-host");
      if (host) host.innerHTML = renderList();
    }

    setTimeout(() => {
      document.addEventListener("click", function layoutHandler(ev) {
        const btn = ev.target.closest("[data-layout-action]");
        if (!btn) return;
        const action = btn.dataset.layoutAction;
        const id = btn.dataset.id;
        if (action === "up") {
          const i = pendingOrder.indexOf(id);
          if (i > 0) { [pendingOrder[i - 1], pendingOrder[i]] = [pendingOrder[i], pendingOrder[i - 1]]; rerender(); }
        } else if (action === "down") {
          const i = pendingOrder.indexOf(id);
          if (i >= 0 && i < pendingOrder.length - 1) { [pendingOrder[i + 1], pendingOrder[i]] = [pendingOrder[i], pendingOrder[i + 1]]; rerender(); }
        } else if (action === "toggle-vis") {
          if (isAlwaysVis(id)) return;
          if (isHidden(id)) pendingHidden = pendingHidden.filter(x => x !== id);
          else pendingHidden.push(id);
          rerender();
        } else if (action === "reset") {
          pendingOrder = defaultOrder.slice();
          pendingHidden = [];
          rerender();
        } else if (action === "save") {
          setPrefs(pageKey, { order: pendingOrder, hidden: pendingHidden });
          document.removeEventListener("click", layoutHandler);
          window.closeSlideover();
          if (typeof onSave === "function") onSave();
          else if (typeof window.__toast === "function") window.__toast("Layout saved", "success");
        }
      });
    }, 60);
  }

  global.SUDO_LAYOUT = { getPrefs, getOrder, setOrder, setPrefs, reset, openCustomizer };

})(typeof window !== "undefined" ? window : globalThis);
