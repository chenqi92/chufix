export interface ArcNode {
  id: string;
  label?: string;
  group?: string | number;
  size?: number;
}

export interface ArcEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface ArcDiagramProps {
  nodes: ArcNode[];
  edges: ArcEdge[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  /** Place arcs above (the default) or below the axis. */
  arcSide?: 'top' | 'bottom';
}

export interface ArcInteractionPayload {
  edge: ArcEdge;
  nativeEvent?: PointerEvent;
}
