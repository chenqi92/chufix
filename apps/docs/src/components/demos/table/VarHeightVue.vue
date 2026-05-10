<script setup lang="ts">
import { computed } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Note { id: string; title: string; body: string; }

const rows = computed<Note[]>(() =>
  Array.from({ length: 1000 }, (_, i) => ({
    id: `N-${i}`,
    title: `Note #${i + 1}`,
    // 长度故意有大有小，模拟"每行高度不一样"
    body: 'lorem ipsum dolor sit amet '.repeat(1 + (i % 5)),
  })),
);

const columns: TableColumn<Note>[] = [
  { key: 'id', title: 'ID', width: 100 },
  { key: 'title', title: '标题', width: 140 },
  { key: 'body', title: '正文', cellClass: 'note-body' },
];

// 行高函数：根据 body 长度估算
function getHeight(idx: number): number {
  const r = rows.value[idx];
  if (!r) return 36;
  const lines = Math.max(1, Math.ceil(r.body.length / 60));
  return 24 + lines * 18; // padding 24 + 每行 18 px
}
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    1000 行 · 每行高度通过 <code>get-row-height</code> 函数计算（短的 42px，长的 ~120px）。
  </p>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    virtual
    :get-row-height="getHeight"
    sticky-header
    :height="380"
    variant="bordered"
  />
</template>

<style scoped>
:deep(.note-body) {
  white-space: normal;
  line-height: 18px;
}
</style>
