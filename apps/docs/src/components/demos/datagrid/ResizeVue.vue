<script setup lang="ts">
import { ref } from 'vue';
import { CfDataGrid, type DataGridColumn } from '@chufix-design/vue';

interface Row { id: string; name: string; email: string; role: string; }

const rows = ref<Row[]>([
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: '前端' },
  { id: '2', name: 'Bob Wang', email: 'bob@example.com', role: '后端' },
  { id: '3', name: 'Carol Liu', email: 'carol@example.com', role: '设计' },
]);

const columns: DataGridColumn<Row>[] = [
  { key: 'id', title: 'ID', width: 60 },
  { key: 'name', title: '姓名', width: 140, resizable: true, minWidth: 80 },
  { key: 'email', title: '邮箱', width: 220, resizable: true, minWidth: 120 },
  { key: 'role', title: '角色', width: 100, resizable: true },
];
</script>

<template>
  <CfDataGrid :columns="columns" :rows="rows" row-key="id" />
  <p style="margin: 8px 0 0; font-size: 12px; color: var(--fg-3);">
    把鼠标放到列头右边缘，光标变成 ↔ 即可拖拽。
  </p>
</template>
