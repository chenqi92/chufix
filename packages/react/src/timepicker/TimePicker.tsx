import { useRef, useState, type FocusEvent } from 'react';
import {
  formatTime,
  parseTime,
  range,
  timePickerClass,
  type TimePickerProps,
} from './variants';

export function TimePicker({
  value,
  defaultValue = null,
  placeholder = '请选择时间',
  size = 'md',
  disabled = false,
  clearable = false,
  showSeconds = false,
  className,
  onChange,
}: TimePickerProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const real: string | null = isControlled ? (value ?? null) : internal;

  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement | null>(null);

  const parts = parseTime(real) ?? { h: 0, m: 0, sec: 0 };
  const displayText = real ? (parseTime(real) ? formatTime(parseTime(real)!, showSeconds) : real) : '';

  function pick(part: 'h' | 'm' | 'sec', n: number) {
    const next = { ...parts, [part]: n };
    const text = formatTime(next, showSeconds);
    if (!isControlled) setInternal(text);
    onChange?.(text);
  }

  function clear() {
    if (!isControlled) setInternal(null);
    onChange?.(null);
  }

  function toggle() {
    if (disabled) return;
    setOpen((v) => !v);
  }

  function onFocusOut(evt: FocusEvent<HTMLDivElement>) {
    if (!wrapper.current) return;
    const next = evt.relatedTarget as Node | null;
    if (next && wrapper.current.contains(next)) return;
    setOpen(false);
  }

  const cls = timePickerClass({ size, disabled, open, className });
  const hours = range(24);
  const minutes = range(60);
  const seconds = range(60);

  return (
    <div ref={wrapper} className={cls} tabIndex={-1} onBlur={onFocusOut}>
      <button
        type="button"
        className="cf-timepicker__trigger"
        disabled={disabled}
        onClick={toggle}
      >
        {displayText ? (
          <span className="cf-timepicker__value">{displayText}</span>
        ) : (
          <span className="cf-timepicker__placeholder">{placeholder}</span>
        )}
        {clearable && real && !disabled && (
          <button
            type="button"
            className="cf-timepicker__clear"
            aria-label="清除"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
          >×</button>
        )}
        <span className="cf-timepicker__caret" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="cf-timepicker__panel" role="dialog">
          <div className="cf-timepicker__columns">
            <div className="cf-timepicker__col">
              {hours.map((h) => (
                <button
                  key={`h-${h}`}
                  type="button"
                  className={`cf-timepicker__cell${parts.h === h ? ' is-selected' : ''}`}
                  onClick={() => pick('h', h)}
                >{String(h).padStart(2, '0')}</button>
              ))}
            </div>
            <div className="cf-timepicker__col">
              {minutes.map((m) => (
                <button
                  key={`m-${m}`}
                  type="button"
                  className={`cf-timepicker__cell${parts.m === m ? ' is-selected' : ''}`}
                  onClick={() => pick('m', m)}
                >{String(m).padStart(2, '0')}</button>
              ))}
            </div>
            {showSeconds && (
              <div className="cf-timepicker__col">
                {seconds.map((s) => (
                  <button
                    key={`s-${s}`}
                    type="button"
                    className={`cf-timepicker__cell${parts.sec === s ? ' is-selected' : ''}`}
                    onClick={() => pick('sec', s)}
                  >{String(s).padStart(2, '0')}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
