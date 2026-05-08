import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toastStore, type ToastItem } from './store';

export interface ToasterProps {
  position?:
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center';
}

function ToastIcon({ type }: { type: ToastItem['type'] }) {
  if (type === 'success')
    return (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (type === 'error')
    return (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (type === 'warning')
    return (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M8 4v5M8 12v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (type === 'info')
    return (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M8 7v5M8 4.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  return null;
}

export function Toaster(props: ToasterProps) {
  const { position = 'top-right' } = props;
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const unsub = toastStore.subscribe((next) => {
      next.forEach((item) => {
        if (timers.current.has(item.id)) return;
        if (item.duration <= 0) return;
        const t = setTimeout(() => {
          timers.current.delete(item.id);
          toastStore.dismiss(item.id);
        }, item.duration);
        timers.current.set(item.id, t);
      });
      const live = new Set(next.map((x) => x.id));
      timers.current.forEach((t, id) => {
        if (!live.has(id)) {
          clearTimeout(t);
          timers.current.delete(id);
        }
      });
      setItems(next);
    });

    return () => {
      unsub();
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={`ck-toaster ck-toaster--${position}`} role="region" aria-label="通知">
      <div className="ck-toaster__list">
        {items.map((item) => (
          <div
            key={item.id}
            className={`ck-toast ck-toast--${item.type}`}
            role="status"
            data-state="open"
          >
            <span className="ck-toast__icon" aria-hidden="true">
              <ToastIcon type={item.type} />
            </span>
            <div className="ck-toast__body">
              {item.title ? <div className="ck-toast__title">{item.title}</div> : null}
              {item.description ? (
                <div className="ck-toast__desc">{item.description}</div>
              ) : null}
            </div>
            {item.dismissible ? (
              <button
                type="button"
                className="ck-toast__close"
                aria-label="关闭"
                onClick={() => toastStore.dismiss(item.id)}
              >
                ×
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}
