import { onBeforeUnmount, onMounted, ref, unref, watch, type Ref } from 'vue';
import { dndStore, type DragPayload } from './dndStore';

type MaybeRef<T> = T | Ref<T>;

export interface UseDroppableOptions {
  accept?: string | string[];
  disabled?: MaybeRef<boolean | undefined>;
  onDrop?: (payload: DragPayload, pointer: { x: number; y: number }) => void;
  onEnter?: (payload: DragPayload) => void;
  onLeave?: (payload: DragPayload) => void;
}

export function useDroppable(target: MaybeRef<HTMLElement | null>, options: UseDroppableOptions = {}) {
  const isOver = ref(false);
  const canDrop = ref(false);
  let attached: HTMLElement | null = null;
  let cleanup: (() => void) | null = null;

  function resolveAccept(): string[] | null {
    if (options.accept === undefined) return null;
    return Array.isArray(options.accept) ? options.accept : [options.accept];
  }

  function attach() {
    const el = unref(target);
    if (!el || el === attached) return;
    detach();
    attached = el;
    if (unref(options.disabled)) return;
    cleanup = dndStore.registerDroppable({
      el,
      accept: resolveAccept(),
      onDrop: (payload, pointer) => {
        isOver.value = false;
        canDrop.value = false;
        options.onDrop?.(payload, pointer);
      },
      onEnter: (payload) => {
        isOver.value = true;
        canDrop.value = true;
        options.onEnter?.(payload);
      },
      onLeave: (payload) => {
        isOver.value = false;
        canDrop.value = false;
        options.onLeave?.(payload);
      },
    });
  }

  function detach() {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    attached = null;
    isOver.value = false;
    canDrop.value = false;
  }

  watch(() => unref(target), attach, { flush: 'post' });
  watch(() => unref(options.disabled), (d) => {
    if (d) detach();
    else attach();
  });
  onMounted(attach);
  onBeforeUnmount(detach);

  return { isOver, canDrop };
}
