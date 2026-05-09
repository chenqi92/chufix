import type { ColorFormat } from './color';

export type ColorPickerSize = 'sm' | 'md' | 'lg';

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  defaultFormat?: ColorFormat;
  showAlpha?: boolean;
  presets?: string[];
  disabled?: boolean;
  size?: ColorPickerSize;
  panelOnly?: boolean;
  name?: string;
  id?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export const DEFAULT_PRESETS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
  '#000000',
];

export function colorPickerClass(p: {
  size: ColorPickerSize;
  open: boolean;
  disabled: boolean;
  panelOnly: boolean;
  className?: string;
}): string {
  return [
    'cf-color',
    `cf-color--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.panelOnly && 'cf-color--panel-only',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
