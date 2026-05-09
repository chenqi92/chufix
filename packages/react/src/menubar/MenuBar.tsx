import { Fragment, useEffect, useRef, useState } from 'react';
import type { MenuBarItem, MenuBarMenu, MenuBarProps } from './variants';

export function MenuBar(props: MenuBarProps) {
  const { menus, onSelect, className } = props;
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openId) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openId]);

  const toggle = (menu: MenuBarMenu) => {
    setOpenId((cur) => (cur === menu.id ? null : menu.id));
  };

  const pick = (menu: MenuBarMenu, item: MenuBarItem) => {
    if (item.disabled || item.separator) return;
    onSelect?.(menu.id, item.id, item);
    setOpenId(null);
  };

  return (
    <div
      ref={rootRef}
      role="menubar"
      className={['cf-menubar', className].filter(Boolean).join(' ')}
    >
      {menus.map((menu) => (
        <div key={menu.id} className="cf-menubar__menu">
          <button
            type="button"
            className={[
              'cf-menubar__trigger',
              openId === menu.id && 'is-open',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-expanded={openId === menu.id}
            aria-haspopup="menu"
            role="menuitem"
            onClick={() => toggle(menu)}
            onMouseEnter={() => openId !== null && setOpenId(menu.id)}
          >
            {menu.label}
          </button>
          {openId === menu.id ? (
            <ul className="cf-menubar__list" role="menu">
              {menu.items.map((item, i) => (
                <Fragment key={i}>
                  {item.separator ? (
                    <li className="cf-menubar__sep" role="separator" />
                  ) : (
                    <li
                      className={[
                        'cf-menubar__item',
                        item.disabled && 'is-disabled',
                        item.danger && 'is-danger',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      role="menuitem"
                      aria-disabled={item.disabled || undefined}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        pick(menu, item);
                      }}
                    >
                      <span className="cf-menubar__label">{item.label}</span>
                      {item.shortcut ? (
                        <span className="cf-menubar__shortcut">
                          {item.shortcut}
                        </span>
                      ) : null}
                    </li>
                  )}
                </Fragment>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
