export interface ChordDiagramProps {
  /** Square matrix: matrix[i][j] = flow from i to j. */
  matrix: number[][];
  labels?: string[];
  width?: number;
  height?: number;
  padAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  ariaLabel?: string;
}

export interface ChordInteractionPayload {
  source: number;
  target: number;
  value: number;
  nativeEvent?: PointerEvent;
}
