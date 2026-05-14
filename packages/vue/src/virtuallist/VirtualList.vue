<script setup lang="ts" generic="T">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { computeWindow, type VirtualListProps } from './variants';

const props = withDefaults(defineProps<VirtualListProps<T>>(), {
  overscan: 5,
});

const scrollerRef = ref<HTMLDivElement | null>(null);
const scrollTop = ref(0);
const viewportHeight = ref(400);

function onScroll() {
  if (!scrollerRef.value) return;
  scrollTop.value = scrollerRef.value.scrollTop;
}

function syncViewport() {
  if (!scrollerRef.value) return;
  viewportHeight.value = scrollerRef.value.clientHeight;
}

onMounted(() => {
  syncViewport();
  scrollerRef.value?.addEventListener('scroll', onScroll, { passive: true });
  if (typeof ResizeObserver !== 'undefined' && scrollerRef.value) {
    const ro = new ResizeObserver(syncViewport);
    ro.observe(scrollerRef.value);
  }
});

const win = computed(() =>
  computeWindow({
    items: props.items,
    itemHeight: props.itemHeight,
    overscan: props.overscan,
    scrollTop: scrollTop.value,
    viewportHeight: viewportHeight.value,
  }),
);

const visibleItems = computed(() => {
  const out: Array<{ item: T; index: number; key: string | number }> = [];
  const { start, end } = win.value;
  for (let i = start; i < end; i++) {
    const item = props.items[i];
    const key = props.itemKey ? props.itemKey(item, i) : i;
    out.push({ item, index: i, key });
  }
  return out;
});

const innerStyle = computed(() => ({
  height: `${win.value.totalHeight}px`,
}));

const padStyle = computed(() => ({
  transform: `translateY(${win.value.offsetTop}px)`,
}));

const rootStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : (props.height ?? '100%'),
}));

watch(
  () => props.scrollToIndex,
  (idx) => {
    if (idx == null || !scrollerRef.value) return;
    nextTick(() => {
      const el = scrollerRef.value!;
      if (typeof props.itemHeight === 'number') {
        el.scrollTo({ top: idx * props.itemHeight });
      } else {
        let off = 0;
        for (let i = 0; i < idx; i++) off += props.itemHeight(props.items[i], i);
        el.scrollTo({ top: off });
      }
    });
  },
);

defineExpose({
  scrollTo(offset: number) {
    scrollerRef.value?.scrollTo({ top: offset });
  },
});
</script>

<template>
  <div ref="scrollerRef" :class="['cf-vlist', className]" :style="rootStyle">
    <div class="cf-vlist__inner" :style="innerStyle">
      <div class="cf-vlist__pad" :style="padStyle">
        <div
          v-for="entry in visibleItems"
          :key="entry.key"
          class="cf-vlist__row"
        >
          <slot :item="entry.item" :index="entry.index" />
        </div>
      </div>
    </div>
  </div>
</template>
