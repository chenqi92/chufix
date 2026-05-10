import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import {
  type NumberInputChangeReason,
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
    id,
    name,
    min,
    max,
    step = 1,
    precision,
    hideSteppers = false,
    onChange,
    onInput,
    onStep,
    onInvalid,
    onFocus,
    onBlur,
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

  function emit(v: number | null, raw: string, reason: NumberInputChangeReason) {
    if (!controlled) setInner(v);
    onChange?.(v, { raw, reason });
  }

  function commit(raw: string, reason: NumberInputChangeReason = 'commit') {
    const trimmed = raw.trim();
    if (trimmed === '') {
      emit(null, raw, reason);
      setText('');
      return;
    }
    const n = Number(trimmed);
    if (Number.isNaN(n)) {
      onInvalid?.({ raw, reason: 'nan' });
      setText(fmt(current));
      return;
    }
    const clamped = clampNumber(n, min, max);
    emit(clamped, raw, reason);
    setText(fmt(clamped));
  }

  function setCommittedValue(next: number, raw: string, reason: NumberInputChangeReason) {
    const clamped = clampNumber(next, min, max);
    emit(clamped, raw, reason);
    setText(fmt(clamped));
    return clamped;
  }

  function bumpStep(direction: 1 | -1) {
    if (disabled) return;
    const base = current == null ? 0 : current;
    const next = setCommittedValue(
      parseFloat((base + direction * step).toFixed(10)),
      String(base),
      'step',
    );
    onStep?.(next, { direction });
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    onInput?.(e.target.value);
  }
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      bumpStep(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      bumpStep(-1);
    } else if (e.key === 'Enter') {
      commit(text, 'enter');
    } else if (e.key === 'Home' && typeof min === 'number') {
      e.preventDefault();
      setCommittedValue(min, String(min), 'home');
    } else if (e.key === 'End' && typeof max === 'number') {
      e.preventDefault();
      setCommittedValue(max, String(max), 'end');
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      const base = current == null ? 0 : current;
      setCommittedValue(base + step * 10, String(base), 'step');
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      const base = current == null ? 0 : current;
      setCommittedValue(base - step * 10, String(base), 'step');
    }
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    commit(text, 'blur');
    onBlur?.(e);
  }

  const canInc = !disabled && (typeof max !== 'number' || (current ?? 0) < max - 1e-9);
  const canDec = !disabled && (typeof min !== 'number' || (current ?? 0) > min + 1e-9);

  return (
    <div className={numberInputClass({ size })} data-disabled={disabled || undefined}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        className="cf-number__native"
        type="text"
        role="spinbutton"
        inputMode="decimal"
        value={text}
        placeholder={placeholder}
        disabled={disabled || undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current ?? undefined}
        onChange={handleInput}
        onBlur={handleBlur}
        onFocus={onFocus}
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
