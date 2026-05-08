import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';
import { isValidChar, sanitize, type OtpInputProps } from './variants';

export function OtpInput(props: OtpInputProps) {
  const {
    value,
    defaultValue = '',
    onChange,
    onComplete,
    length = 6,
    size = 'md',
    type = 'numeric',
    disabled = false,
    autoFocus = false,
    separatorAt,
  } = props;

  const controlled = value !== undefined;
  const [inner, setInner] = useState(() => sanitize(defaultValue, type).slice(0, length));
  const current = controlled ? sanitize(value!, type).slice(0, length) : inner;

  const cells = useMemo(
    () => Array.from({ length }, (_, i) => current[i] ?? ''),
    [current, length],
  );

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus();
  }, [autoFocus]);

  const commit = useCallback(
    (next: string[]) => {
      const v = next.join('');
      if (!controlled) setInner(v);
      onChange?.(v);
      if (v.length === length && !next.includes('')) onComplete?.(v);
    },
    [controlled, onChange, onComplete, length],
  );

  function focusAt(i: number) {
    const idx = Math.max(0, Math.min(length - 1, i));
    const el = inputs.current[idx];
    if (el) {
      el.focus();
      el.select?.();
    }
  }

  function onInput(i: number, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const next = cells.slice();
    if (raw.length > 1) {
      const filtered = sanitize(raw, type);
      for (let k = 0; k < filtered.length && i + k < length; k++) next[i + k] = filtered[k];
      commit(next);
      const land = Math.min(i + filtered.length, length - 1);
      requestAnimationFrame(() => focusAt(land));
      return;
    }
    const ch = raw.slice(-1);
    if (ch === '') {
      next[i] = '';
      commit(next);
      return;
    }
    if (!isValidChar(ch, type)) return;
    next[i] = ch;
    commit(next);
    if (i < length - 1) requestAnimationFrame(() => focusAt(i + 1));
  }

  function onKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (!cells[i] && i > 0) {
        e.preventDefault();
        const next = cells.slice();
        next[i - 1] = '';
        commit(next);
        focusAt(i - 1);
      } else if (cells[i]) {
        const next = cells.slice();
        next[i] = '';
        commit(next);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusAt(i + 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusAt(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusAt(length - 1);
    }
  }

  function onPaste(i: number, e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const data = e.clipboardData.getData('text');
    const filtered = sanitize(data, type);
    if (!filtered) return;
    const next = cells.slice();
    for (let k = 0; k < filtered.length && i + k < length; k++) next[i + k] = filtered[k];
    commit(next);
    const land = Math.min(i + filtered.length, length - 1);
    requestAnimationFrame(() => focusAt(land));
  }

  const inputMode = type === 'numeric' ? 'numeric' : 'text';
  const cellPattern = type === 'numeric' ? '[0-9]' : '[0-9a-zA-Z]';

  return (
    <div className={`cf-otp cf-otp--${size}`} role="group">
      {cells.map((ch, i) => (
        <Fragment key={i}>
          <input
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            className="cf-otp__cell"
            inputMode={inputMode as 'numeric' | 'text'}
            pattern={cellPattern}
            disabled={disabled}
            value={ch}
            aria-label={`第 ${i + 1} 位`}
            autoComplete="one-time-code"
            onChange={(e) => onInput(i, e)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={(e) => onPaste(i, e)}
          />
          {separatorAt !== undefined && i + 1 === separatorAt && (
            <span className="cf-otp__separator" aria-hidden="true">–</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
