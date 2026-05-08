import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'pill' | 'square';

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  block?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

export const buttonDefaults = {
  variant: 'primary' as ButtonVariant,
  size: 'md' as ButtonSize,
  shape: 'default' as ButtonShape,
};

export function buttonClass(
  p: Required<Pick<ButtonOwnProps, 'variant' | 'size' | 'shape'>> & {
    loading?: boolean;
    block?: boolean;
    className?: string;
  },
): string {
  return [
    'cf-btn',
    `cf-btn--${p.variant}`,
    `cf-btn--${p.size}`,
    p.shape !== 'default' && `cf-btn--${p.shape}`,
    p.block && 'cf-btn--block',
    p.loading && 'is-loading',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
