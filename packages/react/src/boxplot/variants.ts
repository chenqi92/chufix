export interface BoxStat {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
}

export interface BoxPlotInteractionPayload {
  box: BoxStat;
  dataIndex: number;
  nativeEvent?: unknown;
}

export interface BoxPlotProps {
  data: BoxStat[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: BoxPlotInteractionPayload) => void;
  onItemLeave?: (payload: BoxPlotInteractionPayload) => void;
}
