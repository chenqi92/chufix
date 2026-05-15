<script setup lang="ts" generic="T">
import { computed, ref, onBeforeUnmount } from 'vue';
import {
  type SortableItemSnapshot,
  snapshotItems,
  findInsertIndex,
  shiftForIndex,
} from '../sortable/variants';
import {
  type ReorderColumn,
  type ReorderTableReorderEvent,
  gridTemplateForColumns,
} from './variants';

const props = withDefaults(
  defineProps<{
    rows: T[];
    columns: ReorderColumn<T>[];
    rowKey: keyof T | ((row: T, index: number) => string | number);
    disabled?: boolean;
    handleWidth?: string;
    striped?: boolean;
    animation?: number;
    threshold?: number;
  }>(),
  {
    handleWidth: '36px',
    striped: false,
    animation: 180,
    threshold: 4,
  },
);

const emit = defineEmits<{
  (e: 'update:rows', rows: T[]): void;
  (e: 'reorder', payload: ReorderTableReorderEvent<T>): void;
}>();

defineSlots<{
  [key: `cell-${string}`]: (props: { row: T; index: number; value: unknown }) => unknown;
}>();

const body = ref<HTMLElement | null>(null);
const draggingIndex = ref<number | null>(null);
const insertIndex = ref<number | null>(null);
const dragOffset = ref(0);

let pointerId = -1;
let snaps: SortableItemSnapshot[] = [];
let startY = 0;
let started = false;
let cancelled = false;
let activeEl: HTMLElement | null = null;

const template = computed(() => gridTemplateForColumns(props.columns, props.handleWidth));

function getKeyOf(row: T, index: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index);
  return row[props.rowKey] as unknown as string | number;
}

function cellValue(col: ReorderColumn<T>, row: T): unknown {
  return row[col.key as keyof T];
}

function onHandleDown(ev: PointerEvent, index: number) {
  if (ev.button !== undefined && ev.button !== 0) return;
  if (props.disabled) return;
  ev.stopPropagation();
  const rowEl = (ev.currentTarget as HTMLElement)?.closest('.cf-rtable__row') as HTMLElement | null;
  if (!rowEl) return;
  draggingIndex.value = index;
  insertIndex.value = index;
  pointerId = ev.pointerId;
  startY = ev.clientY;
  started = false;
  cancelled = false;
  activeEl = rowEl;
  try {
    rowEl.setPointerCapture(ev.pointerId);
  } catch {}
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onCancel);
  window.addEventListener('keydown', onKey);
}

function onMove(ev: PointerEvent) {
  if (ev.pointerId !== pointerId || draggingIndex.value == null) return;
  const dy = ev.clientY - startY;
  if (!started) {
    if (Math.abs(dy) < props.threshold) return;
    started = true;
    if (body.value) snaps = snapshotItems(body.value, 'y');
  }
  dragOffset.value = dy;
  insertIndex.value = findInsertIndex(snaps, draggingIndex.value, dy, 'y');
}

function onKey(ev: KeyboardEvent) {
  if (ev.key === 'Escape') {
    cancelled = true;
    onUp({ pointerId } as PointerEvent);
  }
}

function onCancel(_ev: PointerEvent) {
  cancelled = true;
  onUp(_ev);
}

function onUp(_ev: PointerEvent) {
  if (draggingIndex.value == null) return;
  const from = draggingIndex.value;
  const to = insertIndex.value ?? from;
  if (activeEl) {
    try {
      activeEl.releasePointerCapture(pointerId);
    } catch {}
  }
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onCancel);
  window.removeEventListener('keydown', onKey);
  if (started && !cancelled && from !== to) {
    const next = props.rows.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    emit('update:rows', next);
    emit('reorder', { from, to, rows: next });
  }
  draggingIndex.value = null;
  insertIndex.value = null;
  dragOffset.value = 0;
  snaps = [];
  started = false;
  activeEl = null;
  pointerId = -1;
}

function transformFor(index: number): string {
  if (draggingIndex.value == null || !started) return '';
  if (index === draggingIndex.value) {
    return `translate3d(0, ${dragOffset.value}px, 0)`;
  }
  const ins = insertIndex.value ?? draggingIndex.value;
  const draggedSize = snaps[draggingIndex.value]?.size ?? 0;
  const shift = shiftForIndex(index, draggingIndex.value, ins, draggedSize);
  return shift === 0 ? '' : `translate3d(0, ${shift}px, 0)`;
}

function transitionFor(index: number): string {
  if (draggingIndex.value == null) return '';
  if (index === draggingIndex.value) return 'none';
  return `transform ${props.animation}ms var(--ease-out)`;
}

onBeforeUnmount(() => {
  if (draggingIndex.value != null) {
    cancelled = true;
    onUp({ pointerId } as PointerEvent);
  }
});
</script>

<template>
  <div
    class="cf-rtable"
    :class="{ 'is-disabled': disabled, 'is-striped': striped, 'is-dragging': draggingIndex !== null }"
  >
    <div class="cf-rtable__head" :style="{ gridTemplateColumns: template }">
      <div class="cf-rtable__cell cf-rtable__cell--handle" />
      <div
        v-for="col in columns"
        :key="col.key"
        class="cf-rtable__cell"
        :class="col.align && `cf-rtable__cell--${col.align}`"
      >
        {{ col.label ?? '' }}
      </div>
    </div>
    <div ref="body" class="cf-rtable__body">
      <div
        v-for="(row, index) in rows"
        :key="getKeyOf(row, index)"
        class="cf-rtable__row"
        :class="{ 'is-dragging': draggingIndex === index }"
        :style="{
          gridTemplateColumns: template,
          transform: transformFor(index),
          transition: transitionFor(index),
        }"
      >
        <button
          type="button"
          class="cf-rtable__handle"
          :disabled="disabled"
          aria-label="drag to reorder"
          @pointerdown="(e) => onHandleDown(e, index)"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="6" cy="4" r="1.2" fill="currentColor" />
            <circle cx="10" cy="4" r="1.2" fill="currentColor" />
            <circle cx="6" cy="8" r="1.2" fill="currentColor" />
            <circle cx="10" cy="8" r="1.2" fill="currentColor" />
            <circle cx="6" cy="12" r="1.2" fill="currentColor" />
            <circle cx="10" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </button>
        <div
          v-for="col in columns"
          :key="col.key"
          class="cf-rtable__cell"
          :class="col.align && `cf-rtable__cell--${col.align}`"
        >
          <slot
            :name="`cell-${col.key}`"
            :row="row"
            :index="index"
            :value="cellValue(col, row)"
          >
            {{ cellValue(col, row) ?? '' }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
