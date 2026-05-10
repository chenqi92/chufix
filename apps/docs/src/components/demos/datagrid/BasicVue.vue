<script setup lang="ts">
import { ref } from 'vue';
import { CfDataGrid, type DataGridColumn } from '@chufix-design/vue';

interface Row {
  id: string;
  name: string;
  role: string;
  level: number;
}

const rows = ref<Row[]>([
  { id: '1', name: 'Alice Chen', role: '前端', level: 3 },
  { id: '2', name: 'Bob Wang', role: '后端', level: 2 },
  { id: '3', name: 'Carol Liu', role: '设计', level: 5 },
  { id: '4', name: 'Dave Zhang', role: '运维', level: 1 },
]);

const columns: DataGridColumn<Row>[] = [
  { key: 'id', title: 'ID', width: 60, sortable: true },
  { key: 'name', title: '姓名', width: 140, sortable: true },
  { key: 'role', title: '角色', width: 100 },
  { key: 'level', title: '等级', width: 80, align: 'right', sortable: true },
];
</script>

<template>
  <CfDataGrid :columns="columns" :rows="rows" row-key="id" />
</template>
