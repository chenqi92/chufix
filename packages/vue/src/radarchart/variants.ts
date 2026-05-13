export interface RadarSeries {
  name: string;
  values: number[];
  colorIndex?: number;
}

export interface RadarChartProps {
  axes: string[];
  series: RadarSeries[];
  size?: number;
  /** Override max value (default = max from data). */
  max?: number;
  showLegend?: boolean;
  ariaLabel?: string;
}

export interface RadarChartInteractionPayload {
  series: RadarSeries;
  seriesIndex: number;
  nativeEvent?: PointerEvent;
}
