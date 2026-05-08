export type ProgressVariant = 'line' | 'circle';
export type ProgressTone = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  value?: number;
  variant?: ProgressVariant;
  tone?: ProgressTone;
  size?: ProgressSize;
  indeterminate?: boolean;
  showLabel?: boolean;
  strokeWidth?: number;
}

export function progressClass(p: {
  variant: ProgressVariant;
  tone: ProgressTone;
  size: ProgressSize;
  indeterminate: boolean;
}): string {
  return [
    'cf-progress',
    `cf-progress--${p.variant}`,
    `cf-progress--${p.tone}`,
    `cf-progress--${p.size}`,
    p.indeterminate && 'is-indeterminate',
  ]
    .filter(Boolean)
    .join(' ');
}

export function clamp(v: number): number {
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(100, v));
}
