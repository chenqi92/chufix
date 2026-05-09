<script setup lang="ts">
import { computed } from 'vue';
import { domainOf, linearScale } from '../_charts/scale';
import type { CandlestickChartProps } from './variants';

const props = withDefaults(defineProps<CandlestickChartProps>(), {
  width: 480,
  height: 240,
});

const layout = computed(() => {
  const d = props.data ?? [];
  if (!d.length) return null;
  const all = d.flatMap((c) => [c.open, c.high, c.low, c.close]);
  const dom = domainOf(all);
  const sy = linearScale(dom, { start: props.height - 24, end: 12 });
  const innerW = props.width - 48;
  const slot = innerW / d.length;
  const candleW = Math.max(2, slot * 0.6);
  return d.map((c, i) => {
    const cx = 36 + slot * (i + 0.5);
    const up = c.close >= c.open;
    return {
      cx,
      candleW,
      yHigh: sy(c.high),
      yLow: sy(c.low),
      yOpen: sy(c.open),
      yClose: sy(c.close),
      bodyTop: Math.min(sy(c.open), sy(c.close)),
      bodyHeight: Math.abs(sy(c.open) - sy(c.close)) || 1,
      up,
    };
  });
});
</script>

<template>
  <svg
    class="cf-chart cf-candlestick"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? 'K 线图'"
  >
    <template v-if="layout">
      <g
        v-for="(c, i) in layout"
        :key="i"
        :class="c.up ? 'cf-candlestick__up' : 'cf-candlestick__down'"
      >
        <line
          class="cf-candlestick__wick"
          :x1="c.cx"
          :x2="c.cx"
          :y1="c.yHigh"
          :y2="c.yLow"
        />
        <rect
          class="cf-candlestick__body"
          :x="c.cx - c.candleW / 2"
          :y="c.bodyTop"
          :width="c.candleW"
          :height="c.bodyHeight"
        />
      </g>
    </template>
  </svg>
</template>
