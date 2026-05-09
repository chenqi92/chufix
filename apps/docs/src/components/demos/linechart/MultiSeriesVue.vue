<script setup lang="ts">
import { CfLineChart } from '@chufix/vue';
const series = [
  { name: 'CPU', data: [20, 35, 30, 50, 65, 45, 60, 75, 65, 80, 70, 85] },
  { name: 'Memory', data: [40, 38, 50, 55, 60, 58, 62, 68, 72, 70, 75, 78] },
  { name: 'Disk IO', data: [10, 12, 14, 18, 22, 25, 28, 32, 30, 35, 38, 42] },
  { name: 'Network', data: [5, 8, 10, 9, 12, 14, 18, 22, 19, 25, 28, 30] },
];
</script>

<template>
  <CfLineChart :series="series" smooth />
</template>
