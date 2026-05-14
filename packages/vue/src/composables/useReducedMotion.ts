import { useMediaQuery } from './useMediaQuery';
import type { Ref } from 'vue';

/**
 * Reactive `prefers-reduced-motion` setting.
 * `true` means the user prefers minimal animation.
 *
 * @example
 * const reduced = useReducedMotion();
 * const duration = computed(() => (reduced.value ? 0 : 200));
 */
export function useReducedMotion(): Ref<boolean> {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
