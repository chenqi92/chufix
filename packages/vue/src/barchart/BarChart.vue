<script setup lang="ts">
import { computed, ref } from 'vue';
import { domainOf, linearScale, ticks } from '../_charts/scale';
import type { BarChartInteractionPayload, BarChartProps } from './variants';

const props = withDefaults(defineProps<BarChartProps>(), {
  width: 480,
  height: 240,
  colorIndex: 0,
  orientation: 'vertical',
  showGrid: true,
  showLabels: true,
  showTooltip: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: BarChartInteractionPayload): void;
  (e: 'item-leave', payload: BarChartInteractionPayload): void;
}>();

const padTop = 12;
const padBottom = 24;
const padLeft = 36;
const padRight = 12;
const activeIndex = ref<number | null>(null);

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
        value: v,
        index: i,
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
      value: v,
      index: i,
      cx,
      cy: Math.min(y0, y1) + Math.abs(y1 - y0) / 2,
    };
  });
  return { orientation: 'vertical', scale: sy, ticks: axisTicks, bars, padLeft };
});

const activePayload = computed<BarChartInteractionPayload | null>(() => {
  if (!layout.value || activeIndex.value == null) return null;
  const bar = layout.value.bars[activeIndex.value];
  if (!bar) return null;
  return {
    label: bar.label || `${activeIndex.value}`,
    value: bar.value,
    dataIndex: activeIndex.value,
    colorIndex: props.colorIndex,
  };
});

const tooltip = computed(() => {
  const payload = activePayload.value;
  const l = layout.value;
  if (!payload || !l) return null;
  const bar = l.bars[payload.dataIndex];
  const value = props.valueFormatter ? props.valueFormatter(payload.value, payload) : `${payload.value}`;
  const text = props.tooltipFormatter?.(payload) ?? `${payload.label}: ${value}`;
  const width = Math.max(88, text.length * 7 + 20);
  const height = 28;
  const x = Math.min(Math.max(bar.cx + 10, 4), props.width - width - 4);
  const y = Math.min(Math.max(bar.y - height - 8, 4), props.height - height - 4);
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
          :class="{ 'is-active': activeIndex === i }"
          :x="b.x"
          :y="b.y"
          :width="b.width"
          :height="b.height"
          rx="1.5"
          tabindex="0"
          @mouseenter="setActive(i, $event)"
          @mousemove="setActive(i, $event)"
          @mouseleave="clearActive($event)"
          @focus="setActive(i, $event as FocusEvent as unknown as MouseEvent)"
          @blur="clearActive($event as FocusEvent as unknown as MouseEvent)"
        />
      </g>
      <g v-if="showTooltip && tooltip" class="cf-chart-tooltip" :transform="`translate(${tooltip.x} ${tooltip.y})`" pointer-events="none">
        <rect :width="tooltip.width" :height="tooltip.height" rx="4" />
        <text x="8" y="18">{{ tooltip.text }}</text>
      </g>
    </template>
  </svg>
</template>
