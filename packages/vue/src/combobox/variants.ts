export type ComboboxVariant = 'outline' | 'filled' | 'ghost';
export type ComboboxSize = 'sm' | 'md' | 'lg';
export type ComboboxValue = string | number | null;

export interface ComboboxOption {
  value: ComboboxValue;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  modelValue?: ComboboxValue;
  options?: ComboboxOption[];
  placeholder?: string;
  variant?: ComboboxVariant;
  size?: ComboboxSize;
  disabled?: boolean;
  clearable?: boolean;
  error?: boolean;
  allowCreate?: boolean;
  filter?: (query: string, option: ComboboxOption) => boolean;
  emptyText?: string;
  name?: string;
  id?: string;
}

export function comboboxClass(p: {
  variant: ComboboxVariant;
  size: ComboboxSize;
  open: boolean;
  disabled: boolean;
  error: boolean;
}): string {
  return [
    'cf-combobox',
    `cf-combobox--${p.variant}`,
    `cf-combobox--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
  ]
    .filter(Boolean)
    .join(' ');
}

export function defaultFilter(query: string, option: ComboboxOption): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    option.label.toLowerCase().includes(q) ||
    String(option.value ?? '').toLowerCase().includes(q)
  );
}
