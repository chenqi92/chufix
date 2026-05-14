import { ref, shallowRef, type Ref, type ShallowRef } from 'vue';

export interface AsyncApi<TArgs extends unknown[], TResult> {
  data: ShallowRef<TResult | null>;
  error: Ref<unknown>;
  loading: Ref<boolean>;
  /** Invoke the async function. Replaces stale results when a newer call resolves. */
  run: (...args: TArgs) => Promise<TResult | undefined>;
  /** Reset data/error to initial. */
  reset: () => void;
}

export interface UseAsyncOptions<TResult> {
  /** Initial data value. */
  initial?: TResult | null;
  /** Run immediately on mount. Default false. */
  immediate?: boolean;
}

/**
 * Reactive async state: `{ data, error, loading, run, reset }`.
 *
 * Discards results from stale calls — if you call `run()` twice in a row,
 * only the second resolution updates `data`.
 *
 * @example
 * const { data, loading, error, run } = useAsync(api.getUser);
 * onMounted(() => run(123));
 */
export function useAsync<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: UseAsyncOptions<TResult> = {},
): AsyncApi<TArgs, TResult> {
  const data = shallowRef<TResult | null>(options.initial ?? null);
  const error = ref<unknown>(null);
  const loading = ref(false);
  let callSeq = 0;

  async function run(...args: TArgs): Promise<TResult | undefined> {
    const id = ++callSeq;
    loading.value = true;
    error.value = null;
    try {
      const result = await fn(...args);
      if (id === callSeq) {
        data.value = result;
      }
      return result;
    } catch (err) {
      if (id === callSeq) {
        error.value = err;
      }
      return undefined;
    } finally {
      if (id === callSeq) loading.value = false;
    }
  }

  function reset() {
    callSeq++;
    data.value = options.initial ?? null;
    error.value = null;
    loading.value = false;
  }

  return { data, error, loading, run, reset };
}
