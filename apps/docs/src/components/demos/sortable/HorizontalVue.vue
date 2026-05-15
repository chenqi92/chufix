<script setup lang="ts">
import { ref } from 'vue';
import { CfSortable } from '@chufix-design/vue';

interface Tab {
  id: string;
  label: string;
}

const tabs = ref<Tab[]>([
  { id: 'overview', label: '总览' },
  { id: 'logs', label: '日志' },
  { id: 'metrics', label: '指标' },
  { id: 'traces', label: '链路' },
  { id: 'errors', label: '错误' },
]);
</script>

<template>
  <CfSortable v-model:items="tabs" item-key="id" axis="x">
    <template #default="{ item }">
      <div class="tab-chip">{{ item.label }}</div>
    </template>
  </CfSortable>
</template>

<style scoped>
.tab-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  margin-right: 6px;
  background: var(--bg-2);
  color: var(--fg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-pill);
  font-size: var(--t-13);
  white-space: nowrap;
}
</style>
