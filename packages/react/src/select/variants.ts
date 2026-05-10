import type { FocusEventHandler } from 'react';

export type SelectVariant = 'outline' | 'filled' | 'ghost';
export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectValue = string | number | null;

export interface SelectOption {
  value: SelectValue;
  label: string;
  disabled?: boolean;
}

export interface SelectChangeMeta {
  option: SelectOption | null;
}

export interface SelectProps {
  value?: SelectValue;
  defaultValue?: SelectValue;
  options?: SelectOption[];
  placeholder?: string;
  variant?: SelectVariant;
  size?: SelectSize;
  disabled?: boolean;
  clearable?: boolean;
  error?: boolean;
  name?: string;
  id?: string;
  className?: string;
  onChange?: (value: SelectValue, meta: SelectChangeMeta) => void;
  onSelect?: (option: SelectOption) => void;
  onClear?: () => void;
  onOpenChange?: (open: boolean) => void;
  onActiveChange?: (option: SelectOption | null, index: number) => void;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
}

export function selectClass(p: {
  variant: SelectVariant;
  size: SelectSize;
  open: boolean;
  disabled: boolean;
  error: boolean;
  className?: string;
}): string {
  return [
    'cf-select',
    `cf-select--${p.variant}`,
    `cf-select--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
