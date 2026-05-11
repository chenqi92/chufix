<script setup lang="ts">
import { CfFunnelChart } from '@chufix-design/vue';
const goodConversion = [
  { label: '访问 100k', value: 100000 },
  { label: '注册 50k', value: 50000 },
  { label: '激活 35k', value: 35000 },
  { label: '付费 12k', value: 12000 },
];
const badConversion = [
  { label: '访问 100k', value: 100000 },
  { label: '注册 8k', value: 8000 },
  { label: '激活 3k', value: 3000 },
  { label: '付费 400', value: 400 },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px;">健康漏斗（12% 付费）</div>
      <CfFunnelChart :steps="goodConversion" :height="200" />
    </div>
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px;">流失严重（0.4% 付费）</div>
      <CfFunnelChart :steps="badConversion" :height="200" />
    </div>
  </div>
</template>
