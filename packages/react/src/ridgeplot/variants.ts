export interface RidgeRow {
  label: string;
  density: number[];
  colorIndex?: number;
}

export interface RidgePlotProps {
  rows: RidgeRow[];
  width?: number;
  height?: number;
  overlap?: number;
  ariaLabel?: string;
  className?: string;
}
