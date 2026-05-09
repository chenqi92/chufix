import { useCallback, useEffect, useRef, useState, type WheelEvent, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { clampZoom, imagePreviewClass, type ImagePreviewProps } from './variants';

export function ImagePreview({
  src,
  alt,
  open,
  defaultOpen = false,
  className,
  onOpenChange,
  onClose,
}: ImagePreviewProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const realOpen = isControlled ? !!open : internalOpen;

  const [zoom, setZoom] = useState(1);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const drag = useRef({ active: false, x: 0, y: 0, dx: 0, dy: 0 });

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
      if (!v) onClose?.();
    },
    [isControlled, onOpenChange, onClose],
  );

  const reset = useCallback(() => {
    setZoom(1);
    setDx(0);
    setDy(0);
  }, []);

  function onWheel(evt: WheelEvent<HTMLDivElement>) {
    evt.preventDefault();
    const delta = evt.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => clampZoom(z * delta));
  }

  function onMouseDown(evt: MouseEvent<HTMLImageElement>) {
    drag.current = { active: true, x: evt.clientX, y: evt.clientY, dx, dy };
  }

  useEffect(() => {
    if (!realOpen) return;
    reset();
    const onMove = (e: globalThis.MouseEvent) => {
      if (!drag.current.active) return;
      setDx(drag.current.dx + (e.clientX - drag.current.x));
      setDy(drag.current.dy + (e.clientY - drag.current.y));
    };
    const onUp = () => {
      drag.current.active = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === '+' || e.key === '=') setZoom((z) => clampZoom(z * 1.2));
      else if (e.key === '-') setZoom((z) => clampZoom(z / 1.2));
      else if (e.key === '0') reset();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('keydown', onKey);
    };
  }, [realOpen, reset, setOpen]);

  if (!realOpen) return null;
  if (typeof document === 'undefined') return null;

  const cls = imagePreviewClass({ className });
  const imgStyle = { transform: `translate(${dx}px, ${dy}px) scale(${zoom})` };

  return createPortal(
    <div className={cls} role="dialog" aria-modal="true">
      <div className="cf-imgpreview__backdrop" onClick={() => setOpen(false)} />
      <div className="cf-imgpreview__stage" onWheel={onWheel}>
        {src && (
          <img
            src={src}
            alt={alt ?? ''}
            className="cf-imgpreview__img"
            style={imgStyle}
            draggable={false}
            onMouseDown={onMouseDown}
          />
        )}
        <div className="cf-imgpreview__toolbar" onClick={(e) => e.stopPropagation()}>
          <button type="button" aria-label="缩小" onClick={() => setZoom((z) => clampZoom(z / 1.2))}>−</button>
          <button type="button" aria-label="重置" onClick={reset}>100%</button>
          <button type="button" aria-label="放大" onClick={() => setZoom((z) => clampZoom(z * 1.2))}>+</button>
          <button type="button" aria-label="关闭" onClick={() => setOpen(false)}>✕</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
