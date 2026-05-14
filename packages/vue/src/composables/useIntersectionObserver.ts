import { onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue';

type MaybeRef<T> = T | Ref<T>;

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Stop observing after the first time `isIntersecting` becomes true. Default false. */
  once?: boolean;
}

/**
 * Watch an element's visibility via IntersectionObserver.
 *
 * @example
 * const lazyImg = ref<HTMLImageElement | null>(null);
 * useIntersectionObserver(lazyImg, ([entry]) => {
 *   if (entry.isIntersecting) loadImage();
 * }, { once: true });
 */
export function useIntersectionObserver(
  target: MaybeRef<Element | null | undefined>,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
): () => void {
  let observer: IntersectionObserver | null = null;
  let attached: Element | null = null;

  function attach() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const el = unref(target);
    if (!el || el === attached) return;
    detach();
    observer = new IntersectionObserver((entries, obs) => {
      callback(entries, obs);
      if (options.once && entries.some((e) => e.isIntersecting)) {
        obs.disconnect();
        observer = null;
      }
    }, options);
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
