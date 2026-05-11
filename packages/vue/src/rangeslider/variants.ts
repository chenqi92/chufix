export type RangeSliderSize = 'sm' | 'md' | 'lg';
export type RangeSliderTone = 'default' | 'success' | 'warning' | 'error';

export type RangeValue = [number, number];

export interface RangeSliderProps {
  modelValue?: RangeValue;
  min?: number;
  max?: number;
  step?: number;
  size?: RangeSliderSize;
  tone?: RangeSliderTone;
  disabled?: boolean;
  showTooltip?: boolean;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function snap(n: number, step: number): number {
  if (step <= 0) return n;
  return Math.round(n / step) * step;
}
