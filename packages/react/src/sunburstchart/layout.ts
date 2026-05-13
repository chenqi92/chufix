import type { SunburstNode, SunburstSegment } from './variants';

/** Sum value of node + descendants. */
export function sumValue(node: SunburstNode): number {
  if (!node.children?.length) return node.value ?? 0;
  return node.children.reduce((acc, c) => acc + sumValue(c), 0);
}

/** Max nesting depth of a tree (0 for leaf-only root). */
export function maxDepth(node: SunburstNode, current = 0): number {
  if (!node.children?.length) return current;
  return Math.max(...node.children.map((c) => maxDepth(c, current + 1)));
}

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Build an annular sector SVG path, sweeping clockwise from startAngle to endAngle (degrees). */
function annularPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;
  if (sweep <= 0) return '';
  // Full ring: render as two semicircles to avoid 360°-arc collapse.
  if (sweep >= 360) {
    const oTop = polarPoint(cx, cy, outerR, 0);
    const oBottom = polarPoint(cx, cy, outerR, 180);
    const iTop = polarPoint(cx, cy, innerR, 0);
    const iBottom = polarPoint(cx, cy, innerR, 180);
    return [
      `M ${oTop.x} ${oTop.y}`,
      `A ${outerR} ${outerR} 0 1 1 ${oBottom.x} ${oBottom.y}`,
      `A ${outerR} ${outerR} 0 1 1 ${oTop.x} ${oTop.y}`,
      `Z`,
      `M ${iTop.x} ${iTop.y}`,
      `A ${innerR} ${innerR} 0 1 0 ${iBottom.x} ${iBottom.y}`,
      `A ${innerR} ${innerR} 0 1 0 ${iTop.x} ${iTop.y}`,
      `Z`,
    ].join(' ');
  }
  const large = sweep > 180 ? 1 : 0;
  const o1 = polarPoint(cx, cy, outerR, startAngle);
  const o2 = polarPoint(cx, cy, outerR, endAngle);
  const i2 = polarPoint(cx, cy, innerR, endAngle);
  const i1 = polarPoint(cx, cy, innerR, startAngle);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i1.x} ${i1.y}`,
    `Z`,
  ].join(' ');
}

export interface BuildLayoutOptions {
  size: number;
  innerRadiusRatio: number;
}

/** Walk the tree producing flat segment list keyed by depth + angular slice. */
export function buildLayout(
  root: SunburstNode,
  opts: BuildLayoutOptions,
): { segments: SunburstSegment[]; cx: number; cy: number; ringWidth: number } {
  const cx = opts.size / 2;
  const cy = opts.size / 2;
  const outerMax = opts.size / 2 - 2;
  const innerCore = outerMax * opts.innerRadiusRatio;
  const depth = maxDepth(root);
  const ringWidth = depth > 0 ? (outerMax - innerCore) / depth : 0;
  const total = sumValue(root) || 1;
  const segments: SunburstSegment[] = [];

  function visit(node: SunburstNode, d: number, start: number, end: number, parentColorIndex?: number) {
    if (d === 0) {
      // Skip rendering the root itself; only its children form ring 1.
      const slice = end - start;
      const childTotal = node.children?.reduce((acc, c) => acc + (sumValue(c) || 0), 0) || 0;
      if (!node.children?.length || childTotal === 0) return;
      let cursor = start;
      node.children.forEach((child, idx) => {
        const childSum = sumValue(child) || 0;
        const sweep = childTotal === 0 ? 0 : (childSum / childTotal) * slice;
        const childColor = child.colorIndex ?? idx % 8;
        visit(child, 1, cursor, cursor + sweep, childColor);
        cursor += sweep;
      });
      return;
    }
    const innerR = innerCore + (d - 1) * ringWidth;
    const outerR = innerCore + d * ringWidth;
    const colorIndex = node.colorIndex ?? parentColorIndex ?? 0;
    const midAngle = (start + end) / 2;
    const midRadius = (innerR + outerR) / 2;
    segments.push({
      node,
      depth: d,
      startAngle: start,
      endAngle: end,
      innerR,
      outerR,
      colorIndex,
      midAngle,
      midRadius,
      path: annularPath(cx, cy, innerR, outerR, start, end),
      ariaPath: `${node.name}`,
    });
    if (node.children?.length) {
      const childTotal = node.children.reduce((acc, c) => acc + (sumValue(c) || 0), 0);
      if (childTotal === 0) return;
      let cursor = start;
      const slice = end - start;
      node.children.forEach((child) => {
        const childSum = sumValue(child) || 0;
        const sweep = (childSum / childTotal) * slice;
        visit(child, d + 1, cursor, cursor + sweep, colorIndex);
        cursor += sweep;
      });
    }
  }

  visit(root, 0, 0, 360);
  return { segments, cx, cy, ringWidth };
}

/** Find the path from root to a given node (by reference). */
export function pathTo(root: SunburstNode, target: SunburstNode): string[] {
  if (root === target) return [root.name];
  if (!root.children) return [];
  for (const c of root.children) {
    const sub = pathTo(c, target);
    if (sub.length) return [root.name, ...sub];
  }
  return [];
}
