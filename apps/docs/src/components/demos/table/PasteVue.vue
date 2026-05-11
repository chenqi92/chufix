<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Item { id: string; sku: string; price: number; stock: number; }

const rows = ref<Item[]>(
  Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    sku: `SKU-${(1000 + i).toString()}`,
    price: 100 + i * 13,
    stock: 50 - i * 4,
  })),
);

const columns: TableColumn<Item>[] = [
  { key: 'sku', title: 'SKU', width: 130, editable: true },
  { key: 'price', title: '价格', width: 110, align: 'right', editable: true, editType: 'number' },
  { key: 'stock', title: '库存', width: 110, align: 'right', editable: true, editType: 'number', editValidate: (v) => typeof v === 'number' && v >= 0 },
];

function onCellEdit({ row, column, newValue }: { row: Item; column: TableColumn<Item>; newValue: unknown }) {
  const i = rows.value.findIndex((r) => r.id === row.id);
  if (i === -1) return;
  rows.value[i] = { ...rows.value[i], [column.dataIndex ?? column.key]: newValue };
}
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    cell-selectable
    cell-pastable
    @cell-edit="onCellEdit"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    操作步骤：① 单击任意单元格作为粘贴起点（或者 Shift 框选一片范围）。② 在 Excel / Numbers / Google Sheets 里复制一片单元格。③ 回到这里按 <kbd>Ctrl/⌘ + V</kbd>，TSV 自动按起点写回；
    <code>editValidate</code> 不通过的格子被跳过；负数库存会被拒绝。
  </p>
</template>
