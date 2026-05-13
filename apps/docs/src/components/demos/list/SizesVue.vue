<script setup lang="ts">
import { CfList, type ListItem } from '@chufix-design/vue';

const items: ListItem[] = [
  { key: 'a', label: 'Alice Chen', description: '前端工程师 · 上海' },
  { key: 'b', label: 'Bob Wang',   description: '后端工程师 · 北京' },
  { key: 'c', label: 'Carol Liu',  description: '设计师 · 深圳' },
];
</script>

<template>
  <div class="demo-stack">
    <div><span class="adm-label">sm</span><CfList size="sm" :items="items" /></div>
    <div><span class="adm-label">md</span><CfList size="md" :items="items" /></div>
    <div><span class="adm-label">lg</span><CfList size="lg" :items="items" /></div>
  </div>
</template>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 14px; }
.adm-label { display: block; color: var(--fg-3); font-size: var(--t-12); margin-bottom: 6px; font-family: var(--font-mono); }
</style>
