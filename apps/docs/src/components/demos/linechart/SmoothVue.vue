<script setup lang="ts">
import { CfLineChart } from '@chufix-design/vue';
const series = [{ name: 'CPU', data: [20, 35, 30, 50, 65, 45, 60, 75, 65, 80, 70, 85] }];
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px; font-family: var(--font-mono);">smooth = false</div>
      <CfLineChart :series="series" :height="180" />
    </div>
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px; font-family: var(--font-mono);">smooth = true（Catmull-Rom）</div>
      <CfLineChart :series="series" :height="180" smooth />
    </div>
  </div>
</template>
