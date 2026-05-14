<script setup lang="ts">
import { ref } from 'vue';
import { CfColumnVisibilityMenu, type ColumnConfig } from '@chufix-design/vue';

const columns = ref<ColumnConfig[]>([
  { key: 'name',   label: '姓名',     visible: true, pinned: 'left',  locked: true },
  { key: 'email',  label: '邮箱',     visible: true },
  { key: 'role',   label: '角色',     visible: true },
  { key: 'team',   label: '团队',     visible: false },
  { key: 'joined', label: '加入时间', visible: true },
  { key: 'status', label: '状态',     visible: true, pinned: 'right' },
]);
</script>

<template>
  <div class="demo-stack">
    <CfColumnVisibilityMenu v-model="columns" />
    <pre class="demo-hint">{{ columns.map(c => `${c.visible ? '✓' : '✗'} ${c.label}${c.pinned ? ` (${c.pinned})` : ''}`).join('\n') }}</pre>
  </div>
</template>

<style scoped>
.demo-hint { background: var(--bg-2); padding: 8px 12px; border-radius: var(--r-3); font-family: var(--font-mono); font-size: var(--t-12); margin: 0; }
</style>
