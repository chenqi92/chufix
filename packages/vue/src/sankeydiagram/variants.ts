export interface SankeyNode {
  id: string;
  name: string;
  /** Auto-computed if not set. */
  layer?: number;
  colorIndex?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  ariaLabel?: string;
}

export interface SankeyNodeInteractionPayload {
  node: SankeyNode;
  nativeEvent?: PointerEvent;
}

export interface SankeyLinkInteractionPayload {
  link: SankeyLink;
  linkIndex: number;
  nativeEvent?: PointerEvent;
}
