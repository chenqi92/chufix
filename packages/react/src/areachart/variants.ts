export interface AreaSeries {
  name?: string;
  data: number[];
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
  ariaLabel?: string;
  className?: string;
}
