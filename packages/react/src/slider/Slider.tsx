import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import {
  type SliderProps,
  sliderClass,
  clampStep,
} from './variants';

export function Slider(props: SliderProps) {
  const {
    value,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    tone = 'primary',
    disabled = false,
    showValue = false,
    ticks = false,
    onChange,
    onChangeEnd,
  } = props;

  const controlled = value !== undefined;
  const [inner, setInner] = useState<number>(defaultValue);
  const current = clampStep(controlled ? (value as number) : inner, min, max, step);

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const interactionValueRef = useRef(current);

  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100;

  const tickPositions: number[] = [];
  if (ticks && step > 0 && (max - min) / step <= 50) {
    for (let v = min; v <= max; v += step) {
      tickPositions.push(((v - min) / (max - min)) * 100);
    }
  }

  function commit(
    v: number,
    meta: Parameters<NonNullable<SliderProps['onChange']>>[1],
  ): boolean {
    interactionValueRef.current = v;
    if (v === current) return false;
    if (!controlled) setInner(v);
    onChange?.(v, meta);
    return true;
  }
  function valueFromX(clientX: number): number {
    if (!trackRef.current) return current;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return clampStep(min + ratio * (max - min), min, max, step);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    draggingRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const next = valueFromX(e.clientX);
    commit(next, { event: e, value: next, source: 'pointer' });
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const next = valueFromX(e.clientX);
    commit(next, { event: e, value: next, source: 'pointer' });
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    onChangeEnd?.(interactionValueRef.current, {
      event: e,
      value: interactionValueRef.current,
      source: 'pointer',
    });
  }
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    let dir = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') dir = 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') dir = -1;
    else if (e.key === 'Home') {
      e.preventDefault();
      if (commit(min, { event: e, value: min, source: 'keyboard' })) {
        onChangeEnd?.(min, { event: e, value: min, source: 'keyboard' });
      }
      return;
    }
    else if (e.key === 'End') {
      e.preventDefault();
      if (commit(max, { event: e, value: max, source: 'keyboard' })) {
        onChangeEnd?.(max, { event: e, value: max, source: 'keyboard' });
      }
      return;
    }
    else if (e.key === 'PageUp') dir = 10;
    else if (e.key === 'PageDown') dir = -10;
    if (dir !== 0) {
      e.preventDefault();
      const next = clampStep(current + dir * step, min, max, step);
      if (commit(next, { event: e, value: next, source: 'keyboard' })) {
        onChangeEnd?.(next, { event: e, value: next, source: 'keyboard' });
      }
    }
  }

  return (
    <div className={sliderClass({ size, tone })} data-disabled={disabled || undefined}>
      <div
        ref={trackRef}
        className="cf-slider__track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="cf-slider__rail" />
        <div className="cf-slider__fill" style={{ width: `${percent}%` }} />
        {tickPositions.map((p, i) => (
          <div key={i} className="cf-slider__tick" style={{ left: `${p}%` }} />
        ))}
        <div
          className="cf-slider__thumb"
          style={{ left: `${percent}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-disabled={disabled || undefined}
          onKeyDown={onKeyDown}
        >
          {showValue && <span className="cf-slider__bubble">{current}</span>}
        </div>
      </div>
    </div>
  );
}
