import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import type { EditableProps } from './variants';

export function Editable(props: EditableProps) {
  const {
    value,
    placeholder,
    multiline = false,
    disabled = false,
    showHint = true,
    commitOnEnter = true,
    maxLength,
    size = 'md',
    ariaLabel,
    className,
    validate,
    onChange,
    onCommit,
    onCancel,
    onEditStart,
    onInvalid,
  } = props;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [editing]);

  const cls = [
    'cf-editable',
    `cf-editable--${size}`,
    editing ? 'cf-editable--editing' : '',
    disabled ? 'cf-editable--disabled' : '',
    error ? 'cf-editable--invalid' : '',
    multiline ? 'cf-editable--multiline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const startEdit = useCallback(() => {
    if (disabled || editing) return;
    setDraft(value);
    setError(null);
    setEditing(true);
    onEditStart?.();
  }, [disabled, editing, value, onEditStart]);

  const commit = useCallback(async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }
    if (validate) {
      const result = await validate(draft);
      if (result !== true) {
        const msg = typeof result === 'string' ? result : '校验未通过';
        setError(msg);
        onInvalid?.(msg);
        return;
      }
    }
    const previous = value;
    onChange?.(draft);
    onCommit?.({ value: draft, previous });
    setEditing(false);
    setError(null);
  }, [draft, value, validate, onChange, onCommit, onInvalid]);

  const cancel = useCallback(() => {
    setEditing(false);
    setError(null);
    onCancel?.();
  }, [onCancel]);

  function onKeydown(ev: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      cancel();
      return;
    }
    if (ev.key === 'Enter' && commitOnEnter) {
      if (multiline && !(ev.ctrlKey || ev.metaKey)) return;
      ev.preventDefault();
      commit();
    }
  }

  const isEmpty = !value;
  const displayText = value || placeholder || '';

  return (
    <span
      className={cls}
      role="button"
      tabIndex={disabled || editing ? -1 : 0}
      aria-label={ariaLabel}
      onClick={startEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startEdit();
        }
      }}
    >
      {!editing ? (
        <>
          <span
            className={[
              'cf-editable__text',
              isEmpty ? 'cf-editable__text--placeholder' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {displayText}
          </span>
          {showHint && !disabled ? (
            <svg className="cf-editable__pencil" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M14.06 9.02 14.98 9.94 5.92 19H5v-.92L14.06 9.02M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34a.98.98 0 0 0-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
                fill="currentColor"
              />
            </svg>
          ) : null}
        </>
      ) : multiline ? (
        <>
          <textarea
            ref={(el) => {
              inputRef.current = el;
            }}
            className="cf-editable__input cf-editable__textarea"
            value={draft}
            maxLength={maxLength}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeydown}
            onBlur={commit}
            onClick={(e) => e.stopPropagation()}
          />
          {error ? <span className="cf-editable__error">{error}</span> : null}
        </>
      ) : (
        <>
          <input
            ref={(el) => {
              inputRef.current = el;
            }}
            type="text"
            className="cf-editable__input"
            value={draft}
            maxLength={maxLength}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeydown}
            onBlur={commit}
            onClick={(e) => e.stopPropagation()}
          />
          {error ? <span className="cf-editable__error">{error}</span> : null}
        </>
      )}
    </span>
  );
}
