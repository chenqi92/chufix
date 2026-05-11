export interface BarChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  /** Bar color index (0..7). */
  colorIndex?: number;
  /** Bar direction. */
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLabels?: boolean;
  ariaLabel?: string;
}
