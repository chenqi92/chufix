export type SelectVariant = 'outline' | 'filled' | 'ghost';
export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectValue = string | number | null;

export interface SelectOption {
  value: SelectValue;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  modelValue?: SelectValue;
  options?: SelectOption[];
  placeholder?: string;
  variant?: SelectVariant;
  size?: SelectSize;
  disabled?: boolean;
  clearable?: boolean;
  error?: boolean;
  name?: string;
  id?: string;
}

export function selectClass(p: {
  variant: SelectVariant;
  size: SelectSize;
  open: boolean;
  disabled: boolean;
  error: boolean;
}): string {
  return [
    'ck-select',
    `ck-select--${p.variant}`,
    `ck-select--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
  ]
    .filter(Boolean)
    .join(' ');
}
