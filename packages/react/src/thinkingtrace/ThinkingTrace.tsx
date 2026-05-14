import { useEffect, useState } from 'react';
import { formatDuration, type ThinkingTraceProps } from './variants';

export function ThinkingTrace(props: ThinkingTraceProps) {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    duration,
    status = 'thinking',
    label,
    children,
  } = props;

  const isControlled = typeof openProp === 'boolean';
  const [internal, setInternal] = useState(defaultOpen);
  const open = isControlled ? !!openProp : internal;

  useEffect(() => {
    if (status === 'done' && !isControlled) setInternal(false);
  }, [status, isControlled]);

  function toggle() {
    const next = !open;
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  }

  let labelText = label;
  if (!labelText) {
    const dur = formatDuration(duration);
    if (status === 'thinking') labelText = dur ? `思考中 · ${dur}` : '思考中…';
    else labelText = dur ? `Thought for ${dur}` : '思考结果';
  }

  return (
    <section className={['cf-thinking', `is-${status}`, open ? 'is-open' : ''].filter(Boolean).join(' ')}>
      <button type="button" className="cf-thinking__head" aria-expanded={open} onClick={toggle}>
        <span className="cf-thinking__icon" aria-hidden>
          {status === 'thinking' ? (
            <svg viewBox="0 0 16 16" width={14} height={14} className="cf-thinking__icon-spin">
              <circle cx={8} cy={8} r={6} stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeDasharray="20 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width={14} height={14}>
              <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm-.7 9.3L4.5 8l1-1 1.8 1.8L11 5l1 1-4.7 4.8z" fill="currentColor" />
            </svg>
          )}
        </span>
        <span className="cf-thinking__label">{labelText}</span>
        <svg className="cf-thinking__caret" viewBox="0 0 16 16" width={12} height={12} aria-hidden>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="cf-thinking__body">{children}</div>}
    </section>
  );
}
