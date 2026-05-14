import { useEffect, useState } from 'react';

/**
 * Debounced shadow of a value — updates only after `ms` ms of no further changes.
 * React analogue of Vue's `useDebouncedRef`.
 *
 * @example
 * const [query, setQuery] = useState('');
 * const debounced = useDebouncedValue(query, 300);
 * useEffect(() => fetch(debounced), [debounced]);
 */
export function useDebouncedValue<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}
