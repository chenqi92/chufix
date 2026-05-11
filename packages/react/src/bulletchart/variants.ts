export interface BulletChartProps {
  value: number;
  target?: number;
  max: number;
  bands?: { upTo: number; tone?: 'error' | 'warning' | 'success' }[];
  width?: number;
  height?: number;
  label?: string;
  ariaLabel?: string;
  className?: string;
}
