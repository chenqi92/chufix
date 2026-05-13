export interface RadarSeries {
  name: string;
  values: number[];
  colorIndex?: number;
}

export interface RadarChartInteractionPayload {
  series: RadarSeries;
  seriesIndex: number;
  nativeEvent?: unknown;
}

export interface RadarVertexInteractionPayload {
  series: RadarSeries;
  seriesIndex: number;
  axisIndex: number;
  axisLabel: string;
  value: number;
  nativeEvent?: unknown;
}

export interface RadarAxisInteractionPayload {
  axisIndex: number;
  axisLabel: string;
  values: number[];
  nativeEvent?: unknown;
}

export interface RadarChartProps {
  axes: string[];
  series: RadarSeries[];
  size?: number;
  max?: number;
  showLegend?: boolean;
  /** Render visible dots at each (series × axis) intersection. Default true. */
  showPoints?: boolean;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: RadarChartInteractionPayload) => void;
  onItemLeave?: (payload: RadarChartInteractionPayload) => void;
  onVertexEnter?: (payload: RadarVertexInteractionPayload) => void;
  onVertexLeave?: (payload: RadarVertexInteractionPayload) => void;
  onAxisEnter?: (payload: RadarAxisInteractionPayload) => void;
  onAxisLeave?: (payload: RadarAxisInteractionPayload) => void;
}
