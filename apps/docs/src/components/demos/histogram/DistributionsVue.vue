<script setup lang="ts">
import { CfHistogram } from '@chufix-design/vue';
const normal = [
  { label: '40-60', count: 2 },
  { label: '60-80', count: 8 },
  { label: '80-100', count: 18 },
  { label: '100-120', count: 32 },
  { label: '120-140', count: 24 },
  { label: '140-160', count: 12 },
  { label: '160-180', count: 4 },
];
const skewed = [
  { label: '0-100', count: 38 },
  { label: '100-200', count: 22 },
  { label: '200-400', count: 14 },
  { label: '400-800', count: 8 },
  { label: '800-1.6k', count: 4 },
  { label: '1.6k+', count: 2 },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px;">正态分布</div>
      <CfHistogram :bins="normal" :height="160" :color-index="0" />
    </div>
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px;">长尾分布</div>
      <CfHistogram :bins="skewed" :height="160" :color-index="3" />
    </div>
  </div>
</template>
