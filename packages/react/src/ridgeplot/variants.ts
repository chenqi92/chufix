export interface RidgeRow {
  label: string;
  density: number[];
  colorIndex?: number;
}

export interface RidgePlotInteractionPayload {
  row: RidgeRow;
  rowIndex: number;
  nativeEvent?: unknown;
}

export interface RidgePlotProps {
  rows: RidgeRow[];
  width?: number;
  height?: number;
  overlap?: number;
  ariaLabel?: string;
  className?: string;
  onItemEnter?: (payload: RidgePlotInteractionPayload) => void;
  onItemLeave?: (payload: RidgePlotInteractionPayload) => void;
}
