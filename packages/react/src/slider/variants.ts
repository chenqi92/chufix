export type SliderSize = 'sm' | 'md' | 'lg';
export type SliderTone = 'primary' | 'success' | 'warning' | 'danger';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  tone?: SliderTone;
  disabled?: boolean;
  showValue?: boolean;
  ticks?: boolean;
  onChange?: (v: number) => void;
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
