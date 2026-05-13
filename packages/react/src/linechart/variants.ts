export interface LineSeries {
  name?: string;
  data: number[];
}

export interface LineChartTooltipItem {
  name?: string;
  value: number;
  colorIndex: number;
  seriesIndex: number;
  dataIndex: number;
}

export interface LineChartInteractionPayload {
  label: string;
  dataIndex: number;
  items: LineChartTooltipItem[];
  nativeEvent?: unknown;
}

export interface LineChartProps {
  series: LineSeries[];
  labels?: string[];
  width?: number;
  height?: number;
  smooth?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  yLabelFn?: (v: number) => string;
  valueFormatter?: (value: number, item: LineChartTooltipItem) => string;
  tooltipFormatter?: (payload: LineChartInteractionPayload) => string;
  onItemEnter?: (payload: LineChartInteractionPayload) => void;
  onItemLeave?: (payload: LineChartInteractionPayload) => void;
  onLegendToggle?: (seriesIndex: number, hidden: boolean) => void;
  ariaLabel?: string;
  className?: string;
}
