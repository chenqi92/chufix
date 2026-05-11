<script setup lang="ts">
import { ref } from 'vue';
import { CfGlobalSearch, CfButton } from '@chufix-design/vue';
const open = ref(false);
const host = ref<HTMLElement | null>(null);
const results = [
  { id: '1', title: '/v1/orders', description: 'GET 列表所有订单', category: 'API', badge: 'GET', path: 'payments / orders' },
  { id: '2', title: '/v1/orders/{id}', description: 'PUT 更新订单', category: 'API', badge: 'PUT', path: 'payments / orders' },
  { id: '3', title: 'jane.l@example.com', description: 'Backend · Payments', category: '人员', path: 'org / payments' },
  { id: '4', title: 'preview.protoforge.io', description: '上次部署 12m 前', category: '环境', path: 'envs / preview' },
  { id: '5', title: 'Reset onboarding', description: '清空所有引导提示', category: '设置', path: 'settings / onboarding' },
  { id: '6', title: 'Export collection', description: '导出为 OpenAPI 3.1', category: '操作', shortcut: '⌘E' },
];
</script>

<template>
  <div ref="host" class="demo-floating-host demo-floating-host--search">
    <div class="demo-row">
      <CfButton @click="open = true">⌘⇧K 打开</CfButton>
    </div>
    <CfGlobalSearch
      :open="open"
      :results="results"
      :to="host ?? 'body'"
      @update:open="(v) => open = v"
      @select="(id) => alert(`Selected: ${id}`)"
    />
  </div>
</template>
