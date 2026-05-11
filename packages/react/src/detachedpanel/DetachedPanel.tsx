import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import type { DetachedPanelProps } from './variants';

export function DetachedPanel(props: DetachedPanelProps) {
  const {
    open,
    onOpenChange,
    title,
    x: xProp,
    y: yProp,
    width = 360,
    height = 240,
    resizable = false,
    closable = true,
    container,
    zIndex,
    actions,
    children,
    onMove,
    className,
  } = props;

  const [pos, setPos] = useState({
    x:
      xProp ??
      (typeof window !== 'undefined' ? Math.max(window.innerWidth - 400, 20) : 20),
    y: yProp ?? 80,
  });
  const dragRef = useRef<{
    active: boolean;
    offsetX: number;
    offsetY: number;
  }>({ active: false, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    if (typeof xProp === 'number' || typeof yProp === 'number') {
      setPos((c) => ({
        x: typeof xProp === 'number' ? xProp : c.x,
        y: typeof yProp === 'number' ? yProp : c.y,
      }));
    }
  }, [xProp, yProp]);

  const onHeaderPointerDown = (e: RPointerEvent<HTMLElement>) => {
    dragRef.current = {
      active: true,
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onHeaderPointerMove = (e: RPointerEvent<HTMLElement>) => {
    if (!dragRef.current.active) return;
    const nx = Math.max(0, e.clientX - dragRef.current.offsetX);
    const ny = Math.max(0, e.clientY - dragRef.current.offsetY);
    setPos({ x: nx, y: ny });
    onMove?.(nx, ny);
  };

  const onHeaderPointerUp = (e: RPointerEvent<HTMLElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const target =
    typeof window === 'undefined' ? null : (container ?? document.body);
  if (!open || !target) return null;
  const isContained = target !== document.body;

  const style: CSSProperties = {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    zIndex,
    resize: resizable ? 'both' : undefined,
  };

  return createPortal(
    <section
      className={['cf-detached', isContained && 'is-contained', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      role="dialog"
      aria-label={typeof title === 'string' ? title : 'panel'}
    >
      <header
        className="cf-detached__header"
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        onPointerCancel={onHeaderPointerUp}
      >
        <span className="cf-detached__title">{title}</span>
        <span className="cf-detached__actions">
          {actions}
          {closable ? (
            <button
              type="button"
              className="cf-detached__close"
              aria-label="关闭"
              onClick={() => onOpenChange(false)}
            >
              ×
            </button>
          ) : null}
        </span>
      </header>
      <div className="cf-detached__body">{children}</div>
    </section>,
    target,
  );
}
