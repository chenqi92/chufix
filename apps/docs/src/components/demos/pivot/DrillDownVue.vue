<script setup lang="ts">
import { ref } from 'vue';
import { CfPivot } from '@chufix-design/vue';

interface Sale {
  product: string;
  store: string;
  amount: number;
  qty: number;
}

const data: Sale[] = [
  { product: 'A', store: '上海', amount: 3200, qty: 12 },
  { product: 'A', store: '上海', amount: 2800, qty: 9 },
  { product: 'A', store: '北京', amount: 1900, qty: 7 },
  { product: 'B', store: '上海', amount: 5400, qty: 22 },
  { product: 'B', store: '北京', amount: 6100, qty: 26 },
  { product: 'B', store: '深圳', amount: 4200, qty: 18 },
  { product: 'C', store: '上海', amount: 1200, qty: 4 },
  { product: 'C', store: '北京', amount: 2400, qty: 8 },
  { product: 'C', store: '深圳', amount: 3300, qty: 11 },
];

const drilled = ref<{ row: string; col: string; rows: Sale[] } | null>(null);
</script>

<template>
  <CfPivot
    :data="data"
    row-field="product"
    col-field="store"
    value-field="amount"
    aggregator="sum"
    :on-cell-click="(p: { row: string; col: string; rows: unknown[] }) => drilled = { row: p.row, col: p.col, rows: p.rows as Sale[] }"
  />
  <div v-if="drilled" style="margin-top: 12px; padding: 10px 12px; border: 1px solid var(--line-1); border-radius: 6px; background: var(--bg-2); font-size: 12px;">
    <div style="margin-bottom: 6px;">
      <strong>{{ drilled.row }} × {{ drilled.col }}</strong> 命中 {{ drilled.rows.length }} 条原始记录
    </div>
    <ul style="margin: 0; padding-left: 18px; color: var(--fg-2);">
      <li v-for="(r, i) in drilled.rows" :key="i">
        ¥{{ r.amount.toLocaleString() }} · {{ r.qty }} 件
      </li>
    </ul>
  </div>
</template>
