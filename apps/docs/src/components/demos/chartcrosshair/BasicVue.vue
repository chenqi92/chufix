<script setup lang="ts">
import { ref } from 'vue';
import { CfChartCrosshair } from '@chufix-design/vue';
const x = ref(180);
const y = ref(60);
function onMove(e: MouseEvent) {
  const svg = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
  x.value = e.clientX - svg.left;
  y.value = e.clientY - svg.top;
}
</script>

<template>
  <svg viewBox="0 0 480 200" width="100%" height="200" style="background: var(--bg-inset); border-radius: var(--r-6); cursor: crosshair;" @mousemove="onMove">
    <path d="M 0 150 L 60 130 L 120 110 L 180 90 L 240 70 L 300 80 L 360 60 L 420 50 L 480 40" fill="none" stroke="var(--accent-1)" stroke-width="2" />
    <CfChartCrosshair :x="x" :y="y" :width="480" :height="200" :tooltip="`y=${Math.round(y)}`" show-horizontal />
  </svg>
</template>