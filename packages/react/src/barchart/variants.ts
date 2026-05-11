export interface BarChartInteractionPayload {
  label: string;
  value: number;
  dataIndex: number;
  colorIndex: number;
  nativeEvent?: unknown;
}

export interface BarChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  colorIndex?: number;
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  valueFormatter?: (value: number, payload: BarChartInteractionPayload) => string;
  tooltipFormatter?: (payload: BarChartInteractionPayload) => string;
  onItemEnter?: (payload: BarChartInteractionPayload) => void;
  onItemLeave?: (payload: BarChartInteractionPayload) => void;
  ariaLabel?: string;
  className?: string;
}
