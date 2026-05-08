import type { InputHTMLAttributes, ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchOwnProps {
  size?: SwitchSize;
  loading?: boolean;
  children?: ReactNode;
}

export type SwitchProps = SwitchOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof SwitchOwnProps | 'type'>;

export function switchClass(p: {
  size: SwitchSize;
  disabled: boolean;
  loading: boolean;
  className?: string;
}): string {
  return [
    'ck-switch',
    `ck-switch--${p.size}`,
    p.disabled && 'is-disabled',
    p.loading && 'is-loading',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
