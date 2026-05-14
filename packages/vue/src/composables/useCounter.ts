import { ref, type Ref } from 'vue';

export interface CounterApi {
  count: Ref<number>;
  inc: (by?: number) => void;
  dec: (by?: number) => void;
  set: (v: number) => void;
  reset: () => void;
}

/**
 * Reactive counter with `inc / dec / set / reset` helpers and optional bounds.
 *
 * @example
 * const { count, inc, dec } = useCounter(0, { min: 0, max: 100 });
 */
export function useCounter(
  initial = 0,
  options: { min?: number; max?: number } = {},
): CounterApi {
  const count = ref(initial);
  const clamp = (v: number) => {
    let r = v;
    if (typeof options.min === 'number') r = Math.max(options.min, r);
    if (typeof options.max === 'number') r = Math.min(options.max, r);
    return r;
  };
  return {
    count,
    inc: (by = 1) => (count.value = clamp(count.value + by)),
    dec: (by = 1) => (count.value = clamp(count.value - by)),
    set: (v: number) => (count.value = clamp(v)),
    reset: () => (count.value = initial),
  };
}
