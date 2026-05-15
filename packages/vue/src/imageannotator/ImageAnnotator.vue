<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  type AnnotationTone,
  type ImageAnnotation,
  clampNorm,
} from './variants';

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    annotations: ImageAnnotation[];
    readonly?: boolean;
    addMode?: 'click' | 'manual';
    selectedId?: string;
    defaultTone?: AnnotationTone;
  }>(),
  {
    alt: '',
    addMode: 'click',
    defaultTone: 'info',
  },
);

const emit = defineEmits<{
  (e: 'update:annotations', list: ImageAnnotation[]): void;
  (e: 'add', annotation: ImageAnnotation): void;
  (e: 'update', annotation: ImageAnnotation): void;
  (e: 'delete', id: string): void;
  (e: 'select', id: string): void;
}>();

const surface = ref<HTMLDivElement | null>(null);
const draggingId = ref<string | null>(null);
let pointerId = -1;

function nextId(): string {
  return `pin-${Math.random().toString(36).slice(2, 9)}`;
}

function onSurfacePointerDown(ev: PointerEvent) {
  if (props.readonly || props.addMode !== 'click') return;
  if (ev.button !== undefined && ev.button !== 0) return;
  if ((ev.target as Element)?.closest('.cf-annot__pin')) return;
  if (!surface.value) return;
  const rect = surface.value.getBoundingClientRect();
  const x = clampNorm((ev.clientX - rect.left) / rect.width);
  const y = clampNorm((ev.clientY - rect.top) / rect.height);
  const a: ImageAnnotation = { id: nextId(), x, y, tone: props.defaultTone };
  emit('update:annotations', [...props.annotations, a]);
  emit('add', a);
  emit('select', a.id);
}

function onPinPointerDown(ev: PointerEvent, id: string) {
  if (props.readonly) return;
  ev.stopPropagation();
  if (ev.button !== undefined && ev.button !== 0) return;
  draggingId.value = id;
  pointerId = ev.pointerId;
  try {
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  } catch {}
  window.addEventListener('pointermove', onPinPointerMove);
  window.addEventListener('pointerup', onPinPointerUp);
  emit('select', id);
}

function onPinPointerMove(ev: PointerEvent) {
  if (!draggingId.value || ev.pointerId !== pointerId || !surface.value) return;
  const rect = surface.value.getBoundingClientRect();
  const x = clampNorm((ev.clientX - rect.left) / rect.width);
  const y = clampNorm((ev.clientY - rect.top) / rect.height);
  const next = props.annotations.map((a) => (a.id === draggingId.value ? { ...a, x, y } : a));
  const moved = next.find((a) => a.id === draggingId.value);
  emit('update:annotations', next);
  if (moved) emit('update', moved);
}

function onPinPointerUp(_ev: PointerEvent) {
  if (!draggingId.value) return;
  draggingId.value = null;
  pointerId = -1;
  window.removeEventListener('pointermove', onPinPointerMove);
  window.removeEventListener('pointerup', onPinPointerUp);
}

function deletePin(id: string) {
  if (props.readonly) return;
  const next = props.annotations.filter((a) => a.id !== id);
  emit('update:annotations', next);
  emit('delete', id);
}

const rootClass = computed(() => [
  'cf-annot',
  props.readonly && 'is-readonly',
]);
</script>

<template>
  <div :class="rootClass">
    <div
      ref="surface"
      class="cf-annot__surface"
      @pointerdown="onSurfacePointerDown"
    >
      <img :src="src" :alt="alt" class="cf-annot__img" draggable="false" />
      <div
        v-for="a in annotations"
        :key="a.id"
        class="cf-annot__pin"
        :class="[
          `cf-annot__pin--${a.tone ?? defaultTone}`,
          { 'is-selected': selectedId === a.id, 'is-dragging': draggingId === a.id },
        ]"
        :style="{ left: `${a.x * 100}%`, top: `${a.y * 100}%` }"
        :title="a.label ?? ''"
        @pointerdown="(e) => onPinPointerDown(e, a.id)"
        @click.stop="$emit('select', a.id)"
      >
        <span class="cf-annot__dot" />
        <span v-if="a.label" class="cf-annot__label">{{ a.label }}</span>
        <button
          v-if="!readonly && selectedId === a.id"
          type="button"
          class="cf-annot__remove"
          aria-label="delete"
          @click.stop="deletePin(a.id)"
        >×</button>
      </div>
    </div>
  </div>
</template>
