import { useCallback, useEffect, useState } from 'react';

export type ChuFixDensity = 'comfortable' | 'compact';

export interface DensityApi {
  density: ChuFixDensity;
  set: (d: ChuFixDensity) => void;
  toggle: () => void;
}

function readDensity(): ChuFixDensity {
  if (typeof document === 'undefined') return 'comfortable';
  return document.documentElement.dataset.density === 'compact' ? 'compact' : 'comfortable';
}

/**
 * Read and switch the ChuFix density via `[data-density]` on `<html>`.
 */
export function useDensity(): DensityApi {
  const [density, setDensity] = useState<ChuFixDensity>(() => readDensity());

  const set = useCallback((next: ChuFixDensity) => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.density = next;
    setDensity(next);
  }, []);

  const toggle = useCallback(() => {
    setDensity((current) => {
      const next: ChuFixDensity = current === 'compact' ? 'comfortable' : 'compact';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.density = next;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(() => setDensity(readDensity()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-density'],
    });
    return () => observer.disconnect();
  }, []);

  return { density, set, toggle };
}
