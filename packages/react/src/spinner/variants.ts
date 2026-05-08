export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface SpinnerProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  label?: string;
}

export function spinnerClass(p: { size: SpinnerSize; tone: SpinnerTone }): string {
  return ['cf-spinner', `cf-spinner--${p.size}`, `cf-spinner--${p.tone}`].join(' ');
}
