export interface SunburstNode {
  name: string;
  value?: number;
  colorIndex?: number;
  children?: SunburstNode[];
}

export interface SunburstChartProps {
  root: SunburstNode;
  size?: number;
  /** Inner blank radius as a ratio of `size/2`. Default 0.2 (donut with hole). */
  innerRadiusRatio?: number;
  /** Show labels on segments large enough to fit them. */
  showLabels?: boolean;
  /** Hide labels on segments whose sweep < this many degrees. Default 12. */
  labelMinAngle?: number;
  ariaLabel?: string;
  /** Enable click-to-drill (focus subtree as new root). Default true. */
  drillable?: boolean;
  /** Show the breadcrumb path above the chart. Default true (only matters when drillable). */
  showBreadcrumb?: boolean;
}

export interface SunburstSegment {
  node: SunburstNode;
  depth: number;
  startAngle: number;
  endAngle: number;
  innerR: number;
  outerR: number;
  colorIndex: number;
  path: string;
  midAngle: number;
  midRadius: number;
  ariaPath: string;
}

export interface SunburstChartInteractionPayload {
  node: SunburstNode;
  depth: number;
  /** Path from root to this node, by name. */
  pathNames: string[];
  /** Aggregate value of this node + descendants. */
  totalValue: number;
  nativeEvent?: PointerEvent;
}

export interface SunburstDrillPayload {
  /** The node that became the new focus. Equals the original root when zoomed all the way out. */
  node: SunburstNode;
  pathNames: string[];
}
