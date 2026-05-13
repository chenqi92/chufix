export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  colorIndex?: number;
  size?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  colorIndex?: number;
}

export interface ConnectionGraphNodeInteractionPayload {
  node: GraphNode;
  nativeEvent?: unknown;
}

export interface ConnectionGraphEdgeInteractionPayload {
  edge: GraphEdge;
  edgeIndex: number;
  nativeEvent?: unknown;
}

export interface ConnectionGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  ariaLabel?: string;
  className?: string;
  onNodeEnter?: (payload: ConnectionGraphNodeInteractionPayload) => void;
  onNodeLeave?: (payload: ConnectionGraphNodeInteractionPayload) => void;
  onEdgeEnter?: (payload: ConnectionGraphEdgeInteractionPayload) => void;
  onEdgeLeave?: (payload: ConnectionGraphEdgeInteractionPayload) => void;
}
