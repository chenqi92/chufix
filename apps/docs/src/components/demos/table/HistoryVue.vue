<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Order { id: string; customer: string; amount: number; status: string; }

const rows = ref<Order[]>(
  Array.from({ length: 30 }, (_, i) => ({
    id: `O-${1000 + i}`,
    customer: ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'][i % 6],
    amount: 100 + ((i * 37) % 900),
    status: ['paid', 'pending', 'refunded'][i % 3],
  })),
);

const columns: TableColumn<Order>[] = [
  { key: 'id', title: 'ID', width: 110, sortable: true },
  { key: 'customer', title: '客户', width: 140, sortable: true, filterable: true, filterType: 'select', filterOptions: [
    { label: 'Alice', value: 'Alice' }, { label: 'Bob', value: 'Bob' },
    { label: 'Carol', value: 'Carol' }, { label: 'Dave', value: 'Dave' },
    { label: 'Eve', value: 'Eve' }, { label: 'Frank', value: 'Frank' },
  ] },
  { key: 'amount', title: '金额', width: 110, align: 'right', sortable: true, format: (v) => `¥${(v as number).toLocaleString()}` },
  { key: 'status', title: '状态', width: 110, filterable: true, filterType: 'select', filterOptions: [
    { label: 'paid', value: 'paid' }, { label: 'pending', value: 'pending' }, { label: 'refunded', value: 'refunded' },
  ] },
];

const history = ref<{ canUndo: boolean; canRedo: boolean }>({ canUndo: false, canRedo: false });
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    history-enabled
    multi-sort
    toolbar="auto"
    :default-pagination="{ page: 1, pageSize: 10 }"
    @history-change="(p) => history = p"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    点列头 / 改过滤 / 翻页都进历史栈。<kbd>Ctrl/⌘ + Z</kbd> 撤销，<kbd>Ctrl/⌘ + Shift + Z</kbd> 重做。
    当前：可撤销 = <strong>{{ history.canUndo ? '是' : '否' }}</strong> · 可重做 = <strong>{{ history.canRedo ? '是' : '否' }}</strong>
  </p>
</template>
