/**
 * SUDO Portal — Shared Pagination component
 *
 * USAGE:
 *   <div id="my-pager"></div>
 *
 *   const pager = Pagination.mount('my-pager', {
 *     targetContainer: 'my-results',
 *     itemSelector: 'tbody tr[data-tag]',  // optional, defaults to '[data-tag]'
 *     pageSize: 10,
 *     onChange: (state) => { ... }  // optional
 *   });
 *
 * - Hides items outside the current page automatically.
 * - Respects FilterBar's filtering: only counts/paginates currently visible items.
 * - Listens for 'filterbar:applied' event on the container to re-paginate after filter changes.
 */
(function (global) {

  function render(mountId, opts, state) {
    const totalPages = Math.max(1, Math.ceil(state.totalItems / state.pageSize));
    const cur = state.page;
    const start = (cur - 1) * state.pageSize + 1;
    const end = Math.min(cur * state.pageSize, state.totalItems);

    // Pager buttons: show first, last, current ±1, with ellipses if needed
    function pageBtn(p, label, active, disabled) {
      const cls = [
        "pager__btn",
        active ? "pager__btn--active" : "",
        disabled ? "pager__btn--disabled" : "",
      ].filter(Boolean).join(" ");
      return `<button class="${cls}" data-page="${p}" ${disabled ? "disabled" : ""}>${label}</button>`;
    }

    let pageBtns = [];
    pageBtns.push(pageBtn(cur - 1, "‹", false, cur === 1));
    const pagesToShow = new Set([1, totalPages, cur, cur - 1, cur + 1]);
    let last = 0;
    [...pagesToShow].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b).forEach(p => {
      if (p - last > 1) pageBtns.push('<span class="pager__ellipsis">…</span>');
      pageBtns.push(pageBtn(p, p, p === cur, false));
      last = p;
    });
    pageBtns.push(pageBtn(cur + 1, "›", false, cur === totalPages));

    const root = document.getElementById(mountId);
    root.innerHTML = `
      <div class="pager-row">
        <div class="pager-row__info">
          ${state.totalItems === 0
            ? "No results"
            : `Showing <strong>${start}</strong>–<strong>${end}</strong> of <strong>${state.totalItems}</strong>`}
        </div>
        <div class="pager">
          ${pageBtns.join("")}
        </div>
      </div>
    `;

    // Wire page buttons
    root.querySelectorAll(".pager__btn:not(.pager__btn--disabled)").forEach(btn => {
      btn.addEventListener("click", () => {
        const p = parseInt(btn.dataset.page, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages && p !== state.page) {
          state.page = p;
          apply(opts, state);
          render(mountId, opts, state);
          if (opts.onChange) opts.onChange(state);
        }
      });
    });
  }

  // Re-compute which items are currently FilterBar-visible (display !== 'none'), then
  // hide all except the current page's slice.
  function apply(opts, state) {
    const container = document.getElementById(opts.targetContainer);
    if (!container) return;
    const selector = opts.itemSelector || "[data-tag]";
    const items = Array.from(container.querySelectorAll(selector));

    // Step 1: clear any prior paginator hides so we see the true FilterBar state
    items.forEach(el => {
      if (el.getAttribute("data-pager-hidden") === "1") {
        el.style.display = "";
        el.removeAttribute("data-pager-hidden");
      }
    });

    // Step 2: now read which items are currently visible (FilterBar may have hidden some)
    const filterVisible = items.filter(el => el.style.display !== "none");

    state.totalItems = filterVisible.length;
    const totalPages = Math.max(1, Math.ceil(state.totalItems / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;

    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;

    // Step 3: hide filter-visible items outside the current page
    filterVisible.forEach((el, i) => {
      if (i < start || i >= end) {
        el.style.display = "none";
        el.setAttribute("data-pager-hidden", "1");
      }
    });
  }

  function mount(mountId, opts) {
    const state = {
      page: 1,
      pageSize: opts.pageSize || 10,
      totalItems: 0,
    };

    // Listen for filterbar changes to re-paginate
    const container = document.getElementById(opts.targetContainer);
    if (container) {
      container.addEventListener("filterbar:applied", () => {
        state.page = 1;  // reset to first page on filter change
        apply(opts, state);
        render(mountId, opts, state);
      });
    }

    apply(opts, state);
    render(mountId, opts, state);

    return state;
  }

  global.Pagination = { mount };
})(window);
