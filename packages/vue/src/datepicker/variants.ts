import type { DateLike } from './date';

export type DatePickerSize = 'sm' | 'md' | 'lg';
export type DatePickerVariant = 'outline' | 'filled' | 'ghost';
export type DatePickerView = 'day' | 'month' | 'year';

export interface DatePickerPreset {
  label: string;
  /** Either an absolute Date or a function returning one (called when clicked). */
  value: Date | string | (() => Date | string);
}

export interface DatePickerProps {
  modelValue?: DateLike;
  format?: string;
  placeholder?: string;
  variant?: DatePickerVariant;
  size?: DatePickerSize;
  disabled?: boolean;
  clearable?: boolean;
  error?: boolean;
  minDate?: DateLike;
  maxDate?: DateLike;
  disabledDate?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  view?: DatePickerView;
  name?: string;
  id?: string;
  /** Show ISO week numbers in the leading column. */
  showWeekNumber?: boolean;
  /** Quick-pick presets shown beside the calendar. */
  presets?: DatePickerPreset[];
}

export function datePickerClass(p: {
  variant: DatePickerVariant;
  size: DatePickerSize;
  open: boolean;
  disabled: boolean;
  error: boolean;
}): string {
  return [
    'cf-date',
    `cf-date--${p.variant}`,
    `cf-date--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
  ]
    .filter(Boolean)
    .join(' ');
}
