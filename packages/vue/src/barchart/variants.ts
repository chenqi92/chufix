export interface BarChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  /** Bar color index (0..7). */
  colorIndex?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  ariaLabel?: string;
}
