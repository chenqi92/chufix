export type StatisticSize = 'sm' | 'md' | 'lg';

export interface StatisticProps {
  value?: number;
  precision?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimal?: string;
  duration?: number;
  countdown?: number | Date | null;
  format?: string;
  size?: StatisticSize;
  loading?: boolean;
  label?: string;
  className?: string;
  onFinish?: () => void;
}

export function statisticClass(p: {
  size: StatisticSize;
  className?: string;
}): string {
  return ['cf-statistic', `cf-statistic--${p.size}`, p.className].filter(Boolean).join(' ');
}

export function formatNumber(
  value: number,
  precision: number,
  separator: string,
  decimal: string,
): string {
  if (!Number.isFinite(value)) return '—';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const fixed = abs.toFixed(precision);
  const [int, frac] = fixed.split('.');
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return sign + (frac ? `${withSep}${decimal}${frac}` : withSep);
}

export function formatCountdown(ms: number, format: string): string {
  if (ms <= 0) ms = 0;
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return format
    .replace(/DD/g, String(days).padStart(2, '0'))
    .replace(/HH/g, String(hours).padStart(2, '0'))
    .replace(/mm/g, String(minutes).padStart(2, '0'))
    .replace(/ss/g, String(seconds).padStart(2, '0'));
}
