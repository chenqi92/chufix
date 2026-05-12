<script setup lang="ts">
import { computed, h, inject, ref } from 'vue';
import { CfTable, CfTag, CfSearchInput } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialLoginLogs, type LoginLog } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const search = ref('');
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return initialLoginLogs;
  return initialLoginLogs.filter((r) =>
    [r.user, r.ip, r.ua].some((v) => v.toLowerCase().includes(q)),
  );
});

const cols = computed(() => [
  { key: 'user', title: t.value.col_log_user, dataIndex: 'user', width: 110 },
  { key: 'ip',   title: t.value.col_log_ip,   dataIndex: 'ip',   width: 140 },
  { key: 'ua',   title: t.value.col_log_ua,   dataIndex: 'ua' },
  {
    key: 'status', title: t.value.status, dataIndex: 'status', width: 90,
    render: (v: unknown) =>
      h(CfTag,
        { size: 'sm', tone: v === 'success' ? 'success' : 'danger', variant: 'soft' },
        () => (v === 'success' ? t.value.status_success : t.value.status_failed)),
  },
  { key: 'at', title: t.value.col_log_at, dataIndex: 'at', width: 180 },
]);
</script>

<template>
  <div class="adm-page">
    <header class="adm-page__head">
      <CfSearchInput v-model="search" :placeholder="t.search" size="sm" style="width: 220px;" />
      <span class="adm-page__count">{{ t.total_rows.replace('{n}', String(filtered.length)) }}</span>
    </header>
    <CfTable :columns="cols" :rows="filtered" :row-key="(r: LoginLog) => r.id" size="sm" />
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
.adm-page__head { display: flex; align-items: center; gap: 12px; }
.adm-page__count { color: var(--fg-3); font-size: var(--t-12); }
</style>
