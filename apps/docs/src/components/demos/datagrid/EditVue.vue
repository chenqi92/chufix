<script setup lang="ts">
import { ref } from 'vue';
import { CfDataGrid, type DataGridColumn, type DataGridCellEdit } from '@chufix-design/vue';

interface Row { id: string; name: string; role: string; level: number; }

const rows = ref<Row[]>([
  { id: '1', name: 'Alice Chen', role: '前端', level: 3 },
  { id: '2', name: 'Bob Wang', role: '后端', level: 2 },
  { id: '3', name: 'Carol Liu', role: '设计', level: 5 },
]);

const columns: DataGridColumn<Row>[] = [
  { key: 'id', title: 'ID', width: 60 },
  { key: 'name', title: '姓名', width: 140, editable: true },
  { key: 'role', title: '角色', width: 100, editable: true },
  { key: 'level', title: '等级', width: 80, align: 'right', editable: true },
];

function onEdit(edit: DataGridCellEdit<Row>) {
  const target = rows.value.find((r) => r.id === edit.row.id);
  if (!target) return;
  const key = edit.column.dataIndex ?? edit.column.key;
  (target as any)[key] = key === 'level' ? Number(edit.value) : edit.value;
}
</script>

<template>
  <CfDataGrid :columns="columns" :rows="rows" row-key="id" @cell-edit="onEdit" />
  <p style="margin: 8px 0 0; font-size: 12px; color: var(--fg-3);">
    双击任意单元格进入编辑，Enter 提交，Esc 取消。
  </p>
</template>
