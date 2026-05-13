<script setup lang="ts">
import { computed } from 'vue';
import {
  layoutTreemap,
  type TreemapInteractionPayload,
  type TreemapProps,
} from './variants';

const props = withDefaults(defineProps<TreemapProps>(), {
  width: 480,
  height: 240,
  showLabels: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: TreemapInteractionPayload): void;
  (e: 'item-leave', payload: TreemapInteractionPayload): void;
}>();

const rects = computed(() =>
  layoutTreemap(props.nodes ?? [], props.width, props.height).map((r, i) => ({
    ...r,
    colorIndex: r.colorIndex ?? i % 8,
  })),
);

function onEnter(i: number, ev: PointerEvent) {
  const node = props.nodes?.[i];
  if (!node) return;
  emit('item-enter', { node, dataIndex: i, nativeEvent: ev });
}
function onLeave(i: number, ev: PointerEvent) {
  const node = props.nodes?.[i];
  if (!node) return;
  emit('item-leave', { node, dataIndex: i, nativeEvent: ev });
}
</script>

<template>
  <svg
    class="cf-chart cf-treemap"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '矩形树图'"
  >
    <g
      v-for="(r, i) in rects"
      :key="i"
      @pointerenter="(e: PointerEvent) => onEnter(i, e)"
      @pointerleave="(e: PointerEvent) => onLeave(i, e)"
    >
      <rect
        :class="`cf-chart__bar--${r.colorIndex}`"
        :x="r.x"
        :y="r.y"
        :width="r.w"
        :height="r.h"
        stroke="var(--bg-1)"
        stroke-width="1"
        opacity="0.9"
      />
      <text
        v-if="showLabels && r.w > 50 && r.h > 20"
        :x="r.x + 6"
        :y="r.y + 14"
        fill="var(--fg-on-viz)"
        font-weight="500"
      >{{ r.name }}</text>
    </g>
  </svg>
</template>
