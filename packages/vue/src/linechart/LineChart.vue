<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  domainOf,
  linearScale,
  linePath,
  ticks,
} from '../_charts/scale';
import type { LineChartInteractionPayload, LineChartProps, LineChartTooltipItem } from './variants';

const props = withDefaults(defineProps<LineChartProps>(), {
  width: 480,
  height: 240,
  smooth: false,
  showGrid: true,
  showLabels: true,
  showLegend: true,
  showTooltip: true,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: LineChartInteractionPayload): void;
  (e: 'item-leave', payload: LineChartInteractionPayload): void;
  (e: 'legend-toggle', seriesIndex: number, hidden: boolean): void;
}>();

const padTop = 12;
const padBottom = 24;
const padLeft = 36;
const padRight = 12;
const legendHeight = 24;

const hiddenSeries = ref<Set<number>>(new Set());
const activeIndex = ref<number | null>(null);

const layout = computed(() => {
  const w = props.width;
  const h = props.height;
  const series = props.series ?? [];
  if (!series.length) return null;
  const chartTop = props.showLegend && series.length > 1 ? padTop + legendHeight : padTop;
  const visible = series.map((_, i) => !hiddenSeries.value.has(i));
  const visibleSeries = series.filter((_, i) => visible[i]);
  const lengths = series.map((s) => s.data.length);
  const maxLen = Math.max(...lengths, 1);
  const allValues = (visibleSeries.length ? visibleSeries : series).flatMap((s) => s.data);
  const dom = domainOf(allValues);
  const sx = linearScale(
    { min: 0, max: Math.max(1, maxLen - 1) },
    { start: padLeft, end: w - padRight },
  );
  const sy = linearScale(dom, { start: h - padBottom, end: chartTop });
  const yTicks = ticks(dom, 5);
  const lines = series.map((s, idx) => {
    const points = s.data.map((v, i) => ({ x: sx(i), y: sy(v) }));
    return { idx, name: s.name, data: s.data, hidden: !visible[idx], points, d: linePath(points, props.smooth) };
  });
  const labels = props.labels ?? Array.from({ length: maxLen }, (_, i) => `${i}`);
  const legend = series.map((s, idx) => ({
    idx,
    name: s.name ?? `Series ${idx + 1}`,
    hidden: !visible[idx],
    x: padLeft + (idx % 4) * 104,
    y: 10 + Math.floor(idx / 4) * 16,
  }));
  return { sx, sy, yTicks, lines, labels, maxLen, legend, chartTop };
});

function formatY(v: number): string {
  return props.yLabelFn ? props.yLabelFn(v) : v.toFixed(0);
}

function formatValue(value: number, item: LineChartTooltipItem): string {
  return props.valueFormatter ? props.valueFormatter(value, item) : formatY(value);
}

const activePayload = computed<LineChartInteractionPayload | null>(() => {
  if (!layout.value || activeIndex.value == null) return null;
  const dataIndex = activeIndex.value;
  const items = layout.value.lines
    .filter((line) => !line.hidden && line.data[dataIndex] != null)
    .map((line) => ({
      name: line.name,
      value: line.data[dataIndex],
      colorIndex: line.idx % 8,
      seriesIndex: line.idx,
      dataIndex,
    }));
  return {
    label: layout.value.labels[dataIndex] ?? `${dataIndex}`,
    dataIndex,
    items,
  };
});

const tooltip = computed(() => {
  const payload = activePayload.value;
  const l = layout.value;
  if (!payload || !l || !payload.items.length) return null;
  const custom = props.tooltipFormatter?.(payload);
  const rows = custom
    ? [{ text: custom, colorIndex: payload.items[0].colorIndex }]
    : payload.items.map((item) => ({
        text: `${item.name ?? `Series ${item.seriesIndex + 1}`}: ${formatValue(item.value, item)}`,
        colorIndex: item.colorIndex,
      }));
  const width = Math.max(96, payload.label.length * 7 + 20, ...rows.map((row) => row.text.length * 7 + 28));
  const height = 24 + rows.length * 18;
  const anchorX = l.sx(payload.dataIndex);
  const pointYs = l.lines
    .filter((line) => !line.hidden)
    .map((line) => line.points[payload.dataIndex]?.y)
    .filter((y): y is number => typeof y === 'number');
  const anchorY = pointYs.length ? Math.min(...pointYs) : l.chartTop;
  const x = Math.min(Math.max(anchorX + 10, 4), props.width - width - 4);
  const y = Math.min(Math.max(anchorY - height - 8, 4), props.height - height - 4);
  return { x, y, width, height, anchorX, rows, title: payload.label };
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

function toggleSeries(index: number) {
  const next = new Set(hiddenSeries.value);
  if (next.has(index)) next.delete(index);
  else next.add(index);
  hiddenSeries.value = next;
  emit('legend-toggle', index, next.has(index));
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
      <g v-if="showLegend && layout.legend.length > 1" class="cf-chart-legend">
        <g
          v-for="item in layout.legend"
          :key="item.idx"
          :class="['cf-chart-legend__item', item.hidden && 'is-hidden']"
          :transform="`translate(${item.x} ${item.y})`"
          tabindex="0"
          role="button"
          @click="toggleSeries(item.idx)"
          @keydown.enter.prevent="toggleSeries(item.idx)"
          @keydown.space.prevent="toggleSeries(item.idx)"
        >
          <circle :class="`cf-chart__bar--${item.idx % 8}`" cx="4" cy="4" r="4" />
          <text x="14" y="8">{{ item.name }}</text>
        </g>
      </g>
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
        v-show="!l.hidden"
      >
        <path class="cf-chart__line" :d="l.d" />
      </g>
      <g class="cf-chart-hitarea">
        <rect
          v-for="(_, i) in layout.labels"
          :key="`hit${i}`"
          fill="transparent"
          :x="i === 0 ? padLeft : (layout.sx(i - 0.5))"
          :y="layout.chartTop"
          :width="i === 0 || i === layout.labels.length - 1 ? Math.max(8, (layout.sx(1) - layout.sx(0)) / 2) : Math.max(8, layout.sx(i + 0.5) - layout.sx(i - 0.5))"
          :height="height - padBottom - layout.chartTop"
          pointer-events="all"
          @mouseenter="setActive(i, $event)"
          @mousemove="setActive(i, $event)"
          @mouseleave="clearActive($event)"
        />
      </g>
      <g v-if="showTooltip && tooltip" class="cf-crosshair" pointer-events="none">
        <line
          class="cf-crosshair__line"
          :x1="tooltip.anchorX"
          :x2="tooltip.anchorX"
          :y1="layout.chartTop"
          :y2="height - padBottom"
        />
        <g class="cf-chart-tooltip" :transform="`translate(${tooltip.x} ${tooltip.y})`">
          <rect :width="tooltip.width" :height="tooltip.height" rx="4" />
          <text class="cf-chart-tooltip__title" x="8" y="15">{{ tooltip.title }}</text>
          <g
            v-for="(row, i) in tooltip.rows"
            :key="i"
            :transform="`translate(8 ${28 + i * 18})`"
          >
            <circle :class="`cf-chart__bar--${row.colorIndex}`" cx="4" cy="-4" r="3.5" />
            <text x="14" y="0">{{ row.text }}</text>
          </g>
        </g>
      </g>
    </template>
  </svg>
</template>
