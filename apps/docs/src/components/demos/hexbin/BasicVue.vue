<script setup lang="ts">
import { CfHexbin } from '@chufix-design/vue';

const data = (() => {
  const out: { x: number; y: number }[] = [];
  const clusters = [
    { cx: 25, cy: 30, sd: 8, n: 380 },
    { cx: 65, cy: 60, sd: 14, n: 520 },
    { cx: 80, cy: 25, sd: 6, n: 200 },
  ];
  for (const c of clusters) {
    for (let i = 0; i < c.n; i++) {
      let u = 0;
      let v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      const g = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      const g2 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
      out.push({ x: c.cx + g * c.sd, y: c.cy + g2 * c.sd });
    }
  }
  return out;
})();
</script>

<template>
  <CfHexbin :data="data" :width="580" :height="360" :radius="14" />
</template>
