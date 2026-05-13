export interface TreemapNode {
  name: string;
  /** Value used for area allocation. Ignored when `children` are present
   *  (parent's value is implicitly the sum of its children). */
  value?: number;
  colorIndex?: number;
  /** Optional child nodes — turns this node into a nested group. */
  children?: TreemapNode[];
}

export interface TreemapProps {
  nodes: TreemapNode[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  ariaLabel?: string;
  /** Padding around children inside a parent (px). Default 4. */
  childPadding?: number;
  /** Height (px) reserved at the top of each parent for its label. Default 16. */
  headerHeight?: number;
  /** Allow click-to-drill (focus subtree as new root). Default true. */
  drillable?: boolean;
  /** Show the drill breadcrumb above the chart. Default true. */
  showBreadcrumb?: boolean;
  className?: string;
  onItemEnter?: (payload: TreemapInteractionPayload) => void;
  onItemLeave?: (payload: TreemapInteractionPayload) => void;
  onDrill?: (payload: TreemapDrillPayload) => void;
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

/** Single-layer slice-and-dice within the given rectangle. */
function sliceAndDice(
  nodes: TreemapNode[],
  basePath: string[],
  baseDepth: number,
  x: number,
  y: number,
  width: number,
  height: number,
  childPadding: number,
  headerHeight: number,
  fallbackColor: (i: number) => number,
  out: TreemapRect[],
) {
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
        childPadding,
        headerHeight,
        (idx) => n.children![idx].colorIndex ?? colorIndex,
        out,
      );
    }

    remaining -= v;
    horizontal = !horizontal;
  });
}

export interface LayoutTreemapOptions {
  childPadding?: number;
  headerHeight?: number;
}

export function layoutTreemap(
  nodes: TreemapNode[],
  width: number,
  height: number,
  options: LayoutTreemapOptions = {},
): TreemapRect[] {
  const out: TreemapRect[] = [];
  sliceAndDice(
    nodes,
    [],
    0,
    0,
    0,
    width,
    height,
    options.childPadding ?? 4,
    options.headerHeight ?? 16,
    (i) => i % 8,
    out,
  );
  return out;
}
