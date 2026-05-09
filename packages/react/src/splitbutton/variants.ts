import type { HTMLAttributes } from 'react';

export type SplitButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'danger';
export type SplitButtonSize = 'sm' | 'md' | 'lg';

export interface SplitButtonItem {
  label: string;
  value: string;
  disabled?: boolean;
  danger?: boolean;
}

export interface SplitButtonOwnProps {
  variant?: SplitButtonVariant;
  size?: SplitButtonSize;
  items: SplitButtonItem[];
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSelect?: (value: string, item: SplitButtonItem) => void;
}

export type SplitButtonProps = SplitButtonOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof SplitButtonOwnProps | 'onClick'>;

export const splitButtonDefaults = {
  variant: 'primary' as SplitButtonVariant,
  size: 'md' as SplitButtonSize,
};

export function splitButtonClass(p: {
  variant: SplitButtonVariant;
  size: SplitButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}): string {
  return [
    'cf-splitbtn',
    `cf-splitbtn--${p.variant}`,
    `cf-splitbtn--${p.size}`,
    p.disabled && 'is-disabled',
    p.loading && 'is-loading',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
