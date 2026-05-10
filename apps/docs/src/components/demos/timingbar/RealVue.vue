<script setup lang="ts">
import { CfTimingBar } from '@chufix-design/vue';
// 真实场景：3 个并发 HTTP 请求
const r1 = [
  { label: 'DNS', start: 0, end: 8, colorIndex: 6 },
  { label: 'Connect', start: 8, end: 32, colorIndex: 0 },
  { label: 'TLS', start: 32, end: 80, colorIndex: 2 },
  { label: 'Wait', start: 80, end: 220, colorIndex: 1 },
  { label: 'Receive', start: 220, end: 264, colorIndex: 3 },
];
const r2 = [
  { label: 'Wait', start: 0, end: 184, colorIndex: 1 },
  { label: 'Receive', start: 184, end: 220, colorIndex: 3 },
];
const r3 = [
  { label: 'Wait', start: 0, end: 412, colorIndex: 5 },
  { label: 'Receive', start: 412, end: 480, colorIndex: 3 },
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div style="font-size: 11px; color: var(--fg-3); font-family: var(--font-mono);">GET /v1/me · 264ms</div>
    <CfTimingBar :phases="r1" />
    <div style="font-size: 11px; color: var(--fg-3); font-family: var(--font-mono);">GET /v1/orders (cached) · 220ms</div>
    <CfTimingBar :phases="r2" />
    <div style="font-size: 11px; color: var(--fg-3); font-family: var(--font-mono);">POST /v1/charges · 480ms</div>
    <CfTimingBar :phases="r3" />
  </div>
</template>
