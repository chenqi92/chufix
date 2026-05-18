export interface PyramidRow {
  label: string;
  left: number;
  right: number;
}

export interface PyramidInteractionPayload {
  row: PyramidRow;
  side: 'left' | 'right';
  dataIndex: number;
  nativeEvent?: unknown;
}

export interface PyramidChartProps {
  data: PyramidRow[];
  width?: number;
  height?: number;
  leftLabel?: string;
  rightLabel?: string;
  ariaLabel?: string;
  gap?: number;
  format?: (v: number) => string;
  className?: string;
  onBarEnter?: (payload: PyramidInteractionPayload) => void;
  onBarLeave?: (payload: PyramidInteractionPayload) => void;
}
