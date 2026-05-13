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
  /** Render visible dots at each (series × axis) intersection. Default true. */
  showPoints?: boolean;
  ariaLabel?: string;
}

export interface RadarChartInteractionPayload {
  series: RadarSeries;
  seriesIndex: number;
  nativeEvent?: PointerEvent;
}

export interface RadarVertexInteractionPayload {
  series: RadarSeries;
  seriesIndex: number;
  /** Axis index (0..axes.length-1). */
  axisIndex: number;
  /** Axis name at that index. */
  axisLabel: string;
  /** Value at that vertex. */
  value: number;
  nativeEvent?: PointerEvent;
}

export interface RadarAxisInteractionPayload {
  axisIndex: number;
  axisLabel: string;
  /** Values for this axis across all series, indexed by seriesIndex. */
  values: number[];
  nativeEvent?: PointerEvent;
}
