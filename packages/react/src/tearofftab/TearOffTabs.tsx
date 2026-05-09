import {
  Fragment,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from 'react';
import type { TearOffTabItem, TearOffTabsProps } from './variants';

export function TearOffTabs(props: TearOffTabsProps) {
  const {
    tabs,
    value,
    onChange,
    tearThreshold = 60,
    onTearOff,
    onClose,
    slots = {},
    className,
  } = props;

  const [localActive, setLocalActive] = useState<string | null>(
    tabs[0]?.id ?? null,
  );
  const activeId = value ?? localActive;

  const dragRef = useRef<{ id: string | null; startY: number }>({
    id: null,
    startY: 0,
  });

  const setActive = (id: string) => {
    setLocalActive(id);
    onChange?.(id);
  };

  const onPointerDown =
    (item: TearOffTabItem) => (e: RPointerEvent<HTMLDivElement>) => {
      dragRef.current = { id: item.id, startY: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
    };

  const onPointerMove =
    (item: TearOffTabItem) => (e: RPointerEvent<HTMLDivElement>) => {
      if (dragRef.current.id !== item.id) return;
      if (Math.abs(e.clientY - dragRef.current.startY) > tearThreshold) {
        onTearOff?.(item.id, item, e.clientX, e.clientY);
        dragRef.current.id = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    };

  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    dragRef.current.id = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className={['cf-tearoff', className].filter(Boolean).join(' ')}>
      <div className="cf-tearoff__bar" role="tablist">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={[
              'cf-tearoff__tab',
              t.id === activeId && 'is-active',
            ]
              .filter(Boolean)
              .join(' ')}
            role="tab"
            aria-selected={t.id === activeId}
            onClick={() => setActive(t.id)}
            onPointerDown={onPointerDown(t)}
            onPointerMove={onPointerMove(t)}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="cf-tearoff__title">{t.title}</span>
            {t.modified ? (
              <span className="cf-tearoff__dirty" aria-label="未保存">
                ●
              </span>
            ) : null}
            {t.closable ? (
              <button
                type="button"
                className="cf-tearoff__close"
                aria-label="关闭"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.(t.id, t);
                }}
              >
                ×
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <div className="cf-tearoff__body">
        {tabs.map((t) =>
          t.id === activeId ? (
            <Fragment key={t.id}>
              <div className="cf-tearoff__panel">
                {slots[`content-${t.contentKey ?? t.id}`] ?? null}
              </div>
            </Fragment>
          ) : null,
        )}
      </div>
    </div>
  );
}
