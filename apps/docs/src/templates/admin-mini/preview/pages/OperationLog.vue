<script setup lang="ts">
import { computed, h, inject, ref } from 'vue';
import { CfTable, CfTag, CfSearchInput } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialOpLogs, type OperationLog } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const search = ref('');
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return initialOpLogs;
  return initialOpLogs.filter((r) =>
    [r.user, r.action, r.resource, r.ip].some((v) => v.toLowerCase().includes(q)),
  );
});

const cols = computed(() => [
  { key: 'user',     title: t.value.col_log_user,     dataIndex: 'user',     width: 110 },
  { key: 'action',   title: t.value.col_log_action,   dataIndex: 'action',   width: 100 },
  { key: 'resource', title: t.value.col_log_resource, dataIndex: 'resource' },
  { key: 'ip',       title: t.value.col_log_ip,       dataIndex: 'ip',       width: 130 },
  {
    key: 'status', title: t.value.status, dataIndex: 'status', width: 90,
    render: (v: unknown) =>
      h(CfTag,
        { size: 'sm', tone: v === 'ok' ? 'success' : 'danger', variant: 'soft' },
        () => (v === 'ok' ? t.value.status_ok : t.value.status_fail)),
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
    <CfTable :columns="cols" :rows="filtered" :row-key="(r: OperationLog) => r.id" size="sm" />
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
.adm-page__head { display: flex; align-items: center; gap: 12px; }
.adm-page__count { color: var(--fg-3); font-size: var(--t-12); }
</style>
