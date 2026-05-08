import { useState } from 'react';
import {
  type AccordionProps,
  type AccordionItem,
  accordionClass,
} from './variants';

function toArray(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : v ? [v] : [];
}

export function Accordion(props: AccordionProps) {
  const {
    value,
    defaultValue,
    items = [],
    mode = 'single',
    variant = 'bordered',
    onChange,
  } = props;

  const controlled = value !== undefined;
  const [inner, setInner] = useState<string[]>(toArray(defaultValue));
  const open = controlled ? toArray(value) : inner;

  function isOpen(v: string) {
    return open.includes(v);
  }
  function toggle(item: AccordionItem) {
    if (item.disabled) return;
    let next: string[];
    if (mode === 'multiple') {
      next = isOpen(item.value)
        ? open.filter((x) => x !== item.value)
        : [...open, item.value];
    } else {
      next = isOpen(item.value) ? [] : [item.value];
    }
    if (!controlled) setInner(next);
    const out = mode === 'multiple' ? next : (next[0] ?? '');
    onChange?.(out);
  }

  return (
    <div className={accordionClass({ variant })}>
      {items.map((item) => (
        <div
          key={item.value}
          className={[
            'cf-accordion__item',
            isOpen(item.value) ? 'is-open' : '',
            item.disabled ? 'is-disabled' : '',
          ].filter(Boolean).join(' ')}
        >
          <button
            type="button"
            className="cf-accordion__trigger"
            aria-expanded={isOpen(item.value)}
            disabled={item.disabled || undefined}
            onClick={() => toggle(item)}
          >
            <span className="cf-accordion__title">{item.title}</span>
            <svg className="cf-accordion__chevron" viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          {isOpen(item.value) && (
            <div className="cf-accordion__panel" role="region">
              <div className="cf-accordion__panel-inner">{item.content}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
