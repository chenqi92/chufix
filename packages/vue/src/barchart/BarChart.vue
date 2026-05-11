<script setup lang="ts">
import { computed } from 'vue';
import { domainOf, linearScale, ticks } from '../_charts/scale';
import type { BarChartProps } from './variants';

const props = withDefaults(defineProps<BarChartProps>(), {
  width: 480,
  height: 240,
  colorIndex: 0,
  orientation: 'vertical',
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
  const axisTicks = ticks(dom, 5);

  if (props.orientation === 'horizontal') {
    const left = 72;
    const sx = linearScale(dom, { start: left, end: w - padRight });
    const innerH = h - padTop - padBottom;
    const slot = innerH / data.length;
    const barH = Math.max(2, slot * 0.62);
    const bars = data.map((v, i) => {
      const cy = padTop + slot * (i + 0.5);
      const x0 = sx(0);
      const x1 = sx(v);
      return {
        x: Math.min(x0, x1),
        y: cy - barH / 2,
        width: Math.abs(x1 - x0),
        height: barH,
        label: props.labels?.[i] ?? '',
        cx: x1,
        cy,
      };
    });
    return { orientation: 'horizontal', scale: sx, ticks: axisTicks, bars, padLeft: left };
  }

  const sy = linearScale(dom, { start: h - padBottom, end: padTop });
  const innerW = w - padLeft - padRight;
  const slot = innerW / data.length;
  const barW = Math.max(2, slot * 0.7);
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
      cy: Math.min(y0, y1) + Math.abs(y1 - y0) / 2,
    };
  });
  return { orientation: 'vertical', scale: sy, ticks: axisTicks, bars, padLeft };
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
          v-for="(t, i) in layout.ticks"
          :key="`g${i}`"
          class="cf-chart__grid"
          :x1="layout.orientation === 'horizontal' ? layout.scale(t) : layout.padLeft"
          :x2="layout.orientation === 'horizontal' ? layout.scale(t) : width - padRight"
          :y1="layout.orientation === 'horizontal' ? padTop : layout.scale(t)"
          :y2="layout.orientation === 'horizontal' ? height - padBottom : layout.scale(t)"
        />
      </g>
      <g v-if="showLabels">
        <text
          v-for="(t, i) in layout.ticks"
          :key="`yl${i}`"
          :x="layout.orientation === 'horizontal' ? layout.scale(t) : layout.padLeft - 4"
          :y="layout.orientation === 'horizontal' ? height - 6 : layout.scale(t) + 4"
          :text-anchor="layout.orientation === 'horizontal' ? 'middle' : 'end'"
        >{{ Math.round(t) }}</text>
        <template v-if="layout.bars.length <= 24">
          <text
            v-for="(b, i) in layout.bars"
            :key="`xl${i}`"
            :x="layout.orientation === 'horizontal' ? layout.padLeft - 8 : b.cx"
            :y="layout.orientation === 'horizontal' ? b.cy + 4 : height - 6"
            :text-anchor="layout.orientation === 'horizontal' ? 'end' : 'middle'"
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
