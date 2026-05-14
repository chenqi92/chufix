import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Trap keyboard focus inside `container` while `enabled` is true.
 *
 * @example
 * const modal = useRef<HTMLDivElement>(null);
 * useFocusTrap(modal, isOpen);
 */
export function useFocusTrap(container: RefObject<HTMLElement | null>, enabled: boolean) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !container.current) return;
    const el = container.current;
    previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
    const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (item) => !item.hasAttribute('disabled') && item.tabIndex >= 0,
    );
    if (items[0]) items[0].focus();

    function onKeyDown(ev: KeyboardEvent) {
      if (ev.key !== 'Tab') return;
      const focusables = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (item) => !item.hasAttribute('disabled') && item.tabIndex >= 0,
      );
      if (!focusables.length) {
        ev.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (ev.shiftKey) {
        if (active === first || !el.contains(active)) {
          ev.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          ev.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus?.();
      previouslyFocused.current = null;
    };
  }, [container, enabled]);
}
