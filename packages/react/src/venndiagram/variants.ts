export type VennSize = 'sm' | 'md' | 'lg';

export interface VennSet {
  label: string;
  /** Count of members in this set (used for radius sizing). */
  count: number;
  color?: string;
}

export interface VennIntersection {
  /** Indices of the sets that overlap, e.g. [0,1] or [0,1,2]. */
  sets: number[];
  /** Count in this exact intersection region. */
  count: number;
  label?: string;
}

export interface VennProps {
  /** 2 or 3 sets. Larger arities are not supported. */
  sets: VennSet[];
  /** Optional intersection counts shown inside overlap regions. */
  intersections?: VennIntersection[];
  /** SVG side length. Default 320. */
  size?: number;
  /** Format the count label inside a region. */
  format?: (n: number) => string;
  ariaLabel?: string;
  variant?: VennSize;
}

export interface VennHoverPayload {
  type: 'set' | 'intersection';
  setIndex?: number;
  set?: VennSet;
  intersection?: VennIntersection;
}
