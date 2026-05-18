export interface ViolinSeries {
  label: string;
  values: number[];
}

export interface ViolinPlotProps {
  data: ViolinSeries[];
  width?: number;
  height?: number;
  bins?: number;
  bandwidth?: number;
  ariaLabel?: string;
}

export interface ViolinPlotInteractionPayload {
  series: ViolinSeries;
  dataIndex: number;
  nativeEvent?: PointerEvent;
}
