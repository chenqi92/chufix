import type { StatusBarItem, StatusBarProps } from './variants';

function renderItems(
  items: StatusBarItem[] | undefined,
  onClick: ((id: string, item: StatusBarItem) => void) | undefined,
) {
  if (!items?.length) return null;
  return items.map((item) => (
    <button
      key={item.id}
      type="button"
      className={[
        'cf-statusbar__item',
        `cf-statusbar__item--${item.tone ?? 'default'}`,
        item.disabled && 'is-disabled',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={item.disabled}
      onClick={() => onClick?.(item.id, item)}
    >
      {item.icon}
      <span>{item.label}</span>
      {item.shortcut ? (
        <span className="cf-statusbar__shortcut">{item.shortcut}</span>
      ) : null}
    </button>
  ));
}

export function StatusBar(props: StatusBarProps) {
  const {
    size = 'md',
    tone = 'default',
    leftItems,
    centerItems,
    rightItems,
    leftSlot,
    centerSlot,
    rightSlot,
    onItemClick,
    className,
  } = props;

  const cls = [
    'cf-statusbar',
    `cf-statusbar--${size}`,
    `cf-statusbar--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} role="status">
      <div className="cf-statusbar__group cf-statusbar__group--left">
        {leftSlot ?? renderItems(leftItems, onItemClick)}
      </div>
      <div className="cf-statusbar__group cf-statusbar__group--center">
        {centerSlot ?? renderItems(centerItems, onItemClick)}
      </div>
      <div className="cf-statusbar__group cf-statusbar__group--right">
        {rightSlot ?? renderItems(rightItems, onItemClick)}
      </div>
    </div>
  );
}
