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
} from './dom';
import type { ModalProps } from './variants';

const ANIMATION_MS = 180;

export function Modal(props: ModalProps) {
  const {
    open,
    onOpenChange,
    title,
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
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const trapRef = useRef<FocusTrap | null>(null);

  // mount / unmount with animation
  useLayoutEffect(() => {
    if (open) {
      setMounted(true);
      // next paint, switch to open state to trigger transition
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

  // focus trap + scroll lock
  useEffect(() => {
    if (!mounted || state !== 'open') return;
    lockBodyScroll();
    if (dialogRef.current) trapRef.current = trapFocus(dialogRef.current);
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
      data-ck-modal=""
      data-state={state}
      className="ck-modal__overlay"
      role="presentation"
      onClick={onOverlayClick}
      onKeyDown={onKeyDown}
    >
      <div
        ref={dialogRef}
        className={`ck-modal__dialog ck-modal__dialog--${size}`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {(title || header) && (
          <div className="ck-modal__header">{header ?? title}</div>
        )}
        {showClose && (
          <button
            type="button"
            className="ck-modal__close"
            aria-label="关闭"
            onClick={close}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
        <div className="ck-modal__body">{children}</div>
        {footer && <div className="ck-modal__footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(node, container ?? document.body);
}
