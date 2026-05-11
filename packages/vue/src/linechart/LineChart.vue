<script setup lang="ts">
import { computed } from 'vue';
import {
  domainOf,
  linearScale,
  linePath,
  ticks,
} from '../_charts/scale';
import type { LineChartProps } from './variants';

const props = withDefaults(defineProps<LineChartProps>(), {
  width: 480,
  height: 240,
  smooth: false,
  showGrid: true,
  showLabels: true,
});

const padTop = 12;
const padBottom = 24;
const padLeft = 36;
const padRight = 12;

const layout = computed(() => {
  const w = props.width;
  const h = props.height;
  const series = props.series ?? [];
  if (!series.length) return null;
  const lengths = series.map((s) => s.data.length);
  const maxLen = Math.max(...lengths, 1);
  const allValues = series.flatMap((s) => s.data);
  const dom = domainOf(allValues);
  const sx = linearScale(
    { min: 0, max: Math.max(1, maxLen - 1) },
    { start: padLeft, end: w - padRight },
  );
  const sy = linearScale(dom, { start: h - padBottom, end: padTop });
  const yTicks = ticks(dom, 5);
  const lines = series.map((s, idx) => {
    const points = s.data.map((v, i) => ({ x: sx(i), y: sy(v) }));
    return { idx, name: s.name, d: linePath(points, props.smooth) };
  });
  const labels = props.labels ?? Array.from({ length: maxLen }, (_, i) => `${i}`);
  return { sx, sy, yTicks, lines, labels, maxLen };
});

function formatY(v: number): string {
  return props.yLabelFn ? props.yLabelFn(v) : v.toFixed(0);
}
</script>

<template>
  <svg
    class="cf-chart"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '折线图'"
  >
    <template v-if="layout">
      <g v-if="showGrid">
        <line
          v-for="(t, i) in layout.yTicks"
          :key="`g${i}`"
          class="cf-chart__grid"
          :x1="36"
          :x2="width - 12"
          :y1="layout.sy(t)"
          :y2="layout.sy(t)"
        />
      </g>
      <g v-if="showLabels">
        <text
          v-for="(t, i) in layout.yTicks"
          :key="`yl${i}`"
          :x="32"
          :y="layout.sy(t) + 4"
          text-anchor="end"
        >{{ formatY(t) }}</text>
        <template v-if="layout.labels.length <= 12">
          <text
            v-for="(label, i) in layout.labels"
            :key="`xl${i}`"
            :x="layout.sx(i)"
            :y="height - 6"
            text-anchor="middle"
          >{{ label }}</text>
        </template>
      </g>
      <g
        v-for="(l, i) in layout.lines"
        :key="`s${i}`"
        :class="`cf-chart__series-${l.idx}`"
      >
        <path class="cf-chart__line" :d="l.d" />
      </g>
    </template>
  </svg>
</template>
