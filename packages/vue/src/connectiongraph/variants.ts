export interface GraphNode {
  id: string;
  label: string;
  /** Pre-computed position. If absent, nodes laid out on a circle. */
  x?: number;
  y?: number;
  colorIndex?: number;
  size?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  /** Edge weight (drives stroke-width). */
  weight?: number;
  colorIndex?: number;
}

export interface ConnectionGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  ariaLabel?: string;
}
