export interface CorrelationCellPayload {
  row: number;
  col: number;
  value: number;
  rowLabel: string;
  colLabel: string;
  nativeEvent?: unknown;
}

export interface CorrelationMatrixProps {
  matrix: number[][];
  labels: string[];
  width?: number;
  height?: number;
  cellGap?: number;
  showText?: boolean;
  ariaLabel?: string;
  className?: string;
  onCellEnter?: (payload: CorrelationCellPayload) => void;
  onCellLeave?: (payload: CorrelationCellPayload) => void;
}
