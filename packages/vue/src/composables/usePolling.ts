import { onBeforeUnmount, ref, type Ref } from 'vue';

export interface PollingOptions {
  /** Run the function once immediately when started. Default true. */
  immediate?: boolean;
  /** Auto-pause when document.hidden, auto-resume on visibility. Default true. */
  pauseOnHidden?: boolean;
  /** Start polling on mount. Default true. */
  startOnMount?: boolean;
}

export interface PollingApi {
  active: Ref<boolean>;
  start: () => void;
  stop: () => void;
  /** Force a single tick now without affecting the timer schedule. */
  tick: () => Promise<void>;
}

/**
 * Polling helper: run an async function every `intervalMs`.
 *
 * Skips ticks while the previous one is still in flight (no overlap).
 * Auto-pauses when the tab is hidden (configurable) so the server
 * doesn't keep getting hit while the user is away.
 *
 * @example
 * const { active, start, stop } = usePolling(refreshStatus, 5000);
 */
export function usePolling(
  fn: () => Promise<void> | void,
  intervalMs: number,
  options: PollingOptions = {},
): PollingApi {
  const immediate = options.immediate ?? true;
  const pauseOnHidden = options.pauseOnHidden ?? true;
  const startOnMount = options.startOnMount ?? true;

  const active = ref(false);
  let timer: ReturnType<typeof setTimeout> | null = null;
  let running = false;

  async function tick(): Promise<void> {
    if (running) return;
    running = true;
    try {
      await fn();
    } finally {
      running = false;
    }
  }

  function schedule() {
    if (!active.value) return;
    timer = setTimeout(async () => {
      if (!active.value) return;
      await tick();
      schedule();
    }, intervalMs);
  }

  function start() {
    if (active.value) return;
    active.value = true;
    if (immediate) {
      tick().then(() => schedule());
    } else {
      schedule();
    }
  }

  function stop() {
    active.value = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  if (pauseOnHidden && typeof document !== 'undefined') {
    const onVisibility = () => {
      if (document.hidden) {
        if (active.value) {
          stop();
          active.value = true; // remember intent — auto-resume will see this
        }
      } else if (active.value) {
        // Restart timer.
        if (!timer) schedule();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    onBeforeUnmount(() => document.removeEventListener('visibilitychange', onVisibility));
  }

  if (startOnMount) start();
  onBeforeUnmount(stop);

  return { active, start, stop, tick };
}
