<script setup lang="ts">
import { computed, ref } from 'vue';
import { useResizeObserver } from '../composables/useResizeObserver';
import { resolveColumns, type FormGridProps } from './variants';

const props = withDefaults(defineProps<FormGridProps>(), {
  columns: () => ({ sm: 1, md: 2 }),
  gap: 16,
});

const rootRef = ref<HTMLDivElement | null>(null);
const width = ref(typeof window === 'undefined' ? 1024 : window.innerWidth);

useResizeObserver(rootRef, (entries) => {
  width.value = entries[0]?.contentRect.width ?? width.value;
});

const cols = computed(() => resolveColumns(props.columns, width.value));
const style = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
  gap: `${props.gap}px`,
}));
</script>

<template>
  <div ref="rootRef" class="cf-formgrid" :style="style">
    <slot />
  </div>
</template>
