/* Pure-DOM helpers for Modal: focus trap + body scroll lock.
 * No deps; framework-agnostic. The Vue Modal calls these from lifecycle hooks. */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
  );
}

export interface FocusTrap {
  release: () => void;
}

export function trapFocus(container: HTMLElement): FocusTrap {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const focusables = getFocusable(container);
  (focusables[0] ?? container).focus({ preventScroll: true });

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const list = getFocusable(container);
    if (list.length === 0) {
      e.preventDefault();
      container.focus();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || !container.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      e.preventDefault();
      first.focus();
    }
  }
  document.addEventListener('keydown', onKeyDown);

  return {
    release: () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    },
  };
}

let lockCount = 0;
let savedOverflow = '';
let savedPaddingRight = '';

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    const body = document.body;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    savedOverflow = body.style.overflow;
    savedPaddingRight = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount === 0) {
    const body = document.body;
    body.style.overflow = savedOverflow;
    body.style.paddingRight = savedPaddingRight;
  }
}
