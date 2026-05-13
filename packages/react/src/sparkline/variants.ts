export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  /** Solid line + filled area, vs line only. */
  filled?: boolean;
  /** Smooth curve. */
  smooth?: boolean;
  /** Series color index (0..7), maps to --viz-N. */
  colorIndex?: number;
  /** Highlight last point with a dot. */
  showDot?: boolean;
  /** Enable pointer-tracked vertical crosshair + tooltip. Default false. */
  interactive?: boolean;
  /** Format the value shown in the tooltip. */
  format?: (value: number, index: number) => string;
  /** Optional labels for the X axis (shown in tooltip when present). */
  labels?: string[];
  ariaLabel?: string;
  className?: string;
  onClick?: (payload: SparklineClickPayload) => void;
  onHover?: (payload: SparklineHoverPayload | null) => void;
}

export interface SparklineClickPayload {
  /** Index of the data point nearest the click position. */
  dataIndex: number;
  /** Value at that index. */
  value: number;
  nativeEvent?: MouseEvent;
}

export interface SparklineHoverPayload {
  /** Index of the data point nearest the cursor. */
  dataIndex: number;
  value: number;
  label?: string;
  nativeEvent: PointerEvent;
}
