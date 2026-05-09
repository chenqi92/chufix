export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  thickness?: number;
  sweep?: number;
  label?: string;
  unit?: string;
  tone?: 'accent' | 'success' | 'warning' | 'error';
  ariaLabel?: string;
  className?: string;
}
