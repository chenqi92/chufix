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

export interface SplitButtonProps {
  variant?: SplitButtonVariant;
  size?: SplitButtonSize;
  items: SplitButtonItem[];
  disabled?: boolean;
  loading?: boolean;
}

export const defaultSplitButtonProps: Omit<Required<SplitButtonProps>, 'items'> = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
};

export function splitButtonClass(p: Partial<SplitButtonProps>): string {
  const m = { ...defaultSplitButtonProps, ...p };
  return [
    'cf-splitbtn',
    `cf-splitbtn--${m.variant}`,
    `cf-splitbtn--${m.size}`,
    m.disabled && 'is-disabled',
    m.loading && 'is-loading',
  ]
    .filter(Boolean)
    .join(' ');
}
