export interface SankeyNode {
  id: string;
  name: string;
  layer?: number;
  colorIndex?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyNodeInteractionPayload {
  node: SankeyNode;
  nativeEvent?: unknown;
}

export interface SankeyLinkInteractionPayload {
  link: SankeyLink;
  linkIndex: number;
  nativeEvent?: unknown;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  ariaLabel?: string;
  className?: string;
  onNodeEnter?: (payload: SankeyNodeInteractionPayload) => void;
  onNodeLeave?: (payload: SankeyNodeInteractionPayload) => void;
  onLinkEnter?: (payload: SankeyLinkInteractionPayload) => void;
  onLinkLeave?: (payload: SankeyLinkInteractionPayload) => void;
}
