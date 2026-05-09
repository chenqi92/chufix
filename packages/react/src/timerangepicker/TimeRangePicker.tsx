import { useState } from 'react';
import { TimePicker } from '../timepicker/TimePicker';
import {
  timeRangePickerClass,
  type TimeRangePickerProps,
  type TimeRangeValue,
} from './variants';

export function TimeRangePicker({
  value,
  defaultValue = null,
  placeholder,
  size = 'md',
  disabled = false,
  clearable = false,
  showSeconds = false,
  separator = '–',
  className,
  onChange,
}: TimeRangePickerProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<TimeRangeValue>(defaultValue);
  const real: TimeRangeValue = isControlled ? (value as TimeRangeValue) : internal;

  const start = real?.[0] ?? null;
  const end = real?.[1] ?? null;

  function update(s: string | null, e: string | null) {
    const next: TimeRangeValue = s == null && e == null ? null : [s, e];
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  const cls = timeRangePickerClass({ size, disabled, className });
  const ph = placeholder ?? ['开始时间', '结束时间'];

  return (
    <div className={cls}>
      <TimePicker
        value={start}
        placeholder={ph[0]}
        size={size}
        disabled={disabled}
        clearable={clearable}
        showSeconds={showSeconds}
        onChange={(v) => update(v, end)}
      />
      <span className="cf-timerangepicker__sep">{separator}</span>
      <TimePicker
        value={end}
        placeholder={ph[1]}
        size={size}
        disabled={disabled}
        clearable={clearable}
        showSeconds={showSeconds}
        onChange={(v) => update(start, v)}
      />
    </div>
  );
}
