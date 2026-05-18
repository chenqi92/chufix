<script setup lang="ts">
import { computed } from 'vue';
import type { CorrelationMatrixProps, CorrelationCellPayload } from './variants';

const props = withDefaults(defineProps<CorrelationMatrixProps>(), {
  width: 480,
  height: 480,
  cellGap: 2,
  showText: true,
});

const emit = defineEmits<{
  (e: 'cell-enter', payload: CorrelationCellPayload): void;
  (e: 'cell-leave', payload: CorrelationCellPayload): void;
}>();

const layout = computed(() => {
  const m = props.matrix ?? [];
  const labels = props.labels ?? [];
  const n = m.length;
  if (!n) return null;
  const padLeft = 72;
  const padTop = 56;
  const padRight = 12;
  const padBottom = 12;
  const cellW = Math.max(
    8,
    (props.width - padLeft - padRight - props.cellGap * (n - 1)) / n,
  );
  const cellH = Math.max(
    8,
    (props.height - padTop - padBottom - props.cellGap * (n - 1)) / n,
  );
  const cells: {
    r: number;
    c: number;
    x: number;
    y: number;
    w: number;
    h: number;
    value: number;
    rowLabel: string;
    colLabel: string;
    color: string;
    text: string;
    textColor: string;
  }[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const v = Math.max(-1, Math.min(1, m[r]?.[c] ?? 0));
      const x = padLeft + c * (cellW + props.cellGap);
      const y = padTop + r * (cellH + props.cellGap);
      const intensity = Math.abs(v);
      const hue = v >= 0 ? 263 : 28;
      const lightness = 96 - intensity * 38;
      const color = `oklch(${lightness}% ${0.04 + intensity * 0.16} ${hue})`;
      const textColor = intensity > 0.55 ? 'oklch(98% 0.01 260)' : 'oklch(20% 0.01 260)';
      cells.push({
        r,
        c,
        x,
        y,
        w: cellW,
        h: cellH,
        value: v,
        rowLabel: labels[r] ?? `${r}`,
        colLabel: labels[c] ?? `${c}`,
        color,
        text: v.toFixed(2),
        textColor,
      });
    }
  }
  return {
    cells,
    rowLabels: labels.map((l, r) => ({
      label: l,
      x: padLeft - 8,
      y: padTop + r * (cellH + props.cellGap) + cellH / 2 + 4,
    })),
    colLabels: labels.map((l, c) => ({
      label: l,
      cx: padLeft + c * (cellW + props.cellGap) + cellW / 2,
      cy: padTop - 8,
    })),
    cellW,
    cellH,
  };
});
</script>

<template>
  <svg
    class="cf-chart cf-corrmatrix"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '相关性矩阵'"
  >
    <template v-if="layout">
      <g class="cf-corrmatrix__row-labels">
        <text
          v-for="(l, i) in layout.rowLabels"
          :key="`r${i}`"
          :x="l.x"
          :y="l.y"
          text-anchor="end"
        >{{ l.label }}</text>
      </g>
      <g class="cf-corrmatrix__col-labels">
        <text
          v-for="(l, i) in layout.colLabels"
          :key="`c${i}`"
          :x="l.cx"
          :y="l.cy"
          text-anchor="middle"
        >{{ l.label }}</text>
      </g>
      <g class="cf-corrmatrix__cells">
        <g v-for="(c, i) in layout.cells" :key="i">
          <rect
            :x="c.x"
            :y="c.y"
            :width="c.w"
            :height="c.h"
            :fill="c.color"
            class="cf-corrmatrix__cell"
            rx="2"
            @pointerenter="
              (e: PointerEvent) =>
                emit('cell-enter', {
                  row: c.r,
                  col: c.c,
                  value: c.value,
                  rowLabel: c.rowLabel,
                  colLabel: c.colLabel,
                  nativeEvent: e,
                })
            "
            @pointerleave="
              (e: PointerEvent) =>
                emit('cell-leave', {
                  row: c.r,
                  col: c.c,
                  value: c.value,
                  rowLabel: c.rowLabel,
                  colLabel: c.colLabel,
                  nativeEvent: e,
                })
            "
          />
          <text
            v-if="showText && c.w >= 24 && c.h >= 14"
            :x="c.x + c.w / 2"
            :y="c.y + c.h / 2 + 4"
            text-anchor="middle"
            :fill="c.textColor"
            class="cf-corrmatrix__text"
          >{{ c.text }}</text>
        </g>
      </g>
    </template>
  </svg>
</template>
