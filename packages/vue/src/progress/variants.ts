export type ProgressVariant = 'line' | 'circle';
export type ProgressTone = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  /** 0..100 */
  value?: number;
  variant?: ProgressVariant;
  tone?: ProgressTone;
  size?: ProgressSize;
  /** indeterminate=true 时忽略 value，渲染滚动条纹动画 */
  indeterminate?: boolean;
  /** 是否在右侧/中心显示百分比 */
  showLabel?: boolean;
  /** circle 变体专用：环线宽度（默认按 size 推） */
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
