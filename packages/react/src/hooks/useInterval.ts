import { useCallback, useEffect, useRef } from 'react';

export interface IntervalApi {
  start: () => void;
  cancel: () => void;
}

export function useInterval(
  fn: () => void,
  ms: number,
  options: { startOnMount?: boolean } = {},
): IntervalApi {
  const startOnMount = options.startOnMount ?? true;
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);
  const start = useCallback(() => {
    cancel();
    timer.current = setInterval(() => fnRef.current(), ms);
  }, [ms, cancel]);

  useEffect(() => {
    if (startOnMount) start();
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { start, cancel };
}
