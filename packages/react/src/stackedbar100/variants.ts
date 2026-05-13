export interface StackedBar100Series {
  name: string;
  value: number;
  colorIndex?: number;
}

export interface StackedBar100InteractionPayload {
  segment: StackedBar100Series;
  dataIndex: number;
  pct: number;
  nativeEvent?: unknown;
}

export interface StackedBar100Props {
  segments: StackedBar100Series[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: StackedBar100InteractionPayload) => void;
  onItemLeave?: (payload: StackedBar100InteractionPayload) => void;
}
