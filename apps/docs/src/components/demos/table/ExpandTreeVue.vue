<script setup lang="ts">
import { ref, h } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface FileNode {
  id: string;
  name: string;
  size: string;
  modified: string;
  children?: FileNode[];
}

const rows = ref<FileNode[]>([
  {
    id: 'src',
    name: 'src/',
    size: '—',
    modified: '2026-05-09',
    children: [
      {
        id: 'src/components',
        name: 'components/',
        size: '—',
        modified: '2026-05-09',
        children: [
          { id: 'src/components/Table.vue', name: 'Table.vue', size: '32.4 KB', modified: '2026-05-09' },
          { id: 'src/components/variants.ts', name: 'variants.ts', size: '8.2 KB', modified: '2026-05-09' },
        ],
      },
      { id: 'src/index.ts', name: 'index.ts', size: '1.1 KB', modified: '2026-05-08' },
    ],
  },
  {
    id: 'dist',
    name: 'dist/',
    size: '—',
    modified: '2026-05-10',
    children: [
      { id: 'dist/index.js', name: 'index.js', size: '541 KB', modified: '2026-05-10' },
      { id: 'dist/style.css', name: 'style.css', size: '238 KB', modified: '2026-05-10' },
    ],
  },
  { id: 'README.md', name: 'README.md', size: '4.2 KB', modified: '2026-05-09' },
]);

const columns: TableColumn<FileNode>[] = [
  { key: 'name', title: '名称' },
  { key: 'size', title: '大小', width: 120, align: 'right' },
  { key: 'modified', title: '最近修改', width: 140 },
];

const expanded = ref<string[]>(['src', 'src/components']);
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    expandable
    v-model:expanded-row-keys="expanded"
    variant="bordered"
  />
</template>
