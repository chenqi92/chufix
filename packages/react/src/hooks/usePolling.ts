import { useCallback, useEffect, useRef, useState } from 'react';

export interface PollingOptions {
  immediate?: boolean;
  pauseOnHidden?: boolean;
  startOnMount?: boolean;
}

export interface PollingApi {
  active: boolean;
  start: () => void;
  stop: () => void;
  tick: () => Promise<void>;
}

export function usePolling(
  fn: () => Promise<void> | void,
  intervalMs: number,
  options: PollingOptions = {},
): PollingApi {
  const immediate = options.immediate ?? true;
  const pauseOnHidden = options.pauseOnHidden ?? true;
  const startOnMount = options.startOnMount ?? true;
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const tick = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      await fnRef.current();
    } finally {
      runningRef.current = false;
    }
  }, []);

  const schedule = useCallback(() => {
    if (!activeRef.current) return;
    timerRef.current = setTimeout(async () => {
      if (!activeRef.current) return;
      await tick();
      schedule();
    }, intervalMs);
  }, [intervalMs, tick]);

  const start = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    setActive(true);
    if (immediate) {
      tick().then(() => schedule());
    } else {
      schedule();
    }
  }, [immediate, schedule, tick]);

  const stop = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (startOnMount) start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pauseOnHidden || typeof document === 'undefined') return;
    const onVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } else if (activeRef.current && !timerRef.current) {
        schedule();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [pauseOnHidden, schedule]);

  return { active, start, stop, tick };
}
