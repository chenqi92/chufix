<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Score { name: string; math: number; eng: number; phys: number; chem: number; bio: number; }

const rows = ref<Score[]>([
  { name: '张三', math: 92, eng: 88, phys: 79, chem: 84, bio: 91 },
  { name: '李四', math: 85, eng: 91, phys: 88, chem: 86, bio: 79 },
  { name: '王五', math: 78, eng: 95, phys: 81, chem: 73, bio: 85 },
  { name: '赵六', math: 96, eng: 82, phys: 94, chem: 90, bio: 88 },
  { name: '钱七', math: 73, eng: 79, phys: 71, chem: 80, bio: 75 },
]);

const columns: TableColumn<Score>[] = [
  { key: 'name', title: '姓名', width: 110 },
  { key: 'math', title: '数学', width: 90, align: 'right' },
  { key: 'eng', title: '英语', width: 90, align: 'right' },
  { key: 'phys', title: '物理', width: 90, align: 'right' },
  { key: 'chem', title: '化学', width: 90, align: 'right' },
  { key: 'bio', title: '生物', width: 90, align: 'right' },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    cell-selectable
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    像 Excel 一样：单击选单元格、Shift 单击 / 拖动扩展矩形选区，<kbd>Ctrl/⌘ + C</kbd> 复制为 TSV，可以直接粘到 Excel / Numbers。
  </p>
</template>
