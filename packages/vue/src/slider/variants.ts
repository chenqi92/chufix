export type SliderSize = 'sm' | 'md' | 'lg';
export type SliderTone = 'primary' | 'success' | 'warning' | 'danger';

export interface SliderProps {
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  tone?: SliderTone;
  disabled?: boolean;
  /** Show a tooltip on the thumb with the current value. */
  showValue?: boolean;
  /** Render tick marks at every step (only sensible for small ranges). */
  ticks?: boolean;
}

export function sliderClass(p: { size: SliderSize; tone: SliderTone }): string {
  return ['cf-slider', `cf-slider--${p.size}`, `cf-slider--${p.tone}`].join(' ');
}

export function clampStep(
  v: number,
  min: number,
  max: number,
  step: number,
): number {
  const clamped = Math.max(min, Math.min(max, v));
  if (step <= 0) return clamped;
  const steps = Math.round((clamped - min) / step);
  return Math.max(min, Math.min(max, min + steps * step));
}
