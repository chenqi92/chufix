<script setup lang="ts">
import { computed } from 'vue';
import { domainOf, linearScale } from '../_charts/scale';
import type { HexbinProps, HexbinCell, HexbinInteractionPayload } from './variants';

const props = withDefaults(defineProps<HexbinProps>(), {
  width: 560,
  height: 360,
  radius: 14,
  showAxis: true,
});

const emit = defineEmits<{
  (e: 'cell-enter', payload: HexbinInteractionPayload): void;
  (e: 'cell-leave', payload: HexbinInteractionPayload): void;
}>();

function hexCorner(cx: number, cy: number, r: number, i: number): { x: number; y: number } {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function hexPath(cx: number, cy: number, r: number): string {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const p = hexCorner(cx, cy, r, i);
    d += (i === 0 ? 'M' : 'L') + ` ${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
  }
  return d + 'Z';
}

const layout = computed(() => {
  const data = props.data ?? [];
  if (!data.length) return null;
  const xDom = props.xDomain
    ? { min: props.xDomain[0], max: props.xDomain[1] }
    : domainOf(data.map((d) => d.x));
  const yDom = props.yDomain
    ? { min: props.yDomain[0], max: props.yDomain[1] }
    : domainOf(data.map((d) => d.y));
  const left = 44;
  const right = props.width - 16;
  const top = 16;
  const bottom = props.height - 32;
  const sx = linearScale(xDom, { start: left, end: right });
  const sy = linearScale(yDom, { start: bottom, end: top });
  const r = props.radius;
  const dx = r * Math.sqrt(3);
  const dy = r * 1.5;
  const map = new Map<string, HexbinCell>();
  for (const p of data) {
    const px = sx(p.x);
    const py = sy(p.y);
    const row = Math.round((py - top) / dy);
    const offsetX = row % 2 === 0 ? 0 : dx / 2;
    const col = Math.round((px - left - offsetX) / dx);
    const cx = left + offsetX + col * dx;
    const cy = top + row * dy;
    const key = `${col}_${row}`;
    const cell = map.get(key) ?? { cx, cy, count: 0, weight: 0 };
    cell.count += 1;
    cell.weight += p.weight ?? 1;
    map.set(key, cell);
  }
  const cells = Array.from(map.values());
  const peak = Math.max(1, ...cells.map((c) => c.weight));
  return {
    cells: cells.map((c) => ({
      ...c,
      path: hexPath(c.cx, c.cy, r),
      ratio: c.weight / peak,
    })),
    xDom,
    yDom,
    left,
    right,
    top,
    bottom,
    peak,
  };
});
</script>

<template>
  <svg
    class="cf-chart cf-hexbin"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '六边形热图'"
  >
    <template v-if="layout">
      <g v-if="showAxis">
        <line
          class="cf-chart__axis"
          :x1="layout.left"
          :x2="layout.right"
          :y1="layout.bottom"
          :y2="layout.bottom"
        />
        <line
          class="cf-chart__axis"
          :x1="layout.left"
          :x2="layout.left"
          :y1="layout.top"
          :y2="layout.bottom"
        />
        <text :x="layout.left" :y="height - 8" text-anchor="start">
          {{ layout.xDom.min.toFixed(1) }}
        </text>
        <text :x="layout.right" :y="height - 8" text-anchor="end">
          {{ layout.xDom.max.toFixed(1) }}
        </text>
        <text :x="layout.left - 6" :y="layout.bottom + 4" text-anchor="end">
          {{ layout.yDom.min.toFixed(1) }}
        </text>
        <text :x="layout.left - 6" :y="layout.top + 4" text-anchor="end">
          {{ layout.yDom.max.toFixed(1) }}
        </text>
      </g>
      <g class="cf-hexbin__cells">
        <path
          v-for="(c, i) in layout.cells"
          :key="i"
          class="cf-hexbin__cell"
          :d="c.path"
          :style="{ opacity: 0.18 + 0.82 * c.ratio }"
          @pointerenter="
            (e: PointerEvent) =>
              emit('cell-enter', {
                cell: { cx: c.cx, cy: c.cy, count: c.count, weight: c.weight },
                nativeEvent: e,
              })
          "
          @pointerleave="
            (e: PointerEvent) =>
              emit('cell-leave', {
                cell: { cx: c.cx, cy: c.cy, count: c.count, weight: c.weight },
                nativeEvent: e,
              })
          "
        />
      </g>
    </template>
  </svg>
</template>
