export type TokenMeterTone = 'accent' | 'info' | 'success' | 'warning' | 'error';

export interface TokenMeterSegment {
  label: string;
  value: number;
  tone?: TokenMeterTone;
}

export interface TokenMeterProps {
  used: number;
  limit: number;
  segments?: TokenMeterSegment[];
  showLabel?: boolean;
  showLegend?: boolean;
  autoTone?: boolean;
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
