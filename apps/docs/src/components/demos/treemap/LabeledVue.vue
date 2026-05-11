<script setup lang="ts">
import { CfTreemap } from '@chufix-design/vue';
const small = [
  { name: '依赖 A', value: 280 },
  { name: '依赖 B', value: 220 },
  { name: '依赖 C', value: 180 },
  { name: '依赖 D', value: 120 },
  { name: '其他', value: 80 },
];
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px;">5 个节点（label 显示）</div>
      <CfTreemap :nodes="small" :height="180" />
    </div>
    <div>
      <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px;">label 隐藏</div>
      <CfTreemap :nodes="small" :height="180" :show-labels="false" />
    </div>
  </div>
</template>
