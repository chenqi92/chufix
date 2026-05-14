import { onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue';

type MaybeRef<T> = T | Ref<T>;

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
 * - Tab from the last focusable wraps to the first
 * - Shift+Tab from the first wraps to the last
 * - On enable, focuses the first focusable
 * - On disable, restores focus to the previously-focused element
 *
 * @example
 * useFocusTrap(modalEl, () => isOpen.value);
 */
export function useFocusTrap(
  container: MaybeRef<HTMLElement | null | undefined>,
  enabled: () => boolean,
): () => void {
  let previouslyFocused: HTMLElement | null = null;

  function focusables(): HTMLElement[] {
    const el = unref(container);
    if (!el) return [];
    return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (item) => !item.hasAttribute('disabled') && item.tabIndex >= 0,
    );
  }

  function onKeyDown(ev: KeyboardEvent) {
    if (!enabled() || ev.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) {
      ev.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (ev.shiftKey) {
      if (active === first || !unref(container)?.contains(active)) {
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

  function activate() {
    if (typeof document === 'undefined') return;
    previouslyFocused = document.activeElement as HTMLElement | null;
    const first = focusables()[0];
    if (first) first.focus();
    document.addEventListener('keydown', onKeyDown);
  }

  function deactivate() {
    if (typeof document === 'undefined') return;
    document.removeEventListener('keydown', onKeyDown);
    previouslyFocused?.focus?.();
    previouslyFocused = null;
  }

  watch(
    () => enabled(),
    (on) => {
      if (on) activate();
      else deactivate();
    },
    { flush: 'post' },
  );

  onMounted(() => {
    if (enabled()) activate();
  });
  onBeforeUnmount(deactivate);

  return deactivate;
}
