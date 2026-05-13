export interface HistogramBin {
  /** Bin label, e.g. "0-10" */
  label: string;
  count: number;
}

export interface HistogramInteractionPayload {
  label: string;
  count: number;
  dataIndex: number;
  nativeEvent?: MouseEvent;
}

export interface HistogramProps {
  bins: HistogramBin[];
  width?: number;
  height?: number;
  colorIndex?: number;
  showLabels?: boolean;
  showTooltip?: boolean;
  tooltipFormatter?: (payload: HistogramInteractionPayload) => string;
  ariaLabel?: string;
}
