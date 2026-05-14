import { ref, watch, type Ref } from 'vue';

/**
 * Tracks the previous value of a ref. The returned ref is one tick behind.
 *
 * @example
 * const count = ref(0);
 * const prevCount = usePrevious(count);
 * watch(count, () => console.log(prevCount.value, '→', count.value));
 */
export function usePrevious<T>(source: Ref<T>): Ref<T | undefined> {
  const prev = ref<T | undefined>(undefined) as Ref<T | undefined>;
  let last: T | undefined = undefined;
  watch(
    source,
    (value) => {
      prev.value = last;
      last = value;
    },
    { flush: 'sync' },
  );
  return prev;
}
