<script setup lang="ts">
import { ref } from 'vue';
import { CfGlobalSearch, CfButton } from '@chufix/vue';
const open = ref(false);
const results = Array.from({ length: 18 }, (_, i) => ({
  id: String(i),
  title: ['/v1/orders', '/v1/login', 'jane.l', 'preview env', 'reset onboarding', 'export collection'][i % 6],
  description: 'desc ' + i,
  category: ['API', '人员', '环境', '设置', '操作'][i % 5],
  badge: ['GET', 'POST', '', '', 'env'][i % 5],
  path: 'path/' + i,
  shortcut: i % 4 === 0 ? '⌘E' : undefined,
}));
</script>

<template>
  <div class="demo-row">
    <CfButton @click="open = true">类目过滤搜索</CfButton>
    <CfGlobalSearch
      :open="open"
      :results="results"
      @update:open="(v) => open = v"
      @select="(id) => alert(`Selected: ${id}`)"
    />
  </div>
</template>
