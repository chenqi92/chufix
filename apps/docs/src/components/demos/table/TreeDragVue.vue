<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Folder { id: string; name: string; size: string; children?: Folder[]; }

const rows = ref<Folder[]>([
  { id: 'src', name: 'src/', size: '—', children: [
    { id: 'src/components', name: 'components/', size: '—', children: [
      { id: 'src/components/Table.vue', name: 'Table.vue', size: '32 KB' },
      { id: 'src/components/Modal.vue', name: 'Modal.vue', size: '8 KB' },
    ]},
    { id: 'src/utils', name: 'utils/', size: '—', children: [
      { id: 'src/utils/dom.ts', name: 'dom.ts', size: '4 KB' },
    ]},
    { id: 'src/index.ts', name: 'index.ts', size: '1 KB' },
  ]},
  { id: 'tests', name: 'tests/', size: '—', children: [
    { id: 'tests/table.spec.ts', name: 'table.spec.ts', size: '12 KB' },
  ]},
]);

const expanded = ref<string[]>(['src', 'src/components', 'src/utils', 'tests']);

const columns: TableColumn<Folder>[] = [
  { key: 'name', title: '名称' },
  { key: 'size', title: '大小', width: 100, align: 'right' },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    expandable
    v-model:expanded-row-keys="expanded"
    row-reorderable
    tree-reorderable
    @update:rows="(v) => rows = v"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    拖某行的 ⋮⋮ 把柄到目标行：上 1/4 = 放到上面，下 1/4 = 放到下面，中间 = 拖**进**目标行做子节点。
  </p>
</template>
