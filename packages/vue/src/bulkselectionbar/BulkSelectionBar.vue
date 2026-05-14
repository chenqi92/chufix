<script setup lang="ts">
import { computed } from 'vue';
import type { BulkSelectionBarProps } from './variants';

const props = withDefaults(defineProps<BulkSelectionBarProps>(), {
  hideWhenEmpty: true,
  position: 'sticky-bottom',
  showClear: true,
  clearLabel: '清空',
});

const emit = defineEmits<{
  (e: 'clear'): void;
}>();

const visible = computed(() => !props.hideWhenEmpty || props.count > 0);
const labelText = computed(() => {
  if (props.label) return props.label;
  if (props.total != null) return `已选 ${props.count} / ${props.total}`;
  return `已选 ${props.count} 项`;
});
</script>

<template>
  <Transition name="cf-bulkbar">
    <div
      v-if="visible"
      :class="['cf-bulkbar', `cf-bulkbar--${position}`]"
      role="region"
      aria-label="批量操作"
    >
      <span class="cf-bulkbar__count">{{ labelText }}</span>
      <div class="cf-bulkbar__actions">
        <slot />
      </div>
      <button
        v-if="showClear"
        type="button"
        class="cf-bulkbar__clear"
        @click="emit('clear')"
      >{{ clearLabel }}</button>
    </div>
  </Transition>
</template>
