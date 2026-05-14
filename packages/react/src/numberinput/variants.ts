import type { FocusEventHandler, ReactNode } from 'react';

export type NumberInputSize = 'sm' | 'md' | 'lg';

export interface NumberInputProps {
  value?: number | null;
  defaultValue?: number | null;
  placeholder?: string;
  size?: NumberInputSize;
  disabled?: boolean;
  name?: string;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  hideSteppers?: boolean;
  /** Inline prefix node (e.g. `¥`, an icon). */
  prefix?: ReactNode;
  /** Inline suffix node (e.g. `kg`, `%`). */
  suffix?: ReactNode;
  onChange?: (v: number | null, meta: NumberInputChangeMeta) => void;
  onInput?: (raw: string) => void;
  onStep?: (v: number, meta: NumberInputStepMeta) => void;
  onInvalid?: (meta: NumberInputInvalidMeta) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export type NumberInputChangeReason = 'commit' | 'blur' | 'enter' | 'step' | 'home' | 'end';

export interface NumberInputChangeMeta {
  raw: string;
  reason: NumberInputChangeReason;
}

export interface NumberInputStepMeta {
  direction: 1 | -1;
}

export interface NumberInputInvalidMeta {
  raw: string;
  reason: 'nan';
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
