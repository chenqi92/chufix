import { useCallback, useEffect, useState } from 'react';

export type ChuFixTheme = 'dark-cool' | 'dark-warm' | 'light';
const THEMES: ChuFixTheme[] = ['dark-cool', 'dark-warm', 'light'];

export interface ThemeApi {
  theme: ChuFixTheme;
  set: (t: ChuFixTheme) => void;
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
 */
export function useTheme(): ThemeApi {
  const [theme, setTheme] = useState<ChuFixTheme>(() => readTheme());

  const set = useCallback((next: ChuFixTheme) => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, []);

  const cycle = useCallback(() => {
    setTheme((current) => {
      const i = THEMES.indexOf(current);
      const next = THEMES[(i + 1) % THEMES.length];
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = next;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return { theme, set, cycle };
}
