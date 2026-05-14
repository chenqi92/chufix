import { useEffect, useRef } from 'react';

/**
 * The previous value of `value` — one render behind.
 *
 * @example
 * const prev = usePrevious(count);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
