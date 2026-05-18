export interface ChordInteractionPayload {
  source: number;
  target: number;
  value: number;
  nativeEvent?: unknown;
}

export interface ChordDiagramProps {
  matrix: number[][];
  labels?: string[];
  width?: number;
  height?: number;
  padAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  ariaLabel?: string;
  className?: string;
  onRibbonEnter?: (payload: ChordInteractionPayload) => void;
  onRibbonLeave?: (payload: ChordInteractionPayload) => void;
}
