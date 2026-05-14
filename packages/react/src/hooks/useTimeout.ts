import { useCallback, useEffect, useRef } from 'react';

export interface TimeoutApi {
  start: () => void;
  cancel: () => void;
}

/**
 * `setTimeout` with auto cleanup. Pass `{ startOnMount: false }` to defer.
 */
export function useTimeout(
  fn: () => void,
  ms: number,
  options: { startOnMount?: boolean } = {},
): TimeoutApi {
  const startOnMount = options.startOnMount ?? true;
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  const start = useCallback(() => {
    cancel();
    timer.current = setTimeout(() => {
      timer.current = null;
      fnRef.current();
    }, ms);
  }, [ms, cancel]);

  useEffect(() => {
    if (startOnMount) start();
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { start, cancel };
}
