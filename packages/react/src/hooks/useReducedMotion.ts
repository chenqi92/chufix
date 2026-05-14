import { useMediaQuery } from './useMediaQuery';

/**
 * Reactive `prefers-reduced-motion`.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
