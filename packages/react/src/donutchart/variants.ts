export interface DonutSegment {
  name: string;
  value: number;
  colorIndex?: number;
}

export interface DonutChartInteractionPayload {
  segment: DonutSegment;
  dataIndex: number;
  pct: number;
  nativeEvent?: unknown;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: DonutChartInteractionPayload) => void;
  onItemLeave?: (payload: DonutChartInteractionPayload) => void;
}
