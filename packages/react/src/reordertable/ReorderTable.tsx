import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  type SortableItemSnapshot,
  snapshotItems,
  findInsertIndex,
  shiftForIndex,
} from '../sortable/variants';
import { type ReorderColumn, gridTemplateForColumns } from './variants';

export interface ReorderTableReorderEvent<T> {
  from: number;
  to: number;
  rows: T[];
}

export interface ReorderTableProps<T> {
  rows: T[];
  columns: ReorderColumn<T>[];
  rowKey: keyof T | ((row: T, index: number) => string | number);
  disabled?: boolean;
  handleWidth?: string;
  striped?: boolean;
  animation?: number;
  threshold?: number;
  className?: string;
  onChange?: (rows: T[]) => void;
  onReorder?: (event: ReorderTableReorderEvent<T>) => void;
}

function GripIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      {[4, 8, 12].flatMap((y) => [
        <circle key={`l${y}`} cx={6} cy={y} r={1.2} fill="currentColor" />,
        <circle key={`r${y}`} cx={10} cy={y} r={1.2} fill="currentColor" />,
      ])}
    </svg>
  );
}

export function ReorderTable<T>({
  rows,
  columns,
  rowKey,
  disabled,
  handleWidth = '36px',
  striped = false,
  animation = 180,
  threshold = 4,
  className,
  onChange,
  onReorder,
}: ReorderTableProps<T>) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const stateRef = useRef({
    pointerId: -1,
    snaps: [] as SortableItemSnapshot[],
    startY: 0,
    started: false,
    cancelled: false,
    activeEl: null as HTMLElement | null,
    rows,
    insertIndex: 0,
    draggingIndex: 0,
  });
  stateRef.current.rows = rows;

  const getKeyOf = useCallback(
    (row: T, index: number): string | number => {
      if (typeof rowKey === 'function') return rowKey(row, index);
      return row[rowKey] as unknown as string | number;
    },
    [rowKey],
  );

  const cleanup = useCallback(
    (cancelled: boolean) => {
      const s = stateRef.current;
      const from = s.draggingIndex;
      const to = s.insertIndex;
      if (s.activeEl) {
        try {
          s.activeEl.releasePointerCapture(s.pointerId);
        } catch {}
      }
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('keydown', onKey);
      if (s.started && !cancelled && from !== to) {
        const next = s.rows.slice();
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange?.(next);
        onReorder?.({ from, to, rows: next });
      }
      setDraggingIndex(null);
      setInsertIndex(null);
      setOffset(0);
      s.snaps = [];
      s.started = false;
      s.activeEl = null;
      s.pointerId = -1;
      s.cancelled = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [onChange, onReorder],
  );

  const onMove = useCallback(
    (ev: PointerEvent) => {
      const s = stateRef.current;
      if (ev.pointerId !== s.pointerId) return;
      const dy = ev.clientY - s.startY;
      if (!s.started) {
        if (Math.abs(dy) < threshold) return;
        s.started = true;
        if (bodyRef.current) s.snaps = snapshotItems(bodyRef.current, 'y');
      }
      setOffset(dy);
      const ins = findInsertIndex(s.snaps, s.draggingIndex, dy, 'y');
      s.insertIndex = ins;
      setInsertIndex(ins);
    },
    [threshold],
  );

  const onUp = useCallback(() => {
    cleanup(stateRef.current.cancelled);
  }, [cleanup]);

  const onCancel = useCallback(() => {
    stateRef.current.cancelled = true;
    cleanup(true);
  }, [cleanup]);

  const onKey = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        stateRef.current.cancelled = true;
        cleanup(true);
      }
    },
    [cleanup],
  );

  const onHandleDown = useCallback(
    (ev: React.PointerEvent<HTMLButtonElement>, index: number) => {
      if (ev.button !== undefined && ev.button !== 0) return;
      if (disabled) return;
      ev.stopPropagation();
      const rowEl = (ev.currentTarget.closest('.cf-rtable__row') as HTMLElement) ?? null;
      if (!rowEl) return;
      const s = stateRef.current;
      s.draggingIndex = index;
      s.insertIndex = index;
      s.pointerId = ev.pointerId;
      s.startY = ev.clientY;
      s.started = false;
      s.cancelled = false;
      s.activeEl = rowEl;
      setDraggingIndex(index);
      setInsertIndex(index);
      try {
        rowEl.setPointerCapture(ev.pointerId);
      } catch {}
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onCancel);
      window.addEventListener('keydown', onKey);
    },
    [disabled, onMove, onUp, onCancel, onKey],
  );

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('keydown', onKey);
    };
  }, [onMove, onUp, onCancel, onKey]);

  function transformFor(index: number): string {
    const s = stateRef.current;
    if (draggingIndex == null || !s.started) return '';
    if (index === draggingIndex) {
      return `translate3d(0, ${offset}px, 0)`;
    }
    const ins = insertIndex ?? draggingIndex;
    const draggedSize = s.snaps[draggingIndex]?.size ?? 0;
    const shift = shiftForIndex(index, draggingIndex, ins, draggedSize);
    return shift === 0 ? '' : `translate3d(0, ${shift}px, 0)`;
  }
  function transitionFor(index: number): string {
    if (draggingIndex == null) return '';
    if (index === draggingIndex) return 'none';
    return `transform ${animation}ms var(--ease-out)`;
  }

  const template = gridTemplateForColumns(columns, handleWidth);

  return (
    <div
      className={[
        'cf-rtable',
        disabled && 'is-disabled',
        striped && 'is-striped',
        draggingIndex !== null && 'is-dragging',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="cf-rtable__head" style={{ gridTemplateColumns: template }}>
        <div className="cf-rtable__cell cf-rtable__cell--handle" />
        {columns.map((col) => (
          <div
            key={col.key}
            className={[
              'cf-rtable__cell',
              col.align && `cf-rtable__cell--${col.align}`,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {col.label ?? ''}
          </div>
        ))}
      </div>
      <div ref={bodyRef} className="cf-rtable__body">
        {rows.map((row, index) => {
          const isDragging = draggingIndex === index;
          const style: CSSProperties = {
            gridTemplateColumns: template,
            transform: transformFor(index) || undefined,
            transition: transitionFor(index) || undefined,
          };
          return (
            <div
              key={getKeyOf(row, index)}
              className={['cf-rtable__row', isDragging && 'is-dragging'].filter(Boolean).join(' ')}
              style={style}
            >
              <button
                type="button"
                className="cf-rtable__handle"
                disabled={disabled}
                aria-label="drag to reorder"
                onPointerDown={(e) => onHandleDown(e, index)}
              >
                <GripIcon />
              </button>
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={[
                    'cf-rtable__cell',
                    col.align && `cf-rtable__cell--${col.align}`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {col.render
                    ? col.render(row, index)
                    : (row[col.key as keyof T] as unknown as React.ReactNode) ?? ''}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
