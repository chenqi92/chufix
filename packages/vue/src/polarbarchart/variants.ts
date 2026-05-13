export type PolarBarSize = 'sm' | 'md' | 'lg';

export interface PolarBarItem {
  label: string;
  value: number;
  color?: string;
}

export interface PolarBarProps {
  items: PolarBarItem[];
  /** Side length of the square SVG canvas. Default 280. */
  size?: number;
  /** Inner hole radius as fraction of outer radius. Default 0.35. */
  innerRatio?: number;
  /** Sweep span in degrees. Default 360 (full circle). */
  sweep?: number;
  /** Starting angle in degrees (0 = top, clockwise). Default 0. */
  startAngle?: number;
  /** Default bar color when an item doesn't specify one. */
  barColor?: string;
  /** Show label text outside each bar. Default true. */
  showLabels?: boolean;
  /** Formatter for the tooltip value. */
  format?: (v: number) => string;
  ariaLabel?: string;
  variant?: PolarBarSize;
}

export interface PolarBarHoverPayload {
  index: number;
  item: PolarBarItem;
}
