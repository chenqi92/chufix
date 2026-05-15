import { useRef, type ReactNode } from 'react';
import { useDraggable } from '../hooks/useDraggable';
import { useDragDrop } from '../hooks/useDragDrop';
import type { DragPayload } from '../hooks/dndStore';

export interface DraggableProps {
  type?: string;
  data?: unknown;
  payload?: DragPayload;
  handle?: string;
  disabled?: boolean;
  preview?: 'self' | 'ghost' | 'none';
  className?: string;
  onDragStart?: () => void;
  onDragEnd?: (dropped: boolean) => void;
  children: ReactNode | ((p: { isDragging: boolean }) => ReactNode);
}

export function Draggable({
  type = 'default',
  data,
  payload,
  handle,
  disabled,
  preview = 'ghost',
  className,
  onDragStart,
  onDragEnd,
  children,
}: DraggableProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dnd = useDragDrop();

  useDraggable(ref, {
    payload: () => payload ?? { type, data },
    handle,
    disabled,
    onStart: onDragStart,
    onEnd: onDragEnd,
  });

  const isDragging = dnd.active && dnd.source === ref.current;

  const classes = [
    'cf-draggable',
    isDragging && 'is-dragging',
    disabled && 'is-disabled',
    preview === 'ghost' && isDragging && 'cf-draggable--ghost',
    preview === 'none' && isDragging && 'cf-draggable--hidden',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes}>
      {typeof children === 'function' ? children({ isDragging }) : children}
    </div>
  );
}
