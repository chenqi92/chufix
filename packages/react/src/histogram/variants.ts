export interface HistogramBin {
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
  className?: string;
}
