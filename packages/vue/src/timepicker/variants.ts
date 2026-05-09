export type TimePickerSize = 'sm' | 'md' | 'lg';

export interface TimePickerProps {
  modelValue?: string | null;
  defaultValue?: string | null;
  placeholder?: string;
  size?: TimePickerSize;
  disabled?: boolean;
  clearable?: boolean;
  showSeconds?: boolean;
  className?: string;
}

export function timePickerClass(p: {
  size: TimePickerSize;
  disabled: boolean;
  open: boolean;
  className?: string;
}): string {
  return [
    'cf-timepicker',
    `cf-timepicker--${p.size}`,
    p.disabled && 'is-disabled',
    p.open && 'is-open',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function parseTime(s: string | null | undefined): {
  h: number;
  m: number;
  sec: number;
} | null {
  if (!s) return null;
  const m = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(s.trim());
  if (!m) return null;
  const h = clamp(parseInt(m[1], 10), 0, 23);
  const mm = clamp(parseInt(m[2], 10), 0, 59);
  const sec = m[3] ? clamp(parseInt(m[3], 10), 0, 59) : 0;
  return { h, m: mm, sec };
}

export function formatTime(
  parts: { h: number; m: number; sec: number },
  showSeconds: boolean,
): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return showSeconds
    ? `${pad(parts.h)}:${pad(parts.m)}:${pad(parts.sec)}`
    : `${pad(parts.h)}:${pad(parts.m)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}
