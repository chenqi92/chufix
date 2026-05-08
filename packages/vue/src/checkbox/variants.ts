export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  modelValue?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  disabled?: boolean;
  name?: string;
  id?: string;
  value?: string | number;
}

export function checkboxClass(p: {
  size: CheckboxSize;
  disabled: boolean;
  indeterminate: boolean;
}): string {
  return [
    'ck-checkbox',
    `ck-checkbox--${p.size}`,
    p.disabled && 'is-disabled',
    p.indeterminate && 'is-indeterminate',
  ]
    .filter(Boolean)
    .join(' ');
}
