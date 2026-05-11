<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Person { id: string; name: string; role: string; team: string; }

const rows = ref<Person[]>([
  { id: '1', name: 'Jane Liu', role: 'Engineer', team: 'Payments' },
  { id: '2', name: 'Bob Wang', role: 'Designer', team: 'Brand' },
  { id: '3', name: 'Alice Chen', role: 'PM', team: 'Growth' },
  { id: '4', name: 'Tim Wong', role: 'Engineer', team: 'Platform' },
  { id: '5', name: 'Sue Zhang', role: 'Engineer', team: 'Payments' },
]);

const columns: TableColumn<Person>[] = [
  { key: 'id', title: 'ID', width: 80, hideable: true },
  { key: 'name', title: '姓名', width: 140, sortable: true },
  { key: 'role', title: '角色', width: 120 },
  { key: 'team', title: '团队', width: 140 },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    resizable
    reorderable
    toolbar="auto"
    persist-key="people-list"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    调宽 / 拖列 / 隐藏列 后刷新页面，状态从 <code>localStorage['cf-table:people-list']</code> 恢复。
  </p>
</template>
