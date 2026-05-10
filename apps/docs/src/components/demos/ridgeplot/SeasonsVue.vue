<script setup lang="ts">
import { CfRidgePlot } from '@chufix-design/vue';
function bell(center: number, n = 30, height = 1) {
  return Array.from({ length: n }, (_, i) => {
    const x = (i - center) / 4;
    return Math.exp(-x * x) * height;
  });
}
function combine(...waves: number[][]) {
  const out = new Array(waves[0].length).fill(0);
  for (const w of waves) for (let i = 0; i < w.length; i++) out[i] += w[i];
  return out;
}
const rows = [
  { label: '春', density: combine(bell(8, 30, 1), bell(20, 30, 0.4)) },
  { label: '夏', density: combine(bell(15, 30, 1.2)) },
  { label: '秋', density: combine(bell(10, 30, 0.6), bell(22, 30, 1.0)) },
  { label: '冬', density: combine(bell(5, 30, 0.8), bell(25, 30, 0.6)) },
];
</script>

<template>
  <CfRidgePlot :rows="rows" :height="220" :overlap="0.5" />
</template>
