<script setup lang="ts">
import { computed, ref } from 'vue';
import { useResizeObserver } from '../composables/useResizeObserver';
import { computeColumns, type MasonryProps } from './variants';

const props = withDefaults(defineProps<MasonryProps>(), {
  minColumnWidth: 240,
  gap: 12,
});

const rootRef = ref<HTMLDivElement | null>(null);
const width = ref(0);

useResizeObserver(rootRef, (entries) => {
  width.value = entries[0]?.contentRect.width ?? 0;
});

const cols = computed(() => computeColumns(width.value || 800, { columns: props.columns, minColumnWidth: props.minColumnWidth }));

const containerStyle = computed(() => ({
  columnCount: String(cols.value),
  columnGap: `${props.gap}px`,
  '--cf-masonry-gap': `${props.gap}px`,
}));
</script>

<template>
  <div ref="rootRef" class="cf-masonry" :style="containerStyle">
    <slot />
  </div>
</template>
