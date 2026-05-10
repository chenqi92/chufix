<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Member { id: string; name: string; email: string; role: string; quota: number; }

const rows = ref<Member[]>([
  { id: '1', name: 'Jane Liu', email: 'jane@chufix.com', role: 'admin', quota: 5 },
  { id: '2', name: 'Bob Wang', email: 'bob@chufix.com', role: 'editor', quota: 3 },
  { id: '3', name: 'Alice Chen', email: 'alice@chufix.com', role: 'viewer', quota: 1 },
]);

const columns: TableColumn<Member>[] = [
  { key: 'name', title: '姓名', width: 130, editable: true },
  { key: 'email', title: '邮箱', width: 200, editable: true },
  {
    key: 'role',
    title: '角色',
    width: 130,
    editable: true,
    editType: 'select',
    editOptions: [
      { label: 'admin', value: 'admin' },
      { label: 'editor', value: 'editor' },
      { label: 'viewer', value: 'viewer' },
    ],
  },
  { key: 'quota', title: '配额', width: 90, align: 'right', editable: true, editType: 'number', editValidate: (v) => typeof v === 'number' && v >= 0 },
];

function onCellEdit({ row, column, newValue }: { row: Member; column: TableColumn<Member>; newValue: unknown }) {
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
    edit-mode="row"
    @cell-edit="onCellEdit"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    双击任意行进入整行编辑：所有可编辑列同时变成 input。底部出现 Save / Cancel；Enter 也可提交，Esc 取消。
  </p>
</template>
