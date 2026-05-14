import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export type ChuFixDensity = 'comfortable' | 'compact';

export interface DensityApi {
  density: Ref<ChuFixDensity>;
  set: (d: ChuFixDensity) => void;
  toggle: () => void;
}

function readDensity(): ChuFixDensity {
  if (typeof document === 'undefined') return 'comfortable';
  return document.documentElement.dataset.density === 'compact' ? 'compact' : 'comfortable';
}

/**
 * Read and switch the ChuFix density via `[data-density]` on `<html>`.
 *
 * @example
 * const { density, toggle } = useDensity();
 * toggle();
 */
export function useDensity(): DensityApi {
  const density = ref<ChuFixDensity>('comfortable');

  function sync() {
    density.value = readDensity();
  }
  function set(next: ChuFixDensity) {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.density = next;
    density.value = next;
  }
  function toggle() {
    set(density.value === 'compact' ? 'comfortable' : 'compact');
  }

  let observer: MutationObserver | null = null;
  onMounted(() => {
    sync();
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(sync);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-density'] });
    }
  });
  onBeforeUnmount(() => observer?.disconnect());

  return { density, set, toggle };
}
