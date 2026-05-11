<script setup lang="ts">
import { computed } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

const colCount = 120;
const rowCount = 200;

interface Row { id: string; [k: string]: string | number; }

const rows = computed<Row[]>(() => {
  return Array.from({ length: rowCount }, (_, r) => {
    const row: Row = { id: `R-${r.toString().padStart(4, '0')}` };
    for (let c = 0; c < colCount; c++) {
      row[`c${c}`] = ((r * 13 + c * 7) % 999).toString();
    }
    return row;
  });
});

const columns = computed<TableColumn<Row>[]>(() => {
  const cols: TableColumn<Row>[] = [{ key: 'id', title: 'ID', width: 100, fixed: 'left' }];
  for (let c = 0; c < colCount; c++) {
    cols.push({ key: `c${c}`, title: `c${c}`, width: 90, align: 'right' });
  }
  return cols;
});
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    数据集：<strong style="color: var(--fg-1);">{{ rowCount }} 行 × {{ colCount + 1 }} 列</strong> · 行 + 列双向虚拟化，DOM &lt; 800 个节点。
  </p>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    virtual
    :row-height="32"
    col-virtual
    :col-width="90"
    sticky-header
    :height="380"
    variant="bordered"
  />
</template>
