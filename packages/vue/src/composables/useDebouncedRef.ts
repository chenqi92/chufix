import { customRef, type Ref } from 'vue';

/**
 * A reactive ref whose updates are debounced — the value only commits after
 * `ms` milliseconds of no further writes. The previous timer is cleared on
 * every set.
 *
 * @example
 * const search = useDebouncedRef('', 300);
 * // typing fast keeps `search.value` stable until the user pauses for 300ms.
 */
export function useDebouncedRef<T>(initial: T, ms = 300): Ref<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stored = initial;
  return customRef((track, trigger) => ({
    get() {
      track();
      return stored;
    },
    set(value) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        stored = value;
        trigger();
      }, ms);
    },
  }));
}
