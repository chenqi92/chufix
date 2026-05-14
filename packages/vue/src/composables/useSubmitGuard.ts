import { ref, type Ref } from 'vue';

export interface SubmitGuardOptions {
  /**
   * Minimum interval between successful submissions (ms). Calls inside
   * the cooldown window are ignored and `lastSkipped` flips to true.
   * Default 0 = no cooldown, only protect against in-flight duplicates.
   */
  cooldown?: number;
  /** If true, errors clear the cooldown so the user can retry immediately. Default true. */
  retryOnError?: boolean;
}

export interface SubmitGuardApi<TArgs extends unknown[], TResult> {
  submit: (...args: TArgs) => Promise<TResult | undefined>;
  isSubmitting: Ref<boolean>;
  lastError: Ref<unknown>;
  /** True if the most recent call was suppressed by either in-flight or cooldown. */
  lastSkipped: Ref<boolean>;
  /** Reset cooldown / clear lastError. */
  reset: () => void;
}

/**
 * Wraps an async submit function with two safety nets:
 *   1. While in flight, additional calls return undefined immediately.
 *   2. After a successful call, `cooldown` ms must pass before the next.
 *
 * @example
 * const { submit, isSubmitting } = useSubmitGuard(api.checkout, { cooldown: 2000 });
 * // <button :disabled="isSubmitting" @click="submit(orderId)">确认支付</button>
 */
export function useSubmitGuard<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: SubmitGuardOptions = {},
): SubmitGuardApi<TArgs, TResult> {
  const cooldown = options.cooldown ?? 0;
  const retryOnError = options.retryOnError ?? true;

  const isSubmitting = ref(false);
  const lastError = ref<unknown>(null);
  const lastSkipped = ref(false);
  let lastSuccessAt = 0;

  async function submit(...args: TArgs): Promise<TResult | undefined> {
    if (isSubmitting.value) {
      lastSkipped.value = true;
      return undefined;
    }
    if (cooldown > 0 && Date.now() - lastSuccessAt < cooldown) {
      lastSkipped.value = true;
      return undefined;
    }
    lastSkipped.value = false;
    isSubmitting.value = true;
    lastError.value = null;
    try {
      const out = await fn(...args);
      lastSuccessAt = Date.now();
      return out;
    } catch (err) {
      lastError.value = err;
      if (retryOnError) lastSuccessAt = 0;
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  }

  function reset() {
    lastError.value = null;
    lastSkipped.value = false;
    lastSuccessAt = 0;
  }

  return { submit, isSubmitting, lastError, lastSkipped, reset };
}
