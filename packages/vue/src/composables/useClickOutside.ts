import { onBeforeUnmount, onMounted, unref, type Ref } from 'vue';

type MaybeRef<T> = T | Ref<T>;

/**
 * Fire `handler` when a pointerdown happens outside the given element.
 *
 * @example
 * const popoverEl = ref<HTMLElement | null>(null);
 * useClickOutside(popoverEl, () => (open.value = false));
 */
export function useClickOutside(
  target: MaybeRef<HTMLElement | null | undefined>,
  handler: (ev: PointerEvent) => void,
): () => void {
  function onPointerDown(ev: PointerEvent) {
    const el = unref(target);
    if (!el) return;
    if (el.contains(ev.target as Node)) return;
    handler(ev);
  }

  function detach() {
    if (typeof document === 'undefined') return;
    document.removeEventListener('pointerdown', onPointerDown);
  }

  onMounted(() => {
    if (typeof document === 'undefined') return;
    document.addEventListener('pointerdown', onPointerDown);
  });
  onBeforeUnmount(detach);

  return detach;
}
