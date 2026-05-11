export interface BarChartInteractionPayload {
  label: string;
  value: number;
  dataIndex: number;
  colorIndex: number;
  nativeEvent?: MouseEvent;
}

export interface BarChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  /** Bar color index (0..7). */
  colorIndex?: number;
  /** Bar direction. */
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  valueFormatter?: (value: number, payload: BarChartInteractionPayload) => string;
  tooltipFormatter?: (payload: BarChartInteractionPayload) => string;
  ariaLabel?: string;
}
