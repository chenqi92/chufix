import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { snackbarClass, type SnackbarProps, type SnackbarTone } from './variants';

function ToneIcon({ tone }: { tone: SnackbarTone }) {
  switch (tone) {
    case 'success':
      return (
        <svg viewBox="0 0 16 16" fill="none">
          <circle cx={8} cy={8} r={7} stroke="currentColor" strokeWidth={1.4} />
          <path
            d="M5 8.5l2.2 2.2L11 6.5"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2L1.5 13h13z"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M8 6.5v3M8 11.5h.01"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 16 16" fill="none">
          <circle cx={8} cy={8} r={7} stroke="currentColor" strokeWidth={1.4} />
          <path
            d="M5.5 5.5l5 5M10.5 5.5l-5 5"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </svg>
      );
    case 'info':
      return (
        <svg viewBox="0 0 16 16" fill="none">
          <circle cx={8} cy={8} r={7} stroke="currentColor" strokeWidth={1.4} />
          <path
            d="M8 7v4M8 5h.01"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function Snackbar(props: SnackbarProps) {
  const {
    open,
    onOpenChange,
    message,
    tone = 'default',
    placement = 'bottom-center',
    duration = 5000,
    actionLabel,
    actionShortcut,
    showDismiss = true,
    container,
    onAction,
    onDismiss,
    children,
  } = props;

  useEffect(() => {
    if (!open || duration <= 0) return;
    const t = window.setTimeout(() => onOpenChange(false), duration);
    return () => window.clearTimeout(t);
  }, [open, duration, onOpenChange]);

  const handleAction = () => {
    onAction?.();
    onOpenChange(false);
  };
  const handleDismiss = () => {
    onDismiss?.();
    onOpenChange(false);
  };

  const target =
    typeof window === 'undefined' ? null : (container ?? document.body);
  if (!open || !target) return null;

  const cls = snackbarClass({ tone, placement });

  return createPortal(
    <div className={cls} role="status" aria-live="polite">
      {tone !== 'default' ? (
        <span className="cf-snackbar__icon" aria-hidden="true">
          <ToneIcon tone={tone} />
        </span>
      ) : null}
      <span className="cf-snackbar__message">{children ?? message}</span>
      {actionLabel ? (
        <>
          <span className="cf-snackbar__sep" aria-hidden="true" />
          <button
            type="button"
            className="cf-snackbar__action"
            onClick={handleAction}
          >
            {actionLabel}
            {actionShortcut ? (
              <span className="cf-snackbar__shortcut">{actionShortcut}</span>
            ) : null}
          </button>
        </>
      ) : null}
      {showDismiss ? (
        <button
          type="button"
          className="cf-snackbar__dismiss"
          aria-label="关闭"
          onClick={handleDismiss}
        >
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>,
    target,
  );
}
