export type TornadoSize = 'sm' | 'md' | 'lg';

export interface TornadoItem {
  label: string;
  left: number;
  right: number;
  /** Color override for the left bar. */
  leftColor?: string;
  /** Color override for the right bar. */
  rightColor?: string;
}

export interface TornadoProps {
  items: TornadoItem[];
  /** Header for the left bars. Default '左'. */
  leftLabel?: string;
  /** Header for the right bars. Default '右'. */
  rightLabel?: string;
  /** Default left fill. */
  leftColor?: string;
  /** Default right fill. */
  rightColor?: string;
  /** Pixel row height (each item). Default 24. */
  rowHeight?: number;
  /** Sort by total magnitude (descending) for a classic tornado look. Default true. */
  sortByMagnitude?: boolean;
  /** Show numeric value at the end of each bar. Default true. */
  showValues?: boolean;
  /** Optional formatter for the numeric value. */
  format?: (v: number) => string;
  ariaLabel?: string;
  size?: TornadoSize;
}

export interface TornadoHoverPayload {
  index: number;
  item: TornadoItem;
  side: 'left' | 'right';
}
