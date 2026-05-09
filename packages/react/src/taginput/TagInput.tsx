import {
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';
import { tagInputClass, type TagInputProps } from './variants';

export function TagInput(props: TagInputProps) {
  const {
    value,
    defaultValue = [],
    placeholder = '输入后回车添加',
    variant = 'outline',
    size = 'md',
    tone = 'neutral',
    disabled = false,
    error = false,
    max,
    separators = ['Enter'],
    unique = true,
    trim = true,
    validate,
    name,
    id,
    className,
    onChange,
    onAdd,
    onRemove,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const tags = isControlled ? (value as string[]) : internal;

  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function commit(next: string[]) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function tryAdd(raw: string): boolean {
    if (disabled) return false;
    const v = trim ? raw.trim() : raw;
    if (!v) return false;
    if (unique && tags.includes(v)) return false;
    if (max != null && tags.length >= max) return false;
    if (validate && !validate(v)) return false;
    const next = [...tags, v];
    commit(next);
    onAdd?.(v);
    return true;
  }

  function removeAt(i: number) {
    if (disabled) return;
    const tag = tags[i];
    const next = tags.filter((_, idx) => idx !== i);
    commit(next);
    onRemove?.(tag, i);
  }

  function isSeparator(e: KeyboardEvent<HTMLInputElement>): boolean {
    return separators.some((s) => {
      if (s === 'Enter') return e.key === 'Enter';
      if (s === 'Tab') return e.key === 'Tab';
      if (s === ',') return e.key === ',';
      if (s === ' ') return e.key === ' ';
      return e.key === s;
    });
  }

  function onKeydown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (isSeparator(e)) {
      if (draft.trim()) {
        e.preventDefault();
        if (tryAdd(draft)) setDraft('');
      } else if (e.key === 'Enter') {
        e.preventDefault();
      }
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      e.preventDefault();
      removeAt(tags.length - 1);
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text');
    if (!text) return;
    const parts = text
      .split(/[,\n\t]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length <= 1) return;
    e.preventDefault();
    let added = false;
    for (const p of parts) if (tryAdd(p)) added = true;
    if (added) setDraft('');
  }

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    setDraft(e.target.value);
  }

  function focus() {
    inputRef.current?.focus();
  }

  return (
    <div
      className={tagInputClass({
        variant,
        size,
        disabled,
        error,
        focused,
        className,
      })}
      onClick={focus}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className={`cf-taginput__chip cf-taginput__chip--${tone}`}
        >
          <span className="cf-taginput__chip-label">{tag}</span>
          {!disabled ? (
            <button
              type="button"
              className="cf-taginput__chip-close"
              aria-label={`移除 ${tag}`}
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                removeAt(i);
              }}
            >
              ×
            </button>
          ) : null}
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        className="cf-taginput__input"
        value={draft}
        placeholder={tags.length ? '' : placeholder}
        disabled={disabled}
        autoComplete="off"
        onChange={onInput}
        onKeyDown={onKeydown}
        onPaste={onPaste}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
