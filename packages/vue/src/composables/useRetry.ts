export interface RetryOptions {
  /** Max retry attempts after the first failure. Default 3. */
  retries?: number;
  /** Initial delay before first retry (ms). Default 200. */
  initialDelay?: number;
  /** Exponential backoff factor. Default 2. */
  backoff?: number;
  /** Cap on backoff delay (ms). Default 10000. */
  maxDelay?: number;
  /** Optional jitter: randomize delay ± this fraction. Default 0.2 (±20%). */
  jitter?: number;
  /** Decide whether to retry based on the caught error. Default: always retry. */
  shouldRetry?: (err: unknown, attempt: number) => boolean;
}

/**
 * Wrap an async function with exponential backoff retry on failure.
 *
 * @example
 * const fetchRetry = useRetry(api.fetchData, { retries: 5, initialDelay: 300 });
 * const result = await fetchRetry(id);
 */
export function useRetry<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: RetryOptions = {},
): (...args: TArgs) => Promise<TResult> {
  const retries = options.retries ?? 3;
  const initialDelay = options.initialDelay ?? 200;
  const backoff = options.backoff ?? 2;
  const maxDelay = options.maxDelay ?? 10000;
  const jitter = options.jitter ?? 0.2;
  const shouldRetry = options.shouldRetry ?? (() => true);

  return async function retried(...args: TArgs): Promise<TResult> {
    let attempt = 0;
    let delay = initialDelay;
    while (true) {
      try {
        return await fn(...args);
      } catch (err) {
        if (attempt >= retries || !shouldRetry(err, attempt)) throw err;
        const wobble = jitter ? 1 + (Math.random() * 2 - 1) * jitter : 1;
        const wait = Math.min(delay * wobble, maxDelay);
        await new Promise((resolve) => setTimeout(resolve, wait));
        delay = Math.min(delay * backoff, maxDelay);
        attempt++;
      }
    }
  };
}
