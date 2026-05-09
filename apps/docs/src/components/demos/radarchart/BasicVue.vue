<script setup lang="ts">
import { CfRadarChart } from '@chufix/vue';
const axes = ['速度', '稳定性', '兼容', '生态', '文档', '社区'];
const series = [
  { name: 'A 方案', values: [85, 70, 92, 78, 65, 80] },
  { name: 'B 方案', values: [70, 88, 75, 90, 82, 75] },
];
</script>

<template>
  <CfRadarChart :axes="axes" :series="series" />
</template>