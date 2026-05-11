export interface BarChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  colorIndex?: number;
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLabels?: boolean;
  ariaLabel?: string;
  className?: string;
}
