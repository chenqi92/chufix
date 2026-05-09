export type FloatButtonShape = 'circle' | 'square';
export type FloatButtonVariant = 'primary' | 'default';

export interface FloatButtonProps {
  shape?: FloatButtonShape;
  variant?: FloatButtonVariant;
  tooltip?: string;
  badge?: string | number;
  bottom?: number;
  right?: number;
  top?: number;
  left?: number;
  ariaLabel?: string;
  className?: string;
}

export function floatButtonClass(p: {
  shape: FloatButtonShape;
  variant: FloatButtonVariant;
  className?: string;
}): string {
  return [
    'cf-floatbtn',
    `cf-floatbtn--${p.shape}`,
    `cf-floatbtn--${p.variant}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function floatButtonStyle(p: {
  bottom?: number;
  right?: number;
  top?: number;
  left?: number;
}): Record<string, string> {
  const style: Record<string, string> = {};
  if (p.bottom != null) style.bottom = `${p.bottom}px`;
  if (p.right != null) style.right = `${p.right}px`;
  if (p.top != null) style.top = `${p.top}px`;
  if (p.left != null) style.left = `${p.left}px`;
  if (p.bottom == null && p.top == null) style.bottom = '24px';
  if (p.right == null && p.left == null) style.right = '24px';
  return style;
}
