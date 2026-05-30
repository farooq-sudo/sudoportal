// ============================================================================
//  shared/charts.js — minimal SVG chart helper for SUDO portal prototype
// ============================================================================
//  Zero external dependencies. Each function takes a target element id (or
//  the element itself) plus a small data spec, and renders an inline SVG.
//
//  Chart types supported:
//    SUDO_CHARTS.donut(target, segments, opts)     — status distribution
//    SUDO_CHARTS.hbar(target, rows, opts)          — horizontal bars (team comparison)
//    SUDO_CHARTS.vbar(target, rows, opts)          — vertical bars
//    SUDO_CHARTS.gauge(target, value, opts)        — composite score (0-100)
//    SUDO_CHARTS.funnel(target, stages, opts)      — KPI lifecycle counts
//
//  All charts are responsive (viewBox-based) and theme-aware (read CSS vars).
// ============================================================================

(function (global) {
  function el(target) {
    return typeof target === "string" ? document.getElementById(target) : target;
  }

  // Colour palette — matches the portal's status conventions
  const COLORS = {
    green:  "#16a34a",
    amber:  "#f59e0b",
    red:    "#ef4444",
    grey:   "#9ca3af",
    info:   "#2563eb",
    purple: "#7c3aed",
    pink:   "#db2777",
    cyan:   "#0891b2",
    orange: "#ea580c",
    slate:  "#475569",
  };

  // --------------------------------------------------------------------------
  // DONUT — segments: [{label, value, color}]
  // opts.onClick(segment, idx) — optional, called when a segment OR a legend
  //   row is clicked. Both arcs and legend rows are clickable.
  // --------------------------------------------------------------------------
  function donut(target, segments, opts = {}) {
    const node = el(target);
    if (!node) return;
    const size = opts.size || 180;
    const thickness = opts.thickness || 28;
    const r = (size - thickness) / 2;
    const cx = size / 2, cy = size / 2;
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    const clickable = typeof opts.onClick === "function";

    let angle = -Math.PI / 2; // start at 12 o'clock
    const arcs = segments.map((seg, i) => {
      const frac = seg.value / total;
      const sweep = frac * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      angle += sweep;
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      const large = sweep > Math.PI ? 1 : 0;
      const color = seg.color || COLORS[seg.tone] || COLORS.info;
      const cursorAttr = clickable && seg.value > 0 ? ` style="cursor:pointer" data-chart-idx="${i}"` : "";
      // For 100% single segment, draw a full circle as two arcs to avoid degenerate path
      if (frac >= 0.9999) {
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${thickness}"${cursorAttr}/>`;
      }
      if (frac < 0.0001) return "";
      return `<path d="M${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}" fill="none" stroke="${color}" stroke-width="${thickness}" stroke-linecap="butt"${cursorAttr}/>`;
    }).join("");

    const centerTop = opts.centerTop || total.toString();
    const centerBottom = opts.centerBottom || "total";

    const legendHtml = opts.legend !== false ? `
      <div class="chart-legend" style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--ink-700);min-width:140px">
        ${segments.map((s, i) => {
          const isClickable = clickable && s.value > 0;
          return `
          <div ${isClickable ? `style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:3px 6px;border-radius:4px;transition:background .15s" onmouseover="this.style.background='var(--ink-100)'" onmouseout="this.style.background=''" data-chart-idx="${i}"` : `style="display:flex;align-items:center;gap:8px"`}>
            <span style="width:10px;height:10px;border-radius:2px;background:${s.color || COLORS[s.tone] || COLORS.info};flex-shrink:0"></span>
            <span style="flex:1">${s.label}</span>
            <strong style="color:var(--ink-900)">${s.value}</strong>
          </div>`;
        }).join("")}
      </div>` : "";

    node.innerHTML = `
      <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="flex-shrink:0">
          ${arcs}
          <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="700" fill="var(--ink-900)" font-family="inherit">${centerTop}</text>
          <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="var(--ink-500)" font-family="inherit">${centerBottom}</text>
        </svg>
        ${legendHtml}
      </div>`;

    // Wire click handlers if onClick was provided
    if (clickable) {
      node.querySelectorAll("[data-chart-idx]").forEach(el => {
        el.addEventListener("click", () => {
          const i = parseInt(el.dataset.chartIdx, 10);
          opts.onClick(segments[i], i);
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // HORIZONTAL BAR — rows: [{label, value, color, sub}]
  // opts.onClick(row, idx) — clicks anywhere on a row trigger it
  // --------------------------------------------------------------------------
  function hbar(target, rows, opts = {}) {
    const node = el(target);
    if (!node) return;
    const max = opts.max != null ? opts.max : Math.max(1, ...rows.map(r => r.value));
    const unit = opts.unit || "";
    const showValueOnRight = opts.showValueOnRight !== false;
    const valueFmt = opts.valueFmt || (v => v + unit);
    const clickable = typeof opts.onClick === "function";

    node.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;width:100%">
        ${rows.map((r, i) => {
          const pct = Math.min(100, (r.value / max) * 100);
          const color = r.color || COLORS[r.tone] || COLORS.info;
          const rowAttrs = clickable
            ? `style="display:flex;align-items:center;gap:10px;font-size:12.5px;cursor:pointer;padding:2px 4px;border-radius:4px;transition:background .15s" onmouseover="this.style.background='var(--ink-100)'" onmouseout="this.style.background=''" data-chart-idx="${i}"`
            : `style="display:flex;align-items:center;gap:10px;font-size:12.5px"`;
          return `
            <div ${rowAttrs}>
              <div style="width:120px;flex-shrink:0;font-weight:600;color:var(--ink-900);text-align:right">${r.label}</div>
              <div style="flex:1;height:22px;background:var(--ink-100);border-radius:4px;position:relative;overflow:hidden">
                <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;transition:width .3s ease"></div>
                ${r.sub ? `<div style="position:absolute;left:8px;top:0;line-height:22px;font-size:10.5px;color:#fff;font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,0.2)">${r.sub}</div>` : ""}
              </div>
              ${showValueOnRight ? `<div style="width:50px;flex-shrink:0;text-align:left;font-weight:700;color:var(--ink-900)">${valueFmt(r.value)}</div>` : ""}
            </div>`;
        }).join("")}
      </div>`;

    if (clickable) {
      node.querySelectorAll("[data-chart-idx]").forEach(el => {
        el.addEventListener("click", () => {
          const i = parseInt(el.dataset.chartIdx, 10);
          opts.onClick(rows[i], i);
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // VERTICAL BAR — rows: [{label, value, color}]
  // opts.onClick(row, idx) — clicks on bars trigger it
  // --------------------------------------------------------------------------
  function vbar(target, rows, opts = {}) {
    const node = el(target);
    if (!node) return;
    const max = opts.max != null ? opts.max : Math.max(1, ...rows.map(r => r.value));
    const height = opts.height || 180;
    const barWidth = opts.barWidth || 36;
    const gap = opts.gap || 14;
    const width = rows.length * (barWidth + gap) + gap;
    const unit = opts.unit || "";
    const clickable = typeof opts.onClick === "function";

    node.innerHTML = `
      <div style="overflow-x:auto;padding:8px 0">
        <svg viewBox="0 0 ${width} ${height + 50}" style="width:100%;max-width:${width}px;height:auto;font-family:inherit" preserveAspectRatio="xMinYMid meet">
          ${rows.map((r, i) => {
            const x = gap + i * (barWidth + gap);
            const h = (r.value / max) * height;
            const y = height - h + 6;
            const color = r.color || COLORS[r.tone] || COLORS.info;
            const cursorAttr = clickable && r.value > 0 ? ` style="cursor:pointer" data-chart-idx="${i}"` : "";
            return `
              <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${color}" rx="3" ry="3"${cursorAttr}/>
              <text x="${x + barWidth/2}" y="${y - 6}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--ink-900)">${r.value}${unit}</text>
              <text x="${x + barWidth/2}" y="${height + 22}" text-anchor="middle" font-size="10" fill="var(--ink-700)">${r.label}</text>
            `;
          }).join("")}
          <line x1="0" y1="${height + 6}" x2="${width}" y2="${height + 6}" stroke="var(--ink-200)" stroke-width="1"/>
        </svg>
      </div>`;

    if (clickable) {
      node.querySelectorAll("[data-chart-idx]").forEach(el => {
        el.addEventListener("click", () => {
          const i = parseInt(el.dataset.chartIdx, 10);
          opts.onClick(rows[i], i);
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // GAUGE — value 0-100, semicircle
  // opts.onClick(value) — entire gauge becomes clickable
  // --------------------------------------------------------------------------
  function gauge(target, value, opts = {}) {
    const node = el(target);
    if (!node) return;
    const size = opts.size || 200;
    const cx = size / 2, cy = size * 0.6;
    const r = size * 0.4;
    const thickness = opts.thickness || 18;
    const v = Math.max(0, Math.min(100, value || 0));
    const color = v >= 95 ? COLORS.green : v >= 80 ? COLORS.amber : v > 0 ? COLORS.red : COLORS.grey;
    const clickable = typeof opts.onClick === "function";

    // Semicircle from -180° to 0° (left to right), value sweeps from left
    const startAngle = Math.PI;
    const endAngle = Math.PI + (v / 100) * Math.PI;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle),   y2 = cy + r * Math.sin(endAngle);
    const xFull = cx + r * Math.cos(0), yFull = cy + r * Math.sin(0);
    const large = (v / 100) > 0.5 ? 1 : 0;

    const valuePath = v < 0.5 ? "" :
      `<path d="M${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}" fill="none" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round"/>`;

    node.innerHTML = `
      <svg viewBox="0 0 ${size} ${size * 0.75}" style="width:100%;max-width:${size}px;height:auto;font-family:inherit;${clickable ? 'cursor:pointer' : ''}">
        <path d="M${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 1 1 ${xFull.toFixed(2)} ${yFull.toFixed(2)}" fill="none" stroke="var(--ink-100)" stroke-width="${thickness}" stroke-linecap="round"/>
        ${valuePath}
        <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="${size * 0.16}" font-weight="800" fill="var(--ink-900)">${v.toFixed(0)}<tspan font-size="${size * 0.1}" fill="var(--ink-500)" font-weight="500">%</tspan></text>
        <text x="${cx}" y="${cy + size * 0.13}" text-anchor="middle" font-size="11" fill="var(--ink-500)">${opts.label || "Composite"}</text>
      </svg>`;

    if (clickable) {
      node.querySelector("svg").addEventListener("click", () => opts.onClick(v));
    }
  }

  // --------------------------------------------------------------------------
  // FUNNEL — stages: [{label, value, color}]
  // opts.onClick(stage, idx) — click on a stage to drill into that bucket
  // --------------------------------------------------------------------------
  function funnel(target, stages, opts = {}) {
    const node = el(target);
    if (!node) return;
    const max = Math.max(1, ...stages.map(s => s.value));
    const height = 36;
    const clickable = typeof opts.onClick === "function";

    node.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:6px;width:100%">
        ${stages.map((s, i) => {
          const pct = Math.max(8, (s.value / max) * 100);
          const color = s.color || COLORS[s.tone] || COLORS.info;
          const isClickable = clickable && s.value > 0;
          const rowAttrs = isClickable
            ? `style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:2px 4px;border-radius:4px;transition:background .15s" onmouseover="this.style.background='var(--ink-100)'" onmouseout="this.style.background=''" data-chart-idx="${i}"`
            : `style="display:flex;align-items:center;gap:10px"`;
          return `
            <div ${rowAttrs}>
              <div style="width:160px;flex-shrink:0;font-size:12px;font-weight:600;color:var(--ink-700);text-align:right">${s.label}</div>
              <div style="flex:1;height:${height}px;position:relative">
                <div style="width:${pct}%;height:100%;background:${color};border-radius:4px;display:flex;align-items:center;padding:0 10px;color:#fff;font-weight:700;font-size:13px">${s.value}</div>
              </div>
            </div>`;
        }).join("")}
      </div>`;

    if (clickable) {
      node.querySelectorAll("[data-chart-idx]").forEach(el => {
        el.addEventListener("click", () => {
          const i = parseInt(el.dataset.chartIdx, 10);
          opts.onClick(stages[i], i);
        });
      });
    }
  }

  global.SUDO_CHARTS = { donut, hbar, vbar, gauge, funnel, COLORS };
})(typeof window !== "undefined" ? window : globalThis);
