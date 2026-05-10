<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Symbol { id: string; sym: string; price: number; change: string; volume: string; pinned?: boolean; }

const rows = ref<Symbol[]>([
  { id: 'BTC', sym: 'BTC/USDT', price: 67_842, change: '+1.24%', volume: '32.4B', pinned: true },
  { id: 'ETH', sym: 'ETH/USDT', price: 3_521, change: '-0.82%', volume: '18.9B', pinned: true },
  { id: 'SOL', sym: 'SOL/USDT', price: 184.1, change: '+3.41%', volume: '4.7B' },
  { id: 'AVAX', sym: 'AVAX/USDT', price: 42.7, change: '+0.93%', volume: '780M' },
  { id: 'DOT', sym: 'DOT/USDT', price: 7.31, change: '-1.04%', volume: '420M' },
  { id: 'MATIC', sym: 'MATIC/USDT', price: 0.84, change: '-2.18%', volume: '690M' },
  { id: 'LINK', sym: 'LINK/USDT', price: 18.4, change: '+0.21%', volume: '510M' },
  { id: 'ARB', sym: 'ARB/USDT', price: 0.94, change: '+1.92%', volume: '320M' },
  { id: 'ATOM', sym: 'ATOM/USDT', price: 8.2, change: '+0.42%', volume: '190M' },
  { id: 'NEAR', sym: 'NEAR/USDT', price: 5.6, change: '-0.74%', volume: '230M' },
]);

const columns: TableColumn<Symbol>[] = [
  { key: 'sym', title: '币对', width: 130 },
  { key: 'price', title: '价格', width: 120, align: 'right', format: (v) => `$ ${(v as number).toLocaleString()}` },
  { key: 'change', title: '24h', width: 100, align: 'right', cellClass: (r) => r.change.startsWith('+') ? 'price-up' : 'price-down' },
  { key: 'volume', title: '成交量', width: 110, align: 'right' },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    :pinned-row-keys="['BTC', 'ETH']"
    sticky-header
    :height="280"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    BTC / ETH 被固定在表体顶部 sticky；下面的列表可以滚动，固定行始终可见。
  </p>
</template>

<style scoped>
:deep(.price-up) { color: var(--status-success); }
:deep(.price-down) { color: var(--status-error); }
</style>
