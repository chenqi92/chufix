export interface ScatterPoint {
  x: number;
  y: number;
  r?: number;
  group?: string;
  label?: string;
}

export interface ScatterPlotProps {
  data: ScatterPoint[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  ariaLabel?: string;
  className?: string;
}
