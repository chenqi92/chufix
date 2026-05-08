import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  selectClass,
  type SelectOption,
  type SelectProps,
  type SelectValue,
} from './variants';

export function Select(props: SelectProps) {
  const {
    value,
    defaultValue = null,
    options = [],
    placeholder = '请选择',
    variant = 'outline',
    size = 'md',
    disabled = false,
    clearable = false,
    error = false,
    className,
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<SelectValue>(defaultValue);
  const current = isControlled ? (value as SelectValue) : internal;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === current) ?? null,
    [options, current],
  );

  const focusActive = useCallback((idx: number) => {
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelectorAll<HTMLElement>(
        '.ck-select__option',
      )[idx];
      el?.scrollIntoView({ block: 'nearest' });
    });
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    const idx = options.findIndex((o) => o.value === current);
    const fallback = options.findIndex((o) => !o.disabled);
    const next = idx >= 0 ? idx : fallback;
    setActiveIndex(next);
    if (next >= 0) focusActive(next);
  }, [disabled, options, current, focusActive]);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: globalThis.MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) closeMenu();
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, closeMenu]);

  function commit(v: SelectValue) {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  function pick(opt: SelectOption) {
    if (opt.disabled) return;
    commit(opt.value);
    closeMenu();
  }

  function clear(e: MouseEvent) {
    e.stopPropagation();
    commit(null);
  }

  function moveActive(delta: number) {
    if (!options.length) return;
    let i = activeIndex;
    for (let n = 0; n < options.length; n++) {
      i = (i + delta + options.length) % options.length;
      if (!options[i].disabled) break;
    }
    setActiveIndex(i);
    focusActive(i);
  }

  function onKeydown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open ? moveActive(1) : openMenu();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      open ? moveActive(-1) : openMenu();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!open) {
        e.preventDefault();
        openMenu();
      } else if (activeIndex >= 0) {
        e.preventDefault();
        pick(options[activeIndex]);
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
      className={selectClass({ variant, size, open, disabled, error, className })}
    >
      <button
        type="button"
        className="ck-select__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onKeydown}
      >
        <span className="ck-select__value">
          {selected ? (
            selected.label
          ) : (
            <span className="ck-select__placeholder">{placeholder}</span>
          )}
        </span>
        {clearable && selected && !disabled ? (
          <span
            className="ck-select__clear"
            role="button"
            tabIndex={-1}
            aria-label="清除"
            onClick={clear}
          >
            ×
          </span>
        ) : null}
        <svg className="ck-select__caret" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open ? (
        <ul ref={listRef} className="ck-select__menu" role="listbox">
          {options.map((opt, i) => {
            const cls = [
              'ck-select__option',
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
                    className="ck-select__check"
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
          {!options.length ? (
            <li className="ck-select__empty">无选项</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
