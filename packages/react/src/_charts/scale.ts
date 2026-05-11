/* Shared chart utilities — internal, not exported from package barrel.
 * Pure functions: scales, paths, ticks. No rendering. */

export interface NumberDomain {
  min: number;
  max: number;
}

export interface Range {
  start: number;
  end: number;
}

export function domainOf(values: number[]): NumberDomain {
  if (!values.length) return { min: 0, max: 1 };
  let min = values[0];
  let max = values[0];
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === max) {
    const pad = Math.abs(min) || 1;
    return { min: min - pad, max: max + pad };
  }
  return { min, max };
}

export function linearScale(domain: NumberDomain, range: Range): (v: number) => number {
  const d = domain.max - domain.min || 1;
  const r = range.end - range.start;
  return (v: number) => range.start + ((v - domain.min) / d) * r;
}

export function linePath(
  points: { x: number; y: number }[],
  smooth = false,
): string {
  if (!points.length) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  if (!smooth || points.length < 2) {
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  }
  /* Catmull-Rom-style cubic Bezier smoothing (no overshoot).
   * For each segment p_i → p_{i+1}, use control points derived from
   * neighbors p_{i-1} and p_{i+2}. Tension 0.2 = gentle curve. */
  const T = 0.2;
  const n = points.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < n ? points[i + 2] : p2;
    const cp1x = p1.x + (p2.x - p0.x) * T;
    const cp1y = p1.y + (p2.y - p0.y) * T;
    const cp2x = p2.x - (p3.x - p1.x) * T;
    const cp2y = p2.y - (p3.y - p1.y) * T;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

export function areaPath(
  points: { x: number; y: number }[],
  baselineY: number,
): string {
  if (!points.length) return '';
  let d = `M ${points[0].x} ${baselineY}`;
  for (const p of points) d += ` L ${p.x} ${p.y}`;
  d += ` L ${points[points.length - 1].x} ${baselineY} Z`;
  return d;
}

/** Generate evenly spaced ticks. */
export function ticks(domain: NumberDomain, count = 5): number[] {
  if (count <= 1) return [domain.min, domain.max];
  const step = (domain.max - domain.min) / (count - 1);
  return Array.from({ length: count }, (_, i) => domain.min + i * step);
}

/** Polar coords helper (degrees). */
export function polar(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Donut / pie arc path between two angles (degrees). */
export function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number,
): string {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const a = polar(cx, cy, rOuter, startDeg);
  const b = polar(cx, cy, rOuter, endDeg);
  const c = polar(cx, cy, rInner, endDeg);
  const d = polar(cx, cy, rInner, startDeg);
  return [
    `M ${a.x} ${a.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${b.x} ${b.y}`,
    `L ${c.x} ${c.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${d.x} ${d.y}`,
    'Z',
  ].join(' ');
}
