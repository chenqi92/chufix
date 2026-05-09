import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonVariant = 'default' | 'primary' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonShape = 'square' | 'round';

export interface IconButtonOwnProps {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  pressed?: boolean;
  loading?: boolean;
  badge?: ReactNode;
}

export type IconButtonProps = IconButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof IconButtonOwnProps>;

export const iconButtonDefaults = {
  variant: 'default' as IconButtonVariant,
  size: 'md' as IconButtonSize,
  shape: 'square' as IconButtonShape,
};

export function iconButtonClass(p: {
  variant: IconButtonVariant;
  size: IconButtonSize;
  shape: IconButtonShape;
  loading?: boolean;
  className?: string;
}): string {
  return [
    'cf-iconbtn',
    `cf-iconbtn--${p.variant}`,
    `cf-iconbtn--${p.size}`,
    p.shape === 'round' && 'cf-iconbtn--round',
    p.loading && 'is-loading',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
