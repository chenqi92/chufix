<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue';
import { textEllipsisClass, type TextEllipsisProps } from './variants';

const props = withDefaults(defineProps<TextEllipsisProps>(), {
  rows: 2,
  expandable: false,
  expandText: '展开',
  collapseText: '收起',
});

const expanded = ref(false);
const overflowing = ref(false);
const inner = ref<HTMLDivElement | null>(null);

function checkOverflow() {
  const el = inner.value;
  if (!el) return;
  overflowing.value = el.scrollHeight > el.clientHeight + 1;
}

let ro: ResizeObserver | null = null;

onMounted(() => {
  if (typeof window === 'undefined') return;
  nextTick(checkOverflow);
  if ('ResizeObserver' in window && inner.value) {
    ro = new ResizeObserver(checkOverflow);
    ro.observe(inner.value);
  }
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});

watch(() => [props.text, props.rows], () => nextTick(checkOverflow));

const cls = computed(() =>
  textEllipsisClass({ expanded: expanded.value, className: props.className }),
);

const innerStyle = computed(() => ({
  '-webkit-line-clamp': expanded.value ? 'unset' : String(props.rows),
}));
</script>

<template>
  <span :class="cls">
    <span ref="inner" class="cf-textellipsis__text" :style="innerStyle">
      <slot>{{ text }}</slot>
    </span>
    <button
      v-if="expandable && (overflowing || expanded)"
      type="button"
      class="cf-textellipsis__toggle"
      @click="expanded = !expanded"
    >{{ expanded ? collapseText : expandText }}</button>
  </span>
</template>
