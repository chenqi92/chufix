export type ParallelSize = 'sm' | 'md' | 'lg';

export interface ParallelAxis {
  key: string;
  label: string;
  /** Optional explicit min; defaults to data minimum. */
  min?: number;
  /** Optional explicit max; defaults to data maximum. */
  max?: number;
  /** Reverse the axis (top → max becomes top → min). */
  reversed?: boolean;
  /** Formatter for axis tick labels. */
  format?: (v: number) => string;
}

export interface ParallelItem {
  /** Display label (shown on hover). */
  label: string;
  values: Record<string, number>;
  /** Optional categorical group; lines sharing a group share a color. */
  group?: string;
  color?: string;
}

export interface ParallelProps {
  axes: ParallelAxis[];
  items: ParallelItem[];
  /** Pixel height. Default 280. */
  height?: number;
  /** Tick count per axis. Default 5. */
  ticks?: number;
  /** Default palette mapped by group order. */
  palette?: string[];
  /** Highlight a single item index. */
  highlight?: number | null;
  ariaLabel?: string;
  size?: ParallelSize;
}

export interface ParallelHoverPayload {
  index: number;
  item: ParallelItem;
}
