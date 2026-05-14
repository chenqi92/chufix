<script setup lang="ts">
import { ref } from 'vue';
import { CfSwipeAction } from '@chufix-design/vue';

const items = ref([
  { id: 'a', title: '会议纪要 — 2026 Q2', subtitle: 'Sarah · 上午 10:24' },
  { id: 'b', title: '产品方案评审', subtitle: 'Yifan · 昨天' },
  { id: 'c', title: '需求文档 v0.4', subtitle: 'Lin · 周一' },
]);

const log = ref('');
function onAction(key: string, item: { key: string; label: string }) {
  log.value = `${key} — ${item.label}`;
}
</script>

<template>
  <div class="demo-stack">
    <CfSwipeAction
      v-for="row in items"
      :key="row.id"
      :left="[{ key: 'star', label: '收藏', tone: 'primary' }]"
      :right="[
        { key: 'archive', label: '归档', tone: 'warning' },
        { key: 'delete',  label: '删除', tone: 'danger' },
      ]"
      @action="onAction"
    >
      <div class="demo-row">
        <strong>{{ row.title }}</strong>
        <span class="demo-row__sub">{{ row.subtitle }}</span>
      </div>
    </CfSwipeAction>
    <p v-if="log" class="demo-hint">最近操作：<code>{{ log }}</code></p>
  </div>
</template>

<style scoped>
.demo-row { padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
.demo-row__sub { color: var(--fg-3); font-size: var(--t-12); }
</style>
