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

export interface RadarChartProps {
  axes: string[];
  series: RadarSeries[];
  size?: number;
  max?: number;
  showLegend?: boolean;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: RadarChartInteractionPayload) => void;
  onItemLeave?: (payload: RadarChartInteractionPayload) => void;
}
