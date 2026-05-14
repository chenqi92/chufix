import { onBeforeUnmount, onMounted } from 'vue';

export interface TimeoutApi {
  start: () => void;
  cancel: () => void;
}

/**
 * `setTimeout` with automatic cleanup. Pass `{ startOnMount: false }`
 * to call `start()` manually.
 *
 * @example
 * const { start, cancel } = useTimeout(() => closeAll(), 5000);
 */
export function useTimeout(
  fn: () => void,
  ms: number,
  options: { startOnMount?: boolean } = {},
): TimeoutApi {
  const startOnMount = options.startOnMount ?? true;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function start() {
    cancel();
    timer = setTimeout(() => {
      timer = null;
      fn();
    }, ms);
  }
  function cancel() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  if (startOnMount) onMounted(start);
  onBeforeUnmount(cancel);
  return { start, cancel };
}
