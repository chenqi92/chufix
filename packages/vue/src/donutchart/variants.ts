export interface DonutSegment {
  name: string;
  value: number;
  colorIndex?: number;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
  ariaLabel?: string;
}

export interface DonutChartInteractionPayload {
  segment: DonutSegment;
  dataIndex: number;
  /** Percentage occupied by this segment (0–100). */
  pct: number;
  nativeEvent?: PointerEvent;
}
