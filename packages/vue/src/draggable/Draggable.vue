<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDraggable } from '../composables/useDraggable';
import { useDragDrop } from '../composables/useDragDrop';
import type { DragPayload } from '../composables/dndStore';

const props = withDefaults(
  defineProps<{
    type?: string;
    data?: unknown;
    payload?: DragPayload;
    handle?: string;
    disabled?: boolean;
    preview?: 'self' | 'ghost' | 'none';
  }>(),
  {
    type: 'default',
    preview: 'ghost',
  },
);

const emit = defineEmits<{
  (e: 'drag-start'): void;
  (e: 'drag-end', dropped: boolean): void;
}>();

const root = ref<HTMLElement | null>(null);
const dnd = useDragDrop();

useDraggable(root, {
  payload: () => props.payload ?? { type: props.type, data: props.data },
  handle: props.handle,
  disabled: computed(() => props.disabled),
  onStart: () => emit('drag-start'),
  onEnd: (dropped) => emit('drag-end', dropped),
});

const isDragging = computed(() => dnd.active && dnd.source === root.value);

const rootClass = computed(() => [
  'cf-draggable',
  isDragging.value && 'is-dragging',
  props.disabled && 'is-disabled',
  props.preview === 'ghost' && isDragging.value && 'cf-draggable--ghost',
  props.preview === 'none' && isDragging.value && 'cf-draggable--hidden',
]);
</script>

<template>
  <div ref="root" :class="rootClass">
    <slot :is-dragging="isDragging" />
  </div>
</template>
