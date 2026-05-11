<script setup lang="ts">
import { computed } from 'vue';
import { ratioColor, type LatencyHeatmapProps } from './variants';

const props = withDefaults(defineProps<LatencyHeatmapProps>(), {
  width: 480,
  height: 240,
});

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
  const cells: { x: number; y: number; w: number; h: number; color: string; label: number }[] =
    [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = data[r][c];
      const ratio = max === min ? 0.5 : (v - min) / (max - min);
      cells.push({
        x: padLeft + c * cellW,
        y: padTop + r * cellH,
        w: cellW,
        h: cellH,
        color: ratioColor(ratio),
        label: v,
      });
    }
  }
  return { cells, padLeft, padTop, cellW, cellH, rows, cols };
});
</script>

<template>
  <svg
    class="cf-chart cf-latencyheatmap"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    :style="{ '--cf-latencyheatmap-width': `${width}px` }"
    role="img"
    :aria-label="ariaLabel ?? '延迟热力图'"
  >
    <template v-if="layout">
      <rect
        v-for="(c, i) in layout.cells"
        :key="i"
        class="cf-latencyheatmap__cell"
        :x="c.x"
        :y="c.y"
        :width="c.w"
        :height="c.h"
        :fill="c.color"
      />
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
