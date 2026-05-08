import { useState, type FormEvent } from 'react';
import { type SearchInputProps, searchInputClass } from './variants';

export function SearchInput(props: SearchInputProps) {
  const {
    value,
    defaultValue = '',
    placeholder = '搜索…',
    size = 'md',
    disabled = false,
    clearable = true,
    shortcut,
    onChange,
    onSearch,
    onClear,
  } = props;
  const controlled = value != null;
  const [inner, setInner] = useState<string>(defaultValue);
  const v = controlled ? (value as string) : inner;

  function update(next: string) {
    if (!controlled) setInner(next);
    onChange?.(next);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    onSearch?.(v);
  }
  function clear() {
    update('');
    onClear?.();
  }

  return (
    <form className={searchInputClass({ size })} role="search" onSubmit={submit}>
      <span className="cf-search__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={7} cy={7} r={5} />
          <path d="M14 14l-3-3" />
        </svg>
      </span>
      <input
        className="cf-search__native"
        type="search"
        value={v}
        placeholder={placeholder}
        disabled={disabled || undefined}
        onChange={(e) => update(e.target.value)}
      />
      {clearable && v && !disabled && (
        <button type="button" className="cf-search__clear" aria-label="清空" onClick={clear}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      )}
      {shortcut && <kbd className="cf-search__shortcut">{shortcut}</kbd>}
    </form>
  );
}
