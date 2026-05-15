import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  type SortableAxis,
  type SortableItemSnapshot,
  snapshotItems,
  findInsertIndex,
  shiftForIndex,
} from './variants';

export interface SortableReorderEvent<T> {
  from: number;
  to: number;
  items: T[];
}

export interface SortableRenderProps<T> {
  item: T;
  index: number;
  isDragging: boolean;
}

export interface SortableProps<T> {
  items: T[];
  itemKey: keyof T | ((item: T, index: number) => string | number);
  axis?: SortableAxis;
  handle?: string;
  disabled?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  threshold?: number;
  animation?: number;
  className?: string;
  onChange?: (items: T[]) => void;
  onReorder?: (event: SortableReorderEvent<T>) => void;
  onDragStart?: (payload: { item: T; index: number }) => void;
  onDragEnd?: (payload: { item: T; index: number; cancelled: boolean }) => void;
  children: (renderProps: SortableRenderProps<T>) => ReactNode;
}

export function Sortable<T>({
  items,
  itemKey,
  axis = 'y',
  handle,
  disabled,
  tag = 'div',
  threshold = 4,
  animation = 180,
  className,
  onChange,
  onReorder,
  onDragStart,
  onDragEnd,
  children,
}: SortableProps<T>) {
  const hostRef = useRef<HTMLElement | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [lateral, setLateral] = useState(0);

  const stateRef = useRef({
    pointerId: -1,
    snaps: [] as SortableItemSnapshot[],
    startX: 0,
    startY: 0,
    started: false,
    cancelled: false,
    activeEl: null as HTMLElement | null,
    items,
    insertIndex: 0,
    draggingIndex: 0,
  });
  stateRef.current.items = items;

  const getKeyOf = useCallback(
    (item: T, index: number): string | number => {
      if (typeof itemKey === 'function') return itemKey(item, index);
      return item[itemKey] as unknown as string | number;
    },
    [itemKey],
  );

  const cleanup = useCallback((cancelled: boolean) => {
    const s = stateRef.current;
    const from = s.draggingIndex;
    const to = s.insertIndex;
    if (s.activeEl) {
      try {
        s.activeEl.releasePointerCapture(s.pointerId);
      } catch {}
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('keydown', onKeyDown);
    if (s.started && !cancelled && from !== to) {
      const next = s.items.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onChange?.(next);
      onReorder?.({ from, to, items: next });
    }
    onDragEnd?.({
      item: s.items[from],
      index: from,
      cancelled: cancelled || from === to,
    });
    setDraggingIndex(null);
    setInsertIndex(null);
    setOffset(0);
    setLateral(0);
    s.snaps = [];
    s.started = false;
    s.activeEl = null;
    s.pointerId = -1;
    s.cancelled = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, onReorder, onDragEnd]);

  const onPointerMove = useCallback((ev: PointerEvent) => {
    const s = stateRef.current;
    if (ev.pointerId !== s.pointerId) return;
    const dx = ev.clientX - s.startX;
    const dy = ev.clientY - s.startY;
    const axisD = axis === 'y' ? dy : dx;
    const lat = axis === 'y' ? dx : dy;
    if (!s.started) {
      if (Math.hypot(dx, dy) < threshold) return;
      s.started = true;
      if (hostRef.current) s.snaps = snapshotItems(hostRef.current, axis);
      onDragStart?.({ item: s.items[s.draggingIndex], index: s.draggingIndex });
    }
    setOffset(axisD);
    setLateral(lat);
    const ins = findInsertIndex(s.snaps, s.draggingIndex, axisD, axis);
    s.insertIndex = ins;
    setInsertIndex(ins);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axis, threshold, onDragStart]);

  const onPointerUp = useCallback(() => {
    cleanup(stateRef.current.cancelled);
  }, [cleanup]);

  const onPointerCancel = useCallback(() => {
    stateRef.current.cancelled = true;
    cleanup(true);
  }, [cleanup]);

  const onKeyDown = useCallback((ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      stateRef.current.cancelled = true;
      cleanup(true);
    }
  }, [cleanup]);

  const onPointerDown = useCallback((ev: React.PointerEvent<HTMLDivElement>, index: number) => {
    if (ev.button !== undefined && ev.button !== 0) return;
    if (disabled) return;
    const target = ev.currentTarget;
    if (handle) {
      const t = ev.target as Element | null;
      if (!t || !t.closest(handle) || !target.contains(t)) return;
    }
    const s = stateRef.current;
    s.draggingIndex = index;
    s.insertIndex = index;
    s.pointerId = ev.pointerId;
    s.startX = ev.clientX;
    s.startY = ev.clientY;
    s.started = false;
    s.cancelled = false;
    s.activeEl = target;
    setDraggingIndex(index);
    setInsertIndex(index);
    try {
      target.setPointerCapture(ev.pointerId);
    } catch {}
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    window.addEventListener('keydown', onKeyDown);
  }, [disabled, handle, onPointerMove, onPointerUp, onPointerCancel, onKeyDown]);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onPointerMove, onPointerUp, onPointerCancel, onKeyDown]);

  function transformFor(index: number): string {
    const s = stateRef.current;
    if (draggingIndex == null || !s.started) return '';
    if (index === draggingIndex) {
      const tx = axis === 'y' ? lateral : offset;
      const ty = axis === 'y' ? offset : lateral;
      return `translate3d(${tx}px, ${ty}px, 0)`;
    }
    const ins = insertIndex ?? draggingIndex;
    const draggedSize = s.snaps[draggingIndex]?.size ?? 0;
    const shift = shiftForIndex(index, draggingIndex, ins, draggedSize);
    if (shift === 0) return '';
    return axis === 'y'
      ? `translate3d(0, ${shift}px, 0)`
      : `translate3d(${shift}px, 0, 0)`;
  }

  function transitionFor(index: number): string {
    if (draggingIndex == null) return '';
    if (index === draggingIndex) return 'none';
    return `transform ${animation}ms var(--ease-out)`;
  }

  const Tag: any = tag;
  return (
    <Tag
      ref={(el: HTMLElement | null) => {
        hostRef.current = el;
      }}
      className={[
        'cf-sortable',
        `cf-sortable--${axis}`,
        draggingIndex != null && 'is-dragging',
        disabled && 'is-disabled',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map((item, index) => {
        const isDragging = draggingIndex === index;
        const tx = transformFor(index);
        const isShifted = !isDragging && tx !== '';
        const style: CSSProperties = {
          transform: tx || undefined,
          transition: transitionFor(index) || undefined,
        };
        return (
          <div
            key={getKeyOf(item, index)}
            className={[
              'cf-sortable__item',
              isDragging && 'is-dragging',
              isShifted && 'is-shifted',
            ]
              .filter(Boolean)
              .join(' ')}
            style={style}
            onPointerDown={(ev) => onPointerDown(ev, index)}
          >
            {children({ item, index, isDragging })}
          </div>
        );
      })}
    </Tag>
  );
}
