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
  /** Run a barycenter sweep to minimize link crossings before layout.
   *  Disabled (or skipped per-layer) when the user has manually reordered
   *  that layer via drag. Default true. */
  minimizeCrossings?: boolean;
  /** Number of barycenter sweep iterations. Default 4. */
  crossingIterations?: number;
  /** Controlled per-layer node order: layer index → array of node ids. When
   *  supplied, drag-induced reorders are dispatched via `@update:order`
   *  instead of being mutated internally. */
  order?: Record<number, string[]>;
  /** Controlled per-node layer overrides: id → layer index. Pair with
   *  `onLayerAssignChange`. */
  layerAssign?: Record<string, number>;
  className?: string;
  onNodeEnter?: (payload: SankeyNodeInteractionPayload) => void;
  onNodeLeave?: (payload: SankeyNodeInteractionPayload) => void;
  onLinkEnter?: (payload: SankeyLinkInteractionPayload) => void;
  onLinkLeave?: (payload: SankeyLinkInteractionPayload) => void;
  onNodeDrag?: (payload: SankeyDragPayload) => void;
  onOrderChange?: (order: Record<number, string[]>) => void;
  onLayerAssignChange?: (layerAssign: Record<string, number>) => void;
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
