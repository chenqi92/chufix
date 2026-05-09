export type StatVariant = 'default' | 'outlined' | 'soft';
export type StatSize = 'sm' | 'md' | 'lg';
export type StatTrendDirection = 'up' | 'down' | 'flat';

export interface StatTrend {
  delta: string | number;
  direction?: StatTrendDirection;
  label?: string;
}

export interface StatProps {
  label: string;
  value?: string | number;
  hint?: string;
  prefix?: string;
  suffix?: string;
  variant?: StatVariant;
  size?: StatSize;
  trend?: StatTrend;
  loading?: boolean;
}

export function statClass(p: {
  variant: StatVariant;
  size: StatSize;
  loading: boolean;
}): string {
  return [
    'cf-stat',
    `cf-stat--${p.variant}`,
    `cf-stat--${p.size}`,
    p.loading && 'is-loading',
  ]
    .filter(Boolean)
    .join(' ');
}

export function trendDirection(t?: StatTrend): StatTrendDirection {
  if (!t) return 'flat';
  if (t.direction) return t.direction;
  const n = Number(t.delta);
  if (!Number.isFinite(n)) return 'flat';
  if (n > 0) return 'up';
  if (n < 0) return 'down';
  return 'flat';
}
