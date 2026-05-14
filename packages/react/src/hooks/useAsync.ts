import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncApi<TArgs extends unknown[], TResult> {
  data: TResult | null;
  error: unknown;
  loading: boolean;
  run: (...args: TArgs) => Promise<TResult | undefined>;
  reset: () => void;
}

export interface UseAsyncOptions<TResult> {
  initial?: TResult | null;
  immediate?: boolean;
}

export function useAsync<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: UseAsyncOptions<TResult> = {},
): AsyncApi<TArgs, TResult> {
  const [data, setData] = useState<TResult | null>(options.initial ?? null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const callSeq = useRef(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      const id = ++callSeq.current;
      setLoading(true);
      setError(null);
      try {
        const result = await fnRef.current(...args);
        if (id === callSeq.current) setData(result);
        return result;
      } catch (err) {
        if (id === callSeq.current) setError(err);
        return undefined;
      } finally {
        if (id === callSeq.current) setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    callSeq.current++;
    setData(options.initial ?? null);
    setError(null);
    setLoading(false);
  }, [options.initial]);

  useEffect(() => {
    if (options.immediate) {
      // Call with no args; consumers needing args should use run() manually.
      (run as () => Promise<TResult | undefined>)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, loading, run, reset };
}
