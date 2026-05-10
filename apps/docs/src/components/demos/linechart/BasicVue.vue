<script setup lang="ts">
import { CfLineChart } from '@chufix-design/vue';
const series = [
  { name: 'CPU', data: [20, 35, 30, 50, 65, 45, 60, 75, 65, 80, 70, 85] },
  { name: 'Memory', data: [40, 38, 50, 55, 60, 58, 62, 68, 72, 70, 75, 78] },
];
const labels = ['00','02','04','06','08','10','12','14','16','18','20','22'];
</script>

<template>
  <CfLineChart :series="series" :labels="labels" smooth />
</template>