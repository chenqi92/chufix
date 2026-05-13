export interface RidgeRow {
  label: string;
  /** Density values across an x-axis (e.g. 0..N bins). */
  density: number[];
  colorIndex?: number;
}

export interface RidgePlotProps {
  rows: RidgeRow[];
  width?: number;
  height?: number;
  /** Vertical overlap between rows (0..1). 0.6 typical. */
  overlap?: number;
  ariaLabel?: string;
}

export interface RidgePlotInteractionPayload {
  row: RidgeRow;
  rowIndex: number;
  nativeEvent?: PointerEvent;
}
