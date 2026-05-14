import { useEffect, useRef, type RefObject } from 'react';

/**
 * Watch an element's size via ResizeObserver.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useResizeObserver(ref, ([entry]) => {
 *   const { width, height } = entry.contentRect;
 * });
 */
export function useResizeObserver(
  target: RefObject<Element | null>,
  callback: ResizeObserverCallback,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const el = target.current;
    if (!el || typeof window === 'undefined' || !('ResizeObserver' in window)) return;
    const observer = new ResizeObserver((entries, obs) => callbackRef.current(entries, obs));
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
}
