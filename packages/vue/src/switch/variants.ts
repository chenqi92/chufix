export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  modelValue?: boolean;
  size?: SwitchSize;
  disabled?: boolean;
  loading?: boolean;
  name?: string;
  id?: string;
}

export function switchClass(p: {
  size: SwitchSize;
  disabled: boolean;
  loading: boolean;
}): string {
  return [
    'ck-switch',
    `ck-switch--${p.size}`,
    p.disabled && 'is-disabled',
    p.loading && 'is-loading',
  ]
    .filter(Boolean)
    .join(' ');
}
