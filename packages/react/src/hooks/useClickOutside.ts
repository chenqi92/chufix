import { useEffect, useRef, type RefObject } from 'react';

/**
 * Fire `handler` when a pointerdown happens outside `target.current`.
 *
 * @example
 * const popover = useRef<HTMLDivElement>(null);
 * useClickOutside(popover, () => setOpen(false));
 */
export function useClickOutside(
  target: RefObject<HTMLElement | null>,
  handler: (ev: PointerEvent) => void,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    function onPointerDown(ev: PointerEvent) {
      const el = target.current;
      if (!el) return;
      if (el.contains(ev.target as Node)) return;
      handlerRef.current(ev);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [target]);
}
