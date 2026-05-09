import { useState } from 'react';
import {
  addMonths,
  buildMonthGrid,
  calendarClass,
  isOutOfRange,
  isSameDay,
  startOfMonth,
  weekdayLabels,
  type CalendarProps,
} from './variants';

export function Calendar(props: CalendarProps) {
  const {
    value,
    defaultValue = null,
    month,
    defaultMonth,
    min,
    max,
    size = 'md',
    weekStartsOn = 1,
    showWeekNumbers = false,
    disabled = false,
    className,
    onChange,
    onMonthChange,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<Date | null>(defaultValue);
  const current = isControlled ? value ?? null : internal;

  const monthControlled = month !== undefined;
  const [internalMonth, setInternalMonth] = useState(
    startOfMonth(defaultMonth ?? defaultValue ?? new Date()),
  );
  const viewMonth = monthControlled ? startOfMonth(month as Date) : internalMonth;

  const grid = buildMonthGrid(viewMonth, weekStartsOn);
  const labels = weekdayLabels(weekStartsOn);
  const cls = calendarClass({ size, showWeekNumbers, disabled, className });
  const monthLabel = `${viewMonth.getFullYear()} 年 ${viewMonth.getMonth() + 1} 月`;

  function shift(n: number) {
    const next = addMonths(viewMonth, n);
    if (!monthControlled) setInternalMonth(next);
    onMonthChange?.(next);
  }

  function pick(d: Date) {
    if (disabled) return;
    if (isOutOfRange(d, min, max)) return;
    if (!isControlled) setInternal(d);
    onChange?.(d);
  }

  return (
    <div className={cls}>
      <div className="cf-cal__header">
        <button
          type="button"
          className="cf-cal__nav"
          disabled={disabled}
          aria-label="上个月"
          onClick={() => shift(-1)}
        >
          ‹
        </button>
        <span className="cf-cal__title">{monthLabel}</span>
        <button
          type="button"
          className="cf-cal__nav"
          disabled={disabled}
          aria-label="下个月"
          onClick={() => shift(1)}
        >
          ›
        </button>
      </div>
      <div className="cf-cal__grid">
        {showWeekNumbers ? (
          <span className="cf-cal__head cf-cal__head--week" aria-hidden>
            #
          </span>
        ) : null}
        {labels.map((label) => (
          <span key={label} className="cf-cal__head">
            {label}
          </span>
        ))}
        {grid.map((cell, i) => {
          const out = isOutOfRange(cell.date, min, max);
          const dayCls = [
            'cf-cal__day',
            !cell.inMonth && 'is-outside',
            cell.isToday && 'is-today',
            cell.isWeekend && 'is-weekend',
            isSameDay(cell.date, current) && 'is-selected',
            out && 'is-disabled',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <span key={cell.iso} style={{ display: 'contents' }}>
              {showWeekNumbers && i % 7 === 0 ? (
                <span className="cf-cal__week">{cell.weekNumber}</span>
              ) : null}
              <button
                type="button"
                className={dayCls}
                disabled={disabled || out}
                aria-pressed={isSameDay(cell.date, current)}
                onClick={() => pick(cell.date)}
              >
                {cell.date.getDate()}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
