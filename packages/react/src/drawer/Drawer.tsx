import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  lockBodyScroll,
  trapFocus,
  unlockBodyScroll,
  type FocusTrap,
} from '../modal/dom';
import { useDrag } from '../hooks/useDrag';
import {
  pushDrawer,
  topMostDrawerCloseFn,
  DRAWER_TONE_ICON_PATH,
  type DrawerProps as BaseDrawerProps,
} from './variants';

const ANIMATION_MS = 220;

export type DrawerProps = BaseDrawerProps;

export function Drawer(props: DrawerProps) {
  const {
    open,
    onOpenChange,
    title,
    description,
    placement = 'right',
    size = 'md',
    tone = 'default',
    closeOnOverlay = true,
    closeOnEsc = true,
    showClose = true,
    width,
    height,
    resizable = false,
    showGrabber,
    dismissible,
    mask = true,
    footerAlign = 'end',
    okText,
    cancelText,
    okVariant = 'primary',
    onBeforeOk,
    onOk,
    onCancel,
    container,
    header,
    footer,
    children,
    zIndex,
  } = props;

  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<'open' | 'closed'>(open ? 'open' : 'closed');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const trapRef = useRef<FocusTrap | null>(null);
  const stackEntryRef = useRef<{ zIndex: number; release: () => void } | null>(null);
  const [computedZ, setComputedZ] = useState<number>(zIndex ?? 1500);
  const [sizeOverride, setSizeOverride] = useState<{ width?: number; height?: number }>({});
  const [okLoading, setOkLoading] = useState(false);

  function close() {
    if (okLoading) return;
    onOpenChange(false);
  }

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
    setSizeOverride({});
    setOkLoading(false);
    stackEntryRef.current = pushDrawer(close);
    setComputedZ(zIndex ?? stackEntryRef.current.zIndex);
    return () => {
      stackEntryRef.current?.release();
      stackEntryRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, state]);

  useEffect(() => {
    if (!mounted || state !== 'open') return;
    if (mask) lockBodyScroll();
    if (panelRef.current) trapRef.current = trapFocus(panelRef.current);
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc && topMostDrawerCloseFn() === close) {
        e.stopPropagation();
        if (!okLoading) onOpenChange(false);
      }
    };
    if (typeof window !== 'undefined') window.addEventListener('keydown', handler, true);
    return () => {
      trapRef.current?.release();
      trapRef.current = null;
      if (mask) unlockBodyScroll();
      if (typeof window !== 'undefined') window.removeEventListener('keydown', handler, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, state, closeOnEsc, okLoading, mask]);

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

  // resize from inner edge
  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);
  const onResizePointerDown = (e: ReactPointerEvent) => {
    if (!resizable || !panelRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = panelRef.current.getBoundingClientRect();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, w: rect.width, h: rect.height };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onResizePointerMove = (e: ReactPointerEvent) => {
    if (!resizeRef.current) return;
    const dx = e.clientX - resizeRef.current.startX;
    const dy = e.clientY - resizeRef.current.startY;
    if (placement === 'right') setSizeOverride({ width: Math.max(240, resizeRef.current.w - dx) });
    else if (placement === 'left') setSizeOverride({ width: Math.max(240, resizeRef.current.w + dx) });
    else if (placement === 'bottom') setSizeOverride({ height: Math.max(160, resizeRef.current.h - dy) });
    else setSizeOverride({ height: Math.max(160, resizeRef.current.h + dy) });
  };
  const onResizePointerEnd = () => {
    resizeRef.current = null;
  };

  const isBottom = placement === 'bottom';
  const effectiveGrabber = (showGrabber ?? isBottom) && isBottom;
  const effectiveDismissible = (dismissible ?? isBottom) && isBottom && !resizable;
  const grabberRef = useRef<HTMLDivElement | null>(null);
  const [dismissOffset, setDismissOffset] = useState(0);

  useDrag(grabberRef, {
    axis: 'y',
    bounds: { min: 0 },
    onMove(s) {
      if (!effectiveDismissible) return;
      setDismissOffset(s.dy);
    },
    onEnd(s) {
      if (!effectiveDismissible) return;
      const panelH = panelRef.current?.getBoundingClientRect().height ?? 200;
      const past = s.dy > panelH / 3;
      const fast = s.vy > 0.3;
      setDismissOffset(0);
      if (past || fast) close();
    },
  });

  const panelStyle = useMemo<CSSProperties>(() => {
    const out: CSSProperties = {};
    const isHoriz = placement === 'left' || placement === 'right';
    if (isHoriz) {
      if (width != null) {
        out.maxWidth = typeof width === 'number' ? `${width}px` : width;
        out.width = '100%';
      }
      if (sizeOverride.width) {
        out.maxWidth = `${sizeOverride.width}px`;
        out.width = '100%';
      }
    } else {
      if (height != null) {
        out.maxHeight = typeof height === 'number' ? `${height}px` : height;
        out.height = '100%';
      }
      if (sizeOverride.height) {
        out.maxHeight = `${sizeOverride.height}px`;
        out.height = '100%';
      }
    }
    if (!mask) out.pointerEvents = 'auto';
    if (effectiveDismissible && dismissOffset > 0) {
      out.transform = `translateY(${dismissOffset}px)`;
      out.transition = 'none';
    }
    return out;
  }, [placement, width, height, sizeOverride, mask, effectiveDismissible, dismissOffset]);

  const overlayStyle = useMemo<CSSProperties>(() => {
    const out: CSSProperties = { zIndex: computedZ };
    if (!mask) {
      out.background = 'transparent';
      out.pointerEvents = 'none';
    }
    return out;
  }, [computedZ, mask]);

  function onOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (!closeOnOverlay || okLoading) return;
    if (e.target === e.currentTarget) close();
  }

  if (!mounted) return null;
  if (typeof document === 'undefined') return null;

  const okBtnVariant = tone === 'error' ? 'danger' : okVariant;
  const showHeader = title || header || tone !== 'default';

  const node = (
    <div
      data-cf-drawer=""
      data-state={state}
      className={[
        'cf-drawer__overlay',
        `cf-drawer__overlay--${placement}`,
        tone !== 'default' ? `cf-drawer__overlay--tone-${tone}` : '',
        !mask ? 'cf-drawer__overlay--no-mask' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={overlayStyle}
      role="presentation"
      onClick={onOverlayClick}
    >
      <div
        ref={panelRef}
        className={[
          'cf-drawer__panel',
          `cf-drawer__panel--${placement}`,
          `cf-drawer__panel--${size}`,
          resizable ? 'is-resizable' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'cf-drawer-title' : undefined}
        aria-describedby={description ? 'cf-drawer-desc' : undefined}
        tabIndex={-1}
      >
        {effectiveGrabber && (
          <div
            ref={grabberRef}
            className={['cf-drawer__grabber', effectiveDismissible ? 'is-dismissible' : '']
              .filter(Boolean)
              .join(' ')}
            aria-hidden
          >
            <span className="cf-drawer__grabber-bar" />
          </div>
        )}
        {showHeader && (
          <div className="cf-drawer__header">
            {tone !== 'default' && (
              <span className="cf-drawer__tone-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width={20} height={20}>
                  <path
                    d={(DRAWER_TONE_ICON_PATH as Record<string, string>)[tone]}
                    fill="currentColor"
                  />
                </svg>
              </span>
            )}
            <div className="cf-drawer__title-block">
              {(title || !header) && (
                <h2 id="cf-drawer-title" className="cf-drawer__title">
                  {header ?? title}
                </h2>
              )}
              {description && (
                <p id="cf-drawer-desc" className="cf-drawer__desc">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
        {showClose && (
          <button
            type="button"
            className="cf-drawer__close"
            aria-label="Close"
            disabled={okLoading}
            onClick={close}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}

        <div className="cf-drawer__body">{children}</div>

        {(footer || okText || cancelText) && (
          <div className="cf-drawer__footer" data-align={footerAlign}>
            {typeof footer === 'function' ? (
              footer({ ok: doOk, cancel: doCancel, loading: okLoading })
            ) : footer ? (
              footer
            ) : (
              <>
                {cancelText && (
                  <button
                    type="button"
                    className="cf-drawer__footer-btn cf-drawer__footer-btn--secondary"
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
                      'cf-drawer__footer-btn',
                      `cf-drawer__footer-btn--${okBtnVariant}`,
                      okLoading ? 'is-loading' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={okLoading}
                    onClick={doOk}
                  >
                    {okLoading && <span className="cf-drawer__footer-spinner" />}
                    {okText}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {resizable && (
          <span
            className={`cf-drawer__resize-handle cf-drawer__resize-handle--${placement}`}
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
