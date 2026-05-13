export type StreamGraphSize = 'sm' | 'md' | 'lg';

export interface StreamSeries {
  label: string;
  data: number[];
  color?: string;
}

export interface StreamGraphProps {
  /** Shared X-axis labels. */
  categories: string[];
  series: StreamSeries[];
  /** Pixel height. Default 240. */
  height?: number;
  /** Baseline mode: 'wiggle' (centered, classic streamgraph) or 'zero' (stacked area). Default 'wiggle'. */
  baseline?: 'wiggle' | 'zero';
  /** Smooth band edges via cardinal-spline approximation. Default true. */
  smooth?: boolean;
  /** Default palette when series don't specify color. */
  palette?: string[];
  /** Optional formatter for tooltip values. */
  format?: (v: number) => string;
  ariaLabel?: string;
  size?: StreamGraphSize;
}

export interface StreamGraphHoverPayload {
  index: number;
  category: string;
  /** Map of series label → value at this category. */
  values: Record<string, number>;
}
