import { useState, type MouseEvent } from 'react';
import { ratingClass, type RatingProps } from './variants';

export function Rating(props: RatingProps) {
  const {
    value,
    defaultValue = 0,
    count = 5,
    allowHalf = false,
    readonly = false,
    disabled = false,
    size = 'md',
    showValue = false,
    className,
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? (value as number) : internal;

  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? current;

  function pickValue(i: number, e: MouseEvent<HTMLButtonElement>): number {
    if (!allowHalf) return i + 1;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const isLeft = (e.clientX - rect.left) / rect.width <= 0.5;
    return isLeft ? i + 0.5 : i + 1;
  }

  function onMove(i: number, e: MouseEvent<HTMLButtonElement>) {
    if (readonly || disabled) return;
    setHover(pickValue(i, e));
  }

  function onClick(i: number, e: MouseEvent<HTMLButtonElement>) {
    if (readonly || disabled) return;
    const v = pickValue(i, e);
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  function fillState(i: number) {
    if (display >= i + 1) return 'full';
    if (display >= i + 0.5) return 'half';
    return 'empty';
  }

  return (
    <div
      className={ratingClass({ size, readonly, disabled, className })}
      aria-label={`${current} / ${count}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const state = fillState(i);
        return (
          <button
            key={i}
            type="button"
            className={`cf-rating__star cf-rating__star--${state}`}
            disabled={disabled}
            aria-pressed={state !== 'empty'}
            onMouseMove={(e) => onMove(i, e)}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => onClick(i, e)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5l2.7 6.5 7 .6-5.3 4.6 1.6 6.8L12 17.7l-6 3.3 1.6-6.8-5.3-4.6 7-.6L12 2.5z" />
            </svg>
          </button>
        );
      })}
      {showValue ? (
        <span className="cf-rating__value">
          {current} <span className="cf-rating__total">/ {count}</span>
        </span>
      ) : null}
    </div>
  );
}
