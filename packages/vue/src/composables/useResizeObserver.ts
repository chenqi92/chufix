import { onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue';

type MaybeRef<T> = T | Ref<T>;

/**
 * Watch an element's size via ResizeObserver.
 *
 * @example
 * const panelEl = ref<HTMLElement | null>(null);
 * useResizeObserver(panelEl, ([entry]) => {
 *   const { width, height } = entry.contentRect;
 * });
 */
export function useResizeObserver(
  target: MaybeRef<Element | null | undefined>,
  callback: ResizeObserverCallback,
): () => void {
  let observer: ResizeObserver | null = null;
  let attached: Element | null = null;

  function attach() {
    if (typeof window === 'undefined' || !('ResizeObserver' in window)) return;
    const el = unref(target);
    if (!el || el === attached) return;
    detach();
    observer = new ResizeObserver(callback);
    observer.observe(el);
    attached = el;
  }
  function detach() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    attached = null;
  }

  watch(() => unref(target), attach, { flush: 'post' });
  onMounted(attach);
  onBeforeUnmount(detach);

  return detach;
}
