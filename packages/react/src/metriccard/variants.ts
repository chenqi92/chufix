export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  trend?: number[];
  deltaFn?: (delta: number) => string;
  ariaLabel?: string;
  className?: string;
}
