export interface MetricCardProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  unit?: string;
  hint?: string;
  delta?: number;
  trend?: number[] | 'up' | 'down' | 'flat';
  deltaFn?: (delta: number) => string;
  ariaLabel?: string;
  className?: string;
}
