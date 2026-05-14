import { ref, type Ref } from 'vue';

export interface SingleFlightApi<TArgs extends unknown[], TResult> {
  /** Whether a call is currently in flight. */
  pending: Ref<boolean>;
  /**
   * Invoke the wrapped function. If a previous call is still pending, the
   * same promise is returned so concurrent callers share one in-flight result.
   * Errors propagate to every awaiting caller.
   */
  run: (...args: TArgs) => Promise<TResult>;
}

/**
 * Coalesce concurrent calls of an async function into a single in-flight
 * execution. Useful for "click the submit button twice" race conditions.
 *
 * @example
 * const { pending, run } = useSingleFlight(api.createUser);
 * // <button :disabled="pending" @click="run({...})">提交</button>
 */
export function useSingleFlight<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
): SingleFlightApi<TArgs, TResult> {
  const pending = ref(false);
  let inflight: Promise<TResult> | null = null;

  function run(...args: TArgs): Promise<TResult> {
    if (inflight) return inflight;
    pending.value = true;
    inflight = fn(...args).finally(() => {
      pending.value = false;
      inflight = null;
    });
    return inflight;
  }

  return { pending, run };
}
