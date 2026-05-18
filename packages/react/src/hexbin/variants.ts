export interface HexbinPoint {
  x: number;
  y: number;
  weight?: number;
}

export interface HexbinCell {
  cx: number;
  cy: number;
  count: number;
  weight: number;
}

export interface HexbinInteractionPayload {
  cell: HexbinCell;
  nativeEvent?: unknown;
}

export interface HexbinProps {
  data: HexbinPoint[];
  width?: number;
  height?: number;
  radius?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
  ariaLabel?: string;
  showAxis?: boolean;
  className?: string;
  onCellEnter?: (payload: HexbinInteractionPayload) => void;
  onCellLeave?: (payload: HexbinInteractionPayload) => void;
}
