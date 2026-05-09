<script setup lang="ts">
import { CfRadarChart } from '@chufix/vue';
const axes = ['性能', '安全', '可维护', '可扩展', '兼容性', '生态'];
const series = [
  { name: '当前架构', values: [70, 80, 65, 75, 60, 55], colorIndex: 0 },
  { name: '提议方案', values: [88, 78, 90, 92, 70, 80], colorIndex: 2 },
  { name: '保守方案', values: [60, 90, 75, 50, 95, 85], colorIndex: 1 },
];
</script>

<template>
  <CfRadarChart :axes="axes" :series="series" :size="280" />
</template>
