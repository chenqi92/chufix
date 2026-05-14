import { onBeforeUnmount, watch } from 'vue';

let lockCount = 0;
let originalOverflow: string | null = null;
let originalPaddingRight: string | null = null;

function lock() {
  if (typeof document === 'undefined') return;
  lockCount++;
  if (lockCount === 1) {
    originalOverflow = document.body.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
  }
}

function unlock() {
  if (typeof document === 'undefined') return;
  if (lockCount > 0) lockCount--;
  if (lockCount === 0) {
    document.body.style.overflow = originalOverflow ?? '';
    document.body.style.paddingRight = originalPaddingRight ?? '';
    originalOverflow = null;
    originalPaddingRight = null;
  }
}

/**
 * Lock document body scroll while `enabled` returns true.
 * Reference-counted so multiple modals/drawers stack safely.
 *
 * @example
 * useScrollLock(() => isModalOpen.value);
 */
export function useScrollLock(enabled: () => boolean): () => void {
  let locked = false;

  function sync() {
    const want = enabled();
    if (want && !locked) {
      lock();
      locked = true;
    } else if (!want && locked) {
      unlock();
      locked = false;
    }
  }

  watch(enabled, sync, { immediate: true, flush: 'post' });
  onBeforeUnmount(() => {
    if (locked) {
      unlock();
      locked = false;
    }
  });

  return () => {
    if (locked) {
      unlock();
      locked = false;
    }
  };
}
