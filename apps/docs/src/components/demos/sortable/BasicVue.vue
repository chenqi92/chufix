<script setup lang="ts">
import { ref } from 'vue';
import { CfSortable } from '@chufix-design/vue';

interface Item {
  id: string;
  label: string;
  hint: string;
}

const items = ref<Item[]>([
  { id: 'a', label: '需求分析', hint: 'PM 输入' },
  { id: 'b', label: '设计稿评审', hint: 'Design' },
  { id: 'c', label: '前后端拉齐', hint: 'Eng' },
  { id: 'd', label: '联调', hint: 'QA' },
  { id: 'e', label: '上线灰度', hint: 'SRE' },
]);
</script>

<template>
  <div class="sortable-demo">
    <CfSortable v-model:items="items" item-key="id">
      <template #default="{ item, isDragging }">
        <div class="sortable-row" :class="{ 'is-active': isDragging }">
          <span class="sortable-row__index" />
          <div class="sortable-row__body">
            <strong>{{ item.label }}</strong>
            <span>{{ item.hint }}</span>
          </div>
        </div>
      </template>
    </CfSortable>
    <pre class="sortable-demo__state">{{ items.map((x) => x.id).join(' → ') }}</pre>
  </div>
</template>

<style scoped>
.sortable-demo {
  display: grid;
  gap: 10px;
}
.sortable-row {
  display: grid;
  grid-template-columns: 8px 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-3);
}
.sortable-row.is-active {
  border-color: var(--accent-1);
  background: var(--bg-2);
}
.sortable-row__index {
  width: 4px;
  height: 22px;
  background: var(--accent-1);
  border-radius: 2px;
}
.sortable-row__body {
  display: flex;
  align-items: baseline;
  gap: 10px;
  color: var(--fg-1);
}
.sortable-row__body span {
  color: var(--fg-3);
  font-size: var(--t-12);
}
.sortable-demo__state {
  margin: 0;
  padding: 8px 10px;
  background: var(--bg-inset);
  border-radius: var(--r-3);
  font-size: var(--t-12);
  color: var(--fg-2);
}
</style>
