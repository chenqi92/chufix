import type { IconName } from '@chufix-design/icons';

export type IconPickerSize = 'sm' | 'md' | 'lg';

export interface IconPickerProps {
  modelValue?: IconName;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: IconPickerSize;
}

export function iconPickerClass(p: { size: IconPickerSize; open: boolean; disabled?: boolean }): string {
  return [
    'cf-iconpicker',
    `cf-iconpicker--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
  ].filter(Boolean).join(' ');
}
