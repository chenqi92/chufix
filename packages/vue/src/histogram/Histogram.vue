<script setup lang="ts">
import { computed, ref } from 'vue';
import { domainOf, linearScale } from '../_charts/scale';
import type { HistogramInteractionPayload, HistogramProps } from './variants';

const props = withDefaults(defineProps<HistogramProps>(), {
  width: 480,
  height: 200,
  colorIndex: 0,
  showLabels: true,
  showTooltip: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: HistogramInteractionPayload): void;
  (e: 'item-leave', payload: HistogramInteractionPayload): void;
}>();

const padTop = 8;
const padBottom = 24;
const padLeft = 24;
const padRight = 12;
const activeIndex = ref<number | null>(null);

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
    index: i,
    cx: padLeft + slot * (i + 0.5),
  }));
});

const activePayload = computed<HistogramInteractionPayload | null>(() => {
  if (activeIndex.value == null) return null;
  const bar = bars.value[activeIndex.value];
  if (!bar) return null;
  return { label: bar.label, count: bar.count, dataIndex: activeIndex.value };
});

const tooltip = computed(() => {
  const payload = activePayload.value;
  if (!payload) return null;
  const bar = bars.value[payload.dataIndex];
  const text = props.tooltipFormatter?.(payload) ?? `${payload.label}: ${payload.count}`;
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
    :aria-label="ariaLabel ?? '直方图'"
  >
    <rect
      v-for="(b, i) in bars"
      :key="i"
      class="cf-chart__bar"
      :class="{ 'is-active': activeIndex === i }"
      :x="b.x"
      :y="b.y"
      :width="b.width"
      :height="b.height"
      tabindex="0"
      @mouseenter="setActive(i, $event)"
      @mousemove="setActive(i, $event)"
      @mouseleave="clearActive($event)"
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
    <g v-if="showTooltip && tooltip" class="cf-chart-tooltip" :transform="`translate(${tooltip.x} ${tooltip.y})`" pointer-events="none">
      <rect :width="tooltip.width" :height="tooltip.height" rx="4" />
      <text x="8" y="18">{{ tooltip.text }}</text>
    </g>
  </svg>
</template>
