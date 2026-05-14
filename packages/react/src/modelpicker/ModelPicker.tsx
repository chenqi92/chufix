import { useEffect, useMemo, useRef, useState } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import {
  formatContextWindow,
  groupOptions,
  type ModelOption,
  type ModelPickerProps,
} from './variants';

export function ModelPicker(props: ModelPickerProps) {
  const {
    options,
    value,
    onChange,
    placeholder = '选择模型',
    groupByProvider = true,
    disabled = false,
  } = props;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => options.find((o) => o.id === value), [options, value]);
  const groups = useMemo(() => groupOptions(options, groupByProvider), [options, groupByProvider]);

  useClickOutside(rootRef, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open]);

  function onSelect(opt: ModelOption) {
    if (opt.disabled) return;
    onChange?.(opt.id, opt);
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={[
        'cf-modelpicker',
        open ? 'is-open' : '',
        disabled ? 'is-disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="cf-modelpicker__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        {selected ? (
          <span className="cf-modelpicker__selected">
            <span className="cf-modelpicker__label">{selected.label}</span>
            {selected.contextWindow && (
              <span className="cf-modelpicker__ctx">{formatContextWindow(selected.contextWindow)}</span>
            )}
          </span>
        ) : (
          <span className="cf-modelpicker__placeholder">{placeholder}</span>
        )}
        <svg className="cf-modelpicker__caret" viewBox="0 0 16 16" width={14} height={14} aria-hidden>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="cf-modelpicker__menu" role="listbox">
          {groups.map((group) => (
            <div key={group.provider}>
              {groupByProvider && group.provider && (
                <div className="cf-modelpicker__group">{group.provider}</div>
              )}
              {group.items.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={opt.id === value}
                  aria-disabled={opt.disabled || undefined}
                  disabled={opt.disabled}
                  className={['cf-modelpicker__option', opt.id === value ? 'is-active' : ''].filter(Boolean).join(' ')}
                  onClick={() => onSelect(opt)}
                >
                  <div className="cf-modelpicker__option-main">
                    <span className="cf-modelpicker__option-label">{opt.label}</span>
                    {opt.description && <span className="cf-modelpicker__option-desc">{opt.description}</span>}
                  </div>
                  <div className="cf-modelpicker__option-meta">
                    {(opt.capabilities ?? []).map((cap) => (
                      <span key={cap} className="cf-modelpicker__cap">
                        {cap}
                      </span>
                    ))}
                    {opt.contextWindow && (
                      <span className="cf-modelpicker__ctx">{formatContextWindow(opt.contextWindow)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
