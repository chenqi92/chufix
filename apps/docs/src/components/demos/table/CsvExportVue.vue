<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Invoice { id: string; client: string; product: string; amount: number; status: string; date: string; }

const rows = ref<Invoice[]>([
  { id: 'INV-001', client: 'Acme Inc.', product: 'Pro Plan · 年付', amount: 12000, status: '已支付', date: '2026-04-01' },
  { id: 'INV-002', client: 'Globex', product: 'Team · 月付', amount: 480, status: '已支付', date: '2026-04-12' },
  { id: 'INV-003', client: 'Initech', product: 'Enterprise · 年付', amount: 156000, status: '待支付', date: '2026-04-15' },
  { id: 'INV-004', client: 'Vandelay', product: 'Pro Plan · 月付', amount: 120, status: '已退款', date: '2026-04-22' },
]);

const columns: TableColumn<Invoice>[] = [
  { key: 'id', title: '发票号', width: 110 },
  { key: 'client', title: '客户', width: 160 },
  { key: 'product', title: '产品', width: 200 },
  { key: 'amount', title: '金额', width: 110, align: 'right', format: (v) => `¥${(v as number).toLocaleString()}`, exportRender: (v) => String(v) },
  { key: 'status', title: '状态', width: 100, filterable: true, filterType: 'select', filterOptions: [
    { label: '已支付', value: '已支付' },
    { label: '待支付', value: '待支付' },
    { label: '已退款', value: '已退款' },
  ] },
  { key: 'date', title: '日期', width: 120 },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    toolbar="auto"
    exportable
    export-file-name="invoices-2026-04"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    工具栏右边出现 Export 按钮；导出的是当前过滤 / 搜索后的结果，文件名带 BOM 的 UTF-8 CSV。
    <code>amount</code> 列指定了 <code>exportRender</code>，导出时输出原始数字而不是格式化后的 ¥。
  </p>
</template>
