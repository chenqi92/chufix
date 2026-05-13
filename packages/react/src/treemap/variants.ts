export interface TreemapNode {
  name: string;
  value: number;
  colorIndex?: number;
}

export interface TreemapInteractionPayload {
  node: TreemapNode;
  dataIndex: number;
  nativeEvent?: unknown;
}

export interface TreemapProps {
  nodes: TreemapNode[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: TreemapInteractionPayload) => void;
  onItemLeave?: (payload: TreemapInteractionPayload) => void;
}

interface RectNode extends TreemapNode {
  x: number;
  y: number;
  w: number;
  h: number;
}

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
  for (const n of nodes) {
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
