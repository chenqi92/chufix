<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDroppable } from '../composables/useDroppable';
import type { DragPayload } from '../composables/dndStore';

const props = withDefaults(
  defineProps<{
    accept?: string | string[];
    disabled?: boolean;
  }>(),
  {},
);

const emit = defineEmits<{
  (e: 'drop', payload: DragPayload, pointer: { x: number; y: number }): void;
  (e: 'enter', payload: DragPayload): void;
  (e: 'leave', payload: DragPayload): void;
}>();

const root = ref<HTMLElement | null>(null);

const { isOver, canDrop } = useDroppable(root, {
  accept: props.accept,
  disabled: computed(() => props.disabled),
  onDrop: (payload, pointer) => emit('drop', payload, pointer),
  onEnter: (payload) => emit('enter', payload),
  onLeave: (payload) => emit('leave', payload),
});

const rootClass = computed(() => [
  'cf-droppable',
  isOver.value && 'is-over',
  canDrop.value && 'is-accepting',
  props.disabled && 'is-disabled',
]);
</script>

<template>
  <div ref="root" :class="rootClass">
    <slot :is-over="isOver" :can-drop="canDrop" />
  </div>
</template>
