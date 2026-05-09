<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix/vue';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

const rows = ref<Order[]>([
  { id: 'O-1042', customer: 'Alice Chen', amount: 1280, status: '已支付', date: '2026-05-09' },
  { id: 'O-1041', customer: 'Bob Wang', amount: 698, status: '已发货', date: '2026-05-08' },
  { id: 'O-1040', customer: 'Carol Liu', amount: 3450, status: '处理中', date: '2026-05-08' },
  { id: 'O-1039', customer: 'Dave Zhang', amount: 218, status: '已退款', date: '2026-05-07' },
]);

const columns: TableColumn<Order>[] = [
  { key: 'id', title: '订单号', width: 100, sortable: true },
  { key: 'customer', title: '客户', sortable: true },
  {
    key: 'amount',
    title: '金额',
    align: 'right',
    width: 100,
    sortable: true,
    format: (v) => `¥${(v as number).toLocaleString()}`,
  },
  { key: 'status', title: '状态', width: 80 },
  { key: 'date', title: '日期', width: 120, sortable: true },
];
</script>

<template>
  <CfTable :columns="columns" :rows="rows" row-key="id" variant="bordered" />
</template>
