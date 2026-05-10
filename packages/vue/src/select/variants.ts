export type SelectVariant = 'outline' | 'filled' | 'ghost';
export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectSingleValue = string | number | null;
export type SelectValue = SelectSingleValue | Array<string | number>;

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  /** Optional group name; options sharing a group render under a section header. */
  group?: string;
}

export interface SelectChangeMeta {
  option: SelectOption | null;
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
  /** Allow multiple selection. Model becomes an array. */
  multiple?: boolean;
  /** Show a search input above the option list to filter by label. */
  searchable?: boolean;
  /** Loading state — disables the trigger and replaces options with spinner. */
  loading?: boolean;
  /** Override the no-options message. */
  emptyText?: string;
  /** Cap how many tags are shown in multi mode; the rest collapse to a +N pill. */
  maxTagCount?: number;
}

export function selectClass(p: {
  variant: SelectVariant;
  size: SelectSize;
  open: boolean;
  disabled: boolean;
  error: boolean;
}): string {
  return [
    'cf-select',
    `cf-select--${p.variant}`,
    `cf-select--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
  ]
    .filter(Boolean)
    .join(' ');
}
