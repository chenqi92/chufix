<script setup lang="ts">
import { CfList, type ListItem } from '@chufix-design/vue';

const items: ListItem[] = [
  { key: 'a', label: 'Alice Chen', description: '前端工程师' },
  { key: 'b', label: 'Bob Wang',   description: '后端工程师' },
  { key: 'c', label: 'Carol Liu',  description: '设计师' },
];
</script>

<template>
  <div class="demo-stack">
    <div>
      <span class="adm-label">default —— 紧凑，行间无分割线</span>
      <CfList variant="default" :items="items" />
    </div>
    <div>
      <span class="adm-label">divided —— 行间细分割线</span>
      <CfList variant="divided" :items="items" />
    </div>
    <div>
      <span class="adm-label">card —— 每项独立卡片</span>
      <CfList variant="card" :bordered="false" :items="items" />
    </div>
  </div>
</template>

<style scoped>
.demo-stack { display: flex; flex-direction: column; gap: 18px; }
.adm-label { display: block; color: var(--fg-3); font-size: var(--t-12); margin-bottom: 6px; }
</style>
