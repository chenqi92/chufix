import { useState } from 'react';
import { type AlertProps, type AlertTone, alertClass } from './variants';

const ICONS: Record<AlertTone, string> = {
  success: 'M3 8l3.5 3.5L13 5',
  warning: 'M8 3v6m0 2v.5',
  error:   'M5 5l6 6m0-6l-6 6',
  info:    'M8 5v3m0 2v.5',
};

export function Alert(props: AlertProps) {
  const {
    tone = 'info',
    variant = 'soft',
    title,
    closable = false,
    icon = true,
    onClose,
    children,
  } = props;

  const [open, setOpen] = useState(true);
  if (!open) return null;

  function close() {
    setOpen(false);
    onClose?.();
  }

  return (
    <div className={alertClass({ tone, variant })} role="alert">
      {icon && (
        <span className="cf-alert__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d={ICONS[tone]} />
          </svg>
        </span>
      )}
      <div className="cf-alert__body">
        {title != null && <div className="cf-alert__title">{title}</div>}
        <div className="cf-alert__content">{children}</div>
      </div>
      {closable && (
        <button
          type="button"
          className="cf-alert__close"
          aria-label="close"
          onClick={close}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}
