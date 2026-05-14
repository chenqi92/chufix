import { useCallback, useRef, useState } from 'react';

export interface SubmitGuardOptions {
  cooldown?: number;
  retryOnError?: boolean;
}

export interface SubmitGuardApi<TArgs extends unknown[], TResult> {
  submit: (...args: TArgs) => Promise<TResult | undefined>;
  isSubmitting: boolean;
  lastError: unknown;
  lastSkipped: boolean;
  reset: () => void;
}

export function useSubmitGuard<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: SubmitGuardOptions = {},
): SubmitGuardApi<TArgs, TResult> {
  const cooldown = options.cooldown ?? 0;
  const retryOnError = options.retryOnError ?? true;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<unknown>(null);
  const [lastSkipped, setLastSkipped] = useState(false);
  const lastSuccessAtRef = useRef(0);
  const submittingRef = useRef(false);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const submit = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      if (submittingRef.current) {
        setLastSkipped(true);
        return undefined;
      }
      if (cooldown > 0 && Date.now() - lastSuccessAtRef.current < cooldown) {
        setLastSkipped(true);
        return undefined;
      }
      setLastSkipped(false);
      submittingRef.current = true;
      setIsSubmitting(true);
      setLastError(null);
      try {
        const out = await fnRef.current(...args);
        lastSuccessAtRef.current = Date.now();
        return out;
      } catch (err) {
        setLastError(err);
        if (retryOnError) lastSuccessAtRef.current = 0;
        throw err;
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [cooldown, retryOnError],
  );

  const reset = useCallback(() => {
    setLastError(null);
    setLastSkipped(false);
    lastSuccessAtRef.current = 0;
  }, []);

  return { submit, isSubmitting, lastError, lastSkipped, reset };
}
