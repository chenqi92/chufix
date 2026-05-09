<script setup lang="ts">
import { computed } from 'vue';
import { domainOf, linearScale } from '../_charts/scale';
import type { HistogramProps } from './variants';

const props = withDefaults(defineProps<HistogramProps>(), {
  width: 480,
  height: 200,
  colorIndex: 0,
  showLabels: true,
});

const padTop = 8;
const padBottom = 24;
const padLeft = 24;
const padRight = 12;

const bars = computed(() => {
  const data = props.bins ?? [];
  if (!data.length) return [];
  const counts = data.map((b) => b.count);
  const dom = domainOf([0, ...counts]);
  const sy = linearScale(dom, {
    start: props.height - padBottom,
    end: padTop,
  });
  const innerW = props.width - padLeft - padRight;
  const slot = innerW / data.length;
  const barW = Math.max(1, slot - 1);
  return data.map((b, i) => ({
    x: padLeft + slot * i + (slot - barW) / 2,
    y: sy(b.count),
    width: barW,
    height: Math.abs(sy(0) - sy(b.count)),
    label: b.label,
    count: b.count,
  }));
});
</script>

<template>
  <svg
    :class="['cf-chart', `cf-chart__series-${colorIndex}`]"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '直方图'"
  >
    <rect
      v-for="(b, i) in bars"
      :key="i"
      class="cf-chart__bar"
      :x="b.x"
      :y="b.y"
      :width="b.width"
      :height="b.height"
    />
    <template v-if="showLabels && bars.length <= 16">
      <text
        v-for="(b, i) in bars"
        :key="`l${i}`"
        :x="b.x + b.width / 2"
        :y="height - 6"
        text-anchor="middle"
      >{{ b.label }}</text>
    </template>
  </svg>
</template>
