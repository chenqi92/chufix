import type { DateLike } from '../datepicker/date';

export type DateRangeSize = 'sm' | 'md' | 'lg';
export type DateRangeVariant = 'outline' | 'filled' | 'ghost';

export type DateRangeValue = [string | null, string | null];

export interface DateRangePickerProps {
  modelValue?: DateRangeValue;
  format?: string;
  placeholder?: [string, string];
  separator?: string;
  variant?: DateRangeVariant;
  size?: DateRangeSize;
  disabled?: boolean;
  clearable?: boolean;
  error?: boolean;
  minDate?: DateLike;
  maxDate?: DateLike;
  disabledDate?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  name?: string;
  id?: string;
}

export function dateRangeClass(p: {
  variant: DateRangeVariant;
  size: DateRangeSize;
  open: boolean;
  disabled: boolean;
  error: boolean;
}): string {
  return [
    'cf-date',
    'cf-date--range',
    `cf-date--${p.variant}`,
    `cf-date--${p.size}`,
    p.open && 'is-open',
    p.disabled && 'is-disabled',
    p.error && 'is-error',
  ]
    .filter(Boolean)
    .join(' ');
}
