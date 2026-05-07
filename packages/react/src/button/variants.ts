import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'pill' | 'square';
export type ButtonTone = 'primary' | 'danger';

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  tone?: ButtonTone;
  loading?: boolean;
  block?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

export const buttonDefaults = {
  variant: 'solid' as ButtonVariant,
  size: 'md' as ButtonSize,
  shape: 'default' as ButtonShape,
  tone: 'primary' as ButtonTone,
};

export function buttonClass(p: Required<Pick<ButtonOwnProps, 'variant' | 'size' | 'shape' | 'tone'>> & {
  loading?: boolean;
  block?: boolean;
  className?: string;
}): string {
  return [
    'ck-btn',
    `ck-btn--${p.variant}`,
    `ck-btn--${p.size}`,
    `ck-btn--${p.tone}`,
    p.shape !== 'default' && `ck-btn--${p.shape}`,
    p.block && 'ck-btn--block',
    p.loading && 'is-loading',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
