export type MapLegendPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type MapLegendKind = 'color' | 'size';

export interface MapLegendStop {
  /** Numeric value bound, used in stepped mode. */
  value: number;
  /** Color (for color kind) or radius in px (for size kind). */
  swatch: string | number;
  /** Optional override label. Defaults to the value. */
  label?: string;
}

export interface MapLegendProps {
  /** 'color' = color bar / dots; 'size' = circle radius scale. */
  kind?: MapLegendKind;
  /** Continuous color gradient: array of `{ offset 0-1, color }`. */
  gradient?: Array<{ offset: number; color: string }>;
  /** Domain `[min, max]` for continuous mode. */
  domain?: [number, number];
  /** Stepped legend entries (overrides gradient if both given). */
  stops?: MapLegendStop[];
  /** Title shown above the swatches. */
  title?: string;
  /** Optional unit suffix. */
  unit?: string;
  /** Corner placement when used as an overlay inside another component. */
  position?: MapLegendPosition;
  /** Render inline rather than absolutely positioned. */
  inline?: boolean;
}
