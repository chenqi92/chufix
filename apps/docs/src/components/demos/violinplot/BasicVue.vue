<script setup lang="ts">
import { CfViolinPlot } from '@chufix-design/vue';

function gauss(n: number, mean: number, sd: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    out.push(mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
  }
  return out;
}

const data = [
  { label: '对照组', values: gauss(220, 60, 14) },
  { label: '实验 A', values: [...gauss(180, 72, 10), ...gauss(60, 90, 6)] },
  { label: '实验 B', values: gauss(240, 78, 22) },
  { label: '实验 C', values: gauss(200, 82, 9) },
];
</script>

<template>
  <CfViolinPlot :data="data" :width="540" :height="300" />
</template>
