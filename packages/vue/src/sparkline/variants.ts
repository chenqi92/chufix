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
  ariaLabel?: string;
}
