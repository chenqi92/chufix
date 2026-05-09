<script setup lang="ts">
import { computed } from 'vue';
import { domainOf, linearScale } from '../_charts/scale';
import type { ScatterPlotProps } from './variants';

const props = withDefaults(defineProps<ScatterPlotProps>(), {
  width: 480,
  height: 240,
  showGrid: true,
});

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
  return data.map((p) => ({
    cx: sx(p.x),
    cy: sy(p.y),
    r: p.r ?? 3,
    groupIdx: groups.indexOf(p.group ?? 'default') % 8,
  }));
});
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
        :r="p.r"
        opacity="0.7"
      />
    </template>
  </svg>
</template>
