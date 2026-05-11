<script setup lang="ts">
import { ref, computed } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Trade { id: string; symbol: string; price: number; qty: number; side: string; ts: string; }

const SYMBOLS = ['BTC', 'ETH', 'SOL', 'AVAX', 'DOT', 'MATIC', 'LINK', 'ARB'];
const BASE_TIME = Date.UTC(2026, 4, 10, 12, 0, 0);

const total = ref(50000);
const rows = computed<Trade[]>(() =>
  Array.from({ length: total.value }, (_, i) => {
    const sym = SYMBOLS[i % SYMBOLS.length];
    return {
      id: `T-${i.toString().padStart(6, '0')}`,
      symbol: sym,
      price: Math.round((1000 + Math.sin(i / 20) * 800) * 100) / 100,
      qty: Math.round(((i % 50) + 1) * 0.13 * 100) / 100,
      side: i % 3 === 0 ? 'sell' : 'buy',
      ts: new Date(BASE_TIME - i * 1000).toISOString().slice(11, 19),
    };
  }),
);

const columns: TableColumn<Trade>[] = [
  { key: 'id', title: '订单 ID', width: 130 },
  { key: 'symbol', title: '币对', width: 90, sortable: true },
  { key: 'price', title: '价格', width: 110, align: 'right', sortable: true, format: (v) => `$ ${(v as number).toLocaleString()}` },
  { key: 'qty', title: '数量', width: 100, align: 'right', sortable: true, format: (v) => (v as number).toFixed(2) },
  { key: 'side', title: '方向', width: 80 },
  { key: 'ts', title: '时间', width: 100 },
];
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    数据集大小：<strong style="color: var(--fg-1);">{{ rows.length.toLocaleString() }}</strong> 行 · 实际渲染的 DOM 节点数始终 ~30。
  </p>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    virtual
    :row-height="32"
    :height="360"
    sticky-header
    variant="bordered"
  />
</template>
