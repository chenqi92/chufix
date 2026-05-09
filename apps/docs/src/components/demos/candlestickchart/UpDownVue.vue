<script setup lang="ts">
import { CfCandlestickChart } from '@chufix/vue';
const trendUp = [
  { open: 100, close: 105, high: 108, low: 98 },
  { open: 105, close: 112, high: 114, low: 103 },
  { open: 112, close: 110, high: 116, low: 108 },
  { open: 110, close: 118, high: 120, low: 109 },
  { open: 118, close: 124, high: 128, low: 117 },
  { open: 124, close: 130, high: 132, low: 122 },
  { open: 130, close: 138, high: 140, low: 128 },
];
const trendDown = [
  { open: 200, close: 192, high: 202, low: 188 },
  { open: 192, close: 196, high: 198, low: 188 },
  { open: 196, close: 184, high: 198, low: 180 },
  { open: 184, close: 178, high: 188, low: 174 },
  { open: 178, close: 172, high: 182, low: 168 },
  { open: 172, close: 165, high: 175, low: 160 },
  { open: 165, close: 158, high: 170, low: 154 },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div>
      <div style="font-size: 11px; color: var(--status-success); margin-bottom: 4px; font-family: var(--font-mono);">↑ 上行</div>
      <CfCandlestickChart :data="trendUp" :height="180" />
    </div>
    <div>
      <div style="font-size: 11px; color: var(--status-error); margin-bottom: 4px; font-family: var(--font-mono);">↓ 下行</div>
      <CfCandlestickChart :data="trendDown" :height="180" />
    </div>
  </div>
</template>
