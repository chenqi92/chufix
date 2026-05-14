import { useId as reactUseId } from 'react';

/**
 * SSR-safe stable ID. Thin wrapper around React 18's useId so callers can
 * import from `@chufix-design/react/hooks`.
 *
 * @example
 * const id = useId();           // 'r:r1:'
 * const id = useId('cf');       // 'cf-r:r1:'
 */
export function useId(prefix?: string): string {
  const raw = reactUseId();
  return prefix ? `${prefix}-${raw}` : raw;
}
