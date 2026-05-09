import { useState, type MouseEvent } from 'react';
import {
  isGroup,
  sidebarClass,
  type SidebarEntry,
  type SidebarItem,
  type SidebarProps,
} from './variants';

export function Sidebar(props: SidebarProps) {
  const {
    items,
    value,
    defaultValue,
    openKeys,
    defaultOpenKeys = [],
    collapsed = false,
    size = 'md',
    className,
    onChange,
    onOpenKeysChange,
    onSelect,
  } = props;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const current = isControlled ? (value as string) : internalValue;

  const isOpenControlled = openKeys !== undefined;
  const [internalOpen, setInternalOpen] = useState<string[]>(defaultOpenKeys);
  const openSet = new Set(isOpenControlled ? (openKeys as string[]) : internalOpen);

  function toggle(key: string) {
    if (collapsed) return;
    const next = new Set(openSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    const arr = Array.from(next);
    if (!isOpenControlled) setInternalOpen(arr);
    onOpenKeysChange?.(arr);
  }

  function select(item: SidebarItem, e?: MouseEvent) {
    if (item.disabled) return;
    e?.preventDefault();
    if (!isControlled) setInternalValue(item.key);
    onChange?.(item.key, item);
    onSelect?.(item);
  }

  function renderItem(item: SidebarItem, isChild = false) {
    const active = current === item.key;
    const hasChildren = !!item.children?.length;
    const open = openSet.has(item.key);
    const cls = [
      'cf-sidebar__item',
      isChild && 'cf-sidebar__item--child',
      active && 'is-active',
      item.disabled && 'is-disabled',
      hasChildren && 'has-children',
      hasChildren && open && 'is-open',
    ].filter(Boolean).join(' ');

    return (
      <li key={item.key} className={cls}>
        {hasChildren ? (
          <button
            type="button"
            className="cf-sidebar__link cf-sidebar__link--branch"
            aria-expanded={open}
            title={collapsed ? item.label : undefined}
            onClick={() => toggle(item.key)}
          >
            {item.icon ? <span className="cf-sidebar__icon">{item.icon}</span> : null}
            <span className="cf-sidebar__label">{item.label}</span>
            <svg className="cf-sidebar__caret" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <a
            href={item.href ?? '#'}
            className="cf-sidebar__link"
            aria-disabled={item.disabled}
            aria-current={active ? 'page' : undefined}
            title={collapsed ? item.label : undefined}
            onClick={(e) => select(item, e)}
          >
            {item.icon ? <span className="cf-sidebar__icon">{item.icon}</span> : null}
            <span className="cf-sidebar__label">{item.label}</span>
            {item.badge != null ? (
              <span className="cf-sidebar__badge">{item.badge}</span>
            ) : null}
          </a>
        )}
        {hasChildren && open && !collapsed ? (
          <ul className="cf-sidebar__sublist">
            {item.children!.map((c) => renderItem(c, true))}
          </ul>
        ) : null}
      </li>
    );
  }

  function renderEntry(entry: SidebarEntry, idx: number) {
    if (isGroup(entry)) {
      return (
        <div key={entry.key ?? `g-${idx}`} className="cf-sidebar__group">
          {entry.label && !collapsed ? (
            <div className="cf-sidebar__group-label">{entry.label}</div>
          ) : null}
          <ul className="cf-sidebar__list">
            {entry.items.map((item) => renderItem(item))}
          </ul>
        </div>
      );
    }
    return (
      <ul key={entry.key} className="cf-sidebar__list">
        {renderItem(entry)}
      </ul>
    );
  }

  return (
    <nav className={sidebarClass({ size, collapsed, className })} aria-label="侧栏">
      {items.map(renderEntry)}
    </nav>
  );
}
