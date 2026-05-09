import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  cascaderClass,
  getLabelPath,
  type CascaderOption,
  type CascaderProps,
} from './variants';

export function Cascader(props: CascaderProps) {
  const {
    options,
    value,
    defaultValue = [],
    placeholder = '请选择',
    separator = ' / ',
    size = 'md',
    disabled = false,
    clearable = false,
    className,
    onChange,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const current = isControlled ? (value as string[]) : internal;

  const [open, setOpen] = useState(false);
  const [trail, setTrail] = useState<string[]>(current);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTrail(current);
  }, [current]);

  useEffect(() => {
    function handle(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('pointerdown', handle);
      return () => document.removeEventListener('pointerdown', handle);
    }
  }, [open]);

  function commit(next: string[]) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  const columns: CascaderOption[][] = [options];
  let level = options;
  for (const v of trail) {
    const found = level.find((o) => o.value === v);
    if (!found || !found.children?.length) break;
    columns.push(found.children);
    level = found.children;
  }

  const labels = getLabelPath(options, current);
  const display = labels.join(separator);
  const showClear = clearable && current.length > 0;

  function pick(colIndex: number, opt: CascaderOption) {
    if (opt.disabled) return;
    const next = trail.slice(0, colIndex);
    next.push(opt.value);
    setTrail(next);
    if (!opt.children?.length) {
      commit(next);
      setOpen(false);
    }
  }

  function clearValue(e: MouseEvent) {
    e.stopPropagation();
    commit([]);
    setTrail([]);
  }

  return (
    <div ref={rootRef} className={cascaderClass({ size, disabled, className })}>
      <button
        type="button"
        className="cf-cascader__trigger"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span className={`cf-cascader__value${display ? '' : ' is-placeholder'}`}>
          {display || placeholder}
        </span>
        {showClear ? (
          <button
            type="button"
            className="cf-cascader__clear"
            aria-label="清除"
            onClick={clearValue}
          >
            ×
          </button>
        ) : null}
        <span className="cf-cascader__caret" aria-hidden>▾</span>
      </button>
      {open ? (
        <div className="cf-cascader__panel">
          {columns.map((col, ci) => (
            <div key={ci} className="cf-cascader__col">
              {col.map((opt) => {
                const itemCls = [
                  'cf-cascader__item',
                  opt.value === trail[ci] && 'is-active',
                  current[ci] === opt.value && 'is-selected',
                  opt.disabled && 'is-disabled',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={itemCls}
                    disabled={opt.disabled}
                    onMouseEnter={() => {
                      if (opt.disabled) return;
                      setTrail([...trail.slice(0, ci), opt.value]);
                    }}
                    onClick={() => pick(ci, opt)}
                  >
                    <span className="cf-cascader__label">{opt.label}</span>
                    {opt.children?.length ? (
                      <span className="cf-cascader__arrow" aria-hidden>›</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
