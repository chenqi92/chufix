<script setup lang="ts">
import { CfScatterPlot } from '@chufix-design/vue';
function gen(n: number, group: string, cx: number, cy: number, spread = 20) {
  return Array.from({ length: n }, (_, i) => ({
    x: cx + ((((i * 29) % 100) / 100) - 0.5) * spread,
    y: cy + ((((i * 43 + 11) % 100) / 100) - 0.5) * spread,
    group,
  }));
}
const data = [
  ...gen(30, 'cluster-a', 30, 30),
  ...gen(30, 'cluster-b', 70, 60),
  ...gen(30, 'cluster-c', 50, 85),
  ...gen(20, 'outliers', 80, 20, 40),
];
</script>

<template>
  <CfScatterPlot :data="data" />
</template>
