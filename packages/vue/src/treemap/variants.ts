export interface TreemapNode {
  name: string;
  /** Value used for area allocation. Ignored when `children` are present
   *  (parent's value is implicitly the sum of its children). */
  value?: number;
  colorIndex?: number;
  /** Optional child nodes — turns this node into a nested group. */
  children?: TreemapNode[];
}

export type TreemapLayout = 'squarify' | 'slice-and-dice';

export interface TreemapProps {
  nodes: TreemapNode[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  ariaLabel?: string;
  /** Padding around children inside a parent (px). Pass a function `(depth) => px`
   *  to taper padding by nesting depth. Default 4. */
  childPadding?: number | ((depth: number) => number);
  /** Header height reserved at the top of each parent. Pass a function for
   *  per-depth control. Default 16. */
  headerHeight?: number | ((depth: number) => number);
  /** Allow click-to-drill (focus subtree as new root). Default true. */
  drillable?: boolean;
  /** Show the drill breadcrumb above the chart. Default true. */
  showBreadcrumb?: boolean;
  /** Layout algorithm. Default 'squarify' for cleaner aspect ratios. */
  layout?: TreemapLayout;
  /** Controlled focus path (names from top siblings → current focus). Each
   *  entry drills one level deeper. Empty array (or undefined) shows the
   *  top-level. Pair with `@update:focusPath`. */
  focusPath?: string[];
}

export interface TreemapInteractionPayload {
  node: TreemapNode;
  /** Index inside its parent's children list. */
  dataIndex: number;
  /** Depth from the current focused root (0 = top-level inside focus). */
  depth: number;
  /** Path of names from the original root to this node. */
  pathNames: string[];
  nativeEvent?: PointerEvent;
}

export interface TreemapDrillPayload {
  node: TreemapNode | null;
  pathNames: string[];
}

export interface TreemapRect {
  node: TreemapNode;
  /** Index inside its immediate parent's children list. */
  dataIndex: number;
  /** Depth from the layout root (0 for the visible parent itself). */
  depth: number;
  /** Path from the original (un-drilled) root to this rect, by name. */
  path: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  colorIndex: number;
  hasChildren: boolean;
}

/** Sum the area-allocation value for a node and its subtree. */
export function treemapValue(node: TreemapNode): number {
  if (node.children?.length) {
    return node.children.reduce((s, c) => s + treemapValue(c), 0);
  }
  return node.value ?? 0;
}

type DepthFn = (depth: number) => number;

function resolveDepthFn(v: number | DepthFn | undefined, fallback: number): DepthFn {
  if (typeof v === 'function') return v;
  if (typeof v === 'number') return () => v;
  return () => fallback;
}

/** Single-layer slice-and-dice within the given rectangle. */
function sliceAndDice(
  nodes: TreemapNode[],
  basePath: string[],
  baseDepth: number,
  x: number,
  y: number,
  width: number,
  height: number,
  padFn: DepthFn,
  headerFn: DepthFn,
  fallbackColor: (i: number) => number,
  out: TreemapRect[],
) {
  const childPadding = padFn(baseDepth);
  const headerHeight = headerFn(baseDepth);
  const total = nodes.reduce((s, n) => s + treemapValue(n), 0) || 1;
  let cursorX = x;
  let cursorY = y;
  let remainingW = width;
  let remainingH = height;
  let horizontal = width >= height;
  let remaining = total;

  nodes.forEach((n, i) => {
    const v = treemapValue(n) || 0;
    const ratio = remaining > 0 ? v / remaining : 0;
    let rectX: number;
    let rectY: number;
    let rectW: number;
    let rectH: number;
    if (horizontal) {
      rectW = remainingW * ratio;
      rectH = remainingH;
      rectX = cursorX;
      rectY = cursorY;
      cursorX += rectW;
      remainingW -= rectW;
    } else {
      rectW = remainingW;
      rectH = remainingH * ratio;
      rectX = cursorX;
      rectY = cursorY;
      cursorY += rectH;
      remainingH -= rectH;
    }
    const path = [...basePath, n.name];
    const colorIndex = n.colorIndex ?? fallbackColor(i);

    out.push({
      node: n,
      dataIndex: i,
      depth: baseDepth,
      path,
      x: rectX,
      y: rectY,
      w: rectW,
      h: rectH,
      colorIndex,
      hasChildren: !!n.children?.length,
    });

    if (n.children?.length && rectW > childPadding * 2 + 4 && rectH > headerHeight + childPadding * 2 + 4) {
      const innerX = rectX + childPadding;
      const innerY = rectY + headerHeight;
      const innerW = rectW - childPadding * 2;
      const innerH = rectH - headerHeight - childPadding;
      sliceAndDice(
        n.children,
        path,
        baseDepth + 1,
        innerX,
        innerY,
        innerW,
        innerH,
        padFn,
        headerFn,
        (idx) => n.children![idx].colorIndex ?? colorIndex,
        out,
      );
    }

    remaining -= v;
    horizontal = !horizontal;
  });
}

/* ─────────── Squarified treemap (Bruls et al., 2000) ───────────
 * At each step we greedily build a "row" of siblings inside the
 * shortest side of the remaining rectangle. We add the next child to
 * the row as long as the worst aspect ratio in the row keeps improving
 * (or stays the same); otherwise we commit the current row and start a
 * fresh row in the leftover rectangle. */

interface ScaledItem<T> {
  idx: number;
  node: T;
  area: number;
}

function worstRatio(areas: number[], side: number): number {
  if (!areas.length || side <= 0) return Infinity;
  let sum = 0;
  let rMin = Infinity;
  let rMax = 0;
  for (const a of areas) {
    sum += a;
    if (a < rMin) rMin = a;
    if (a > rMax) rMax = a;
  }
  if (sum <= 0) return Infinity;
  const s2 = sum * sum;
  const w2 = side * side;
  return Math.max((w2 * rMax) / s2, s2 / (w2 * Math.max(rMin, 1e-9)));
}

interface PlacedAtoms {
  idx: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

function layoutRowSquarify<T>(
  row: ScaledItem<T>[],
  rectX: number,
  rectY: number,
  rectW: number,
  rectH: number,
  out: PlacedAtoms[],
): { x: number; y: number; w: number; h: number } {
  const rowSum = row.reduce((s, r) => s + r.area, 0);
  /* Horizontal=true means width >= height: the row consumes the LEFT slab. */
  const horizontal = rectW >= rectH;
  const side = horizontal ? rectH : rectW;
  const slab = side > 0 ? rowSum / side : 0;
  if (horizontal) {
    let cy = rectY;
    for (const item of row) {
      const itemH = slab > 0 ? item.area / slab : 0;
      out.push({ idx: item.idx, x: rectX, y: cy, w: slab, h: itemH });
      cy += itemH;
    }
    return { x: rectX + slab, y: rectY, w: rectW - slab, h: rectH };
  }
  let cx = rectX;
  for (const item of row) {
    const itemW = slab > 0 ? item.area / slab : 0;
    out.push({ idx: item.idx, x: cx, y: rectY, w: itemW, h: slab });
    cx += itemW;
  }
  return { x: rectX, y: rectY + slab, w: rectW, h: rectH - slab };
}

function squarify<T>(
  items: ScaledItem<T>[],
  rect: { x: number; y: number; w: number; h: number },
  out: PlacedAtoms[],
): void {
  let remaining = items;
  let row: ScaledItem<T>[] = [];
  let { x, y, w, h } = rect;

  while (remaining.length) {
    const c = remaining[0];
    const side = Math.min(w, h);
    if (side <= 0) {
      /* Degenerate rect — place whatever's left in a thin strip and bail. */
      const r = layoutRowSquarify([...row, ...remaining], x, y, w, h, out);
      x = r.x; y = r.y; w = r.w; h = r.h;
      return;
    }
    const rowAreas = row.map((r) => r.area);
    const candAreas = [...rowAreas, c.area];
    if (row.length === 0 || worstRatio(candAreas, side) <= worstRatio(rowAreas, side)) {
      row.push(c);
      remaining = remaining.slice(1);
    } else {
      const r = layoutRowSquarify(row, x, y, w, h, out);
      x = r.x; y = r.y; w = r.w; h = r.h;
      row = [];
    }
  }
  if (row.length) layoutRowSquarify(row, x, y, w, h, out);
}

function squarifyLayer(
  nodes: TreemapNode[],
  basePath: string[],
  baseDepth: number,
  x: number,
  y: number,
  width: number,
  height: number,
  padFn: DepthFn,
  headerFn: DepthFn,
  fallbackColor: (i: number) => number,
  out: TreemapRect[],
) {
  if (width <= 0 || height <= 0 || !nodes.length) return;
  const childPadding = padFn(baseDepth);
  const headerHeight = headerFn(baseDepth);
  const totalValue = nodes.reduce((s, n) => s + treemapValue(n), 0);
  if (totalValue <= 0) return;
  const totalArea = width * height;
  const scale = totalArea / totalValue;

  /* Squarify is sensitive to ordering — descending values produce the most
   * even aspect ratios. Carry the original child index along so callbacks /
   * colors stay stable. */
  const items: ScaledItem<TreemapNode>[] = nodes
    .map((n, idx) => ({ idx, node: n, area: treemapValue(n) * scale }))
    .sort((a, b) => b.area - a.area);

  const atoms: PlacedAtoms[] = [];
  squarify(items, { x, y, w: width, h: height }, atoms);

  for (const atom of atoms) {
    const n = nodes[atom.idx];
    const path = [...basePath, n.name];
    const colorIndex = n.colorIndex ?? fallbackColor(atom.idx);
    out.push({
      node: n,
      dataIndex: atom.idx,
      depth: baseDepth,
      path,
      x: atom.x,
      y: atom.y,
      w: atom.w,
      h: atom.h,
      colorIndex,
      hasChildren: !!n.children?.length,
    });
    if (n.children?.length && atom.w > childPadding * 2 + 4 && atom.h > headerHeight + childPadding * 2 + 4) {
      squarifyLayer(
        n.children,
        path,
        baseDepth + 1,
        atom.x + childPadding,
        atom.y + headerHeight,
        atom.w - childPadding * 2,
        atom.h - headerHeight - childPadding,
        padFn,
        headerFn,
        (idx) => n.children![idx].colorIndex ?? colorIndex,
        out,
      );
    }
  }
}

export interface LayoutTreemapOptions {
  childPadding?: number | DepthFn;
  headerHeight?: number | DepthFn;
  layout?: TreemapLayout;
}

export function layoutTreemap(
  nodes: TreemapNode[],
  width: number,
  height: number,
  options: LayoutTreemapOptions = {},
): TreemapRect[] {
  const out: TreemapRect[] = [];
  const padFn = resolveDepthFn(options.childPadding, 4);
  const headerFn = resolveDepthFn(options.headerHeight, 16);
  const algorithm = options.layout ?? 'squarify';
  const layout = algorithm === 'squarify' ? squarifyLayer : sliceAndDice;
  layout(
    nodes,
    [],
    0,
    0,
    0,
    width,
    height,
    padFn,
    headerFn,
    (i) => i % 8,
    out,
  );
  return out;
}
