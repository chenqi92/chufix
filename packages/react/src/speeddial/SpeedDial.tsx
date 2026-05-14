import { useState } from 'react';
import type { SpeedDialAction, SpeedDialProps } from './variants';

export function SpeedDial(props: SpeedDialProps) {
  const {
    actions,
    direction = 'up',
    position = 'bottom-right',
    trigger = 'click',
    showLabels = 'hover',
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onAction,
    ariaLabel = '展开操作',
    triggerIcon,
  } = props;

  const isControlled = typeof openProp === 'boolean';
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;

  function setOpen(v: boolean) {
    if (!isControlled) setInternal(v);
    onOpenChange?.(v);
  }

  function handleAction(a: SpeedDialAction) {
    if (a.disabled) return;
    onAction?.(a.key, a);
    setOpen(false);
  }

  return (
    <div
      className={[
        'cf-speeddial',
        `cf-speeddial--${position}`,
        `cf-speeddial--${direction}`,
        `cf-speeddial--labels-${showLabels}`,
        open ? 'is-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseLeave={() => trigger === 'hover' && setOpen(false)}
    >
      {open && (
        <ul className="cf-speeddial__list" role="menu">
          {actions.map((a) => (
            <li key={a.key} className="cf-speeddial__item" role="none">
              {showLabels !== 'never' && a.label && (
                <span className="cf-speeddial__label">{a.label}</span>
              )}
              <button
                type="button"
                role="menuitem"
                className="cf-speeddial__action"
                disabled={a.disabled}
                aria-label={a.label || a.key}
                title={a.label}
                onClick={() => handleAction(a)}
              >
                {a.icon ?? (a.iconPath ? (
                  <svg viewBox="0 0 24 24" width={20} height={20}>
                    <path d={a.iconPath} fill="currentColor" />
                  </svg>
                ) : null)}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="cf-speeddial__trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => trigger === 'hover' && setOpen(true)}
      >
        {triggerIcon ?? (
          <svg viewBox="0 0 24 24" width={22} height={22} className="cf-speeddial__trigger-icon">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
