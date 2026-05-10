<script setup lang="ts">
import { CfLatencyHeatmap } from '@chufix-design/vue';
function row(peakHour: number) {
  return Array.from({ length: 24 }, (_, h) => {
    const dist = Math.abs(h - peakHour);
    return 80 + (24 - dist) * 12 + Math.random() * 60;
  });
}
const data = [row(15), row(15), row(15), row(16), row(15), row(13), row(13)];
const rowLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const colLabels = Array.from({ length: 24 }, (_, i) => i % 4 === 0 ? `${i}h` : '');
</script>

<template>
  <CfLatencyHeatmap :data="data" :row-labels="rowLabels" :col-labels="colLabels" :height="220" />
</template>
