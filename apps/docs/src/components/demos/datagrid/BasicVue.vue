<script setup lang="ts">
import { ref } from 'vue';
import { CfDataGrid, type DataGridColumn, type DataGridCellEdit } from '@chufix/vue';

interface Row {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  level: number;
}

const rows = ref<Row[]>([
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: '前端', joined: '2023-04-12', level: 3 },
  { id: '2', name: 'Bob Wang', email: 'bob@example.com', role: '后端', joined: '2024-01-08', level: 2 },
  { id: '3', name: 'Carol Liu', email: 'carol@example.com', role: '设计', joined: '2025-09-15', level: 5 },
  { id: '4', name: 'Dave Zhang', email: 'dave@example.com', role: '运维', joined: '2026-02-20', level: 1 },
  { id: '5', name: 'Eve Sun', email: 'eve@example.com', role: '产品', joined: '2024-11-03', level: 4 },
]);

const columns: DataGridColumn<Row>[] = [
  { key: 'id', title: 'ID', width: 60, sortable: true },
  { key: 'name', title: '姓名', width: 120, sortable: true, resizable: true, editable: true },
  { key: 'email', title: '邮箱', width: 200, resizable: true, editable: true },
  { key: 'role', title: '角色', width: 100, resizable: true, editable: true },
  { key: 'joined', title: '入职', width: 120, sortable: true, resizable: true },
  { key: 'level', title: '等级', width: 80, align: 'right', sortable: true, editable: true },
];

function onEdit(edit: DataGridCellEdit<Row>) {
  const target = rows.value.find((r) => r.id === edit.row.id);
  if (!target) return;
  const key = edit.column.dataIndex ?? edit.column.key;
  if (key === 'level') {
    (target as any)[key] = Number(edit.value);
  } else {
    (target as any)[key] = edit.value;
  }
}
</script>

<template>
  <CfDataGrid
    :columns="columns"
    :rows="rows"
    row-key="id"
    selectable="multiple"
    :max-height="320"
    @cell-edit="onEdit"
  />
  <p style="margin: 8px 0 0; font-size: 12px; color: var(--fg-3);">
    双击单元格可编辑「姓名 / 邮箱 / 角色 / 等级」；拖动列右边缘调整宽度；点击列头排序。
  </p>
</template>
