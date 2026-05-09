import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { splitterClass, type SplitterProps } from './variants';

export function Splitter(props: SplitterProps) {
  const {
    value,
    defaultValue = 30,
    unit = '%',
    orientation = 'horizontal',
    min = 10,
    max = 90,
    disabled = false,
    collapsible = false,
    resizeFrom = 'start',
    start,
    end,
    className,
    onChange,
    onResize,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const size = isControlled ? (value as number) : internal;

  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  function commit(v: number) {
    const clamped = Math.max(min, Math.min(max, v));
    if (!isControlled) setInternal(clamped);
    onChange?.(clamped);
    onResize?.(clamped);
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || !rootRef.current) return;
    e.preventDefault();
    setDragging(true);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const rect = rootRef.current.getBoundingClientRect();
    const isH = orientation === 'horizontal';

    function onMove(ev: globalThis.PointerEvent) {
      const total = isH ? rect.width : rect.height;
      let raw = isH ? ev.clientX - rect.left : ev.clientY - rect.top;
      if (resizeFrom === 'end') raw = total - raw;
      const next = unit === '%' ? (raw / total) * 100 : raw;
      commit(next);
    }

    function onUp(ev: globalThis.PointerEvent) {
      setDragging(false);
      target.releasePointerCapture(ev.pointerId);
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointercancel', onUp);
    }

    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    const step = e.shiftKey ? 10 : 2;
    const isH = orientation === 'horizontal';
    const inc = (isH && e.key === 'ArrowRight') || (!isH && e.key === 'ArrowDown') ? step : 0;
    const dec = (isH && e.key === 'ArrowLeft') || (!isH && e.key === 'ArrowUp') ? step : 0;
    if (inc || dec) {
      e.preventDefault();
      const direction = resizeFrom === 'end' ? -1 : 1;
      commit(size + (inc - dec) * direction);
    } else if (e.key === 'Home') {
      e.preventDefault();
      commit(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      commit(max);
    } else if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      commit(size <= min + 1 ? defaultValue : min);
    }
  }

  const dim = orientation === 'horizontal' ? 'width' : 'height';
  const sizeValue = unit === '%' ? `${size}%` : `${size}px`;
  const startStyle: CSSProperties =
    resizeFrom === 'end'
      ? { [dim]: 'auto' as never, flex: '1 1 0' }
      : { [dim]: sizeValue as never, flex: 'none' };
  const endStyle: CSSProperties =
    resizeFrom === 'end'
      ? { [dim]: sizeValue as never, flex: 'none' }
      : { [dim]: 'auto' as never, flex: '1 1 0' };

  const cls = splitterClass({ orientation, disabled, dragging, className });

  return (
    <div ref={rootRef} className={cls}>
      <div className="cf-splitter__pane cf-splitter__pane--start" style={startStyle}>
        {start}
      </div>
      <div
        className="cf-splitter__handle"
        role="separator"
        aria-orientation={orientation}
        aria-valuenow={Math.round(size)}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <span className="cf-splitter__grip" aria-hidden="true" />
      </div>
      <div className="cf-splitter__pane cf-splitter__pane--end" style={endStyle}>
        {end}
      </div>
    </div>
  );
}
