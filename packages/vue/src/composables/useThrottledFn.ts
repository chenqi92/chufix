import { onBeforeUnmount } from 'vue';

export interface ThrottleOptions {
  /** Fire on the leading edge of a burst. Default true. */
  leading?: boolean;
  /** Fire one trailing call after the burst ends. Default true. */
  trailing?: boolean;
}

export interface ThrottledFn<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: () => void;
}

/**
 * Throttle — at most one call per `ms` milliseconds. Useful for
 * scroll/resize/pointer handlers that fire dozens of times a second.
 *
 * @example
 * const onScroll = useThrottledFn(updatePosition, 80);
 * window.addEventListener('scroll', onScroll);
 */
export function useThrottledFn<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  ms = 200,
  options: ThrottleOptions = {},
): ThrottledFn<TArgs> {
  const leading = options.leading ?? true;
  const trailing = options.trailing ?? true;
  let lastCallAt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: TArgs | null = null;

  function throttled(...args: TArgs): void {
    const now = Date.now();
    if (!lastCallAt && !leading) lastCallAt = now;
    const remaining = ms - (now - lastCallAt);
    pendingArgs = args;
    if (remaining <= 0 || remaining > ms) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallAt = now;
      pendingArgs = null;
      fn(...args);
    } else if (!timer && trailing) {
      timer = setTimeout(() => {
        lastCallAt = leading ? Date.now() : 0;
        timer = null;
        if (pendingArgs) {
          const toRun = pendingArgs;
          pendingArgs = null;
          fn(...toRun);
        }
      }, remaining);
    }
  }

  throttled.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    pendingArgs = null;
    lastCallAt = 0;
  };

  onBeforeUnmount(() => throttled.cancel());
  return throttled as ThrottledFn<TArgs>;
}
