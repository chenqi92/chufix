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
  /** Stack series on top of each other. */
  stacked?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  ariaLabel?: string;
}
