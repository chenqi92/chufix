import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useDrag } from '../hooks/useDrag';
import {
  lockBodyScroll,
  trapFocus,
  unlockBodyScroll,
  type FocusTrap,
} from '../modal/dom';
import { nearestSnapIndex, resolveSnap, type BottomSheetProps } from './variants';

const ANIMATION_MS = 220;

export function BottomSheet(props: BottomSheetProps) {
  const {
    open,
    onOpenChange,
    snapPoints = ['40%', '90%'],
    initialSnap = 0,
    showGrabber = true,
    maskClosable = true,
    closeOnEsc = true,
    mask = true,
    dismissible = true,
    container,
    zIndex,
    title,
    onSnapChange,
    children,
  } = props;

  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<'open' | 'closed'>(open ? 'open' : 'closed');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const grabberRef = useRef<HTMLDivElement | null>(null);
  const trapRef = useRef<FocusTrap | null>(null);
  const [snapIndex, setSnapIndex] = useState(initialSnap);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const [windowH, setWindowH] = useState(0);

  function close() {
    onOpenChange(false);
  }

  useLayoutEffect(() => {
    if (open) {
      setMounted(true);
      setSnapIndex(initialSnap);
      if (typeof window !== 'undefined') setWindowH(window.innerHeight);
      const id = requestAnimationFrame(() => setState('open'));
      return () => cancelAnimationFrame(id);
    }
    if (mounted) {
      setState('closed');
      const t = setTimeout(() => setMounted(false), ANIMATION_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, mounted, initialSnap]);

  useEffect(() => {
    if (!mounted || state !== 'open') return;
    if (mask) lockBodyScroll();
    if (panelRef.current) trapRef.current = trapFocus(panelRef.current);
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        e.stopPropagation();
        close();
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
  }, [mounted, state, closeOnEsc, mask]);

  const snapHeights = useMemo(() => {
    const wh = windowH || 800;
    const ch = contentRef.current?.scrollHeight ?? 400;
    return snapPoints.map((s) => resolveSnap(s, wh, ch));
  }, [snapPoints, windowH, mounted]);

  const targetHeight = useMemo(() => {
    if (snapHeights.length === 0) return 200;
    return snapHeights[Math.max(0, Math.min(snapIndex, snapHeights.length - 1))];
  }, [snapHeights, snapIndex]);

  const currentHeight = dragHeight ?? targetHeight;

  useDrag(grabberRef, {
    axis: 'y',
    onMove(s) {
      setDragHeight(Math.max(0, targetHeight - s.dy));
    },
    onEnd(s) {
      if (snapHeights.length === 0) {
        setDragHeight(null);
        return;
      }
      const released = (dragHeight ?? targetHeight) - 0; // current actually
      const smallest = snapHeights[0];
      const fastDown = s.vy > 0.5;
      if (dismissible && (released < smallest * 0.5 || fastDown)) {
        setDragHeight(null);
        close();
        return;
      }
      const idx = nearestSnapIndex(snapHeights, released);
      setDragHeight(null);
      if (idx !== snapIndex) {
        setSnapIndex(idx);
        onSnapChange?.(idx);
      }
    },
  });

  function onOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (!maskClosable) return;
    if (e.target === e.currentTarget) close();
  }

  if (!mounted) return null;
  if (typeof document === 'undefined') return null;

  const overlayStyle: CSSProperties = {
    zIndex: zIndex ?? undefined,
    pointerEvents: mask ? undefined : 'none',
    background: mask ? undefined : 'transparent',
  };
  const panelStyle: CSSProperties = {
    height: `${currentHeight}px`,
    transition: dragHeight !== null ? 'none' : undefined,
  };

  const node = (
    <div
      className={['cf-sheet__overlay', !mask ? 'cf-sheet__overlay--no-mask' : '']
        .filter(Boolean)
        .join(' ')}
      data-state={state}
      style={overlayStyle}
      role="presentation"
      onClick={onOverlayClick}
    >
      <div
        ref={panelRef}
        className="cf-sheet__panel"
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {showGrabber && (
          <div ref={grabberRef} className="cf-sheet__grabber" aria-hidden>
            <span className="cf-sheet__grabber-bar" />
          </div>
        )}
        {title && (
          <div className="cf-sheet__header">
            <h2 className="cf-sheet__title">{title}</h2>
          </div>
        )}
        <div ref={contentRef} className="cf-sheet__content">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(node, container ?? document.body);
}
