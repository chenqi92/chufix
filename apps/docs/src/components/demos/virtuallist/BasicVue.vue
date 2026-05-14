<script setup lang="ts">
import { CfVirtualList } from '@chufix-design/vue';

const items = Array.from({ length: 50_000 }, (_, i) => ({
  id: i,
  title: `Row #${i + 1}`,
  desc: `Lorem ipsum dolor sit amet — ${(i * 7) % 1000}`,
}));
</script>

<template>
  <CfVirtualList
    :items="items"
    :item-height="48"
    :height="320"
    :item-key="(it) => it.id"
  >
    <template #default="{ item }">
      <div class="demo-row">
        <strong>{{ item.title }}</strong>
        <span class="demo-row__sub">{{ item.desc }}</span>
      </div>
    </template>
  </CfVirtualList>
</template>

<style scoped>
.demo-row { padding: 8px 12px; border-bottom: 1px solid var(--line-1); display: flex; flex-direction: column; }
.demo-row__sub { color: var(--fg-3); font-size: var(--t-11); }
</style>
