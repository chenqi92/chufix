export type MarimekkoSize = 'sm' | 'md' | 'lg';

export interface MarimekkoSegment {
  label: string;
  value: number;
  color?: string;
}

export interface MarimekkoColumn {
  label: string;
  segments: MarimekkoSegment[];
}

export interface MarimekkoProps {
  columns: MarimekkoColumn[];
  /** Pixel height. Default 320. */
  height?: number;
  /** Show column total labels above each column. Default true. */
  showColumnLabels?: boolean;
  /** Show segment labels inside large cells. Default true. */
  showSegmentLabels?: boolean;
  /** Optional formatter for tooltip values. */
  format?: (value: number, segment: MarimekkoSegment, column: MarimekkoColumn) => string;
  /** Default palette when segments don't specify color. */
  palette?: string[];
  ariaLabel?: string;
  size?: MarimekkoSize;
}

export interface MarimekkoHoverPayload {
  column: MarimekkoColumn;
  segment: MarimekkoSegment;
  /** Column's contribution to the grand total (0–1). */
  columnShare: number;
  /** Segment's contribution within its column (0–1). */
  segmentShare: number;
  /** Segment's absolute share of the grand total (0–1). */
  cellShare: number;
}
