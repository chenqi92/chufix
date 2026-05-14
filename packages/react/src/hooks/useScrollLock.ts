import { useEffect } from 'react';

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
 * Lock document body scroll while `enabled` is true. Reference-counted.
 */
export function useScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    lock();
    return unlock;
  }, [enabled]);
}
