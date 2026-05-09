export type CountDownSize = 'sm' | 'md' | 'lg';

export interface CountDownProps {
  target?: number | Date | string;
  format?: string;
  interval?: number;
  size?: CountDownSize;
  className?: string;
  onFinish?: () => void;
  onChange?: (remaining: number) => void;
}

export function countDownClass(p: { size: CountDownSize; className?: string }): string {
  return ['cf-countdown', `cf-countdown--${p.size}`, p.className]
    .filter(Boolean)
    .join(' ');
}

export function targetMs(t: number | Date | string | undefined): number {
  if (t == null) return 0;
  if (t instanceof Date) return t.getTime();
  if (typeof t === 'number') return t;
  const parsed = Date.parse(t);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatRemaining(ms: number, format: string): string {
  if (ms < 0) ms = 0;
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const sss = ms % 1000;
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return format
    .replace(/DD/g, pad(days))
    .replace(/HH/g, pad(hours))
    .replace(/mm/g, pad(minutes))
    .replace(/ss/g, pad(seconds))
    .replace(/SSS/g, pad(sss, 3));
}
