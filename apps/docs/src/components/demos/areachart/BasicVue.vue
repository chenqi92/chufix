<script setup lang="ts">
import { CfAreaChart } from '@chufix-design/vue';
const series = [
  { name: 'GET', data: [10, 14, 12, 18, 22, 20, 26, 32, 28, 35, 30, 40] },
  { name: 'POST', data: [3, 5, 4, 6, 8, 7, 10, 12, 11, 14, 13, 16] },
  { name: 'PUT', data: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7] },
];
</script>

<template>
  <CfAreaChart :series="series" stacked smooth />
</template>