import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxOwnProps {
  size?: CheckboxSize;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean, meta: CheckboxChangeMeta) => void;
  children?: ReactNode;
}

export interface CheckboxChangeMeta {
  event: ChangeEvent<HTMLInputElement>;
  checked: boolean;
  indeterminate: boolean;
  value: string;
  name?: string;
}

export type CheckboxProps = CheckboxOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof CheckboxOwnProps | 'type'>;

export function checkboxClass(p: {
  size: CheckboxSize;
  disabled: boolean;
  indeterminate: boolean;
  className?: string;
}): string {
  return [
    'cf-checkbox',
    `cf-checkbox--${p.size}`,
    p.disabled && 'is-disabled',
    p.indeterminate && 'is-indeterminate',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
