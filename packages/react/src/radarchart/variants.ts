export interface RadarSeries {
  name: string;
  values: number[];
  colorIndex?: number;
}

export interface RadarChartProps {
  axes: string[];
  series: RadarSeries[];
  size?: number;
  max?: number;
  showLegend?: boolean;
  ariaLabel?: string;
  className?: string;
}
