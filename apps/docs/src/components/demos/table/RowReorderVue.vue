<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Step { id: string; title: string; owner: string; eta: string; status: string; }

const rows = ref<Step[]>([
  { id: '1', title: '需求评审', owner: 'Alice', eta: '0.5d', status: 'done' },
  { id: '2', title: '设计稿', owner: 'Bob', eta: '2d', status: 'in-progress' },
  { id: '3', title: 'API 草案', owner: 'Carol', eta: '1d', status: 'in-progress' },
  { id: '4', title: '前端实现', owner: 'Dave', eta: '3d', status: 'todo' },
  { id: '5', title: '联调', owner: 'Eve', eta: '1d', status: 'todo' },
  { id: '6', title: '测试 + 上线', owner: 'Frank', eta: '0.5d', status: 'todo' },
]);

const columns: TableColumn<Step>[] = [
  { key: 'title', title: '步骤', width: 160 },
  { key: 'owner', title: '负责人', width: 100 },
  { key: 'eta', title: '预计', width: 80 },
  { key: 'status', title: '状态', width: 110 },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    row-reorderable
    @update:rows="(v) => rows = v"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    左侧的 ⋮⋮ 把柄可拖动整行换序；上层通过 <code>@update:rows</code> 拿到新数组。
  </p>
</template>
