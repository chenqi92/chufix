import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDragDrop } from '../hooks/useDragDrop';
import type { DragPayload } from '../hooks/dndStore';

export interface DragLayerProps {
  offsetX?: number;
  offsetY?: number;
  children?: (p: { payload: DragPayload; over: HTMLElement | null; canDrop: boolean }) => ReactNode;
}

export function DragLayer({ offsetX = 12, offsetY = 12, children }: DragLayerProps) {
  const dnd = useDragDrop();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === 'undefined') return null;
  if (!dnd.active || !dnd.payload) return null;

  const style: React.CSSProperties = {
    left: dnd.pointer.x + offsetX,
    top: dnd.pointer.y + offsetY,
  };

  return createPortal(
    <div
      className={['cf-draglayer', dnd.canDrop && 'can-drop'].filter(Boolean).join(' ')}
      style={style}
    >
      {children ? (
        children({ payload: dnd.payload, over: dnd.over, canDrop: dnd.canDrop })
      ) : (
        <div className="cf-draglayer__default">{String(dnd.payload.type)}</div>
      )}
    </div>,
    document.body,
  );
}
