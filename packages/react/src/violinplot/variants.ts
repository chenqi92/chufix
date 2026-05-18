export interface ViolinSeries {
  label: string;
  values: number[];
}

export interface ViolinPlotInteractionPayload {
  series: ViolinSeries;
  dataIndex: number;
  nativeEvent?: unknown;
}

export interface ViolinPlotProps {
  data: ViolinSeries[];
  width?: number;
  height?: number;
  bins?: number;
  bandwidth?: number;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: ViolinPlotInteractionPayload) => void;
  onItemLeave?: (payload: ViolinPlotInteractionPayload) => void;
}
