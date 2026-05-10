<script setup lang="ts">
import { CfAreaChart } from '@chufix-design/vue';
const series = [
  { name: 'GET', data: [10, 14, 12, 18, 22, 20, 26, 32, 28, 35, 30, 40] },
  { name: 'POST', data: [3, 5, 4, 6, 8, 7, 10, 12, 11, 14, 13, 16] },
  { name: 'PUT', data: [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7] },
  { name: 'DELETE', data: [0, 1, 0, 2, 1, 1, 2, 3, 2, 3, 4, 3] },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px; font-family: var(--font-mono);">stacked = false（重叠）</div>
      <CfAreaChart :series="series" :height="180" smooth />
    </div>
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px; font-family: var(--font-mono);">stacked = true</div>
      <CfAreaChart :series="series" :height="180" smooth stacked />
    </div>
  </div>
</template>
