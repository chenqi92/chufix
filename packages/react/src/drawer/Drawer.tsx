import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  lockBodyScroll,
  trapFocus,
  unlockBodyScroll,
  type FocusTrap,
} from '../modal/dom';
import type { DrawerProps } from './variants';

const ANIMATION_MS = 200;

export function Drawer(props: DrawerProps) {
  const {
    open,
    onOpenChange,
    title,
    placement = 'right',
    size = 'md',
    closeOnOverlay = true,
    closeOnEsc = true,
    showClose = true,
    container,
    header,
    footer,
    children,
  } = props;

  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<'open' | 'closed'>(open ? 'open' : 'closed');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const trapRef = useRef<FocusTrap | null>(null);

  useLayoutEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setState('open'));
      return () => cancelAnimationFrame(id);
    }
    if (mounted) {
      setState('closed');
      const t = setTimeout(() => setMounted(false), ANIMATION_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted || state !== 'open') return;
    lockBodyScroll();
    if (panelRef.current) trapRef.current = trapFocus(panelRef.current);
    return () => {
      trapRef.current?.release();
      trapRef.current = null;
      unlockBodyScroll();
    };
  }, [mounted, state]);

  if (!mounted) return null;
  if (typeof document === 'undefined') return null;

  function close() {
    onOpenChange(false);
  }

  function onOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (!closeOnOverlay) return;
    if (e.target === e.currentTarget) close();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' && closeOnEsc) {
      e.stopPropagation();
      close();
    }
  }

  const node = (
    <div
      data-cf-drawer=""
      data-state={state}
      className={`cf-drawer__overlay cf-drawer__overlay--${placement}`}
      role="presentation"
      onClick={onOverlayClick}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        className={`cf-drawer__panel cf-drawer__panel--${placement} cf-drawer__panel--${size}`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {(title || header) && (
          <div className="cf-drawer__header">{header ?? title}</div>
        )}
        {showClose && (
          <button
            type="button"
            className="cf-drawer__close"
            aria-label="关闭"
            onClick={close}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
        <div className="cf-drawer__body">{children}</div>
        {footer && <div className="cf-drawer__footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(node, container ?? document.body);
}
