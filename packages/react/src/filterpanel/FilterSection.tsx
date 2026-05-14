import { useState } from 'react';
import type { FilterSectionProps } from './variants';

export function FilterSection(props: FilterSectionProps) {
  const { title, count, defaultOpen = true, open: openProp, onOpenChange, children } = props;
  const isControlled = typeof openProp === 'boolean';
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;

  function toggle() {
    const next = !open;
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  }

  return (
    <section className={['cf-filterpanel__section', open ? 'is-open' : ''].filter(Boolean).join(' ')}>
      <button type="button" className="cf-filterpanel__section-head" aria-expanded={open} onClick={toggle}>
        <span className="cf-filterpanel__section-title">{title}</span>
        {!!count && <span className="cf-filterpanel__section-count">{count}</span>}
        <svg className="cf-filterpanel__section-caret" viewBox="0 0 16 16" width={12} height={12}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="cf-filterpanel__section-body">{children}</div>}
    </section>
  );
}
