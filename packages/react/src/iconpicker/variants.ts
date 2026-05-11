import type { HTMLAttributes } from 'react';
import type { IconName } from '@chufix-design/icons';

export type IconPickerSize = 'sm' | 'md' | 'lg';

export interface IconPickerOwnProps {
  value?: IconName;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: IconPickerSize;
  onChange?: (value: IconName | undefined) => void;
}

export type IconPickerProps = IconPickerOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof IconPickerOwnProps | 'children' | 'onChange'>;

export function iconPickerClass(p: { size: IconPickerSize; open: boolean; disabled?: boolean; className?: string }): string {
  return [
    'cf-iconpicker',
    `cf-iconpicker--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.className,
  ].filter(Boolean).join(' ');
}
