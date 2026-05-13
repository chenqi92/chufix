export type SlopeSize = 'sm' | 'md' | 'lg';

export interface SlopeItem {
  label: string;
  before: number;
  after: number;
  color?: string;
}

export interface SlopeProps {
  items: SlopeItem[];
  /** Header label for the left column. Default '之前'. */
  beforeLabel?: string;
  /** Header label for the right column. Default '之后'. */
  afterLabel?: string;
  height?: number;
  /** Show direction-tinted lines (up = positive accent, down = error). Default true. */
  colorByDirection?: boolean;
  /** Optional formatter for endpoint values. */
  format?: (v: number) => string;
  ariaLabel?: string;
  size?: SlopeSize;
}

export interface SlopeHoverPayload {
  index: number;
  item: SlopeItem;
  delta: number;
}
