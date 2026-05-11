export interface BoxStat {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
}

export interface BoxPlotProps {
  data: BoxStat[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
}
