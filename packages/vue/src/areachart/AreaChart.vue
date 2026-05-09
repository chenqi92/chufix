<script setup lang="ts">
import { computed } from 'vue';
import {
  areaPath,
  domainOf,
  linearScale,
  linePath,
} from '../_charts/scale';
import type { AreaChartProps } from './variants';

const props = withDefaults(defineProps<AreaChartProps>(), {
  width: 480,
  height: 240,
  smooth: false,
  stacked: false,
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
  const series = props.series ?? [];
  if (!series.length) return null;
  const maxLen = Math.max(...series.map((s) => s.data.length), 1);

  let stackedData: number[][];
  if (props.stacked) {
    stackedData = series.map(() => new Array(maxLen).fill(0));
    for (let i = 0; i < maxLen; i++) {
      let acc = 0;
      for (let s = 0; s < series.length; s++) {
        acc += series[s].data[i] ?? 0;
        stackedData[s][i] = acc;
      }
    }
  } else {
    stackedData = series.map((s) => s.data.slice());
  }

  const allValues = stackedData.flat();
  const dom = domainOf(props.stacked ? [0, ...allValues] : allValues);
  const sx = linearScale(
    { min: 0, max: Math.max(1, maxLen - 1) },
    { start: padLeft, end: w - padRight },
  );
  const sy = linearScale(dom, { start: h - padBottom, end: padTop });
  const baselineY = sy(dom.min);

  const areas = stackedData.map((data, idx) => {
    const pts = data.map((v, i) => ({ x: sx(i), y: sy(v) }));
    return {
      idx,
      area: areaPath(pts, baselineY),
      line: linePath(pts, props.smooth),
    };
  });

  return { sx, sy, areas, dom };
});
</script>

<template>
  <svg
    class="cf-chart"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    :aria-label="ariaLabel ?? '面积图'"
  >
    <template v-if="layout">
      <g
        v-for="a in layout.areas"
        :key="a.idx"
        :class="`cf-chart__series-${a.idx}`"
      >
        <path class="cf-chart__area" :d="a.area" />
        <path class="cf-chart__line" :d="a.line" />
      </g>
    </template>
  </svg>
</template>
