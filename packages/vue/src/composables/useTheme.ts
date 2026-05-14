import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export type ChuFixTheme = 'dark-cool' | 'dark-warm' | 'light';
const THEMES: ChuFixTheme[] = ['dark-cool', 'dark-warm', 'light'];

export interface ThemeApi {
  theme: Ref<ChuFixTheme>;
  set: (t: ChuFixTheme) => void;
  /** Cycle through dark-cool → dark-warm → light → dark-cool. */
  cycle: () => void;
}

function readTheme(): ChuFixTheme {
  if (typeof document === 'undefined') return 'dark-cool';
  const attr = document.documentElement.dataset.theme;
  if (attr === 'dark') return 'dark-cool';
  if ((THEMES as string[]).includes(attr ?? '')) return attr as ChuFixTheme;
  return 'dark-cool';
}

/**
 * Read and switch the ChuFix theme via `[data-theme]` on `<html>`.
 *
 * @example
 * const { theme, set, cycle } = useTheme();
 * set('light');
 */
export function useTheme(): ThemeApi {
  const theme = ref<ChuFixTheme>('dark-cool');

  function sync() {
    theme.value = readTheme();
  }

  function set(next: ChuFixTheme) {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = next;
    theme.value = next;
  }

  function cycle() {
    const i = THEMES.indexOf(theme.value);
    set(THEMES[(i + 1) % THEMES.length]);
  }

  let observer: MutationObserver | null = null;
  onMounted(() => {
    sync();
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(sync);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
  });
  onBeforeUnmount(() => observer?.disconnect());

  return { theme, set, cycle };
}
