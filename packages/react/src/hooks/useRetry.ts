import { useCallback, useRef } from 'react';

export interface RetryOptions {
  retries?: number;
  initialDelay?: number;
  backoff?: number;
  maxDelay?: number;
  jitter?: number;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
}

export function useRetry<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: RetryOptions = {},
): (...args: TArgs) => Promise<TResult> {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const retries = options.retries ?? 3;
  const initialDelay = options.initialDelay ?? 200;
  const backoff = options.backoff ?? 2;
  const maxDelay = options.maxDelay ?? 10000;
  const jitter = options.jitter ?? 0.2;
  const shouldRetry = options.shouldRetry ?? (() => true);

  return useCallback(
    async (...args: TArgs): Promise<TResult> => {
      let attempt = 0;
      let delay = initialDelay;
      while (true) {
        try {
          return await fnRef.current(...args);
        } catch (err) {
          if (attempt >= retries || !shouldRetry(err, attempt)) throw err;
          const wobble = jitter ? 1 + (Math.random() * 2 - 1) * jitter : 1;
          const wait = Math.min(delay * wobble, maxDelay);
          await new Promise((resolve) => setTimeout(resolve, wait));
          delay = Math.min(delay * backoff, maxDelay);
          attempt++;
        }
      }
    },
    [retries, initialDelay, backoff, maxDelay, jitter, shouldRetry],
  );
}
