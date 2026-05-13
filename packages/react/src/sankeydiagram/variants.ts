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
  /** Allow vertical drag of nodes to manually reorder a layer. Default true. */
  draggable?: boolean;
  className?: string;
  onNodeEnter?: (payload: SankeyNodeInteractionPayload) => void;
  onNodeLeave?: (payload: SankeyNodeInteractionPayload) => void;
  onLinkEnter?: (payload: SankeyLinkInteractionPayload) => void;
  onLinkLeave?: (payload: SankeyLinkInteractionPayload) => void;
  onNodeDrag?: (payload: SankeyDragPayload) => void;
}

export interface SankeyDragPayload {
  node: SankeyNode;
  /** Final y after drop, in SVG user units. */
  y: number;
  /** Delta from the auto-layout y position. */
  deltaY: number;
  /** Layer the node ended up in (may differ from its original layer). */
  layer: number;
  /** New 0-based order index within its (possibly new) layer. */
  orderIndex: number;
  /** True when the drop resulted in a layer change. */
  layerChanged: boolean;
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
