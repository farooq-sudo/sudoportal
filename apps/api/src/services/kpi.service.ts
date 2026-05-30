// ────────────────────────────────────────────────────────────────────────────
//  src/services/kpi.service.ts
//  Pure functions for KPI math. Identical semantics to the prototype's
//  SUDO_DB_HELPERS so the API returns the same numbers the UI already shows.
//
//  This service avoids importing Prisma model types at compile time — they
//  only exist after `prisma generate` has run. We declare the minimal
//  shapes inline; callers pass Prisma rows directly and structural typing
//  matches them up at the call site.
// ────────────────────────────────────────────────────────────────────────────

export type StatusColor = "green" | "amber" | "red" | "grey";

export type KpiDirection = "HIGHER_IS_BETTER" | "LOWER_IS_BETTER" | "EXACT_MATCH" | "BOOLEAN_DONE";

/** Minimal shape of a KpiAssignment row this service needs. */
export interface AssignmentLike {
  currentValue: string | null;
  weight: number;
}

/** Minimal shape of a KpiTemplate row this service needs. */
export interface TemplateLike {
  target: string | null;
  direction: KpiDirection;
}

/**
 * Parse a target/current string into a numeric value. Strings like
 * "90%+", "8+ per cycle", "100%" all reduce to a single number.
 */
function parseValue(s: string | null | undefined): number {
  if (!s) return NaN;
  const match = String(s).match(/[-+]?\d*\.?\d+/);
  return match ? Number(match[0]) : NaN;
}

/**
 * Returns the canonical traffic-light status for an assignment given its
 * current value, target, and direction. Mirrors prototype semantics:
 *   - grey:  no current value yet (employee hasn't submitted, or auto-KPI no data)
 *   - green: meets/beats target
 *   - amber: within 80% of target (or within 120% if lower-is-better)
 *   - red:   below 80% of target (or above 120% if lower-is-better)
 */
export function kpiStatusColor(
  assignment: AssignmentLike,
  template: TemplateLike
): StatusColor {
  const cur = parseValue(assignment.currentValue);
  const tgt = parseValue(template.target);
  if (Number.isNaN(cur)) return "grey";
  if (Number.isNaN(tgt) || tgt === 0) return "grey";

  const ratio = cur / tgt;
  const dir: KpiDirection = template.direction || "HIGHER_IS_BETTER";

  if (dir === "BOOLEAN_DONE") {
    // Done/not-done KPI: any positive current value counts as done
    return cur >= 1 ? "green" : "red";
  }

  if (dir === "EXACT_MATCH") {
    const diff = Math.abs(ratio - 1);
    if (diff <= 0.05) return "green";
    if (diff <= 0.2) return "amber";
    return "red";
  }

  if (dir === "HIGHER_IS_BETTER") {
    if (ratio >= 1) return "green";
    if (ratio >= 0.8) return "amber";
    return "red";
  }

  // LOWER_IS_BETTER
  if (ratio <= 1) return "green";
  if (ratio <= 1.2) return "amber";
  return "red";
}

/**
 * Weighted composite score for an employee in a given cycle. Capped at 120
 * so a single over-achievement doesn't skew the picture.
 *
 * Returns null if the employee has no scoreable KPIs (all grey).
 */
export function compositeScore(
  assignments: Array<AssignmentLike & { template: TemplateLike }>
): number | null {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const a of assignments) {
    const cur = parseValue(a.currentValue);
    const tgt = parseValue(a.template.target);
    if (Number.isNaN(cur) || Number.isNaN(tgt) || tgt === 0) continue;
    const dir = a.template.direction || "HIGHER_IS_BETTER";
    let score: number;
    if (dir === "HIGHER_IS_BETTER") {
      score = Math.min(120, (cur / tgt) * 100);
    } else if (dir === "LOWER_IS_BETTER") {
      score = Math.min(120, (tgt / cur) * 100);
    } else {
      // EXACT_MATCH: 100 - (|cur-tgt|/tgt)*100
      score = Math.max(0, 100 - Math.abs(cur - tgt) / tgt * 100);
    }
    weightedSum += score * a.weight;
    totalWeight += a.weight;
  }
  if (totalWeight === 0) return null;
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}
