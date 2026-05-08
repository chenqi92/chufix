import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  type NumberInputProps,
  numberInputClass,
  clampNumber,
  inferPrecision,
} from './variants';

export function NumberInput(props: NumberInputProps) {
  const {
    value,
    defaultValue = null,
    placeholder,
    size = 'md',
    disabled = false,
    min,
    max,
    step = 1,
    precision,
    hideSteppers = false,
    onChange,
  } = props;

  const controlled = value !== undefined;
  const [inner, setInner] = useState<number | null>(defaultValue);
  const current = controlled ? (value as number | null) : inner;
  const prec = inferPrecision(step, precision);

  const fmt = (v: number | null): string =>
    v == null || Number.isNaN(v) ? '' : v.toFixed(prec);

  const [text, setText] = useState<string>(fmt(current));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setText(fmt(current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, prec]);

  function emit(v: number | null) {
    if (!controlled) setInner(v);
    onChange?.(v);
  }

  function commit(raw: string) {
    const trimmed = raw.trim();
    if (trimmed === '') {
      emit(null);
      setText('');
      return;
    }
    const n = Number(trimmed);
    if (Number.isNaN(n)) {
      setText(fmt(current));
      return;
    }
    const clamped = clampNumber(n, min, max);
    emit(clamped);
    setText(fmt(clamped));
  }

  function bumpStep(direction: 1 | -1) {
    if (disabled) return;
    const base = current == null ? 0 : current;
    const next = clampNumber(parseFloat((base + direction * step).toFixed(10)), min, max);
    emit(next);
    setText(fmt(next));
  }

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      bumpStep(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      bumpStep(-1);
    } else if (e.key === 'Enter') {
      commit(text);
    }
  }

  const canInc = !disabled && (typeof max !== 'number' || (current ?? 0) + step <= max + 1e-9);
  const canDec = !disabled && (typeof min !== 'number' || (current ?? 0) - step >= min - 1e-9);

  return (
    <div className={numberInputClass({ size })} data-disabled={disabled || undefined}>
      <input
        ref={inputRef}
        className="cf-number__native"
        type="text"
        inputMode="decimal"
        value={text}
        placeholder={placeholder}
        disabled={disabled || undefined}
        onChange={onInput}
        onBlur={() => commit(text)}
        onKeyDown={onKeyDown}
      />
      {!hideSteppers && (
        <div className="cf-number__steppers">
          <button
            type="button"
            className="cf-number__step"
            tabIndex={-1}
            disabled={!canInc}
            aria-label="增加"
            onClick={() => bumpStep(1)}
          >▲</button>
          <button
            type="button"
            className="cf-number__step"
            tabIndex={-1}
            disabled={!canDec}
            aria-label="减少"
            onClick={() => bumpStep(-1)}
          >▼</button>
        </div>
      )}
    </div>
  );
}
