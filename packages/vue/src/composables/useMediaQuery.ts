import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

/**
 * Reactive `matchMedia` ref. Returns true while the media query matches.
 *
 * @example
 * const isNarrow = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(false);
  let mql: MediaQueryList | null = null;
  const onChange = () => {
    matches.value = mql?.matches ?? false;
  };

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    mql = window.matchMedia(query);
    matches.value = mql.matches;
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
  });

  onBeforeUnmount(() => {
    if (!mql) return;
    if (mql.removeEventListener) mql.removeEventListener('change', onChange);
    else mql.removeListener(onChange);
    mql = null;
  });

  return matches;
}
