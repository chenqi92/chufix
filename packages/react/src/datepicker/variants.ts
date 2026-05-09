import type { DateLike } from './date';

export type DatePickerSize = 'sm' | 'md' | 'lg';
export type DatePickerVariant = 'outline' | 'filled' | 'ghost';
export type DatePickerView = 'day' | 'month' | 'year';

export interface DatePickerProps {
  value?: DateLike;
  defaultValue?: DateLike;
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
  className?: string;
  onChange?: (value: string | null, date: Date | null) => void;
}

export function datePickerClass(p: {
  variant: DatePickerVariant;
  size: DatePickerSize;
  open: boolean;
  disabled: boolean;
  error: boolean;
  className?: string;
}): string {
  return [
    'cf-date',
    `cf-date--${p.variant}`,
    `cf-date--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
