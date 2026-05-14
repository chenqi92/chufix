import { useEffect, useRef, type RefObject } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  once?: boolean;
}

/**
 * Watch an element's visibility via IntersectionObserver.
 *
 * @example
 * const ref = useRef<HTMLImageElement>(null);
 * useIntersectionObserver(ref, ([entry]) => {
 *   if (entry.isIntersecting) loadImage();
 * }, { once: true });
 */
export function useIntersectionObserver(
  target: RefObject<Element | null>,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const { once, root, rootMargin, threshold } = options;

  useEffect(() => {
    const el = target.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        callbackRef.current(entries, obs);
        if (once && entries.some((e) => e.isIntersecting)) {
          obs.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, once, root, rootMargin, threshold]);
}
