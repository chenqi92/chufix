export type TimeRangeSize = 'sm' | 'md' | 'lg';

export type TimeRangeValue = [string | null, string | null] | null;

export interface TimeRangePickerProps {
  modelValue?: TimeRangeValue;
  defaultValue?: TimeRangeValue;
  placeholder?: [string, string];
  size?: TimeRangeSize;
  disabled?: boolean;
  clearable?: boolean;
  showSeconds?: boolean;
  separator?: string;
  className?: string;
}

export function timeRangePickerClass(p: {
  size: TimeRangeSize;
  disabled: boolean;
  className?: string;
}): string {
  return [
    'cf-timerangepicker',
    `cf-timerangepicker--${p.size}`,
    p.disabled && 'is-disabled',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}
