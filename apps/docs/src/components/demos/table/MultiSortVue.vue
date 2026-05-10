<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn, type TableSort } from '@chufix-design/vue';

interface Repo { name: string; stars: number; forks: number; lang: string; }

const rows = ref<Repo[]>([
  { name: 'vuejs/core', stars: 47800, forks: 8200, lang: 'TypeScript' },
  { name: 'facebook/react', stars: 232000, forks: 47800, lang: 'JavaScript' },
  { name: 'sveltejs/svelte', stars: 81000, forks: 4200, lang: 'TypeScript' },
  { name: 'solidjs/solid', stars: 32400, forks: 1100, lang: 'TypeScript' },
  { name: 'preactjs/preact', stars: 36800, forks: 2050, lang: 'JavaScript' },
  { name: 'angular/angular', stars: 96100, forks: 25400, lang: 'TypeScript' },
  { name: 'lit/lit', stars: 19200, forks: 980, lang: 'TypeScript' },
]);

const sort = ref<TableSort[]>([
  { key: 'lang', direction: 'asc' },
  { key: 'stars', direction: 'desc' },
]);

const columns: TableColumn<Repo>[] = [
  { key: 'name', title: '仓库', width: 220 },
  { key: 'lang', title: '语言', width: 140, sortable: true },
  { key: 'stars', title: 'Stars', width: 110, align: 'right', sortable: true, format: (v) => (v as number).toLocaleString() },
  { key: 'forks', title: 'Forks', width: 110, align: 'right', sortable: true, format: (v) => (v as number).toLocaleString() },
];
</script>

<template>
  <CfTable
    :columns="columns"
    :rows="rows"
    row-key="name"
    multi-sort
    v-model:sort="sort"
    variant="bordered"
  />
  <p style="margin-top: 8px; color: var(--fg-3); font-size: 12px;">
    点列头切换排序；按住 <kbd>Shift</kbd> 再点别的列追加次级排序。当前：按语言升序，再按 stars 降序。
  </p>
</template>
