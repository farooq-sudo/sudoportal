/**
 * SUDO Portal — Shared FilterBar component
 *
 * Renders a consistent filter+sort+view+export bar above any data table or list.
 * Used by:
 *   Employee — My Trainings, My Certifications, My Documents, My Requests,
 *              Notifications, Time Off, My Team, My Projects, My Badges, My KPIs
 *   HR — Training Verification, KPI Management, Project Ratings, Leave Approvals,
 *        Documents, Notification Templates, Projects, Employees
 *   PM, TL, Admin — similar tables
 *
 * USAGE:
 *   <div id="my-filterbar"></div>
 *   FilterBar.mount('my-filterbar', {
 *     period: true,                  // show "this month/quarter/year/custom" select
 *     views: ['list','tiles','kanban'],   // which view modes to offer
 *     tabs: [{id:'all',label:'All'},{id:'active',label:'Active',count:5}],
 *     filters: [
 *       { id:'status', label:'Status', options:['Active','Done','Cancelled'] },
 *       { id:'category', label:'Category', options:['Cert','Training'] },
 *     ],
 *     search: true,
 *     download: true,                // PDF export button
 *     onChange: (state) => { ... }   // fired any time filter changes
 *   });
 *
 * The `onChange` callback gives you the current state:
 *   { period:'this_month', view:'list', tab:'active', filters:{status:'Active'},
 *     search:'', from:'2026-04-01', to:'2026-04-30' }
 */
