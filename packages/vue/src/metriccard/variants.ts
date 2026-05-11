export interface MetricCardProps {
  label: string;
  value: string | number;
  /** Text rendered before the value, e.g. currency symbol. */
  prefix?: string;
  /** Text rendered after the value. Alias of unit for dashboard-style cards. */
  suffix?: string;
  unit?: string;
  /** Small helper text below the value. */
  hint?: string;
  delta?: number;
  /** Trend sparkline data or a built-in preset. */
  trend?: number[] | 'up' | 'down' | 'flat';
  /** Format the delta. Default: "+N%". */
  deltaFn?: (delta: number) => string;
  ariaLabel?: string;
}
