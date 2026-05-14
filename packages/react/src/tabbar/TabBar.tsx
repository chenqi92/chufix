import type { TabBarItem, TabBarProps } from './variants';

export function TabBar(props: TabBarProps) {
  const {
    items,
    value,
    onChange,
    fixed = true,
    safeArea = true,
    variant = 'line',
    ariaLabel = '主导航',
  } = props;

  const useSafeArea = fixed && safeArea;

  function isActive(item: TabBarItem) {
    return item.key === value;
  }
  function onSelect(item: TabBarItem) {
    if (item.disabled || item.key === value) return;
    onChange?.(item.key, item);
  }
  function showBadge(b: TabBarItem['badge']) {
    return b !== undefined && b !== '' && b !== 0;
  }

  return (
    <nav
      className={[
        'cf-tabbar',
        `cf-tabbar--${variant}`,
        fixed ? 'cf-tabbar--fixed' : '',
        useSafeArea ? 'cf-tabbar--safe-area' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={isActive(item)}
          aria-disabled={item.disabled || undefined}
          disabled={item.disabled}
          className={['cf-tabbar__item', isActive(item) ? 'is-active' : ''].filter(Boolean).join(' ')}
          onClick={() => onSelect(item)}
        >
          <span className="cf-tabbar__icon" aria-hidden>
            {item.icon ??
              (item.iconPath ? (
                <svg viewBox="0 0 24 24" width={22} height={22}>
                  <path d={item.iconPath} fill="currentColor" />
                </svg>
              ) : null)}
            {showBadge(item.badge) && <span className="cf-tabbar__badge">{item.badge}</span>}
          </span>
          {item.label && <span className="cf-tabbar__label">{item.label}</span>}
        </button>
      ))}
    </nav>
  );
}
