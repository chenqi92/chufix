import { useRef, type ReactNode } from 'react';
import { useDroppable } from '../hooks/useDroppable';
import type { DragPayload } from '../hooks/dndStore';

export interface DroppableProps {
  accept?: string | string[];
  disabled?: boolean;
  className?: string;
  onDrop?: (payload: DragPayload, pointer: { x: number; y: number }) => void;
  onEnter?: (payload: DragPayload) => void;
  onLeave?: (payload: DragPayload) => void;
  children: ReactNode | ((p: { isOver: boolean; canDrop: boolean }) => ReactNode);
}

export function Droppable({
  accept,
  disabled,
  className,
  onDrop,
  onEnter,
  onLeave,
  children,
}: DroppableProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isOver, canDrop } = useDroppable(ref, {
    accept,
    disabled,
    onDrop,
    onEnter,
    onLeave,
  });

  const classes = [
    'cf-droppable',
    isOver && 'is-over',
    canDrop && 'is-accepting',
    disabled && 'is-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes}>
      {typeof children === 'function' ? children({ isOver, canDrop }) : children}
    </div>
  );
}
