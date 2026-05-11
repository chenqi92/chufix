<script setup lang="ts">
import { computed, ref } from 'vue';
import { domainOf, linearScale } from '../_charts/scale';
import type { ScatterPlotInteractionPayload, ScatterPlotProps } from './variants';

const props = withDefaults(defineProps<ScatterPlotProps>(), {
  width: 480,
  height: 240,
  showGrid: true,
  showTooltip: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: ScatterPlotInteractionPayload): void;
  (e: 'item-leave', payload: ScatterPlotInteractionPayload): void;
}>();

const activeIndex = ref<number | null>(null);

const layout = computed(() => {
  const data = props.data ?? [];
  if (!data.length) return null;
  const xs = data.map((p) => p.x);
  const ys = data.map((p) => p.y);
  const dx = domainOf(xs);
  const dy = domainOf(ys);
  const sx = linearScale(dx, { start: 36, end: props.width - 12 });
  const sy = linearScale(dy, { start: props.height - 24, end: 12 });
  const groups = Array.from(new Set(data.map((p) => p.group ?? 'default')));
  return data.map((p, i) => ({
    cx: sx(p.x),
    cy: sy(p.y),
    r: p.r ?? 3,
    groupIdx: groups.indexOf(p.group ?? 'default') % 8,
    point: p,
    index: i,
  }));
});

const activePayload = computed<ScatterPlotInteractionPayload | null>(() => {
  if (!layout.value || activeIndex.value == null) return null;
  const item = layout.value[activeIndex.value];
  if (!item) return null;
  return { point: item.point, dataIndex: activeIndex.value, groupIndex: item.groupIdx };
});

const tooltip = computed(() => {
  const payload = activePayload.value;
  if (!payload || !layout.value) return null;
  const item = layout.value[payload.dataIndex];
  const text = props.tooltipFormatter?.(payload) ?? `${payload.point.label ?? payload.point.group ?? payload.dataIndex}: ${payload.point.x}, ${payload.point.y}`;
  const width = Math.max(96, text.length * 7 + 20);
  const height = 28;
  const x = Math.min(Math.max(item.cx + 10, 4), props.width - width - 4);
  const y = Math.min(Math.max(item.cy - height - 8, 4), props.height - height - 4);
  return { x, y, width, height, text };
});

function setActive(index: number, event: MouseEvent) {
  activeIndex.value = index;
  const payload = activePayload.value;
  if (payload) emit('item-enter', { ...payload, nativeEvent: event });
}

function clearActive(event: MouseEvent) {
  const payload = activePayload.value;
  if (payload) emit('item-leave', { ...payload, nativeEvent: event });
  activeIndex.value = null;
}
</script>

<template>
  <svg
    class="cf-chart"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '散点图'"
  >
    <template v-if="layout">
      <circle
        v-for="(p, i) in layout"
        :key="i"
        :class="`cf-chart__bar--${p.groupIdx}`"
        :cx="p.cx"
        :cy="p.cy"
        :r="activeIndex === i ? p.r + 1.5 : p.r"
        opacity="0.7"
        tabindex="0"
        @mouseenter="setActive(i, $event)"
        @mousemove="setActive(i, $event)"
        @mouseleave="clearActive($event)"
      />
      <g v-if="showTooltip && tooltip" class="cf-chart-tooltip" :transform="`translate(${tooltip.x} ${tooltip.y})`" pointer-events="none">
        <rect :width="tooltip.width" :height="tooltip.height" rx="4" />
        <text x="8" y="18">{{ tooltip.text }}</text>
      </g>
    </template>
  </svg>
</template>
