<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Member { id: string; name: string; role: string; quota: number; }

const rows = ref<Member[]>([
  { id: '1', name: 'Jane', role: 'admin', quota: 5 },
  { id: '2', name: 'Bob', role: 'editor', quota: 3 },
  { id: '3', name: 'Alice', role: 'viewer', quota: 1 },
]);

const columns: TableColumn<Member>[] = [
  { key: 'name', title: '姓名', editable: true, width: 140 },
  {
    key: 'role',
    title: '角色',
    width: 140,
    editable: true,
    editType: 'select',
    editOptions: [
      { label: 'admin', value: 'admin' },
      { label: 'editor', value: 'editor' },
      { label: 'viewer', value: 'viewer' },
    ],
  },
  {
    key: 'quota',
    title: '配额',
    width: 120,
    align: 'right',
    editable: true,
    editType: 'number',
    editValidate: (v) => typeof v === 'number' && v >= 0,
  },
];

function onCellEdit({ row, column, newValue }: { row: Member; column: TableColumn<Member>; newValue: unknown }) {
  // 应用到本地数据
  const i = rows.value.findIndex((r) => r.id === row.id);
  if (i === -1) return;
  rows.value[i] = { ...rows.value[i], [column.dataIndex ?? column.key]: newValue };
}
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    @cell-edit="onCellEdit"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    双击单元格进入编辑：text / select / number。Enter / blur 提交，Esc 取消。
    数字列加了 <code>editValidate</code>，负数会被拒绝。
  </p>
</template>
