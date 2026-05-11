import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as RMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import type { ContextMenuItem, ContextMenuProps } from './variants';

export function ContextMenu(props: ContextMenuProps) {
  const {
    items,
    disabled = false,
    container,
    children,
    onSelect,
    onOpen,
    onClose,
  } = props;

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLUListElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const onTriggerContextMenu = (e: RMouseEvent<HTMLSpanElement>) => {
    if (disabled) return;
    e.preventDefault();
    setPos({
      top: e.clientY + window.scrollY,
      left: e.clientX + window.scrollX,
    });
    setOpen(true);
    onOpen?.();
  };

  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    let { top, left } = pos;
    if (left + rect.width > vw - 4) left = vw - rect.width - 4;
    if (top + rect.height > vh - 4) top = vh - rect.height - 4;
    if (left < 4) left = 4;
    if (top < 4) top = 4;
    if (top !== pos.top || left !== pos.left) setPos({ top, left });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: globalThis.MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const pick = (item: ContextMenuItem) => {
    if (item.disabled || item.separator) return;
    onSelect?.(item.value ?? item.label ?? '', item);
    close();
  };

  const target =
    typeof window === 'undefined' ? null : (container ?? document.body);

  return (
    <>
      <span
        className="cf-ctxmenu__trigger"
        onContextMenu={onTriggerContextMenu}
      >
        {children}
      </span>
      {open && target
        ? createPortal(
            <ul
              ref={menuRef}
              role="menu"
              className="cf-ctxmenu"
              style={{ top: pos.top, left: pos.left }}
            >
              {items.map((item, i) => (
                <Fragment key={i}>
                  {item.separator ? (
                    <li className="cf-ctxmenu__sep" role="separator" />
                  ) : (
                    <li
                      className={[
                        'cf-ctxmenu__item',
                        item.disabled && 'is-disabled',
                        item.danger && 'is-danger',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      role="menuitem"
                      aria-disabled={item.disabled || undefined}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        pick(item);
                      }}
                    >
                      <span className="cf-ctxmenu__label">{item.label}</span>
                      {item.shortcut ? (
                        <span className="cf-ctxmenu__shortcut">
                          {item.shortcut}
                        </span>
                      ) : null}
                    </li>
                  )}
                </Fragment>
              ))}
            </ul>,
            target,
          )
        : null}
    </>
  );
}
