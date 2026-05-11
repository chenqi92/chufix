<script setup lang="ts">
import { CfLatencyHeatmap } from '@chufix-design/vue';
function row(day: number) {
  return Array.from({ length: 24 }, (_, hour) => 80 + ((day * 47 + hour * 31) % 320));
}
const data = Array.from({ length: 7 }, (_, day) => row(day));
const rowLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const colLabels = Array.from({ length: 24 }, (_, i) => i % 4 === 0 ? `${i}h` : '');
</script>

<template>
  <CfLatencyHeatmap :data="data" :row-labels="rowLabels" :col-labels="colLabels" />
</template>
