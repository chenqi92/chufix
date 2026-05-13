export interface AreaSeries {
  name?: string;
  data: number[];
}

export interface AreaChartTooltipItem {
  name?: string;
  value: number;
  colorIndex: number;
  seriesIndex: number;
  dataIndex: number;
}

export interface AreaChartInteractionPayload {
  label: string;
  dataIndex: number;
  items: AreaChartTooltipItem[];
  nativeEvent?: unknown;
}

export interface AreaChartProps {
  series: AreaSeries[];
  labels?: string[];
  width?: number;
  height?: number;
  smooth?: boolean;
  stacked?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  valueFormatter?: (value: number, item: AreaChartTooltipItem) => string;
  tooltipFormatter?: (payload: AreaChartInteractionPayload) => string;
  onItemEnter?: (payload: AreaChartInteractionPayload) => void;
  onItemLeave?: (payload: AreaChartInteractionPayload) => void;
  onLegendToggle?: (seriesIndex: number, hidden: boolean) => void;
  ariaLabel?: string;
  className?: string;
}
