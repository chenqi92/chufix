import { useMemo, useState } from 'react';
import {
  formatDuration,
  safeStringify,
  STATUS_LABEL,
  type ToolCallCardProps,
} from './variants';

export function ToolCallCard(props: ToolCallCardProps) {
  const {
    name,
    input,
    output,
    status = 'success',
    duration,
    collapsible = true,
    defaultOpen = false,
    errorMessage,
  } = props;

  const [open, setOpen] = useState(defaultOpen);

  const inputStr = useMemo(() => safeStringify(input), [input]);
  const outputStr = useMemo(
    () => (errorMessage ? errorMessage : safeStringify(output)),
    [output, errorMessage],
  );
  const durationStr = formatDuration(duration);

  function toggle() {
    if (!collapsible) return;
    setOpen((v) => !v);
  }

  return (
    <article
      className={[
        'cf-toolcall',
        `is-${status}`,
        open ? 'is-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="cf-toolcall__head">
        {collapsible && (
          <button
            type="button"
            className="cf-toolcall__toggle"
            aria-expanded={open}
            onClick={toggle}
          >
            <svg className="cf-toolcall__caret" viewBox="0 0 16 16" width={12} height={12} aria-hidden>
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <span className="cf-toolcall__icon" aria-hidden>
          {status === 'running' && (
            <svg viewBox="0 0 16 16" width={14} height={14} className="cf-toolcall__spinner">
              <circle cx={8} cy={8} r={6} stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeDasharray="20 12" />
            </svg>
          )}
          {status === 'success' && (
            <svg viewBox="0 0 16 16" width={14} height={14}>
              <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm-.7 9.3L4.5 8l1-1 1.8 1.8L11 5l1 1-4.7 4.8z" fill="currentColor" />
            </svg>
          )}
          {status === 'error' && (
            <svg viewBox="0 0 16 16" width={14} height={14}>
              <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM6 5l2 2 2-2 1 1-2 2 2 2-1 1-2-2-2 2-1-1 2-2-2-2 1-1z" fill="currentColor" />
            </svg>
          )}
          {status === 'pending' && (
            <svg viewBox="0 0 16 16" width={14} height={14}>
              <circle cx={8} cy={8} r={6} stroke="currentColor" strokeWidth={1.4} fill="none" />
            </svg>
          )}
        </span>
        <span className="cf-toolcall__name">{name}</span>
        <span className="cf-toolcall__status">{STATUS_LABEL[status]}</span>
        {durationStr && <span className="cf-toolcall__duration">{durationStr}</span>}
      </header>
      {open && (
        <div className="cf-toolcall__body">
          {inputStr && (
            <div className="cf-toolcall__section">
              <div className="cf-toolcall__section-head">输入</div>
              <pre className="cf-toolcall__pre">
                <code>{inputStr}</code>
              </pre>
            </div>
          )}
          {outputStr && (
            <div className="cf-toolcall__section">
              <div className="cf-toolcall__section-head">{status === 'error' ? '错误' : '输出'}</div>
              <pre className={['cf-toolcall__pre', status === 'error' ? 'is-error' : ''].filter(Boolean).join(' ')}>
                <code>{outputStr}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
