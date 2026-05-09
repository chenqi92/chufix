import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import {
  addMonths,
  buildMonthGrid,
  formatDate,
  formatISO,
  isAfter,
  isBefore,
  isInRange,
  isSameDay,
  MONTH_LABELS_ZH,
  startOfDay,
  startOfMonth,
  toDate,
  WEEK_LABELS_ZH_MON_FIRST,
  WEEK_LABELS_ZH_SUN_FIRST,
} from '../datepicker/date';
import {
  dateRangeClass,
  type DateRangePickerProps,
  type DateRangeValue,
} from './variants';

export function DateRangePicker(props: DateRangePickerProps) {
  const {
    value,
    defaultValue = [null, null],
    format = 'YYYY-MM-DD',
    placeholder = ['开始日期', '结束日期'],
    separator = '至',
    variant = 'outline',
    size = 'md',
    disabled = false,
    clearable = false,
    error = false,
    minDate,
    maxDate,
    disabledDate,
    weekStartsOn = 1,
    name,
    id,
    className,
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<DateRangeValue>(defaultValue);
  const range = (isControlled ? (value as DateRangeValue) : internal) ?? [null, null];

  const startDate = useMemo(() => toDate(range[0]), [range]);
  const endDate = useMemo(() => toDate(range[1]), [range]);
  const min = useMemo(() => toDate(minDate), [minDate]);
  const max = useMemo(() => toDate(maxDate), [maxDate]);

  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<Date>(startDate ? startOfMonth(startDate) : startOfMonth(new Date()));
  const [draftStart, setDraftStart] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (startDate) setCursor(startOfMonth(startDate));
  }, [startDate]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: globalThis.MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setDraftStart(null);
        setHoverDate(null);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const weekLabels = weekStartsOn === 0 ? WEEK_LABELS_ZH_SUN_FIRST : WEEK_LABELS_ZH_MON_FIRST;
  const leftMonth = cursor;
  const rightMonth = useMemo(() => addMonths(cursor, 1), [cursor]);
  const leftGrid = useMemo(() => buildMonthGrid(leftMonth, weekStartsOn), [leftMonth, weekStartsOn]);
  const rightGrid = useMemo(() => buildMonthGrid(rightMonth, weekStartsOn), [rightMonth, weekStartsOn]);

  const previewRange = useMemo(() => {
    if (draftStart && hoverDate) {
      return isBefore(draftStart, hoverDate)
        ? { start: draftStart, end: hoverDate }
        : { start: hoverDate, end: draftStart };
    }
    if (draftStart && !hoverDate) return { start: draftStart, end: null as Date | null };
    return { start: startDate, end: endDate };
  }, [draftStart, hoverDate, startDate, endDate]);

  function isDayDisabled(d: Date) {
    if (min && isBefore(d, min)) return true;
    if (max && isAfter(d, max)) return true;
    if (disabledDate?.(d)) return true;
    return false;
  }

  function emit(next: DateRangeValue, s: Date | null, e: Date | null) {
    if (!isControlled) setInternal(next);
    onChange?.(next, s, e);
  }

  function pickDay(d: Date) {
    if (isDayDisabled(d)) return;
    if (!draftStart) {
      setDraftStart(startOfDay(d));
      setHoverDate(null);
      return;
    }
    const a = draftStart;
    const b = startOfDay(d);
    const s = isBefore(a, b) ? a : b;
    const e = isBefore(a, b) ? b : a;
    emit([formatISO(s), formatISO(e)], s, e);
    setDraftStart(null);
    setHoverDate(null);
    setOpen(false);
  }

  function onDayHover(d: Date) {
    if (!draftStart) return;
    setHoverDate(startOfDay(d));
  }

  function clear(e: MouseEvent) {
    e.stopPropagation();
    emit([null, null], null, null);
  }

  function applyPreset(daysBack: number) {
    const today = startOfDay(new Date());
    const start = new Date(today);
    start.setDate(start.getDate() - daysBack + 1);
    emit([formatISO(start), formatISO(today)], start, today);
    setCursor(startOfMonth(start));
    setOpen(false);
  }

  function isInPreview(d: Date) {
    return previewRange.start && previewRange.end
      ? isInRange(d, previewRange.start, previewRange.end)
      : false;
  }
  function isPreviewStart(d: Date) {
    return previewRange.start ? isSameDay(d, previewRange.start) : false;
  }
  function isPreviewEnd(d: Date) {
    return previewRange.end ? isSameDay(d, previewRange.end) : false;
  }

  const startDisplay = startDate ? formatDate(startDate, format) : '';
  const endDisplay = endDate ? formatDate(endDate, format) : '';

  function renderGrid(grid: ReturnType<typeof buildMonthGrid>, prefix: string) {
    return grid.map((cell) => {
      const dis = isDayDisabled(cell.date);
      const cls = [
        'cf-date__day',
        !cell.inMonth && 'is-out',
        cell.isToday && 'is-today',
        (isPreviewStart(cell.date) || isPreviewEnd(cell.date)) && 'is-selected',
        isInPreview(cell.date) && 'is-in-range',
        isPreviewStart(cell.date) && 'is-range-start',
        isPreviewEnd(cell.date) && 'is-range-end',
        dis && 'is-disabled',
      ].filter(Boolean).join(' ');
      return (
        <button
          key={`${prefix}-${cell.date.toISOString()}`}
          type="button"
          className={cls}
          disabled={dis}
          onClick={() => pickDay(cell.date)}
          onMouseEnter={() => onDayHover(cell.date)}
        >
          {cell.date.getDate()}
        </button>
      );
    });
  }

  const cls = dateRangeClass({ variant, size, open, disabled, error, className });

  return (
    <div ref={rootRef} className={cls} id={id}>
      <button
        type="button"
        className="cf-date__trigger cf-date__trigger--range"
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
          {startDisplay ? startDisplay : <span className="cf-date__placeholder">{placeholder[0]}</span>}
        </span>
        <span className="cf-date__separator">{separator}</span>
        <span className="cf-date__value">
          {endDisplay ? endDisplay : <span className="cf-date__placeholder">{placeholder[1]}</span>}
        </span>
        {clearable && (startDate || endDate) && !disabled ? (
          <span
            className="cf-date__clear"
            role="button"
            tabIndex={-1}
            aria-label="清除"
            onClick={clear}
          >×</span>
        ) : null}
      </button>

      {open ? (
        <div className="cf-date__panel cf-date__panel--range" role="dialog">
          <div className="cf-date__range-grids">
            <div className="cf-date__range-pane">
              <header className="cf-date__header">
                <button type="button" className="cf-date__nav" aria-label="上个月" onClick={() => setCursor(addMonths(cursor, -1))}>‹</button>
                <div className="cf-date__title">
                  <span className="cf-date__title-btn">{MONTH_LABELS_ZH[leftMonth.getMonth()]}</span>
                  <span className="cf-date__title-btn">{leftMonth.getFullYear()}</span>
                </div>
                <span className="cf-date__nav" aria-hidden="true" />
              </header>
              <div className="cf-date__weekdays">
                {weekLabels.map((w) => <span key={`l-${w}`}>{w}</span>)}
              </div>
              <div className="cf-date__grid">{renderGrid(leftGrid, 'l')}</div>
            </div>

            <div className="cf-date__range-pane">
              <header className="cf-date__header">
                <span className="cf-date__nav" aria-hidden="true" />
                <div className="cf-date__title">
                  <span className="cf-date__title-btn">{MONTH_LABELS_ZH[rightMonth.getMonth()]}</span>
                  <span className="cf-date__title-btn">{rightMonth.getFullYear()}</span>
                </div>
                <button type="button" className="cf-date__nav" aria-label="下个月" onClick={() => setCursor(addMonths(cursor, 1))}>›</button>
              </header>
              <div className="cf-date__weekdays">
                {weekLabels.map((w) => <span key={`r-${w}`}>{w}</span>)}
              </div>
              <div className="cf-date__grid">{renderGrid(rightGrid, 'r')}</div>
            </div>
          </div>

          <footer className="cf-date__footer">
            <div className="cf-date__presets">
              <button type="button" className="cf-date__action" onClick={() => applyPreset(7)}>近 7 天</button>
              <button type="button" className="cf-date__action" onClick={() => applyPreset(30)}>近 30 天</button>
              <button type="button" className="cf-date__action" onClick={() => applyPreset(90)}>近 90 天</button>
            </div>
            <button type="button" className="cf-date__action" onClick={() => setOpen(false)}>关闭</button>
          </footer>
        </div>
      ) : null}
    </div>
  );
}
