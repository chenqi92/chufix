<script setup lang="ts">
import { CfCorrelationMatrix } from '@chufix-design/vue';

const labels = ['CPU', 'MEM', 'RPS', 'P99', '错误率', '队列长度'];
const matrix = [
  [1.0, 0.62, 0.74, 0.58, 0.21, 0.39],
  [0.62, 1.0, 0.48, 0.41, 0.18, 0.34],
  [0.74, 0.48, 1.0, 0.71, 0.36, 0.66],
  [0.58, 0.41, 0.71, 1.0, 0.53, 0.81],
  [0.21, 0.18, 0.36, 0.53, 1.0, 0.45],
  [0.39, 0.34, 0.66, 0.81, 0.45, 1.0],
];
</script>

<template>
  <CfCorrelationMatrix :matrix="matrix" :labels="labels" :width="480" :height="480" />
</template>
