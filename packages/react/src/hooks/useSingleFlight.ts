import { useCallback, useRef, useState } from 'react';

export interface SingleFlightApi<TArgs extends unknown[], TResult> {
  pending: boolean;
  run: (...args: TArgs) => Promise<TResult>;
}

/**
 * Coalesce concurrent calls of an async function into a single in-flight
 * execution. Useful for "click the submit button twice" race conditions.
 */
export function useSingleFlight<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
): SingleFlightApi<TArgs, TResult> {
  const [pending, setPending] = useState(false);
  const inflight = useRef<Promise<TResult> | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(
    (...args: TArgs): Promise<TResult> => {
      if (inflight.current) return inflight.current;
      setPending(true);
      inflight.current = fnRef.current(...args).finally(() => {
        setPending(false);
        inflight.current = null;
      });
      return inflight.current;
    },
    [],
  );

  return { pending, run };
}
