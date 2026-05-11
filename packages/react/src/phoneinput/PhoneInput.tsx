import { useEffect, useMemo, useRef, useState } from 'react';
import {
  defaultCountries,
  type CountryCode,
  type PhoneInputProps,
} from './variants';

export function PhoneInput(props: PhoneInputProps) {
  const {
    value,
    onChange,
    country = 'CN',
    onCountryChange,
    countries,
    size = 'md',
    placeholder = '请输入手机号',
    disabled = false,
    error = false,
  } = props;

  const list = countries ?? defaultCountries;
  const current = list.find((c) => c.code === country) ?? list[0];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dial.includes(q),
    );
  }, [list, search]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: globalThis.MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const cls = [
    'cf-phoneinput',
    `cf-phoneinput--${size}`,
    open && 'is-open',
    disabled && 'is-disabled',
    error && 'is-error',
  ]
    .filter(Boolean)
    .join(' ');

  const pickCountry = (c: CountryCode) => {
    onCountryChange?.(c.code);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={rootRef} className={cls}>
      <button
        type="button"
        className="cf-phoneinput__cc"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span className="cf-phoneinput__cc-code">+{current.dial}</span>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="cf-phoneinput__caret"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        type="tel"
        className="cf-phoneinput__input"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      {open ? (
        <div className="cf-phoneinput__menu">
          <div className="cf-phoneinput__search">
            <input
              type="text"
              placeholder="搜索国家 / 区号…"
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul className="cf-phoneinput__list" role="listbox">
            {filtered.map((c) => (
              <li
                key={c.code}
                role="option"
                aria-selected={c.code === current.code}
                className={[
                  'cf-phoneinput__opt',
                  c.code === current.code && 'is-selected',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pickCountry(c);
                }}
              >
                <span className="cf-phoneinput__opt-label">{c.label}</span>
                <span className="cf-phoneinput__opt-dial">+{c.dial}</span>
              </li>
            ))}
            {filtered.length === 0 ? (
              <li className="cf-phoneinput__empty">无匹配国家</li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
