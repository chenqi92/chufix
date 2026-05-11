import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  lockBodyScroll,
  trapFocus,
  unlockBodyScroll,
  type FocusTrap,
} from './dom';
import {
  pushModal,
  topMostCloseFn,
  toneClass,
  TONE_ICON_PATH,
  type FooterAlign,
  type ModalProps as BaseModalProps,
  type ModalTone,
} from './variants';

const ANIMATION_MS = 180;

export interface ModalProps extends BaseModalProps {
  /** React-style controlled callback. */
  onOpenChange: (open: boolean) => void;
  header?: ReactNode;
  footer?: ReactNode | ((ctx: { ok: () => void; cancel: () => void; loading: boolean }) => ReactNode);
  children?: ReactNode;
  /** Where to portal. Defaults to document.body. */
  container?: HTMLElement;
  onOk?: () => void;
  onCancel?: () => void;
}

export function Modal(props: ModalProps) {
  const {
    open,
    onOpenChange,
    title,
    description,
    size = 'md',
    tone = 'default',
    closeOnOverlay = true,
    closeOnEsc = true,
    showClose = true,
    centered = true,
    width,
    minHeight,
    footerAlign = 'end',
    draggable = false,
    resizable = false,
    okText,
    cancelText,
    okVariant = 'primary',
    onBeforeOk,
    container,
    header,
    footer,
    children,
    onOk,
    onCancel,
    zIndex,
  } = props;

  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<'open' | 'closed'>(open ? 'open' : 'closed');
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const trapRef = useRef<FocusTrap | null>(null);
  const stackEntryRef = useRef<{ zIndex: number; release: () => void } | null>(null);
  const [computedZ, setComputedZ] = useState<number>(zIndex ?? 1000);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [sizeOverride, setSizeOverride] = useState<{ width?: number; height?: number }>({});
  const [okLoading, setOkLoading] = useState(false);

  function close() {
    if (okLoading) return;
    onOpenChange(false);
  }

  // mount / unmount with animation
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

  // stack push / pop
  useEffect(() => {
    if (!mounted || state !== 'open') return;
    setDragOffset({ x: 0, y: 0 });
    setSizeOverride({});
    setOkLoading(false);

    stackEntryRef.current = pushModal(close);
    setComputedZ(zIndex ?? stackEntryRef.current.zIndex);

    return () => {
      stackEntryRef.current?.release();
      stackEntryRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, state]);

  // focus trap + scroll lock + ESC
  useEffect(() => {
    if (!mounted || state !== 'open') return;
    lockBodyScroll();
    if (dialogRef.current) trapRef.current = trapFocus(dialogRef.current);

    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc && topMostCloseFn() === close) {
        e.stopPropagation();
        if (!okLoading) onOpenChange(false);
      }
    };
    if (typeof window !== 'undefined') window.addEventListener('keydown', handler, true);

    return () => {
      trapRef.current?.release();
      trapRef.current = null;
      unlockBodyScroll();
      if (typeof window !== 'undefined') window.removeEventListener('keydown', handler, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, state, closeOnEsc, okLoading]);

  async function doOk() {
    if (onBeforeOk) {
      setOkLoading(true);
      try {
        const r = await onBeforeOk();
        if (r === false) return;
      } catch {
        return;
      } finally {
        setOkLoading(false);
      }
    }
    onOk?.();
    onOpenChange(false);
  }
  function doCancel() {
    if (okLoading) return;
    onCancel?.();
    onOpenChange(false);
  }

  // Drag header
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const onDragPointerDown = (e: ReactPointerEvent) => {
    if (!draggable) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: dragOffset.x, baseY: dragOffset.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragPointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    setDragOffset({
      x: dragRef.current.baseX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.baseY + (e.clientY - dragRef.current.startY),
    });
  };
  const onDragPointerEnd = () => {
    dragRef.current = null;
  };

  // Resize
  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);
  const onResizePointerDown = (e: ReactPointerEvent) => {
    if (!resizable || !dialogRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = dialogRef.current.getBoundingClientRect();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, w: rect.width, h: rect.height };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onResizePointerMove = (e: ReactPointerEvent) => {
    if (!resizeRef.current) return;
    setSizeOverride({
      width: Math.max(280, resizeRef.current.w + (e.clientX - resizeRef.current.startX)),
      height: Math.max(160, resizeRef.current.h + (e.clientY - resizeRef.current.startY)),
    });
  };
  const onResizePointerEnd = () => {
    resizeRef.current = null;
  };

  const dialogStyle = useMemo<CSSProperties>(() => {
    const out: CSSProperties = {};
    if (width != null) out.width = typeof width === 'number' ? `${width}px` : width;
    if (sizeOverride.width) out.width = `${sizeOverride.width}px`;
    if (minHeight != null) out.minHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
    if (sizeOverride.height) out.height = `${sizeOverride.height}px`;
    if (dragOffset.x !== 0 || dragOffset.y !== 0) {
      out.transform = `translate(${dragOffset.x}px, ${dragOffset.y}px)`;
    }
    return out;
  }, [width, minHeight, sizeOverride, dragOffset]);

  const overlayStyle = useMemo<CSSProperties>(
    () => ({
      zIndex: computedZ,
      alignItems: centered ? 'center' : 'flex-start',
      paddingTop: centered ? undefined : '80px',
    }),
    [computedZ, centered],
  );

  function onOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (!closeOnOverlay || okLoading) return;
    if (e.target === e.currentTarget) close();
  }
  function onKeyDownLocal(e: KeyboardEvent<HTMLDivElement>) {
    // 让全局监听处理 ESC（避免重复）
    if (e.key === 'Escape') e.stopPropagation();
  }

  if (!mounted) return null;
  if (typeof document === 'undefined') return null;

  const okBtnVariant = tone === 'error' ? 'danger' : okVariant;
  const showHeader = title || header || tone !== 'default';

  const node = (
    <div
      data-cf-modal=""
      data-state={state}
      className={['cf-modal__overlay', toneClass(tone)].filter(Boolean).join(' ')}
      style={overlayStyle}
      role="presentation"
      onClick={onOverlayClick}
      onKeyDown={onKeyDownLocal}
    >
      <div
        ref={dialogRef}
        className={[
          'cf-modal__dialog',
          `cf-modal__dialog--${size}`,
          draggable ? 'is-draggable' : '',
          resizable ? 'is-resizable' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={dialogStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'cf-modal-title' : undefined}
        aria-describedby={description ? 'cf-modal-desc' : undefined}
        tabIndex={-1}
      >
        {showHeader && (
          <div
            className="cf-modal__header"
            onPointerDown={onDragPointerDown}
            onPointerMove={onDragPointerMove}
            onPointerUp={onDragPointerEnd}
            onPointerCancel={onDragPointerEnd}
          >
            {tone !== 'default' && (
              <span className="cf-modal__tone-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width={20} height={20}>
                  <path
                    d={(TONE_ICON_PATH as Record<string, string>)[tone]}
                    fill="currentColor"
                  />
                </svg>
              </span>
            )}
            <div className="cf-modal__title-block">
              {(title || !header) && (
                <h2 id="cf-modal-title" className="cf-modal__title">
                  {header ?? title}
                </h2>
              )}
              {description && (
                <p id="cf-modal-desc" className="cf-modal__desc">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
        {showClose && (
          <button
            type="button"
            className="cf-modal__close"
            aria-label="Close"
            disabled={okLoading}
            onClick={close}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}

        <div className="cf-modal__body">{children}</div>

        {(footer || okText || cancelText) && (
          <div className="cf-modal__footer" data-align={footerAlign}>
            {typeof footer === 'function' ? (
              footer({ ok: doOk, cancel: doCancel, loading: okLoading })
            ) : footer ? (
              footer
            ) : (
              <>
                {cancelText && (
                  <button
                    type="button"
                    className="cf-modal__footer-btn cf-modal__footer-btn--secondary"
                    disabled={okLoading}
                    onClick={doCancel}
                  >
                    {cancelText}
                  </button>
                )}
                {okText && (
                  <button
                    type="button"
                    className={[
                      'cf-modal__footer-btn',
                      `cf-modal__footer-btn--${okBtnVariant}`,
                      okLoading ? 'is-loading' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={okLoading}
                    onClick={doOk}
                  >
                    {okLoading && <span className="cf-modal__footer-spinner" />}
                    {okText}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {resizable && (
          <span
            className="cf-modal__resize-handle"
            onPointerDown={onResizePointerDown}
            onPointerMove={onResizePointerMove}
            onPointerUp={onResizePointerEnd}
            onPointerCancel={onResizePointerEnd}
          />
        )}
      </div>
    </div>
  );

  return createPortal(node, container ?? document.body);
}
