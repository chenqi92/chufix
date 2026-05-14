import { useCallback, useEffect, useRef } from 'react';

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottledFn<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: () => void;
}

export function useThrottledFn<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  ms = 200,
  options: ThrottleOptions = {},
): ThrottledFn<TArgs> {
  const leading = options.leading ?? true;
  const trailing = options.trailing ?? true;
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const lastCallAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingArgs = useRef<TArgs | null>(null);

  const throttled = useCallback(
    (...args: TArgs) => {
      const now = Date.now();
      if (!lastCallAt.current && !leading) lastCallAt.current = now;
      const remaining = ms - (now - lastCallAt.current);
      pendingArgs.current = args;
      if (remaining <= 0 || remaining > ms) {
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
        lastCallAt.current = now;
        pendingArgs.current = null;
        fnRef.current(...args);
      } else if (!timer.current && trailing) {
        timer.current = setTimeout(() => {
          lastCallAt.current = leading ? Date.now() : 0;
          timer.current = null;
          if (pendingArgs.current) {
            const toRun = pendingArgs.current;
            pendingArgs.current = null;
            fnRef.current(...toRun);
          }
        }, remaining);
      }
    },
    [ms, leading, trailing],
  );

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    pendingArgs.current = null;
    lastCallAt.current = 0;
  }, []);

  useEffect(() => () => cancel(), [cancel]);

  const wrapped = throttled as ThrottledFn<TArgs>;
  wrapped.cancel = cancel;
  return wrapped;
}
