import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import {
  clamp,
  snap,
  type RangeSliderProps,
  type RangeValue,
} from './variants';

export function RangeSlider(props: RangeSliderProps) {
  const {
    value,
    onChange,
    onCommit,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    tone = 'default',
    disabled = false,
    showTooltip = true,
  } = props;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

  const span = Math.max(1, max - min);
  const lo = Math.min(value[0], value[1]);
  const hi = Math.max(value[0], value[1]);
  const loPct = ((lo - min) / span) * 100;
  const hiPct = ((hi - min) / span) * 100;

  const cls = [
    'cf-rangeslider',
    `cf-rangeslider--${size}`,
    `cf-rangeslider--${tone}`,
    disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const valueAt = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return min;
    const rect = el.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return clamp(snap(min + ratio * span, step), min, max);
  };

  const startDrag =
    (which: 'min' | 'max') => (e: PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      setDragging(which);
      e.currentTarget.setPointerCapture(e.pointerId);
    };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    e.preventDefault();
    const v = valueAt(e.clientX);
    if (dragging === 'min') {
      const nLo = Math.min(v, hi);
      if (nLo !== lo) onChange([nLo, hi]);
    } else {
      const nHi = Math.max(v, lo);
      if (nHi !== hi) onChange([lo, nHi]);
    }
  };

  const endDrag = (e: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(null);
    onCommit?.([lo, hi]);
  };

  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const v = valueAt(e.clientX);
    const distLo = Math.abs(v - lo);
    const distHi = Math.abs(v - hi);
    const next: RangeValue =
      distLo <= distHi ? [Math.min(v, hi), hi] : [lo, Math.max(v, lo)];
    onChange(next);
    onCommit?.(next);
  };

  const onKeyDown =
    (which: 'min' | 'max') => (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      let delta = 0;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
      else if (e.key === 'PageDown') delta = -step * 10;
      else if (e.key === 'PageUp') delta = step * 10;
      else if (e.key === 'Home') {
        return onChange(which === 'min' ? [min, hi] : [lo, lo]);
      } else if (e.key === 'End') {
        return onChange(which === 'max' ? [lo, max] : [hi, hi]);
      }
      if (delta === 0) return;
      e.preventDefault();
      if (which === 'min') {
        onChange([clamp(lo + delta, min, hi), hi]);
      } else {
        onChange([lo, clamp(hi + delta, lo, max)]);
      }
    };

  return (
    <div className={cls}>
      <div
        ref={trackRef}
        className="cf-rangeslider__track"
        onClick={onTrackClick}
      >
        <div
          className="cf-rangeslider__fill"
          style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }}
        />
        <button
          type="button"
          className="cf-rangeslider__knob"
          style={{ left: `${loPct}%` }}
          aria-valuemin={min}
          aria-valuemax={hi}
          aria-valuenow={lo}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          onPointerDown={startDrag('min')}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown('min')}
        >
          {showTooltip ? (
            <span className="cf-rangeslider__tooltip">{lo}</span>
          ) : null}
        </button>
        <button
          type="button"
          className="cf-rangeslider__knob"
          style={{ left: `${hiPct}%` }}
          aria-valuemin={lo}
          aria-valuemax={max}
          aria-valuenow={hi}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          onPointerDown={startDrag('max')}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown('max')}
        >
          {showTooltip ? (
            <span className="cf-rangeslider__tooltip">{hi}</span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
