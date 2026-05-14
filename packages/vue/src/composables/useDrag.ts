import { onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue';

type MaybeRef<T> = T | Ref<T>;
type DragAxis = 'x' | 'y' | 'both';

export interface DragState {
  /** Accumulated horizontal displacement since pointerdown (px). */
  dx: number;
  /** Accumulated vertical displacement since pointerdown (px). */
  dy: number;
  /** Horizontal velocity over the last ~100ms window (px/ms). */
  vx: number;
  /** Vertical velocity over the last ~100ms window (px/ms). */
  vy: number;
  /** Milliseconds since pointerdown. */
  duration: number;
  /** Pointer id from the originating event. */
  pointerId: number;
  /** Originating pointer event (for currentTarget / metaKey / etc.). */
  event: PointerEvent;
  /** Release pointer capture and abort. Subsequent move/up are ignored. */
  cancel: () => void;
}

export interface DragOptions {
  /** Restrict tracked axis. Default 'both'. */
  axis?: DragAxis;
  /** Movement threshold before onStart fires (px). Default 4. */
  threshold?: number;
  /** Clamp displacement to {min, max} on the active axis (single-axis only). */
  bounds?: { min?: number; max?: number };
  /** Fires once movement exceeds `threshold`. */
  onStart?: (state: DragState) => void;
  /** Fires on every pointermove after onStart. */
  onMove?: (state: DragState) => void;
  /** Fires on pointerup / pointercancel / cancel(). */
  onEnd?: (state: DragState) => void;
}

interface VelocitySample {
  t: number;
  x: number;
  y: number;
}

/**
 * Pointer-capture drag base for sheets / swipe / sliders.
 * Set CSS `touch-action: none` (or matching axis value) on the target
 * to opt out of native scroll while dragging.
 */
export function useDrag(target: MaybeRef<HTMLElement | null>, options: DragOptions = {}) {
  const axis = options.axis ?? 'both';
  const threshold = options.threshold ?? 4;
  let attached: HTMLElement | null = null;

  let startX = 0;
  let startY = 0;
  let startedAt = 0;
  let active = false;
  let started = false;
  let pointerId = -1;
  let samples: VelocitySample[] = [];

  function buildState(ev: PointerEvent): DragState {
    let dx = axis === 'y' ? 0 : ev.clientX - startX;
    let dy = axis === 'x' ? 0 : ev.clientY - startY;
    if (options.bounds && axis !== 'both') {
      const { min, max } = options.bounds;
      if (axis === 'x') {
        if (typeof min === 'number') dx = Math.max(min, dx);
        if (typeof max === 'number') dx = Math.min(max, dx);
      } else {
        if (typeof min === 'number') dy = Math.max(min, dy);
        if (typeof max === 'number') dy = Math.min(max, dy);
      }
    }
    const now = performance.now();
    samples.push({ t: now, x: dx, y: dy });
    const cutoff = now - 100;
    while (samples.length > 2 && samples[0].t < cutoff) samples.shift();
    const oldest = samples[0];
    const span = now - oldest.t || 1;
    const vx = (dx - oldest.x) / span;
    const vy = (dy - oldest.y) / span;
    return {
      dx,
      dy,
      vx,
      vy,
      duration: now - startedAt,
      pointerId,
      event: ev,
      cancel: stop,
    };
  }

  function onPointerDown(ev: PointerEvent) {
    if (ev.button !== undefined && ev.button !== 0) return;
    if (!attached) return;
    active = true;
    started = false;
    startX = ev.clientX;
    startY = ev.clientY;
    startedAt = performance.now();
    pointerId = ev.pointerId;
    samples = [{ t: startedAt, x: 0, y: 0 }];
    try {
      attached.setPointerCapture(ev.pointerId);
    } catch {}
    attached.addEventListener('pointermove', onPointerMove);
    attached.addEventListener('pointerup', onPointerUp);
    attached.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(ev: PointerEvent) {
    if (!active || ev.pointerId !== pointerId) return;
    const state = buildState(ev);
    if (!started) {
      const moved = axis === 'x' ? Math.abs(state.dx) : axis === 'y' ? Math.abs(state.dy) : Math.hypot(state.dx, state.dy);
      if (moved < threshold) return;
      started = true;
      options.onStart?.(state);
    }
    options.onMove?.(state);
  }

  function onPointerUp(ev: PointerEvent) {
    if (!active || ev.pointerId !== pointerId) return;
    const state = buildState(ev);
    stop();
    if (started) options.onEnd?.(state);
  }

  function stop() {
    if (!active) return;
    active = false;
    if (attached) {
      try {
        attached.releasePointerCapture(pointerId);
      } catch {}
      attached.removeEventListener('pointermove', onPointerMove);
      attached.removeEventListener('pointerup', onPointerUp);
      attached.removeEventListener('pointercancel', onPointerUp);
    }
  }

  function attach() {
    const t = unref(target);
    if (!t || t === attached) return;
    detach();
    attached = t;
    attached.addEventListener('pointerdown', onPointerDown);
  }

  function detach() {
    if (!attached) return;
    stop();
    attached.removeEventListener('pointerdown', onPointerDown);
    attached = null;
  }

  watch(() => unref(target), attach, { flush: 'post' });
  onMounted(attach);
  onBeforeUnmount(detach);

  return { stop };
}
