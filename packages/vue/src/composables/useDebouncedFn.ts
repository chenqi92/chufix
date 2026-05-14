import { onBeforeUnmount } from 'vue';

export interface DebouncedFn<TArgs extends unknown[]> {
  (...args: TArgs): void;
  /** Cancel any pending invocation. */
  cancel: () => void;
  /** Invoke immediately with the most-recent args (if any), bypassing the wait. */
  flush: () => void;
}

/**
 * Debounce a function — collapses bursts of calls into one trailing
 * invocation `ms` ms after the last call.
 *
 * @example
 * const sendTelemetry = useDebouncedFn((event) => track(event), 500);
 */
export function useDebouncedFn<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  ms = 300,
): DebouncedFn<TArgs> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: TArgs | null = null;

  function debounced(...args: TArgs): void {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (lastArgs) {
        const argsToRun = lastArgs;
        lastArgs = null;
        fn(...argsToRun);
      }
    }, ms);
  }

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (lastArgs) {
      const argsToRun = lastArgs;
      lastArgs = null;
      fn(...argsToRun);
    }
  };

  onBeforeUnmount(() => debounced.cancel());
  return debounced as DebouncedFn<TArgs>;
}
