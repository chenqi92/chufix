<script setup lang="ts">
import { computed } from 'vue';
import { domainOf, linearScale, ticks } from '../_charts/scale';
import type { BarChartProps } from './variants';

const props = withDefaults(defineProps<BarChartProps>(), {
  width: 480,
  height: 240,
  colorIndex: 0,
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
  const data = props.data ?? [];
  if (!data.length) return null;
  const dom = domainOf([0, ...data]);
  const sy = linearScale(dom, { start: h - padBottom, end: padTop });
  const innerW = w - padLeft - padRight;
  const barCount = data.length;
  const slot = innerW / barCount;
  const barW = Math.max(2, slot * 0.7);
  const yTicks = ticks(dom, 5);
  const bars = data.map((v, i) => {
    const cx = padLeft + slot * (i + 0.5);
    const y0 = sy(0);
    const y1 = sy(v);
    return {
      x: cx - barW / 2,
      y: Math.min(y0, y1),
      width: barW,
      height: Math.abs(y1 - y0),
      label: props.labels?.[i] ?? '',
      cx,
    };
  });
  return { sy, yTicks, bars };
});
</script>

<template>
  <svg
    :class="['cf-chart', `cf-chart__series-${colorIndex}`]"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '柱状图'"
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
        >{{ Math.round(t) }}</text>
        <template v-if="layout.bars.length <= 24">
          <text
            v-for="(b, i) in layout.bars"
            :key="`xl${i}`"
            :x="b.cx"
            :y="height - 6"
            text-anchor="middle"
          >{{ b.label }}</text>
        </template>
      </g>
      <g
        v-for="(b, i) in layout.bars"
        :key="i"
      >
        <rect
          class="cf-chart__bar"
          :x="b.x"
          :y="b.y"
          :width="b.width"
          :height="b.height"
          rx="1.5"
        />
      </g>
    </template>
  </svg>
</template>
