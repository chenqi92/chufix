<script setup lang="ts">
import { ref } from 'vue';
import { CfDataGrid, type DataGridColumn } from '@chufix/vue';

interface Row { id: string; name: string; status: string; }

const rows = ref<Row[]>(
  Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
    name: `项目 ${String(i + 1).padStart(3, '0')}`,
    status: i % 3 === 0 ? '进行中' : i % 3 === 1 ? '已完成' : '待审核',
  })),
);

const columns: DataGridColumn<Row>[] = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '项目', width: 240 },
  { key: 'status', title: '状态', width: 120 },
];
</script>

<template>
  <CfDataGrid :columns="columns" :rows="rows" row-key="id" :max-height="280" selectable="multiple" />
</template>