(function (global) {

  const VIEW_ICONS = {
    list:     '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    tiles:    '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="1.8"/></svg>',
    kanban:   '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><rect x="3" y="3" width="6" height="18" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="10" y="3" width="6" height="11" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="17" y="3" width="4" height="14" rx="1" stroke="currentColor" stroke-width="1.8"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    timeline: '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="7" cy="6" r="2" fill="currentColor"/><circle cx="13" cy="12" r="2" fill="currentColor"/><circle cx="18" cy="18" r="2" fill="currentColor"/></svg>',
    chart:    '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const ICON_FILTER = '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M3 4h18l-7 9v6l-4 2v-8L3 4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const ICON_DL     = '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_SEARCH = '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const ICON_CAL    = '<svg viewBox="0 0 24 24" fill="none" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  // Period options drive date-range filtering
  const PERIODS = [
    { id:"this_month",   label:"This month" },
    { id:"last_month",   label:"Last month" },
    { id:"this_quarter", label:"This quarter" },
    { id:"this_year",    label:"This year" },
    { id:"last_year",    label:"Last year" },
    { id:"all_time",     label:"All time" },
    { id:"custom",       label:"Custom range…" },
  ];

  // Build a state object from defaults + opts
  function defaultState(opts) {
    return {
      period:  opts.period ? "this_month" : null,
      view:    opts.views ? opts.views[0] : null,
      tab:     opts.tabs ? (opts.tabs[0]?.id || null) : null,
      filters: (opts.filters || []).reduce((acc, f) => { acc[f.id] = f.options[0] || ""; return acc; }, {}),
      search:  "",
      from:    null,
      to:      null,
    };
  }

  function render(mountId, opts, state) {
    const tabs = opts.tabs ? `
      <div class="fb__tabs">
        ${opts.tabs.map(t => `
          <button class="fb__tab ${t.id === state.tab ? "fb__tab--active" : ""}" data-tab="${t.id}">
            ${t.label}
            ${t.count != null ? `<span class="fb__tab-count">${t.count}</span>` : ""}
          </button>
        `).join("")}
      </div>` : "";

    // Hide the view switch UI when there's only one view — no point showing a toggle
    const views = (opts.views && opts.views.length > 1) ? `
      <div class="fb__views">
        ${opts.views.map(v => `
          <button class="fb__view-btn ${v === state.view ? "fb__view-btn--active" : ""}" data-view="${v}" title="${v.charAt(0).toUpperCase()+v.slice(1)} view">
            ${VIEW_ICONS[v] || ""}<span>${v.charAt(0).toUpperCase()+v.slice(1)}</span>
          </button>
        `).join("")}
      </div>` : "";

    const periodCtl = opts.period ? `
      <div class="fb__period">
        <select class="fb__select" data-fb="period">
          ${PERIODS.map(p => `<option value="${p.id}" ${p.id === state.period ? "selected" : ""}>${p.label}</option>`).join("")}
        </select>
        <div class="fb__custom-range" data-fb-custom style="${state.period === "custom" ? "" : "display:none"}">
          <span class="fb__cal">${ICON_CAL}</span>
          <input type="date" class="fb__date" data-fb="from" value="${state.from || ""}" />
          <span class="fb__dash">→</span>
          <input type="date" class="fb__date" data-fb="to" value="${state.to || ""}" />
        </div>
      </div>` : "";

    const filterControls = (opts.filters || []).map(f => `
      <select class="fb__select" data-fb-filter="${f.id}">
        ${f.options.map(o => {
          const val = typeof o === "string" ? o : o.value;
          const label = typeof o === "string" ? o : o.label;
          return `<option value="${val}" ${val === state.filters[f.id] ? "selected" : ""}>${label}</option>`;
        }).join("")}
      </select>
    `).join("");

    const searchCtl = opts.search ? `
      <div class="fb__search">
        ${ICON_SEARCH}
        <input class="fb__search-input" placeholder="Search…" value="${state.search}" data-fb="search" />
      </div>` : "";

    const dlBtn = opts.download ? `
      <button class="fb__dl" data-fb-action="download">${ICON_DL} <span>PDF</span></button>` : "";

    const root = document.getElementById(mountId);
    root.innerHTML = `
      <div class="fb">
        ${tabs}
        <div class="fb__row">
          ${views}
          <div class="fb__controls">
            ${periodCtl}
            ${filterControls}
            ${searchCtl}
            ${dlBtn}
          </div>
        </div>
      </div>`;
  }

  function bind(mountId, opts, state, onChange) {
    const root = document.getElementById(mountId);

    // Tabs
    root.querySelectorAll(".fb__tab").forEach(b => b.addEventListener("click", () => {
      state.tab = b.dataset.tab;
      render(mountId, opts, state); bind(mountId, opts, state, onChange);
      onChange && onChange(state);
    }));

    // Views
    root.querySelectorAll(".fb__view-btn").forEach(b => b.addEventListener("click", () => {
      state.view = b.dataset.view;
      render(mountId, opts, state); bind(mountId, opts, state, onChange);
      onChange && onChange(state);
    }));

    // Period
    const periodSel = root.querySelector('[data-fb="period"]');
    if (periodSel) periodSel.addEventListener("change", e => {
      state.period = e.target.value;
      if (state.period !== "custom") { state.from = null; state.to = null; }
      render(mountId, opts, state); bind(mountId, opts, state, onChange);
      onChange && onChange(state);
    });

    // Custom date inputs
    const fromInp = root.querySelector('[data-fb="from"]');
    const toInp = root.querySelector('[data-fb="to"]');
    if (fromInp) fromInp.addEventListener("change", e => { state.from = e.target.value; onChange && onChange(state); });
    if (toInp) toInp.addEventListener("change", e => { state.to = e.target.value; onChange && onChange(state); });

    // Filter selects
    root.querySelectorAll("[data-fb-filter]").forEach(s => s.addEventListener("change", e => {
      state.filters[s.dataset.fbFilter] = e.target.value;
      onChange && onChange(state);
    }));

    // Search
    const searchInp = root.querySelector('[data-fb="search"]');
    if (searchInp) {
      let to;
      searchInp.addEventListener("input", e => {
        state.search = e.target.value;
        clearTimeout(to);
        to = setTimeout(() => onChange && onChange(state), 180);
      });
    }

    // Download
    const dlBtn = root.querySelector('[data-fb-action="download"]');
    if (dlBtn) dlBtn.addEventListener("click", () => {
      const period = PERIODS.find(p => p.id === state.period)?.label || "selected period";
      // Toast — real implementation calls the API
      const t = document.getElementById("toast");
      if (t) {
        t.textContent = `Generating PDF report for ${period}…`;
        t.className = "toast toast--show toast--info";
        setTimeout(() => t.classList.remove("toast--show"), 3500);
      }
    });
  }

  /**
   * Auto-filter: if opts.targetContainer is provided, automatically show/hide
   * elements within it whenever the FilterBar state changes.
   *
   * Each filterable element should have:
   *   - data-tag="..."     space-separated tag list (e.g. "active overdue required aws")
   *   - data-search="..."  searchable text (lowercase)
   *
   * Filtering logic:
   *   - TAB id is used as filter tag. "all" = no tab filter.
   *   - SEARCH matches anywhere in data-search.
   *   - DROPDOWN FILTERS: each non-default value is slugified to a tag and the
   *     row must contain that tag. Default options (first option, conventionally
   *     "All X", "Any X") don't filter.
   *   - VIEW-SWITCH toggles classes view--list / view--tiles / view--kanban etc.
   */
  function slug(s) {
    return (s || "").toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function isDefaultFilterValue(v) {
    if (!v) return true;
    const lower = v.toLowerCase();
    return lower.startsWith("all ") || lower.startsWith("any ") ||
           lower === "all" || lower === "any" || lower === "all status" ||
           lower === "all sources" || lower === "all categories" ||
           lower === "all departments" || lower === "all depts" ||
           lower === "all roles" || lower === "all stages" || lower === "all health";
  }

  function applyAutoFilter(opts, state) {
    if (!opts.targetContainer) return;
    const container = document.getElementById(opts.targetContainer);
    if (!container) return;

    // Apply view class on the container
    if (state.view) {
      container.classList.forEach(c => {
        if (c.startsWith("view--")) container.classList.remove(c);
      });
      container.classList.add(`view--${state.view}`);
    }

    const tagFilter = state.tab && state.tab !== "all" ? state.tab.toLowerCase() : null;
    const search = (state.search || "").trim().toLowerCase();

    // Build list of dropdown-filter slugs that need to match
    const dropdownTags = [];
    Object.values(state.filters || {}).forEach(val => {
      if (!isDefaultFilterValue(val)) {
        dropdownTags.push(slug(val));
      }
    });

    let shown = 0, total = 0;

    container.querySelectorAll("[data-tag], [data-search]").forEach(el => {
      total++;
      const tags = (el.getAttribute("data-tag") || "").toLowerCase().split(/\s+/).filter(Boolean);
      const searchText = (el.getAttribute("data-search") || "").toLowerCase();
      const tagMatch = !tagFilter || tags.includes(tagFilter);
      const searchMatch = !search || searchText.includes(search);
      // Every active dropdown filter must match
      const dropdownMatch = dropdownTags.every(t => tags.includes(t));
      const visible = tagMatch && searchMatch && dropdownMatch;
      el.style.display = visible ? "" : "none";
      // Clear pager-hidden flag — whoever set display now owns the row's state.
      // (Pagination's next pass will re-hide outside-page items.)
      el.removeAttribute("data-pager-hidden");
      if (visible) shown++;
    });

    // Toggle "empty state" message if nothing matches
    const emptyEl = container.querySelector(".fb-empty");
    if (emptyEl) emptyEl.style.display = (total > 0 && shown === 0) ? "" : "none";

    // Update tab counts (if pages provided dynamic counters)
    container.dispatchEvent(new CustomEvent("filterbar:applied", { detail: { shown, total, state } }));
  }

  function mount(mountId, opts) {
    const state = defaultState(opts);

    // Wrap onChange so we always run auto-filter AND the user's onChange
    const wrappedOnChange = (st) => {
      applyAutoFilter(opts, st);
      if (opts.onChange) opts.onChange(st);
    };

    render(mountId, opts, state);
    bind(mountId, opts, state, wrappedOnChange);

    // Run once on mount to apply the initial filter
    applyAutoFilter(opts, state);

    return state;
  }

  global.FilterBar = { mount };
})(window);
