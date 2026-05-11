export interface HistogramBin {
  /** Bin label, e.g. "0-10" */
  label: string;
  count: number;
}

export interface HistogramProps {
  bins: HistogramBin[];
  width?: number;
  height?: number;
  colorIndex?: number;
  showLabels?: boolean;
  ariaLabel?: string;
}
