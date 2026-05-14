import { onBeforeUnmount, onMounted } from 'vue';

export interface IntervalApi {
  start: () => void;
  cancel: () => void;
}

/**
 * `setInterval` with automatic cleanup. Pass `{ startOnMount: false }`
 * to call `start()` manually.
 *
 * @example
 * const { cancel } = useInterval(() => updateClock(), 1000);
 */
export function useInterval(
  fn: () => void,
  ms: number,
  options: { startOnMount?: boolean } = {},
): IntervalApi {
  const startOnMount = options.startOnMount ?? true;
  let timer: ReturnType<typeof setInterval> | null = null;

  function start() {
    cancel();
    timer = setInterval(fn, ms);
  }
  function cancel() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (startOnMount) onMounted(start);
  onBeforeUnmount(cancel);
  return { start, cancel };
}
