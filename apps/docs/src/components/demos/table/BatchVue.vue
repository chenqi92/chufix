<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Task { id: string; title: string; owner: string; due: string; status: string; }

const rows = ref<Task[]>(
  Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    title: `Task #${i + 1} · ${['fix bug', 'design review', 'API draft', 'merge PR', 'release notes'][i % 5]}`,
    owner: ['Alice', 'Bob', 'Carol', 'Dave'][i % 4],
    due: `2026-05-${(10 + (i % 20)).toString().padStart(2, '0')}`,
    status: ['todo', 'doing', 'done'][i % 3],
  })),
);

const selected = ref<string[]>([]);

const columns: TableColumn<Task>[] = [
  { key: 'title', title: '标题', width: 280 },
  { key: 'owner', title: '负责人', width: 110 },
  { key: 'due', title: '截止', width: 130 },
  { key: 'status', title: '状态', width: 100 },
];

function batchClose(keys: string[]) {
  rows.value = rows.value.map((r) => keys.includes(r.id) ? { ...r, status: 'done' } : r);
  selected.value = [];
}
function batchDelete(keys: string[]) {
  rows.value = rows.value.filter((r) => !keys.includes(r.id));
  selected.value = [];
}
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    selectable="multiple"
    v-model="selected"
    batch-actions
    variant="bordered"
  >
    <template #batch-actions="{ selectedKeys }">
      <button type="button" class="cf-table__batch-btn" @click="batchClose(selectedKeys as string[])">标记完成</button>
      <button type="button" class="cf-table__batch-btn" @click="batchDelete(selectedKeys as string[])" style="color: var(--status-error);">删除</button>
    </template>
  </CfTable>
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    勾选任意行后顶部出现批量操作条。内置 "导出选中" / "清空"，再加上业务自定义的 "标记完成" / "删除"。
  </p>
</template>
