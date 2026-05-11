export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  /** Trend sparkline data. */
  trend?: number[];
  /** Format the delta. Default: "+N%". */
  deltaFn?: (delta: number) => string;
  ariaLabel?: string;
}
