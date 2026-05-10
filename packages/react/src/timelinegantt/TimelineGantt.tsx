import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { addDays, startOfDay, toDate } from '../datepicker/date';
import type {
  GanttBar,
  GanttBarChangeMeta,
  GanttRow,
  TimelineGanttProps as BaseProps,
} from './variants';

export type TimelineGanttProps = BaseProps & {
  onBarClick?: (bar: GanttBar, row: GanttRow) => void;
  onRowClick?: (row: GanttRow) => void;
  onBarChange?: (payload: {
    bar: GanttBar;
    row: GanttRow;
    next: { start: Date; end: Date };
    meta: GanttBarChangeMeta;
  }) => void;
};

interface RenderRow {
  type: 'header' | 'row';
  group?: string;
  row?: GanttRow;
}

interface DragState {
  bar: GanttBar;
  row: GanttRow;
  action: GanttBarChangeMeta['action'];
  startX: number;
  prev: { start: Date; end: Date };
}

export function TimelineGantt(props: TimelineGanttProps) {
  const {
    rows,
    start,
    end,
    unit = 'day',
    dayWidth = 32,
    rowHeight = 40,
    labelWidth = 200,
    showToday = true,
    dependencies,
    editable = false,
    weekStartsOn = 1,
    caption,
    size = 'md',
    onBarClick,
    onRowClick,
    onBarChange,
  } = props;
  void unit;
  void weekStartsOn;

  const rangeStart = useMemo(() => startOfDay(toDate(start) ?? new Date()), [start]);
  const rangeEnd = useMemo(
    () => startOfDay(toDate(end) ?? addDays(rangeStart, 30)),
    [end, rangeStart],
  );
  const totalDays = useMemo(
    () => Math.max(1, Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86400000) + 1),
    [rangeStart, rangeEnd],
  );
  const totalWidth = totalDays * dayWidth;
  const today = useMemo(() => startOfDay(new Date()), []);

  const dayIndex = useCallback(
    (d: Date) => Math.round((startOfDay(d).getTime() - rangeStart.getTime()) / 86400000),
    [rangeStart],
  );
  const clampIndex = useCallback(
    (i: number) => Math.max(0, Math.min(totalDays - 1, i)),
    [totalDays],
  );

  const monthTicks = useMemo(() => {
    const out: Array<{ label: string; days: number }> = [];
    let d = new Date(rangeStart);
    while (d <= rangeEnd) {
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const winStart = monthStart < rangeStart ? rangeStart : monthStart;
      const winEnd = next > rangeEnd ? addDays(rangeEnd, 1) : next;
      const days = Math.round((winEnd.getTime() - winStart.getTime()) / 86400000);
      out.push({ label: `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`, days });
      d = next;
    }
    return out;
  }, [rangeStart, rangeEnd]);

  const dayCells = useMemo(() => {
    const out: Array<{ date: Date; isToday: boolean; isWeekend: boolean; label: string }> = [];
    for (let i = 0; i < totalDays; i++) {
      const d = addDays(rangeStart, i);
      out.push({
        date: d,
        isToday: d.getTime() === today.getTime(),
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        label: String(d.getDate()),
      });
    }
    return out;
  }, [rangeStart, totalDays, today]);

  const renderRows = useMemo<RenderRow[]>(() => {
    const out: RenderRow[] = [];
    const seen = new Set<string>();
    for (const r of rows) {
      if (r.group && !seen.has(r.group)) {
        out.push({ type: 'header', group: r.group });
        seen.add(r.group);
      }
      out.push({ type: 'row', row: r });
    }
    return out;
  }, [rows]);

  const totalHeight = renderRows.length * rowHeight;

  const todayLeft = useMemo(() => {
    const idx = dayIndex(today);
    if (idx < 0 || idx >= totalDays) return -1;
    return idx * dayWidth + dayWidth / 2;
  }, [dayIndex, today, totalDays, dayWidth]);

  const dragRef = useRef<DragState | null>(null);
  const [dragPreview, setDragPreview] = useState<{
    id: string;
    left: number;
    width: number;
  } | null>(null);

  const barStyle = useCallback(
    (bar: GanttBar): CSSProperties => {
      const s = toDate(bar.start);
      const e = toDate(bar.end);
      if (!s || !e) return { display: 'none' };
      const startIdx = clampIndex(dayIndex(s));
      const endIdx = clampIndex(dayIndex(e));
      const left = startIdx * dayWidth;
      const width = Math.max(dayWidth * 0.5, (endIdx - startIdx + 1) * dayWidth - 4);
      return {
        left: `${left}px`,
        width: `${width}px`,
        background: bar.color,
      };
    },
    [clampIndex, dayIndex, dayWidth],
  );

  const onBarPointerDown = (
    e: ReactPointerEvent,
    bar: GanttBar,
    row: GanttRow,
    action: GanttBarChangeMeta['action'],
  ) => {
    if (!editable || bar.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const s = toDate(bar.start) ?? rangeStart;
    const en = toDate(bar.end) ?? rangeStart;
    dragRef.current = {
      bar,
      row,
      action,
      startX: e.clientX,
      prev: { start: s, end: en },
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onBarPointerMove = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dDays = Math.round(dx / dayWidth);
    let newStart = drag.prev.start;
    let newEnd = drag.prev.end;
    if (drag.action === 'move') {
      newStart = addDays(drag.prev.start, dDays);
      newEnd = addDays(drag.prev.end, dDays);
    } else if (drag.action === 'resize-start') {
      newStart = addDays(drag.prev.start, dDays);
      if (newStart > drag.prev.end) newStart = drag.prev.end;
    } else if (drag.action === 'resize-end') {
      newEnd = addDays(drag.prev.end, dDays);
      if (newEnd < drag.prev.start) newEnd = drag.prev.start;
    }
    const startIdx = clampIndex(dayIndex(newStart));
    const endIdx = clampIndex(dayIndex(newEnd));
    setDragPreview({
      id: drag.bar.id,
      left: startIdx * dayWidth,
      width: Math.max(dayWidth * 0.5, (endIdx - startIdx + 1) * dayWidth - 4),
    });
  };

  const onBarPointerEnd = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dDays = Math.round(dx / dayWidth);
    let nextStart = drag.prev.start;
    let nextEnd = drag.prev.end;
    if (drag.action === 'move') {
      nextStart = addDays(drag.prev.start, dDays);
      nextEnd = addDays(drag.prev.end, dDays);
    } else if (drag.action === 'resize-start') {
      nextStart = addDays(drag.prev.start, dDays);
      if (nextStart > drag.prev.end) nextStart = drag.prev.end;
    } else if (drag.action === 'resize-end') {
      nextEnd = addDays(drag.prev.end, dDays);
      if (nextEnd < drag.prev.start) nextEnd = drag.prev.start;
    }
    if (dDays !== 0) {
      onBarChange?.({
        bar: drag.bar,
        row: drag.row,
        next: { start: nextStart, end: nextEnd },
        meta: { action: drag.action, prev: drag.prev },
      });
    }
    dragRef.current = null;
    setDragPreview(null);
  };

  const depLines = useMemo(() => {
    if (!dependencies?.length) return [];
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; key: string }> = [];
    const positions = new Map<string, { left: number; right: number; rowIdx: number }>();
    let visibleRowIdx = 0;
    for (const r of renderRows) {
      if (r.type === 'header') {
        visibleRowIdx++;
        continue;
      }
      const row = r.row!;
      for (const bar of row.bars) {
        const s = toDate(bar.start);
        const e = toDate(bar.end);
        if (!s || !e) continue;
        const startIdx = clampIndex(dayIndex(s));
        const endIdx = clampIndex(dayIndex(e));
        positions.set(bar.id, {
          left: startIdx * dayWidth,
          right: (endIdx + 1) * dayWidth,
          rowIdx: visibleRowIdx,
        });
      }
      visibleRowIdx++;
    }
    for (const dep of dependencies) {
      const from = positions.get(dep.from);
      const to = positions.get(dep.to);
      if (!from || !to) continue;
      const y1 = from.rowIdx * rowHeight + rowHeight / 2;
      const y2 = to.rowIdx * rowHeight + rowHeight / 2;
      lines.push({ x1: from.right, y1, x2: to.left, y2, key: `${dep.from}->${dep.to}` });
    }
    return lines;
  }, [dependencies, renderRows, clampIndex, dayIndex, dayWidth, rowHeight]);

  return (
    <div className={`cf-gantt cf-gantt--${size}`}>
      {caption && <p className="cf-gantt__caption">{caption}</p>}
      <div
        className="cf-gantt__frame"
        style={{ ['--gantt-row-h' as string]: `${rowHeight}px` } as CSSProperties}
      >
        <div
          className="cf-gantt__sidebar"
          style={{ width: `${labelWidth}px`, flex: `0 0 ${labelWidth}px` }}
        >
          <div className="cf-gantt__sidebar-head">名称</div>
          <div className="cf-gantt__sidebar-body">
            {renderRows.map((r, i) =>
              r.type === 'header' ? (
                <div key={`h-${i}`} className="cf-gantt__sidebar-group">
                  {r.group}
                </div>
              ) : (
                <button
                  key={r.row!.id}
                  type="button"
                  className="cf-gantt__sidebar-row"
                  onClick={() => onRowClick?.(r.row!)}
                >
                  {r.row!.label}
                </button>
              ),
            )}
          </div>
        </div>

        <div
          className="cf-gantt__viewport"
          onPointerMove={onBarPointerMove}
          onPointerUp={onBarPointerEnd}
          onPointerCancel={onBarPointerEnd}
        >
          <div className="cf-gantt__inner" style={{ width: `${totalWidth}px` }}>
            <div className="cf-gantt__axis">
              <div className="cf-gantt__axis-row">
                {monthTicks.map((t, i) => (
                  <div
                    key={i}
                    className="cf-gantt__axis-cell cf-gantt__axis-cell--month"
                    style={{ width: `${t.days * dayWidth}px` }}
                  >
                    {t.label}
                  </div>
                ))}
              </div>
              <div className="cf-gantt__axis-row">
                {dayCells.map((c, i) => (
                  <div
                    key={i}
                    className={
                      'cf-gantt__axis-cell cf-gantt__axis-cell--day' +
                      (c.isToday ? ' is-today' : '') +
                      (c.isWeekend ? ' is-weekend' : '')
                    }
                    style={{ width: `${dayWidth}px` }}
                  >
                    {c.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="cf-gantt__body" style={{ height: `${totalHeight}px` }}>
              <div className="cf-gantt__grid">
                {dayCells.map((c, i) => (
                  <div
                    key={i}
                    className={'cf-gantt__grid-col' + (c.isWeekend ? ' is-weekend' : '')}
                    style={{ left: `${i * dayWidth}px`, width: `${dayWidth}px` }}
                  />
                ))}
              </div>

              {showToday && todayLeft >= 0 && (
                <span className="cf-gantt__today" style={{ left: `${todayLeft}px` }} />
              )}

              {renderRows.map((r, i) =>
                r.type === 'header' ? (
                  <div
                    key={`hr-${i}`}
                    className="cf-gantt__group-row"
                    style={{ top: `${i * rowHeight}px`, height: `${rowHeight}px` }}
                  />
                ) : (
                  <div
                    key={r.row!.id}
                    className="cf-gantt__row"
                    style={{ top: `${i * rowHeight}px`, height: `${rowHeight}px` }}
                  >
                    {r.row!.bars.map((bar) => {
                      const overrideStyle =
                        dragPreview && dragPreview.id === bar.id
                          ? {
                              left: `${dragPreview.left}px`,
                              width: `${dragPreview.width}px`,
                              background: bar.color,
                            }
                          : barStyle(bar);
                      const w = Math.max(0, Math.min(1, bar.progress ?? 0));
                      return (
                        <div
                          key={bar.id}
                          className={
                            'cf-gantt__bar' +
                            (bar.disabled ? ' is-disabled' : '') +
                            (editable && !bar.disabled ? ' is-editable' : '')
                          }
                          style={overrideStyle as CSSProperties}
                          onClick={() => {
                            if (dragRef.current) return;
                            onBarClick?.(bar, r.row!);
                          }}
                          onPointerDown={(e) => onBarPointerDown(e, bar, r.row!, 'move')}
                        >
                          {editable && !bar.disabled && (
                            <span
                              className="cf-gantt__bar-handle cf-gantt__bar-handle--start"
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                onBarPointerDown(e, bar, r.row!, 'resize-start');
                              }}
                            />
                          )}
                          {bar.progress != null && (
                            <span
                              className="cf-gantt__bar-progress"
                              style={{ width: `${w * 100}%` }}
                            />
                          )}
                          <span className="cf-gantt__bar-label">{bar.label}</span>
                          {editable && !bar.disabled && (
                            <span
                              className="cf-gantt__bar-handle cf-gantt__bar-handle--end"
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                onBarPointerDown(e, bar, r.row!, 'resize-end');
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ),
              )}

              {depLines.length > 0 && (
                <svg
                  className="cf-gantt__deps"
                  width={totalWidth}
                  height={totalHeight}
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="cf-gantt-arrow"
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M0 0L10 5L0 10z" fill="currentColor" />
                    </marker>
                  </defs>
                  {depLines.map((l) => (
                    <path
                      key={l.key}
                      d={`M${l.x1} ${l.y1} L${l.x1 + 12} ${l.y1} L${l.x1 + 12} ${l.y2} L${l.x2} ${l.y2}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      markerEnd="url(#cf-gantt-arrow)"
                    />
                  ))}
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
