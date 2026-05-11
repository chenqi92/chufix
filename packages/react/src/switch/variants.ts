import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchOwnProps {
  size?: SwitchSize;
  loading?: boolean;
  onCheckedChange?: (checked: boolean, meta: SwitchChangeMeta) => void;
  children?: ReactNode;
}

export interface SwitchChangeMeta {
  event: ChangeEvent<HTMLInputElement>;
  checked: boolean;
  name?: string;
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
    'cf-switch',
    `cf-switch--${p.size}`,
    p.disabled && 'is-disabled',
    p.loading && 'is-loading',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
