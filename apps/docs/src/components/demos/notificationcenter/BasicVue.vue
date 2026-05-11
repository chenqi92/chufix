<script setup lang="ts">
import { ref } from 'vue';
import { CfNotificationCenter } from '@chufix-design/vue';
const items = ref([
  { id: '1', title: 'Build 成功', description: '#142 通过 · 1m 23s', tone: 'success' as const, timestamp: '刚刚' },
  { id: '2', title: 'Pipeline 警告', description: '3 条未使用导出', tone: 'warning' as const, timestamp: '5m', read: false },
  { id: '3', title: '部署失败', description: 'Cloudflare returned 502', tone: 'error' as const, timestamp: '1h', actionLabel: '查看日志', read: true },
  { id: '4', title: '新成员加入', description: 'jane.l 加入了 payments 团队', tone: 'info' as const, timestamp: '2h', read: true },
]);
function markAllRead() { items.value = items.value.map(it => ({ ...it, read: true })); }
function clearAll() { items.value = []; }
</script>

<template>
  <CfNotificationCenter
    :items="items"
    @item-action="(id) => alert(`Action: ${id}`)"
    @mark-all-read="markAllRead"
    @clear-all="clearAll"
  />
</template>
