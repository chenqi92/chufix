import { onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue';
import { dndStore, type DragPayload } from './dndStore';

type MaybeRef<T> = T | Ref<T>;

export interface UseDraggableOptions {
  payload: DragPayload | (() => DragPayload);
  handle?: string;
  disabled?: MaybeRef<boolean | undefined>;
  threshold?: number;
  onStart?: () => void;
  onEnd?: (dropped: boolean) => void;
}

export function useDraggable(target: MaybeRef<HTMLElement | null>, options: UseDraggableOptions) {
  let attached: HTMLElement | null = null;
  let active = false;
  let started = false;
  let startX = 0;
  let startY = 0;
  let pointerId = -1;
  const threshold = options.threshold ?? 4;

  function isDisabled() {
    return !!unref(options.disabled);
  }

  function resolvePayload(): DragPayload {
    return typeof options.payload === 'function' ? options.payload() : options.payload;
  }

  function matchHandle(ev: PointerEvent): boolean {
    if (!options.handle || !attached) return true;
    const target = ev.target as Element | null;
    if (!target) return false;
    return !!target.closest(options.handle);
  }

  function onDown(ev: PointerEvent) {
    if (ev.button !== undefined && ev.button !== 0) return;
    if (isDisabled() || !attached) return;
    if (!matchHandle(ev)) return;
    active = true;
    started = false;
    startX = ev.clientX;
    startY = ev.clientY;
    pointerId = ev.pointerId;
    try {
      attached.setPointerCapture(ev.pointerId);
    } catch {}
    attached.addEventListener('pointermove', onMove);
    attached.addEventListener('pointerup', onUp);
    attached.addEventListener('pointercancel', onCancel);
  }

  function onMove(ev: PointerEvent) {
    if (!active || ev.pointerId !== pointerId || !attached) return;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    if (!started) {
      if (Math.hypot(dx, dy) < threshold) return;
      started = true;
      dndStore.start(resolvePayload(), attached, ev.clientX, ev.clientY);
      options.onStart?.();
    } else {
      dndStore.move(ev.clientX, ev.clientY);
    }
  }

  function onUp(ev: PointerEvent) {
    if (!active || ev.pointerId !== pointerId) return;
    const dropped = started && !!dndStore.get().over;
    stop();
    if (started) {
      dndStore.end();
      options.onEnd?.(dropped);
    }
  }

  function onCancel(ev: PointerEvent) {
    if (!active || ev.pointerId !== pointerId) return;
    stop();
    if (started) {
      dndStore.cancel();
      options.onEnd?.(false);
    }
  }

  function stop() {
    if (!active) return;
    active = false;
    started = false;
    if (attached) {
      try {
        attached.releasePointerCapture(pointerId);
      } catch {}
      attached.removeEventListener('pointermove', onMove);
      attached.removeEventListener('pointerup', onUp);
      attached.removeEventListener('pointercancel', onCancel);
    }
  }

  function attach() {
    const el = unref(target);
    if (!el || el === attached) return;
    detach();
    attached = el;
    attached.addEventListener('pointerdown', onDown);
  }

  function detach() {
    if (!attached) return;
    stop();
    attached.removeEventListener('pointerdown', onDown);
    attached = null;
  }

  watch(() => unref(target), attach, { flush: 'post' });
  onMounted(attach);
  onBeforeUnmount(detach);

  return { cancel: () => dndStore.cancel() };
}
