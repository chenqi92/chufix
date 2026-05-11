<script setup lang="ts">
import { computed } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Note { id: string; title: string; body: string; }

const rows = computed<Note[]>(() =>
  Array.from({ length: 600 }, (_, i) => ({
    id: `N-${i}`,
    title: `Note ${i + 1}`,
    // 故意制造长短不一的内容，组件内自动测量
    body: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(1 + (i % 6)),
  })),
);

const columns: TableColumn<Note>[] = [
  { key: 'id', title: 'ID', width: 100 },
  { key: 'title', title: '标题', width: 130 },
  { key: 'body', title: '正文', cellClass: 'note-body' },
];
</script>

<template>
  <p style="margin: 0 0 8px; color: var(--fg-3); font-size: 12px;">
    600 行，body 长度从 1× 到 6× 不等。<code>auto-row-height</code> 自动用 ResizeObserver 测每行真实高度。
  </p>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="id"
    virtual
    auto-row-height
    sticky-header
    :height="400"
    variant="bordered"
  />
</template>

<style scoped>
:deep(.note-body) {
  white-space: normal;
  line-height: 18px;
  padding: 8px 12px;
}
</style>
