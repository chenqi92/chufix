import { useState } from 'react';
import {
  groupItems,
  listClass,
  type ListItem,
  type ListProps,
} from './variants';

export function List(props: ListProps) {
  const {
    items,
    value,
    defaultValue,
    selectable,
    size = 'md',
    variant = 'default',
    bordered = true,
    hoverable = true,
    emptyText = '暂无数据',
    className,
    renderItem,
    onChange,
    onSelect,
  } = props;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | string[] | null>(
    defaultValue ?? (selectable === 'multiple' ? [] : null),
  );
  const current = isControlled ? value : internal;

  const selectedSet = (() => {
    if (selectable === 'multiple') {
      return new Set(Array.isArray(current) ? current : []);
    }
    if (selectable === 'single') {
      return new Set(current ? [current as string] : []);
    }
    return new Set<string>();
  })();

  function commit(next: string | string[] | null) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function pick(item: ListItem) {
    if (item.disabled) return;
    if (!selectable) {
      onSelect?.(item);
      return;
    }
    if (selectable === 'single') {
      commit(item.key);
      onSelect?.(item);
      return;
    }
    const next = new Set(selectedSet);
    if (next.has(item.key)) next.delete(item.key);
    else next.add(item.key);
    commit(Array.from(next));
    onSelect?.(item);
  }

  const cls = listClass({
    size,
    variant,
    bordered,
    hoverable,
    selectable: !!selectable,
    className,
  });

  if (!items.length) {
    return (
      <div className={cls}>
        <div className="cf-list__empty">{emptyText}</div>
      </div>
    );
  }

  const grouped = groupItems(items);

  return (
    <div className={cls}>
      {grouped.map(([group, list]) => (
        <div key={group ?? '__no_group__'} className="cf-list__group">
          {group ? <div className="cf-list__group-label">{group}</div> : null}
          <ul className="cf-list__items">
            {list.map((item) => {
              const sel = selectedSet.has(item.key);
              const itemCls = [
                'cf-list__item',
                sel && 'is-selected',
                item.disabled && 'is-disabled',
              ].filter(Boolean).join(' ');
              return (
                <li
                  key={item.key}
                  className={itemCls}
                  role={selectable ? 'option' : undefined}
                  aria-selected={selectable ? sel : undefined}
                  onClick={() => pick(item)}
                >
                  {renderItem ? (
                    renderItem(item, { selected: sel })
                  ) : (
                    <>
                      {item.leading ? (
                        <span className="cf-list__leading">{item.leading}</span>
                      ) : null}
                      <span className="cf-list__body">
                        {item.label ? (
                          <span className="cf-list__label">{item.label}</span>
                        ) : null}
                        {item.description ? (
                          <span className="cf-list__description">{item.description}</span>
                        ) : null}
                      </span>
                      {item.trailing ? (
                        <span className="cf-list__trailing">{item.trailing}</span>
                      ) : null}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
