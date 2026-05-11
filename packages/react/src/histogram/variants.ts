export interface HistogramBin {
  label: string;
  count: number;
}

export interface HistogramInteractionPayload {
  label: string;
  count: number;
  dataIndex: number;
  nativeEvent?: unknown;
}

export interface HistogramProps {
  bins: HistogramBin[];
  width?: number;
  height?: number;
  colorIndex?: number;
  showLabels?: boolean;
  showTooltip?: boolean;
  tooltipFormatter?: (payload: HistogramInteractionPayload) => string;
  onItemEnter?: (payload: HistogramInteractionPayload) => void;
  onItemLeave?: (payload: HistogramInteractionPayload) => void;
  ariaLabel?: string;
  className?: string;
}
