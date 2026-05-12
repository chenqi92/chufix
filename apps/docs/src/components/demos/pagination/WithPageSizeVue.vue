<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { CfPagination, CfSelect } from '@chufix-design/vue';

const page = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(243);

const pageOptions = [
  { label: '10 / 页', value: 10 },
  { label: '20 / 页', value: 20 },
  { label: '50 / 页', value: 50 },
];

const summary = computed<string>(() => {
  const start = (page.value - 1) * pageSize.value + 1;
  const end = Math.min(page.value * pageSize.value, total.value);
  return `${start}-${end} / ${total.value}`;
});

watch(pageSize, () => {
  page.value = 1;
});
</script>

<template>
  <div class="demo-row">
    <CfSelect v-model="pageSize" :options="pageOptions" size="sm" />
    <CfPagination v-model="page" :total="total" :page-size="pageSize" size="sm" />
    <span class="adm-summary">{{ summary }}</span>
  </div>
</template>

<style scoped>
.adm-summary { color: var(--fg-3); font-size: var(--t-12); }
</style>
