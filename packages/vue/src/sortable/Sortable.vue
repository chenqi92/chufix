<script setup lang="ts" generic="T">
import { computed, ref, onBeforeUnmount, nextTick } from 'vue';
import {
  type SortableAxis,
  type SortableItemSnapshot,
  type SortableReorderEvent,
  snapshotItems,
  findInsertIndex,
  shiftForIndex,
} from './variants';

const props = withDefaults(
  defineProps<{
    items: T[];
    itemKey: keyof T | ((item: T, index: number) => string | number);
    axis?: SortableAxis;
    handle?: string;
    disabled?: boolean;
    tag?: string;
    threshold?: number;
    animation?: number;
  }>(),
  {
    axis: 'y',
    tag: 'div',
    threshold: 4,
    animation: 180,
  },
);

const emit = defineEmits<{
  (e: 'update:items', items: T[]): void;
  (e: 'reorder', payload: SortableReorderEvent<T>): void;
  (e: 'drag-start', payload: { item: T; index: number }): void;
  (e: 'drag-end', payload: { item: T; index: number; cancelled: boolean }): void;
}>();

const host = ref<HTMLElement | null>(null);
const draggingIndex = ref<number | null>(null);
const insertIndex = ref<number | null>(null);
const dragOffset = ref(0);
const dragLateral = ref(0);

let pointerId = -1;
let snaps: SortableItemSnapshot[] = [];
let startClientX = 0;
let startClientY = 0;
let started = false;
let cancelled = false;
let activeEl: HTMLElement | null = null;

function getKeyOf(item: T, index: number): string | number {
  if (typeof props.itemKey === 'function') return props.itemKey(item, index);
  const v = item[props.itemKey];
  return v as unknown as string | number;
}

function matchHandle(ev: PointerEvent, itemEl: HTMLElement): boolean {
  if (!props.handle) return true;
  const t = ev.target as Element | null;
  return !!(t && t.closest(props.handle) && itemEl.contains(t));
}

function onPointerDown(ev: PointerEvent, index: number) {
  if (ev.button !== undefined && ev.button !== 0) return;
  if (props.disabled) return;
  const target = (ev.currentTarget as HTMLElement) ?? null;
  if (!target) return;
  if (!matchHandle(ev, target)) return;
  draggingIndex.value = index;
  insertIndex.value = index;
  pointerId = ev.pointerId;
  startClientX = ev.clientX;
  startClientY = ev.clientY;
  started = false;
  cancelled = false;
  activeEl = target;
  try {
    target.setPointerCapture(ev.pointerId);
  } catch {}
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
  window.addEventListener('keydown', onKeyDown);
}

function onPointerMove(ev: PointerEvent) {
  if (ev.pointerId !== pointerId || draggingIndex.value == null) return;
  const dx = ev.clientX - startClientX;
  const dy = ev.clientY - startClientY;
  const axisD = props.axis === 'y' ? dy : dx;
  const lateral = props.axis === 'y' ? dx : dy;
  if (!started) {
    if (Math.hypot(dx, dy) < (props.threshold ?? 4)) return;
    started = true;
    if (host.value) snaps = snapshotItems(host.value, props.axis);
    emit('drag-start', { item: props.items[draggingIndex.value], index: draggingIndex.value });
  }
  dragOffset.value = axisD;
  dragLateral.value = lateral;
  insertIndex.value = findInsertIndex(snaps, draggingIndex.value, axisD, props.axis);
}

function onKeyDown(ev: KeyboardEvent) {
  if (ev.key === 'Escape' && draggingIndex.value != null) {
    cancelled = true;
    onPointerUp({ pointerId } as PointerEvent);
  }
}

function onPointerUp(_ev: PointerEvent) {
  if (draggingIndex.value == null) return;
  const from = draggingIndex.value;
  const to = insertIndex.value ?? from;
  if (activeEl) {
    try {
      activeEl.releasePointerCapture(pointerId);
    } catch {}
  }
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerCancel);
  window.removeEventListener('keydown', onKeyDown);
  if (started && !cancelled && from !== to) {
    const next = props.items.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    emit('update:items', next);
    emit('reorder', { from, to, items: next });
  }
  emit('drag-end', {
    item: props.items[from],
    index: from,
    cancelled: cancelled || from === to,
  });
  draggingIndex.value = null;
  insertIndex.value = null;
  dragOffset.value = 0;
  dragLateral.value = 0;
  snaps = [];
  started = false;
  activeEl = null;
  pointerId = -1;
}

function onPointerCancel(ev: PointerEvent) {
  cancelled = true;
  onPointerUp(ev);
}

function transformFor(index: number): string {
  if (draggingIndex.value == null || !started) return '';
  if (index === draggingIndex.value) {
    const tx = props.axis === 'y' ? dragLateral.value : dragOffset.value;
    const ty = props.axis === 'y' ? dragOffset.value : dragLateral.value;
    return `translate3d(${tx}px, ${ty}px, 0)`;
  }
  const ins = insertIndex.value ?? draggingIndex.value;
  const draggedSize = snaps[draggingIndex.value]?.size ?? 0;
  const shift = shiftForIndex(index, draggingIndex.value, ins, draggedSize);
  if (shift === 0) return '';
  return props.axis === 'y'
    ? `translate3d(0, ${shift}px, 0)`
    : `translate3d(${shift}px, 0, 0)`;
}

function transitionFor(index: number): string {
  if (draggingIndex.value == null) return '';
  if (index === draggingIndex.value) return 'none';
  return `transform ${props.animation}ms var(--ease-out)`;
}

const rootClass = computed(() => [
  'cf-sortable',
  `cf-sortable--${props.axis}`,
  draggingIndex.value != null && 'is-dragging',
  props.disabled && 'is-disabled',
]);

onBeforeUnmount(() => {
  if (draggingIndex.value != null) {
    cancelled = true;
    onPointerUp({ pointerId } as PointerEvent);
  }
});
</script>

<template>
  <component :is="tag" ref="host" :class="rootClass">
    <div
      v-for="(item, index) in items"
      :key="getKeyOf(item, index)"
      class="cf-sortable__item"
      :class="{
        'is-dragging': draggingIndex === index,
        'is-shifted': draggingIndex !== null && draggingIndex !== index && transformFor(index) !== '',
      }"
      :style="{ transform: transformFor(index), transition: transitionFor(index) }"
      @pointerdown="onPointerDown($event, index)"
    >
      <slot
        :item="item"
        :index="index"
        :is-dragging="draggingIndex === index"
      />
    </div>
  </component>
</template>
