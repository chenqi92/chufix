export interface SparklineClickPayload {
  /** Index of the data point nearest the click position. */
  dataIndex: number;
  /** Value at that index. */
  value: number;
  nativeEvent?: unknown;
}

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  filled?: boolean;
  smooth?: boolean;
  colorIndex?: number;
  showDot?: boolean;
  ariaLabel?: string;
  className?: string;
  onClick?: (payload: SparklineClickPayload) => void;
}
