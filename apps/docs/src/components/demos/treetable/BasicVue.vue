<script setup lang="ts">
import { CfTreeTable, type TreeTableColumn } from '@chufix-design/vue';

interface Row extends Record<string, unknown> {
  name: string;
  size: string;
  modified: string;
  children?: Row[];
}

const data: Row[] = [
  {
    name: 'src',
    size: '—',
    modified: '今天 09:14',
    children: [
      { name: 'index.ts', size: '2.1 KB', modified: '今天 09:12' },
      {
        name: 'components',
        size: '—',
        modified: '昨天',
        children: [
          { name: 'Button.vue', size: '4.4 KB', modified: '昨天' },
          { name: 'Input.vue',  size: '6.2 KB', modified: '昨天' },
        ],
      },
    ],
  },
  {
    name: 'docs',
    size: '—',
    modified: '2 天前',
    children: [
      { name: 'README.md', size: '1.8 KB', modified: '2 天前' },
    ],
  },
];

const columns: TreeTableColumn<Row>[] = [
  { key: 'name',     label: '名称' },
  { key: 'size',     label: '大小',     align: 'right', width: 100 },
  { key: 'modified', label: '修改时间', width: 140 },
];
</script>

<template>
  <CfTreeTable
    :data="data"
    :columns="columns"
    :default-expanded-keys="['0', '0.1']"
  />
</template>
