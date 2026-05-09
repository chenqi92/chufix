<script setup lang="ts">
import { CfLatencyHeatmap } from '@chufix/vue';
function row() { return Array.from({ length: 24 }, () => 50 + Math.random() * 400); }
const data = [row(), row(), row(), row(), row(), row(), row()];
const rowLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const colLabels = Array.from({ length: 24 }, (_, i) => i % 4 === 0 ? `${i}h` : '');
</script>

<template>
  <CfLatencyHeatmap :data="data" :row-labels="rowLabels" :col-labels="colLabels" />
</template>