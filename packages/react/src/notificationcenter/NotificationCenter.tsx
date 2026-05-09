import { useMemo } from 'react';
import type { NotificationCenterProps } from './variants';

export function NotificationCenter(props: NotificationCenterProps) {
  const {
    items,
    open = true,
    emptyText = '没有通知',
    showMarkAllRead = true,
    showClearAll = true,
    maxHeight,
    onItemClick,
    onItemAction,
    onMarkAllRead,
    onClearAll,
    className,
  } = props;

  const unreadCount = useMemo(
    () => items.filter((it) => !it.read).length,
    [items],
  );

  if (!open) return null;

  const bodyStyle =
    maxHeight != null
      ? {
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        }
      : undefined;

  return (
    <aside
      className={['cf-notifcenter', className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="通知中心"
    >
      <header className="cf-notifcenter__header">
        <div className="cf-notifcenter__title">
          通知
          {unreadCount > 0 ? (
            <span className="cf-notifcenter__count">{unreadCount}</span>
          ) : null}
        </div>
        <div className="cf-notifcenter__head-actions">
          {showMarkAllRead && unreadCount > 0 ? (
            <button
              type="button"
              className="cf-notifcenter__action"
              onClick={() => onMarkAllRead?.()}
            >
              全部标为已读
            </button>
          ) : null}
          {showClearAll && items.length > 0 ? (
            <button
              type="button"
              className="cf-notifcenter__action"
              onClick={() => onClearAll?.()}
            >
              清空
            </button>
          ) : null}
        </div>
      </header>
      <div className="cf-notifcenter__body" style={bodyStyle}>
        {!items.length ? (
          <div className="cf-notifcenter__empty">{emptyText}</div>
        ) : (
          <ul className="cf-notifcenter__list">
            {items.map((item) => (
              <li
                key={item.id}
                className={[
                  'cf-notifcenter__item',
                  `cf-notifcenter__item--${item.tone ?? 'default'}`,
                  item.read && 'is-read',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onItemClick?.(item.id, item)}
              >
                <span className="cf-notifcenter__dot" aria-hidden="true" />
                <div className="cf-notifcenter__content">
                  <div className="cf-notifcenter__row">
                    <span className="cf-notifcenter__name">{item.title}</span>
                    {item.timestamp ? (
                      <span className="cf-notifcenter__time">{item.timestamp}</span>
                    ) : null}
                  </div>
                  {item.description ? (
                    <p className="cf-notifcenter__desc">{item.description}</p>
                  ) : null}
                  {item.actionLabel ? (
                    <button
                      type="button"
                      className="cf-notifcenter__item-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemAction?.(item.id, item);
                      }}
                    >
                      {item.actionLabel}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
