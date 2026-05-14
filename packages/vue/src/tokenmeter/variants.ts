export type TokenMeterTone = 'accent' | 'info' | 'success' | 'warning' | 'error';

export interface TokenMeterSegment {
  label: string;
  value: number;
  tone?: TokenMeterTone;
}

export interface TokenMeterProps {
  /** Tokens used. */
  used: number;
  /** Context window limit. */
  limit: number;
  /** Optional breakdown shown stacked inside the bar. Sum must be ≤ used. */
  segments?: TokenMeterSegment[];
  /** Show "12.3k / 200k" label. Default true. */
  showLabel?: boolean;
  /** Show legend chips below the bar (only when segments are provided). */
  showLegend?: boolean;
  /** Auto-promote tone to warning / error based on used/limit ratio. Default true. */
  autoTone?: boolean;
  /** Compact mode for inline placement (smaller height, no legend). */
  compact?: boolean;
}

const FORMAT_THRESHOLDS: Array<[number, string]> = [
  [1_000_000, 'M'],
  [1_000, 'k'],
];

export function formatTokens(n: number): string {
  for (const [step, suffix] of FORMAT_THRESHOLDS) {
    if (n >= step) {
      const v = n / step;
      return `${v.toFixed(v < 10 ? 1 : 0)}${suffix}`;
    }
  }
  return String(n);
}

export function ratioTone(ratio: number): TokenMeterTone {
  if (ratio >= 0.95) return 'error';
  if (ratio >= 0.8) return 'warning';
  return 'accent';
}
