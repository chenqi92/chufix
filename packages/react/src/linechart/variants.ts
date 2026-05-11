export interface LineSeries {
  name?: string;
  data: number[];
}

export interface LineChartProps {
  series: LineSeries[];
  labels?: string[];
  width?: number;
  height?: number;
  smooth?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  yLabelFn?: (v: number) => string;
  ariaLabel?: string;
  className?: string;
}
