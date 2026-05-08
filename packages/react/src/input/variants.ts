import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputVariant = 'outline' | 'filled' | 'ghost';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputOwnProps {
  variant?: InputVariant;
  inputSize?: InputSize;
  error?: boolean;
  clearable?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onClear?: () => void;
}

export type InputProps = InputOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputOwnProps | 'size' | 'prefix'>;

export function inputClass(p: {
  variant: InputVariant;
  size: InputSize;
  focused: boolean;
  disabled: boolean;
  error: boolean;
  className?: string;
}): string {
  return [
    'cf-input',
    `cf-input--${p.variant}`,
    `cf-input--${p.size}`,
    p.focused && 'is-focused',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
