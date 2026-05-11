import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  selectClass,
  type SelectOption,
  type SelectProps,
  type SelectValue,
} from './variants';

interface RenderRow {
  type: 'header' | 'option';
  group?: string;
  option?: SelectOption;
  optIndex?: number;
}

export function Select(props: SelectProps) {
  const {
    value,
    defaultValue,
    options = [],
    placeholder = '请选择',
    variant = 'outline',
    size = 'md',
    disabled = false,
    clearable = false,
    error = false,
    multiple = false,
    searchable = false,
    loading = false,
    emptyText = '无选项',
    maxTagCount,
    id,
    name,
    className,
    onChange,
    onSelect,
    onClear,
    onOpenChange,
    onActiveChange,
    onSearch,
    onFocus,
    onBlur,
  } = props;

  const initial: SelectValue =
    defaultValue !== undefined ? defaultValue : multiple ? [] : null;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<SelectValue>(initial);
  const current = isControlled ? (value as SelectValue) : internal;

  const valueArr = useMemo<Array<string | number>>(() => {
    if (multiple) return Array.isArray(current) ? current : [];
    return current == null ? [] : ([current] as Array<string | number>);
  }, [current, multiple]);

  const isSelected = useCallback(
    (opt: SelectOption) => valueArr.includes(opt.value),
    [valueArr],
  );

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [term, setTerm] = useState('');

  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const generatedId = useId();
  const triggerId = id ?? `cf-select-${generatedId}`;
  const menuId = `${triggerId}-menu`;

  const filteredOptions = useMemo(() => {
    if (!searchable || !term.trim()) return options;
    const q = term.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, searchable, term]);

  const renderRows = useMemo<RenderRow[]>(() => {
    const rows: RenderRow[] = [];
    const opts = filteredOptions;
    const hasGroups = opts.some((o) => o.group);
    if (!hasGroups) {
      opts.forEach((o, i) => rows.push({ type: 'option', option: o, optIndex: i }));
      return rows;
    }
    const seen: string[] = [];
    for (const o of opts) {
      const g = o.group ?? '__';
      if (!seen.includes(g)) seen.push(g);
    }
    for (const g of seen) {
      if (g !== '__') rows.push({ type: 'header', group: g });
      opts.forEach((o, i) => {
        if ((o.group ?? '__') === g) rows.push({ type: 'option', option: o, optIndex: i });
      });
    }
    return rows;
  }, [filteredOptions]);

  const selected = useMemo<SelectOption | null>(() => {
    if (multiple) return null;
    return options.find((o) => o.value === current) ?? null;
  }, [options, current, multiple]);

  const selectedTags = useMemo<SelectOption[]>(() => {
    if (!multiple) return [];
    return valueArr
      .map((v) => options.find((o) => o.value === v))
      .filter((o): o is SelectOption => !!o);
  }, [multiple, valueArr, options]);

  const visibleTags = useMemo(() => {
    const cap = maxTagCount ?? Number.POSITIVE_INFINITY;
    return selectedTags.slice(0, cap);
  }, [maxTagCount, selectedTags]);
  const overflowCount =
    Math.max(0, selectedTags.length - (maxTagCount ?? Number.POSITIVE_INFINITY));

  const focusActive = useCallback((idx: number) => {
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelectorAll<HTMLElement>('.cf-select__option')[idx];
      el?.scrollIntoView({ block: 'nearest' });
    });
  }, []);

  const setOpenState = useCallback(
    (next: boolean) => {
      setOpen((prev) => {
        if (prev === next) return prev;
        onOpenChange?.(next);
        return next;
      });
    },
    [onOpenChange],
  );

  const setActive = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onActiveChange?.(index >= 0 ? filteredOptions[index] : null, index);
      if (index >= 0) focusActive(index);
    },
    [filteredOptions, focusActive, onActiveChange],
  );

  const openMenu = useCallback(() => {
    if (disabled) return;
    setOpenState(true);
    const opts = filteredOptions;
    const idx = opts.findIndex((o) => valueArr.includes(o.value));
    const fallback = opts.findIndex((o) => !o.disabled);
    setActive(idx >= 0 ? idx : fallback);
    if (searchable) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [disabled, filteredOptions, valueArr, setActive, setOpenState, searchable]);

  const closeMenu = useCallback(() => {
    setOpenState(false);
    if (searchable) setTerm('');
  }, [setOpenState, searchable]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: globalThis.MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) closeMenu();
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, closeMenu]);

  function commit(v: SelectValue, option: SelectOption | null) {
    if (!isControlled) setInternal(v);
    onChange?.(v, { option });
  }

  function pick(opt: SelectOption) {
    if (opt.disabled) return;
    if (multiple) {
      const arr = valueArr.slice();
      const idx = arr.indexOf(opt.value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(opt.value);
      commit(arr, opt);
      onSelect?.(opt);
    } else {
      commit(opt.value, opt);
      onSelect?.(opt);
      closeMenu();
    }
  }

  function removeTag(opt: SelectOption, e?: MouseEvent) {
    if (e) e.stopPropagation();
    const arr = valueArr.filter((v) => v !== opt.value);
    commit(arr, opt);
  }

  function clear(e: MouseEvent) {
    e.stopPropagation();
    const next: SelectValue = multiple ? [] : null;
    commit(next, null);
    onClear?.();
  }

  function moveActive(delta: number) {
    const opts = filteredOptions;
    if (!opts.length) return;
    let i = activeIndex;
    for (let n = 0; n < opts.length; n++) {
      i = (i + delta + opts.length) % opts.length;
      if (!opts[i].disabled) break;
    }
    setActive(i);
  }

  function onKeydown(e: KeyboardEvent<HTMLElement>) {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open ? moveActive(1) : openMenu();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      open ? moveActive(-1) : openMenu();
    } else if (e.key === 'Enter') {
      if (!open) {
        e.preventDefault();
        openMenu();
      } else if (activeIndex >= 0) {
        e.preventDefault();
        pick(filteredOptions[activeIndex]);
      }
    } else if (e.key === ' ' && !searchable) {
      if (!open) {
        e.preventDefault();
        openMenu();
      } else if (activeIndex >= 0) {
        e.preventDefault();
        pick(filteredOptions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        closeMenu();
      }
    } else if (e.key === 'Tab') {
      closeMenu();
    } else if (e.key === 'Backspace' && multiple && !term && valueArr.length) {
      const last = options.find((o) => o.value === valueArr[valueArr.length - 1]);
      if (last) removeTag(last);
    }
  }

  function onSearchInput(e: ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    onSearch?.(e.target.value);
    const opts = filteredOptions;
    setActive(opts.findIndex((o) => !o.disabled));
  }

  return (
    <div
      ref={rootRef}
      className={selectClass({ variant, size, open, disabled, error, multiple, className })}
    >
      <button
        id={triggerId}
        type="button"
        className="cf-select__trigger"
        role="combobox"
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={selected ? selected.label : placeholder}
        aria-controls={open ? menuId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${menuId}-option-${activeIndex}` : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onKeydown}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <span className="cf-select__value">
          {multiple ? (
            selectedTags.length ? (
              <>
                {visibleTags.map((opt) => (
                  <span key={String(opt.value)} className="cf-select__tag">
                    {opt.label}
                    {!disabled && (
                      <span
                        className="cf-select__tag-x"
                        role="button"
                        tabIndex={-1}
                        aria-label="移除"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => removeTag(opt, e)}
                      >
                        ×
                      </span>
                    )}
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span className="cf-select__tag is-more">+{overflowCount}</span>
                )}
              </>
            ) : (
              <span className="cf-select__placeholder">{placeholder}</span>
            )
          ) : selected ? (
            selected.label
          ) : (
            <span className="cf-select__placeholder">{placeholder}</span>
          )}
        </span>
        {clearable && (multiple ? valueArr.length > 0 : selected) && !disabled && !loading ? (
          <span
            className="cf-select__clear"
            role="button"
            tabIndex={-1}
            aria-label="清除"
            onClick={clear}
          >
            ×
          </span>
        ) : null}
        {loading ? (
          <span className="cf-select__spinner" aria-hidden="true" />
        ) : (
          <svg className="cf-select__caret" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      {open ? (
        <ul
          id={menuId}
          ref={listRef}
          className="cf-select__menu"
          role="listbox"
          aria-multiselectable={multiple || undefined}
        >
          {searchable && (
            <li className="cf-select__search">
              <input
                ref={searchInputRef}
                type="text"
                value={term}
                placeholder="搜索…"
                className="cf-select__search-input"
                onChange={onSearchInput}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  onKeydown(e);
                }}
              />
            </li>
          )}
          {loading ? (
            <li className="cf-select__empty">加载中…</li>
          ) : (
            <>
              {renderRows.map((row, i) => {
                if (row.type === 'header') {
                  return (
                    <li key={`g-${row.group}-${i}`} className="cf-select__group">
                      {row.group}
                    </li>
                  );
                }
                const opt = row.option!;
                const idx = row.optIndex!;
                const cls = [
                  'cf-select__option',
                  idx === activeIndex && 'is-active',
                  isSelected(opt) && 'is-selected',
                  opt.disabled && 'is-disabled',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <li
                    key={`o-${idx}-${String(opt.value)}`}
                    id={`${menuId}-option-${idx}`}
                    className={cls}
                    role="option"
                    aria-selected={isSelected(opt)}
                    onMouseEnter={() => !opt.disabled && setActive(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pick(opt);
                    }}
                  >
                    {multiple && (
                      <span className="cf-select__check-box">
                        {isSelected(opt) && (
                          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path
                              d="M3 8.5l3.2 3.2L13 5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                    {opt.label}
                    {!multiple && isSelected(opt) ? (
                      <svg
                        className="cf-select__check"
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
              {!filteredOptions.length ? (
                <li className="cf-select__empty">{emptyText}</li>
              ) : null}
            </>
          )}
        </ul>
      ) : null}
      {name && !multiple ? <input type="hidden" name={name} value={(current as string | number) ?? ''} /> : null}
    </div>
  );
}
