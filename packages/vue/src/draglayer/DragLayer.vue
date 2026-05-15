<script setup lang="ts">
import { computed } from 'vue';
import { useDragDrop } from '../composables/useDragDrop';

const props = withDefaults(
  defineProps<{
    offsetX?: number;
    offsetY?: number;
  }>(),
  {
    offsetX: 12,
    offsetY: 12,
  },
);

const dnd = useDragDrop();

const style = computed(() => ({
  left: `${dnd.pointer.x + props.offsetX}px`,
  top: `${dnd.pointer.y + props.offsetY}px`,
}));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="dnd.active && dnd.payload"
      class="cf-draglayer"
      :class="{ 'can-drop': dnd.canDrop }"
      :style="style"
    >
      <slot :payload="dnd.payload" :over="dnd.over" :can-drop="dnd.canDrop">
        <div class="cf-draglayer__default">{{ String(dnd.payload?.type ?? '') }}</div>
      </slot>
    </div>
  </Teleport>
</template>
