import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  comboboxClass,
  defaultFilter,
  type ComboboxOption,
  type ComboboxProps,
  type ComboboxValue,
} from './variants';

export function Combobox(props: ComboboxProps) {
  const {
    value,
    defaultValue = null,
    options = [],
    placeholder = '请选择或输入',
    variant = 'outline',
    size = 'md',
    disabled = false,
    clearable = false,
    error = false,
    allowCreate = false,
    filter,
    emptyText = '无匹配项',
    className,
    id,
    name,
    onChange,
    onCreate,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<ComboboxValue>(defaultValue);
  const current = isControlled ? (value as ComboboxValue) : internal;

  const selected = useMemo(
    () => options.find((o) => o.value === current) ?? null,
    [options, current],
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>(selected?.label ?? '');
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!open) setQuery(selected?.label ?? '');
  }, [selected, open]);

  const filtered = useMemo(() => {
    const fn = filter ?? defaultFilter;
    return options.filter((o) => fn(query, o));
  }, [options, query, filter]);

  const showCreate =
    allowCreate &&
    query.trim().length > 0 &&
    !filtered.some((o) => o.label === query);

  const focusActive = useCallback((idx: number) => {
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelectorAll<HTMLElement>(
        '.cf-combobox__option',
      )[idx];
      el?.scrollIntoView({ block: 'nearest' });
    });
  }, []);

  const openMenu = useCallback(() => {
    if (disabled || open) return;
    setOpen(true);
    setQuery('');
    const idx = filtered.findIndex((o) => !o.disabled);
    setActiveIndex(idx);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [disabled, open, filtered]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setQuery(selected?.label ?? '');
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: globalThis.MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) closeMenu();
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, closeMenu]);

  function commit(v: ComboboxValue) {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  function pick(opt: ComboboxOption) {
    if (opt.disabled) return;
    commit(opt.value);
    setOpen(false);
    setQuery(opt.label);
  }

  function createTag() {
    const v = query.trim();
    if (!v) return;
    onCreate?.(v);
    commit(v);
    setOpen(false);
    setQuery(v);
  }

  function clear(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    commit(null);
    setQuery('');
    inputRef.current?.focus();
  }

  function moveActive(delta: number) {
    const total = filtered.length + (showCreate ? 1 : 0);
    if (!total) return;
    let i = activeIndex;
    for (let n = 0; n < total; n++) {
      i = (i + delta + total) % total;
      const isCreate = i === filtered.length;
      if (isCreate) break;
      if (!filtered[i]?.disabled) break;
    }
    setActiveIndex(i);
    focusActive(i);
  }

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (!open) setOpen(true);
    setActiveIndex(0);
  }

  function onKeydown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open ? moveActive(1) : openMenu();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      open ? moveActive(-1) : openMenu();
    } else if (e.key === 'Enter') {
      if (!open) return;
      e.preventDefault();
      if (showCreate && activeIndex === filtered.length) {
        createTag();
      } else if (activeIndex >= 0 && filtered[activeIndex]) {
        pick(filtered[activeIndex]);
      } else if (allowCreate && query.trim()) {
        createTag();
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        closeMenu();
      }
    } else if (e.key === 'Tab') {
      closeMenu();
    }
  }

  return (
    <div
      ref={rootRef}
      className={comboboxClass({ variant, size, open, disabled, error, className })}
    >
      <div className="cf-combobox__trigger" onClick={openMenu}>
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          className="cf-combobox__input"
          value={query}
          placeholder={selected ? selected.label : placeholder}
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          autoComplete="off"
          onChange={onInput}
          onFocus={() => !open && openMenu()}
          onKeyDown={onKeydown}
        />
        {clearable && selected && !disabled ? (
          <span
            className="cf-combobox__clear"
            role="button"
            tabIndex={-1}
            aria-label="清除"
            onMouseDown={clear}
          >
            ×
          </span>
        ) : null}
        <svg className="cf-combobox__caret" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {open ? (
        <ul ref={listRef} className="cf-combobox__menu" role="listbox">
          {filtered.map((opt, i) => {
            const cls = [
              'cf-combobox__option',
              i === activeIndex && 'is-active',
              opt.value === current && 'is-selected',
              opt.disabled && 'is-disabled',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <li
                key={String(opt.value)}
                className={cls}
                role="option"
                aria-selected={opt.value === current}
                onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(opt);
                }}
              >
                {opt.label}
                {opt.value === current ? (
                  <svg
                    className="cf-combobox__check"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5l3.2 3.2L13 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </li>
            );
          })}
          {showCreate ? (
            <li
              className={`cf-combobox__option cf-combobox__option--create${activeIndex === filtered.length ? ' is-active' : ''}`}
              role="option"
              onMouseEnter={() => setActiveIndex(filtered.length)}
              onMouseDown={(e) => {
                e.preventDefault();
                createTag();
              }}
            >
              创建 "{query}"
            </li>
          ) : null}
          {!filtered.length && !showCreate ? (
            <li className="cf-combobox__empty">{emptyText}</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
