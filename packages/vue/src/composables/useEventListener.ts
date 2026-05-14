import { onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue';

type TargetLike = EventTarget | null | undefined;
type MaybeRef<T> = T | Ref<T>;

/**
 * Subscribe to a DOM event for the lifetime of the calling component.
 * Auto-cleans up on unmount. `target` can be a ref or a direct element.
 *
 * @example
 * useEventListener(window, 'resize', () => { ... });
 * useEventListener(buttonRef, 'click', (ev) => { ... });
 */
export function useEventListener<K extends keyof WindowEventMap>(
  target: Window,
  event: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: MaybeRef<TargetLike>,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function useEventListener(
  target: MaybeRef<TargetLike>,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions,
): () => void;
export function useEventListener(
  target: MaybeRef<TargetLike>,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions,
) {
  let attachedTo: EventTarget | null = null;

  function attach() {
    const t = unref(target);
    if (!t || t === attachedTo) return;
    detach();
    t.addEventListener(event, handler, options);
    attachedTo = t;
  }
  function detach() {
    if (attachedTo) {
      attachedTo.removeEventListener(event, handler, options);
      attachedTo = null;
    }
  }

  // If target is reactive, re-attach when it changes.
  watch(() => unref(target), attach, { flush: 'post' });
  onMounted(attach);
  onBeforeUnmount(detach);

  return detach;
}
