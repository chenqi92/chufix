<script setup lang="ts">
import { CfBoxPlot } from '@chufix/vue';
const apis = [
  { label: '/login', min: 50, q1: 65, median: 80, q3: 110, max: 145, outliers: [220, 280] },
  { label: '/orders', min: 30, q1: 50, median: 75, q3: 110, max: 160, outliers: [320, 510] },
  { label: '/checkout', min: 80, q1: 110, median: 145, q3: 200, max: 280, outliers: [580] },
  { label: '/payment', min: 200, q1: 240, median: 290, q3: 360, max: 440, outliers: [820, 950, 1100] },
];
</script>

<template>
  <CfBoxPlot :data="apis" :height="240" />
</template>
