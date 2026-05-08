export type NumberInputSize = 'sm' | 'md' | 'lg';

export interface NumberInputProps {
  value?: number | null;
  defaultValue?: number | null;
  placeholder?: string;
  size?: NumberInputSize;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  hideSteppers?: boolean;
  onChange?: (v: number | null) => void;
}

export function numberInputClass(p: { size: NumberInputSize }): string {
  return ['cf-number', `cf-number--${p.size}`].join(' ');
}

export function clampNumber(
  v: number,
  min: number | undefined,
  max: number | undefined,
): number {
  let r = v;
  if (typeof min === 'number') r = Math.max(min, r);
  if (typeof max === 'number') r = Math.min(max, r);
  return r;
}

export function inferPrecision(step: number | undefined, explicit: number | undefined): number {
  if (typeof explicit === 'number') return explicit;
  if (typeof step !== 'number') return 0;
  const s = String(step);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}
