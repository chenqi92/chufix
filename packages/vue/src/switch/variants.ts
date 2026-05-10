export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  modelValue?: boolean;
  size?: SwitchSize;
  disabled?: boolean;
  loading?: boolean;
  name?: string;
  id?: string;
}

export interface SwitchChangeMeta {
  event: Event;
  checked: boolean;
  name?: string;
}

export function switchClass(p: {
  size: SwitchSize;
  disabled: boolean;
  loading: boolean;
}): string {
  return [
    'cf-switch',
    `cf-switch--${p.size}`,
    p.disabled && 'is-disabled',
    p.loading && 'is-loading',
  ]
    .filter(Boolean)
    .join(' ');
}
