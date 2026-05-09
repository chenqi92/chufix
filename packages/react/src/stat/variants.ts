export type StatVariant = 'default' | 'outlined' | 'soft';
export type StatSize = 'sm' | 'md' | 'lg';
export type StatTrendDirection = 'up' | 'down' | 'flat';

export interface StatTrend {
  delta: string | number;
  direction?: StatTrendDirection;
  label?: string;
}

export interface StatProps {
  label: import('react').ReactNode;
  value?: import('react').ReactNode;
  hint?: import('react').ReactNode;
  prefix?: import('react').ReactNode;
  suffix?: import('react').ReactNode;
  variant?: StatVariant;
  size?: StatSize;
  trend?: StatTrend;
  loading?: boolean;
  leading?: import('react').ReactNode;
  trailing?: import('react').ReactNode;
  footer?: import('react').ReactNode;
  className?: string;
}

export function statClass(p: {
  variant: StatVariant;
  size: StatSize;
  loading: boolean;
  className?: string;
}): string {
  return [
    'cf-stat',
    `cf-stat--${p.variant}`,
    `cf-stat--${p.size}`,
    p.loading && 'is-loading',
    p.className,
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
