export type InputVariant = 'outline' | 'filled' | 'ghost';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps {
  modelValue?: string | number;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  variant?: InputVariant;
  size?: InputSize;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  error?: boolean;
  clearable?: boolean;
  autofocus?: boolean;
  name?: string;
  id?: string;
}

export function inputClass(p: {
  variant: InputVariant;
  size: InputSize;
  focused: boolean;
  disabled: boolean;
  error: boolean;
}): string {
  return [
    'cf-input',
    `cf-input--${p.variant}`,
    `cf-input--${p.size}`,
    p.focused && 'is-focused',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
  ]
    .filter(Boolean)
    .join(' ');
}
