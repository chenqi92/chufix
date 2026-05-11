import type { ChangeEvent, FocusEvent, ReactNode } from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioValue = string | number | boolean | null;

export interface RadioProps {
  value: RadioValue;
  checked?: boolean;
  defaultChecked?: boolean;
  size?: RadioSize;
  disabled?: boolean;
  name?: string;
  id?: string;
  onChange?: (value: RadioValue, meta: RadioChangeMeta) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
}

export interface RadioChangeMeta {
  event: ChangeEvent<HTMLInputElement>;
  value: RadioValue;
  name?: string;
  checked: boolean;
}

export interface RadioGroupProps {
  value?: RadioValue;
  defaultValue?: RadioValue;
  name?: string;
  size?: RadioSize;
  disabled?: boolean;
  direction?: 'row' | 'column';
  onChange?: (value: RadioValue, meta: RadioChangeMeta) => void;
  children?: ReactNode;
  className?: string;
}

export function radioClass(p: {
  size: RadioSize;
  disabled: boolean;
  checked: boolean;
  className?: string;
}): string {
  return [
    'cf-radio',
    `cf-radio--${p.size}`,
    p.disabled && 'is-disabled',
    p.checked && 'is-checked',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function radioGroupClass(p: {
  direction: 'row' | 'column';
  className?: string;
}): string {
  return ['cf-radio-group', `cf-radio-group--${p.direction}`, p.className]
    .filter(Boolean)
    .join(' ');
}
