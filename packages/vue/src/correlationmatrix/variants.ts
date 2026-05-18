export interface CorrelationMatrixProps {
  /** Square matrix in row-major order, values in [-1, 1]. */
  matrix: number[][];
  labels: string[];
  width?: number;
  height?: number;
  cellGap?: number;
  showText?: boolean;
  ariaLabel?: string;
}

export interface CorrelationCellPayload {
  row: number;
  col: number;
  value: number;
  rowLabel: string;
  colLabel: string;
  nativeEvent?: PointerEvent;
}
