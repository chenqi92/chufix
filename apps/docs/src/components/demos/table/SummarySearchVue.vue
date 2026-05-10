<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Sale {
  id: string;
  product: string;
  category: string;
  price: number;
  qty: number;
  total: number;
}

const rows = ref<Sale[]>(
  Array.from({ length: 24 }, (_, i) => {
    const product = ['Pro · 月付', 'Pro · 年付', 'Team · 月付', 'Team · 年付', 'Enterprise · 年付'][i % 5];
    const category = product.startsWith('Enterprise') ? 'Enterprise' : product.startsWith('Team') ? 'Team' : 'Pro';
    const price = product.includes('年付') ? (category === 'Enterprise' ? 1290 : category === 'Team' ? 480 : 120) : category === 'Enterprise' ? 130 : category === 'Team' ? 49 : 12;
    const qty = 1 + (i % 7);
    return {
      id: `S-${10000 + i}`,
      product,
      category,
      price,
      qty,
      total: price * qty,
    };
  }),
);

const columns: TableColumn<Sale>[] = [
  { key: 'id', title: '订单号', width: 110 },
  { key: 'product', title: '产品', width: 180, filterable: true },
  {
    key: 'category',
    title: '套餐',
    width: 130,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Pro', value: 'Pro' },
      { label: 'Team', value: 'Team' },
      { label: 'Enterprise', value: 'Enterprise' },
    ],
    summary: 'count',
    summaryRender: (n) => `${n} 行`,
  },
  { key: 'price', title: '单价', width: 100, align: 'right', sortable: true, format: (v) => `¥${(v as number).toLocaleString()}`, summary: 'avg', summaryRender: (n) => `平均 ¥${Math.round(n as number).toLocaleString()}` },
  { key: 'qty', title: '数量', width: 90, align: 'right', sortable: true, summary: 'sum' },
  { key: 'total', title: '合计', width: 130, align: 'right', sortable: true, format: (v) => `¥${(v as number).toLocaleString()}`, summary: 'sum', summaryRender: (n) => `¥${(n as number).toLocaleString()}` },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    toolbar="auto"
    show-summary
    variant="bordered"
    :default-pagination="{ page: 1, pageSize: 8 }"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    工具栏自带全局搜索；点列头漏斗图标做单列过滤；总计行自动求和 / 平均 / 计数；分页跟随过滤后结果。
  </p>
</template>
