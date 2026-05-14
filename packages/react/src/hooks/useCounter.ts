import { useCallback, useState } from 'react';

export interface CounterApi {
  count: number;
  inc: (by?: number) => void;
  dec: (by?: number) => void;
  set: (v: number) => void;
  reset: () => void;
}

export function useCounter(
  initial = 0,
  options: { min?: number; max?: number } = {},
): CounterApi {
  const [count, setCount] = useState(initial);
  const clamp = useCallback(
    (v: number) => {
      let r = v;
      if (typeof options.min === 'number') r = Math.max(options.min, r);
      if (typeof options.max === 'number') r = Math.min(options.max, r);
      return r;
    },
    [options.min, options.max],
  );
  return {
    count,
    inc: useCallback((by = 1) => setCount((v) => clamp(v + by)), [clamp]),
    dec: useCallback((by = 1) => setCount((v) => clamp(v - by)), [clamp]),
    set: useCallback((v: number) => setCount(clamp(v)), [clamp]),
    reset: useCallback(() => setCount(initial), [initial]),
  };
}
