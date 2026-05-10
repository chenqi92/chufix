<script setup lang="ts">
import { CfBoxPlot } from '@chufix-design/vue';
const data = [
  { label: 'p50', min: 80, q1: 95, median: 110, q3: 125, max: 145, outliers: [220] },
  { label: 'p75', min: 120, q1: 140, median: 165, q3: 195, max: 230, outliers: [340] },
  { label: 'p95', min: 200, q1: 235, median: 280, q3: 320, max: 380 },
  { label: 'p99', min: 320, q1: 380, median: 440, q3: 510, max: 620, outliers: [820, 950] },
];
</script>

<template>
  <CfBoxPlot :data="data" />
</template>