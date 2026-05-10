import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  addDays,
  addMonths,
  addYears,
  buildMonthGrid,
  clampToBounds,
  endOfMonth,
  formatDate,
  formatISO,
  getISOWeek,
  isAfter,
  isBefore,
  isSameDay,
  MONTH_LABELS_ZH,
  startOfDay,
  startOfMonth,
  toDate,
  WEEK_LABELS_ZH_MON_FIRST,
  WEEK_LABELS_ZH_SUN_FIRST,
} from './date';
import {
  datePickerClass,
  type DatePickerPreset,
  type DatePickerProps,
  type DatePickerView,
} from './variants';

export function DatePicker(props: DatePickerProps) {
  const {
    value,
    defaultValue = null,
    format = 'YYYY-MM-DD',
    placeholder = '选择日期',
    variant = 'outline',
    size = 'md',
    disabled = false,
    clearable = false,
    error = false,
    minDate,
    maxDate,
    disabledDate,
    weekStartsOn = 1,
    view: initialView = 'day',
    name,
    id,
    className,
    showWeekNumber = false,
    presets,
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(() => toDate(defaultValue));
  const externalDate = useMemo(() => toDate(value), [value]);
  const selected = isControlled ? externalDate : internal;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<DatePickerView>(initialView);
  const [cursor, setCursor] = useState<Date>(selected ?? new Date());
  const [focusDate, setFocusDate] = useState<Date>(selected ?? new Date());
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selected) {
      setCursor(selected);
      setFocusDate(selected);
    }
  }, [selected]);

  const min = useMemo(() => toDate(minDate), [minDate]);
  const max = useMemo(() => toDate(maxDate), [maxDate]);
  const weekLabels = weekStartsOn === 0 ? WEEK_LABELS_ZH_SUN_FIRST : WEEK_LABELS_ZH_MON_FIRST;
  const monthGrid = useMemo(() => buildMonthGrid(cursor, weekStartsOn), [cursor, weekStartsOn]);
  const yearGrid = useMemo(() => {
    const base = cursor.getFullYear();
    const start = base - (base % 12);
    return Array.from({ length: 12 }, (_, i) => start + i);
  }, [cursor]);

  const weekRows = useMemo(() => {
    const rows: Array<{ weekNumber: number; days: typeof monthGrid }> = [];
    for (let i = 0; i < 6; i++) {
      const slice = monthGrid.slice(i * 7, i * 7 + 7);
      rows.push({ weekNumber: getISOWeek(slice[0].date), days: slice });
    }
    return rows;
  }, [monthGrid]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: globalThis.MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  function isDayDisabled(d: Date) {
    if (min && isBefore(d, min)) return true;
    if (max && isAfter(d, max)) return true;
    if (disabledDate?.(d)) return true;
    return false;
  }

  function emit(next: Date | null) {
    if (!isControlled) setInternal(next);
    onChange?.(next ? formatISO(next) : null, next);
  }

  function pickDay(d: Date) {
    if (isDayDisabled(d)) return;
    const clamped = clampToBounds(startOfDay(d), min, max);
    setCursor(clamped);
    setFocusDate(clamped);
    emit(clamped);
    setOpen(false);
  }

  function pickMonth(m: number) {
    setCursor(new Date(cursor.getFullYear(), m, 1));
    setView('day');
  }

  function pickYear(y: number) {
    setCursor(new Date(y, cursor.getMonth(), 1));
    setView('month');
  }

  function clear(e: MouseEvent) {
    e.stopPropagation();
    emit(null);
  }

  function prev() {
    if (view === 'day') setCursor(addMonths(cursor, -1));
    else if (view === 'month') setCursor(addYears(cursor, -1));
    else setCursor(addYears(cursor, -12));
  }
  function next() {
    if (view === 'day') setCursor(addMonths(cursor, 1));
    else if (view === 'month') setCursor(addYears(cursor, 1));
    else setCursor(addYears(cursor, 12));
  }

  function selectToday() {
    const today = startOfDay(new Date());
    if (isDayDisabled(today)) return;
    pickDay(today);
  }

  function applyPreset(p: DatePickerPreset) {
    const raw = typeof p.value === 'function' ? p.value() : p.value;
    const d = toDate(raw as never);
    if (!d || isDayDisabled(d)) return;
    pickDay(d);
  }

  function moveFocus(delta: number) {
    const next = addDays(focusDate, delta);
    setFocusDate(next);
    setCursor(next);
  }

  function onPanelKeydown(e: KeyboardEvent<HTMLDivElement>) {
    if (view !== 'day') return;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocus(-7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocus(7);
        break;
      case 'PageUp':
        e.preventDefault();
        setCursor((c) => {
          const next = addMonths(c, -1);
          setFocusDate(next);
          return next;
        });
        break;
      case 'PageDown':
        e.preventDefault();
        setCursor((c) => {
          const next = addMonths(c, 1);
          setFocusDate(next);
          return next;
        });
        break;
      case 'Home':
        e.preventDefault();
        setFocusDate(startOfMonth(cursor));
        break;
      case 'End':
        e.preventDefault();
        setFocusDate(endOfMonth(cursor));
        break;
      case 'Enter':
        e.preventDefault();
        pickDay(focusDate);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  }

  const display = selected ? formatDate(selected, format) : '';
  const cls = datePickerClass({ variant, size, open, disabled, error, className });

  function renderDayCell(cell: typeof monthGrid[number]) {
    const dis = isDayDisabled(cell.date);
    const dcls = [
      'cf-date__day',
      !cell.inMonth && 'is-out',
      cell.isToday && 'is-today',
      isSameDay(cell.date, selected) && 'is-selected',
      isSameDay(cell.date, focusDate) && 'is-focused',
      dis && 'is-disabled',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <button
        key={cell.date.toISOString()}
        type="button"
        className={dcls}
        disabled={dis}
        onClick={() => pickDay(cell.date)}
      >
        {cell.date.getDate()}
      </button>
    );
  }

  return (
    <div ref={rootRef} className={cls} id={id}>
      <button
        type="button"
        className="cf-date__trigger"
        name={name}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <svg className="cf-date__icon" viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M2.5 6.5h11M5 2v3M11 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="cf-date__value">
          {display ? display : <span className="cf-date__placeholder">{placeholder}</span>}
        </span>
        {clearable && selected && !disabled ? (
          <span
            className="cf-date__clear"
            role="button"
            tabIndex={-1}
            aria-label="清除"
            onClick={clear}
          >
            ×
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className={`cf-date__panel${presets && presets.length ? ' cf-date__panel--with-presets' : ''}`}
          role="dialog"
          tabIndex={-1}
          onKeyDown={onPanelKeydown}
        >
          {presets && presets.length ? (
            <aside className="cf-date__presets">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  className="cf-date__preset-btn"
                  onClick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </aside>
          ) : null}

          <div className="cf-date__main">
            <header className="cf-date__header">
              <button type="button" className="cf-date__nav" aria-label="上一页" onClick={prev}>‹</button>
              <div className="cf-date__title">
                {view === 'day' ? (
                  <button type="button" className="cf-date__title-btn" onClick={() => setView('month')}>
                    {MONTH_LABELS_ZH[cursor.getMonth()]}
                  </button>
                ) : null}
                <button type="button" className="cf-date__title-btn" onClick={() => setView('year')}>
                  {cursor.getFullYear()}
                </button>
              </div>
              <button type="button" className="cf-date__nav" aria-label="下一页" onClick={next}>›</button>
            </header>

            {view === 'day' ? (
              <div className="cf-date__body">
                <div className={`cf-date__weekdays${showWeekNumber ? ' with-week-num' : ''}`}>
                  {showWeekNumber && <span className="cf-date__week-col-head">w</span>}
                  {weekLabels.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </div>
                {showWeekNumber ? (
                  weekRows.map((row) => (
                    <div key={row.weekNumber} className="cf-date__week-row">
                      <span className="cf-date__week-num">{row.weekNumber}</span>
                      {row.days.map((cell) => renderDayCell(cell))}
                    </div>
                  ))
                ) : (
                  <div className="cf-date__grid">
                    {monthGrid.map((cell) => renderDayCell(cell))}
                  </div>
                )}
              </div>
            ) : view === 'month' ? (
              <div className="cf-date__months">
                {MONTH_LABELS_ZH.map((label, i) => {
                  const sel =
                    !!selected &&
                    cursor.getFullYear() === selected.getFullYear() &&
                    i === selected.getMonth();
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`cf-date__cell${sel ? ' is-selected' : ''}`}
                      onClick={() => pickMonth(i)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="cf-date__years">
                {yearGrid.map((y) => {
                  const sel = !!selected && y === selected.getFullYear();
                  return (
                    <button
                      key={y}
                      type="button"
                      className={`cf-date__cell${sel ? ' is-selected' : ''}`}
                      onClick={() => pickYear(y)}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}

            <footer className="cf-date__footer">
              <button type="button" className="cf-date__action" onClick={selectToday}>今天</button>
              <button type="button" className="cf-date__action" onClick={() => setOpen(false)}>关闭</button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
