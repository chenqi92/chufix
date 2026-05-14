import { useState, type KeyboardEvent } from 'react';
import type { FormSectionProps } from './variants';

export function FormSection(props: FormSectionProps) {
  const {
    title,
    description,
    anchor,
    collapsible = false,
    defaultOpen = true,
    open: openProp,
    onOpenChange,
    children,
  } = props;

  const isControlled = typeof openProp === 'boolean';
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;

  function toggle() {
    if (!collapsible) return;
    const next = !open;
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  }

  function onKey(e: KeyboardEvent<HTMLElement>) {
    if (!collapsible) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }

  return (
    <section
      className={['cf-formsection', collapsible ? 'is-collapsible' : '', open ? 'is-open' : '']
        .filter(Boolean)
        .join(' ')}
      id={anchor}
    >
      {(title || description) && (
        <header
          className={['cf-formsection__head', collapsible ? 'is-clickable' : ''].filter(Boolean).join(' ')}
          role={collapsible ? 'button' : undefined}
          aria-expanded={collapsible ? open : undefined}
          tabIndex={collapsible ? 0 : undefined}
          onClick={toggle}
          onKeyDown={onKey}
        >
          <div className="cf-formsection__head-text">
            {title && <h3 className="cf-formsection__title">{title}</h3>}
            {description && <p className="cf-formsection__description">{description}</p>}
          </div>
          {collapsible && (
            <svg className="cf-formsection__caret" viewBox="0 0 16 16" width={14} height={14} aria-hidden>
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </header>
      )}
      {open && <div className="cf-formsection__body">{children}</div>}
    </section>
  );
}
