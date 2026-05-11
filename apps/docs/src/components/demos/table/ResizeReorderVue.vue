<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Pkg { name: string; version: string; downloads: number; size: string; license: string; }

const rows = ref<Pkg[]>([
  { name: 'react', version: '19.0.1', downloads: 28940000, size: '6.1 KB', license: 'MIT' },
  { name: 'vue', version: '3.5.34', downloads: 4920000, size: '36.8 KB', license: 'MIT' },
  { name: 'lodash', version: '4.17.21', downloads: 53200000, size: '24.3 KB', license: 'MIT' },
  { name: 'axios', version: '1.7.4', downloads: 51800000, size: '13.4 KB', license: 'MIT' },
  { name: 'tailwindcss', version: '4.1.0', downloads: 12400000, size: '—', license: 'MIT' },
]);

const columns: TableColumn<Pkg>[] = [
  { key: 'name', title: '包名', width: 160, sortable: true },
  { key: 'version', title: '版本', width: 100 },
  { key: 'downloads', title: '周下载', width: 140, align: 'right', sortable: true, format: (v) => (v as number).toLocaleString() },
  { key: 'size', title: '体积', width: 90, align: 'right' },
  { key: 'license', title: '许可证', width: 100 },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="name"
    resizable
    reorderable
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    ↔ 拖拽列右边缘改宽度；按住表头拖到目标列改顺序。
  </p>
</template>
