import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  computeDropdownPosition,
  type DropdownPlacement,
  type DropdownItem,
  type DropdownProps,
} from './variants';

const ANIMATION_MS = 140;

export function Dropdown(props: DropdownProps) {
  const {
    open,
    defaultOpen = false,
    onOpenChange,
    items,
    placement = 'bottom',
    offset = 6,
    closeOnSelect = true,
    disabled = false,
    width,
    onSelect,
    children,
  } = props;

  const controlled = open !== undefined;
  const [inner, setInner] = useState(defaultOpen);
  const visible = controlled ? !!open : inner;

  const setVisible = useCallback(
    (v: boolean) => {
      if (!controlled) setInner(v);
      onOpenChange?.(v);
    },
    [controlled, onOpenChange],
  );

  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(visible);
  const [state, setState] = useState<'open' | 'closed'>(visible ? 'open' : 'closed');
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    placement: DropdownPlacement;
  }>({ top: 0, left: 0, placement });
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectableIndices = useMemo(
    () =>
      items
        .map((it, i) => (it.divider || it.header || it.disabled ? -1 : i))
        .filter((i) => i >= 0),
    [items],
  );

  useLayoutEffect(() => {
    if (visible) {
      setMounted(true);
      const id = requestAnimationFrame(() => setState('open'));
      setActiveIndex(selectableIndices[0] ?? -1);
      return () => cancelAnimationFrame(id);
    }
    if (mounted) {
      setState('closed');
      const t = setTimeout(() => {
        setMounted(false);
        setActiveIndex(-1);
      }, ANIMATION_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [visible, mounted, selectableIndices]);

  const reposition = useCallback(() => {
    if (!triggerRef.current || !menuRef.current) return;
    const tRect = triggerRef.current.getBoundingClientRect();
    const mw = menuRef.current.offsetWidth;
    const mh = menuRef.current.offsetHeight;
    setPos(computeDropdownPosition(tRect, mw, mh, placement, offset));
  }, [placement, offset]);

  useLayoutEffect(() => {
    if (!mounted || state !== 'open') return;
    reposition();
  }, [mounted, state, reposition]);

  const selectAt = useCallback(
    (i: number) => {
      const it = items[i];
      if (!it || it.disabled || it.divider || it.header) return;
      onSelect?.(it, i);
      if (closeOnSelect) setVisible(false);
    },
    [items, onSelect, closeOnSelect, setVisible],
  );

  const moveActive = useCallback(
    (dir: 1 | -1) => {
      if (!selectableIndices.length) return;
      setActiveIndex((cur) => {
        const idx = selectableIndices.indexOf(cur);
        if (idx === -1) return dir > 0 ? selectableIndices[0] : selectableIndices[selectableIndices.length - 1];
        return selectableIndices[(idx + dir + selectableIndices.length) % selectableIndices.length];
      });
    },
    [selectableIndices],
  );

  useEffect(() => {
    if (!mounted || state !== 'open') return;

    function onDocClick(e: MouseEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setVisible(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setVisible(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveActive(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveActive(-1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (activeIndex >= 0) {
          e.preventDefault();
          selectAt(activeIndex);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        if (selectableIndices.length) setActiveIndex(selectableIndices[0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        if (selectableIndices.length) setActiveIndex(selectableIndices[selectableIndices.length - 1]);
      }
    }

    document.addEventListener('mousedown', onDocClick, true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('mousedown', onDocClick, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [mounted, state, activeIndex, selectableIndices, moveActive, selectAt, reposition, setVisible]);

  function onTriggerClick() {
    if (disabled) return;
    setVisible(!visible);
  }

  function onTriggerKey(e: ReactKeyboardEvent<HTMLSpanElement>) {
    if (visible) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setVisible(true);
    }
  }

  const menuStyle: CSSProperties = {
    top: pos.top,
    left: pos.left,
    width: typeof width === 'number' ? `${width}px` : width,
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="cf-dropdown-trigger"
        tabIndex={0}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKey}
      >
        {children}
      </span>
      {mounted && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              className={`cf-dropdown cf-dropdown--${pos.placement}`}
              data-state={state}
              role="menu"
              style={menuStyle}
            >
              {items.map((item, i) => {
                if (item.divider) {
                  return (
                    <div
                      key={item.key ?? `divider-${i}`}
                      className="cf-dropdown__divider"
                      role="separator"
                    />
                  );
                }
                if (item.header) {
                  return (
                    <div
                      key={item.key ?? `header-${i}`}
                      className="cf-dropdown__header"
                    >
                      {item.label}
                    </div>
                  );
                }
                const cls =
                  'cf-dropdown__item' +
                  (i === activeIndex ? ' cf-dropdown__item--active' : '') +
                  (item.tone === 'danger' ? ' cf-dropdown__item--danger' : '');
                return (
                  <button
                    key={item.key ?? `${i}:${item.label}`}
                    type="button"
                    className={cls}
                    role="menuitem"
                    aria-disabled={item.disabled || undefined}
                    disabled={item.disabled}
                    onClick={() => selectAt(i)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    {item.icon && <span className="cf-dropdown__icon">{item.icon}</span>}
                    <span className="cf-dropdown__label">{item.label}</span>
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
