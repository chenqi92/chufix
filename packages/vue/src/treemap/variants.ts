export interface TreemapNode {
  name: string;
  value: number;
  colorIndex?: number;
}

export interface TreemapProps {
  nodes: TreemapNode[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  ariaLabel?: string;
}

export interface TreemapInteractionPayload {
  node: TreemapNode;
  dataIndex: number;
  nativeEvent?: PointerEvent;
}

interface RectNode extends TreemapNode {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Simple slice-and-dice treemap layout (single level, no recursion). */
export function layoutTreemap(
  nodes: TreemapNode[],
  width: number,
  height: number,
): RectNode[] {
  const total = nodes.reduce((s, n) => s + n.value, 0) || 1;
  const out: RectNode[] = [];
  let x = 0;
  let y = 0;
  let remainingW = width;
  let remainingH = height;
  let horizontal = width >= height;
  let remaining = total;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const ratio = n.value / remaining;
    if (horizontal) {
      const w = remainingW * ratio;
      out.push({ ...n, x, y, w, h: remainingH });
      x += w;
      remainingW -= w;
    } else {
      const h = remainingH * ratio;
      out.push({ ...n, x, y, w: remainingW, h });
      y += h;
      remainingH -= h;
    }
    remaining -= n.value;
    horizontal = !horizontal;
  }
  return out;
}
