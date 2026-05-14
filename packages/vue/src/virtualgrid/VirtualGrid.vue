<script setup lang="ts" generic="T">
import { computed, onMounted, ref } from 'vue';
import { computeGrid, type VirtualGridProps } from './variants';

const props = withDefaults(defineProps<VirtualGridProps<T>>(), {
  gap: 8,
  overscan: 2,
  minColumnWidth: 200,
});

const scrollerRef = ref<HTMLDivElement | null>(null);
const scrollTop = ref(0);
const containerWidth = ref(800);
const viewportHeight = ref(400);

function onScroll() {
  if (!scrollerRef.value) return;
  scrollTop.value = scrollerRef.value.scrollTop;
}

function syncSize() {
  if (!scrollerRef.value) return;
  containerWidth.value = scrollerRef.value.clientWidth;
  viewportHeight.value = scrollerRef.value.clientHeight;
}

onMounted(() => {
  syncSize();
  scrollerRef.value?.addEventListener('scroll', onScroll, { passive: true });
  if (typeof ResizeObserver !== 'undefined' && scrollerRef.value) {
    new ResizeObserver(syncSize).observe(scrollerRef.value);
  }
});

const win = computed(() =>
  computeGrid({
    totalItems: props.items.length,
    containerWidth: containerWidth.value,
    itemHeight: props.itemHeight,
    scrollTop: scrollTop.value,
    viewportHeight: viewportHeight.value,
    gap: props.gap,
    overscan: props.overscan,
    columns: props.columns,
    minColumnWidth: props.minColumnWidth,
  }),
);

const visibleCells = computed(() => {
  const { rowStart, rowEnd, cols } = win.value;
  const out: Array<{ item: T; index: number; row: number; col: number; key: string | number }> = [];
  for (let r = rowStart; r < rowEnd; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= props.items.length) break;
      const item = props.items[idx];
      out.push({ item, index: idx, row: r, col: c, key: props.itemKey ? props.itemKey(item, idx) : idx });
    }
  }
  return out;
});

const innerStyle = computed(() => ({
  height: `${win.value.totalRows * win.value.rowHeight - props.gap}px`,
  position: 'relative' as const,
}));

const rootStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : (props.height ?? '100%'),
}));

function cellStyle(row: number, col: number) {
  const { cellWidth, rowHeight } = win.value;
  return {
    position: 'absolute' as const,
    top: `${row * rowHeight}px`,
    left: `${col * (cellWidth + props.gap)}px`,
    width: `${cellWidth}px`,
    height: `${props.itemHeight}px`,
  };
}
</script>

<template>
  <div ref="scrollerRef" :class="['cf-vgrid', className]" :style="rootStyle">
    <div class="cf-vgrid__inner" :style="innerStyle">
      <div
        v-for="cell in visibleCells"
        :key="cell.key"
        class="cf-vgrid__cell"
        :style="cellStyle(cell.row, cell.col)"
      >
        <slot :item="cell.item" :index="cell.index" />
      </div>
    </div>
  </div>
</template>
