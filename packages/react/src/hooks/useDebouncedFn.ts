import { useCallback, useEffect, useRef } from 'react';

export interface DebouncedFn<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: () => void;
  flush: () => void;
}

export function useDebouncedFn<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  ms = 300,
): DebouncedFn<TArgs> {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const argsRef = useRef<TArgs | null>(null);

  const debounced = useCallback(
    (...args: TArgs) => {
      argsRef.current = args;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        if (argsRef.current) {
          const a = argsRef.current;
          argsRef.current = null;
          fnRef.current(...a);
        }
      }, ms);
    },
    [ms],
  );

  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    argsRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (argsRef.current) {
      const a = argsRef.current;
      argsRef.current = null;
      fnRef.current(...a);
    }
  }, []);

  useEffect(() => () => cancel(), [cancel]);

  // Attach methods to the function reference.
  const wrapped = debounced as DebouncedFn<TArgs>;
  wrapped.cancel = cancel;
  wrapped.flush = flush;
  return wrapped;
}
