import { useEffect, useRef, type RefObject } from 'react';

type TargetLike = EventTarget | null | undefined;
type TargetSource = TargetLike | RefObject<TargetLike>;

function resolve(target: TargetSource): EventTarget | null {
  if (!target) return null;
  if ('current' in (target as RefObject<TargetLike>)) {
    return (target as RefObject<TargetLike>).current ?? null;
  }
  return target as EventTarget;
}

/**
 * Subscribe to a DOM event for the lifetime of the component.
 *
 * @example
 * useEventListener(window, 'resize', () => { ... });
 * useEventListener(buttonRef, 'click', () => { ... });
 */
export function useEventListener(
  target: TargetSource,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const t = resolve(target);
    if (!t) return;
    const wrapped: EventListener = (ev) => {
      const h = handlerRef.current;
      if (typeof h === 'function') h(ev);
      else h.handleEvent(ev);
    };
    t.addEventListener(event, wrapped, options);
    return () => t.removeEventListener(event, wrapped, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, event]);
}
