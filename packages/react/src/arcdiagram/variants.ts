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

export interface ArcInteractionPayload {
  edge: ArcEdge;
  nativeEvent?: unknown;
}

export interface ArcDiagramProps {
  nodes: ArcNode[];
  edges: ArcEdge[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  arcSide?: 'top' | 'bottom';
  className?: string;
  onEdgeEnter?: (payload: ArcInteractionPayload) => void;
  onEdgeLeave?: (payload: ArcInteractionPayload) => void;
}
