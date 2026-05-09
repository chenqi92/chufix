<script setup lang="ts">
import { CfRidgePlot } from '@chufix/vue';
function bell(center: number, n = 30) {
  return Array.from({ length: n }, (_, i) => {
    const x = (i - center) / 4;
    return Math.exp(-x * x);
  });
}
const rows = [
  { label: '2024 Q1', density: bell(8) },
  { label: '2024 Q2', density: bell(12) },
  { label: '2024 Q3', density: bell(15) },
  { label: '2024 Q4', density: bell(20) },
];
</script>

<template>
  <CfRidgePlot :rows="rows" />
</template>