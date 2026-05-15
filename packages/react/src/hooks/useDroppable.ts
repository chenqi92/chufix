import { useEffect, useRef, useState, type RefObject } from 'react';
import { dndStore, type DragPayload } from './dndStore';

export interface UseDroppableOptions {
  accept?: string | string[];
  disabled?: boolean;
  onDrop?: (payload: DragPayload, pointer: { x: number; y: number }) => void;
  onEnter?: (payload: DragPayload) => void;
  onLeave?: (payload: DragPayload) => void;
}

export function useDroppable(
  target: RefObject<HTMLElement | null>,
  options: UseDroppableOptions = {},
) {
  const [isOver, setIsOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const el = target.current;
    if (!el || options.disabled) return;
    const accept = options.accept === undefined ? null : Array.isArray(options.accept) ? options.accept : [options.accept];
    const unregister = dndStore.registerDroppable({
      el,
      accept,
      onDrop: (payload, pointer) => {
        setIsOver(false);
        setCanDrop(false);
        optsRef.current.onDrop?.(payload, pointer);
      },
      onEnter: (payload) => {
        setIsOver(true);
        setCanDrop(true);
        optsRef.current.onEnter?.(payload);
      },
      onLeave: (payload) => {
        setIsOver(false);
        setCanDrop(false);
        optsRef.current.onLeave?.(payload);
      },
    });
    return () => {
      unregister();
      setIsOver(false);
      setCanDrop(false);
    };
  }, [target, options.disabled, Array.isArray(options.accept) ? options.accept.join('|') : options.accept]);

  return { isOver, canDrop };
}
