<script setup lang="ts">
import { computed } from 'vue';
import {
  resolveColorScale,
  type HeatmapChartInteractionPayload,
  type HeatmapChartProps,
} from './variants';

const props = withDefaults(defineProps<HeatmapChartProps>(), {
  width: 480,
  height: 240,
  colorScale: 'green-red',
  showValueLabels: false,
  valueDigits: 0,
});

const emit = defineEmits<{
  (e: 'item-enter', payload: HeatmapChartInteractionPayload): void;
  (e: 'item-leave', payload: HeatmapChartInteractionPayload): void;
}>();

const colorFn = computed(() => resolveColorScale(props.colorScale));

function buildPayload(row: number, col: number, ratio: number, ev: PointerEvent): HeatmapChartInteractionPayload | null {
  const value = props.data?.[row]?.[col];
  if (value == null) return null;
  return {
    row,
    col,
    value,
    rowLabel: props.rowLabels?.[row],
    colLabel: props.colLabels?.[col],
    ratio,
    nativeEvent: ev,
  };
}

function onEnter(row: number, col: number, ratio: number, ev: PointerEvent) {
  const p = buildPayload(row, col, ratio, ev);
  if (p) emit('item-enter', p);
}
function onLeave(row: number, col: number, ratio: number, ev: PointerEvent) {
  const p = buildPayload(row, col, ratio, ev);
  if (p) emit('item-leave', p);
}

const layout = computed(() => {
  const data = props.data ?? [];
  if (!data.length || !data[0]?.length) return null;
  const rows = data.length;
  const cols = data[0].length;
  const all = data.flat();
  const min = props.min ?? Math.min(...all);
  const max = props.max ?? Math.max(...all);
  const padLeft = props.rowLabels ? 64 : 4;
  const padTop = props.colLabels ? 18 : 4;
  const cellW = (props.width - padLeft - 4) / cols;
  const cellH = (props.height - padTop - 4) / rows;
  const cells: {
    x: number; y: number; w: number; h: number; color: string; value: number;
    row: number; col: number; ratio: number;
  }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = data[r][c];
      const ratio = max === min ? 0.5 : (v - min) / (max - min);
      cells.push({
        x: padLeft + c * cellW,
        y: padTop + r * cellH,
        w: cellW,
        h: cellH,
        color: colorFn.value(ratio),
        value: v,
        row: r,
        col: c,
        ratio,
      });
    }
  }
  return { cells, padLeft, padTop, cellW, cellH, rows, cols };
});
</script>

<template>
  <svg
    class="cf-chart cf-heatmap"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '热力图'"
  >
    <template v-if="layout">
      <rect
        v-for="(c, i) in layout.cells"
        :key="i"
        class="cf-heatmap__cell"
        :x="c.x"
        :y="c.y"
        :width="c.w"
        :height="c.h"
        :fill="c.color"
        @pointerenter="(e: PointerEvent) => onEnter(c.row, c.col, c.ratio, e)"
        @pointerleave="(e: PointerEvent) => onLeave(c.row, c.col, c.ratio, e)"
      />
      <template v-if="showValueLabels">
        <text
          v-for="(c, i) in layout.cells"
          :key="`v${i}`"
          class="cf-heatmap__value"
          :x="c.x + c.w / 2"
          :y="c.y + c.h / 2"
          text-anchor="middle"
          dominant-baseline="central"
        >{{ c.value.toFixed(valueDigits) }}</text>
      </template>
      <template v-if="rowLabels">
        <text
          v-for="(label, i) in rowLabels"
          :key="`r${i}`"
          :x="layout.padLeft - 6"
          :y="layout.padTop + i * layout.cellH + layout.cellH / 2"
          text-anchor="end"
          dominant-baseline="central"
        >{{ label }}</text>
      </template>
      <template v-if="colLabels">
        <text
          v-for="(label, i) in colLabels"
          :key="`c${i}`"
          :x="layout.padLeft + i * layout.cellW + layout.cellW / 2"
          :y="12"
          text-anchor="middle"
        >{{ label }}</text>
      </template>
    </template>
  </svg>
</template>
