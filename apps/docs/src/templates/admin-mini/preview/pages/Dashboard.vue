<script setup lang="ts">
import { computed, inject } from 'vue';
import { CfStat, CfTable, CfTag } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import {
  initialUsers,
  initialRoles,
  initialOpLogs,
  initialLoginLogs,
  type OperationLog,
  type LoginLog,
} from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const kpis = computed(() => [
  { label: t.value.kpi_users,       value: initialUsers.length,  trend: { delta: '+2', direction: 'up' as const } },
  { label: t.value.kpi_roles,       value: initialRoles.length,  trend: { delta: '+1', direction: 'up' as const } },
  { label: t.value.kpi_login_today, value: 38,                   trend: { delta: '+12%', direction: 'up' as const } },
  { label: t.value.kpi_op_today,    value: 142,                  trend: { delta: '-4%',  direction: 'down' as const } },
]);

const opCols = computed(() => [
  { key: 'user',     title: t.value.col_log_user,     dataIndex: 'user',     width: 100 },
  { key: 'action',   title: t.value.col_log_action,   dataIndex: 'action',   width: 90 },
  { key: 'resource', title: t.value.col_log_resource, dataIndex: 'resource' },
  { key: 'at',       title: t.value.col_log_at,       dataIndex: 'at',       width: 180 },
]);
const loginCols = computed(() => [
  { key: 'user', title: t.value.col_log_user, dataIndex: 'user', width: 100 },
  { key: 'ip',   title: t.value.col_log_ip,   dataIndex: 'ip',   width: 130 },
  { key: 'ua',   title: t.value.col_log_ua,   dataIndex: 'ua' },
  { key: 'at',   title: t.value.col_log_at,   dataIndex: 'at',   width: 180 },
]);

const opRows = computed<OperationLog[]>(() => initialOpLogs.slice(0, 5));
const loginRows = computed<LoginLog[]>(() => initialLoginLogs.slice(0, 5));
</script>

<template>
  <div class="adm-dashboard">
    <div class="adm-dashboard__kpis">
      <CfStat
        v-for="k in kpis"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :trend="k.trend"
        variant="outlined"
      />
    </div>
    <div class="adm-dashboard__pair">
      <section class="adm-card">
        <header class="adm-card__head">
          <h3>{{ t.recent_op }}</h3>
          <CfTag size="sm" tone="info">live</CfTag>
        </header>
        <CfTable :columns="opCols" :rows="opRows" :row-key="(r: OperationLog) => r.id" size="sm" />
      </section>
      <section class="adm-card">
        <header class="adm-card__head">
          <h3>{{ t.recent_login }}</h3>
          <CfTag size="sm" tone="success">stable</CfTag>
        </header>
        <CfTable :columns="loginCols" :rows="loginRows" :row-key="(r: LoginLog) => r.id" size="sm" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.adm-dashboard { display: flex; flex-direction: column; gap: 16px; }
.adm-dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.adm-dashboard__pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 900px) {
  .adm-dashboard__pair { grid-template-columns: 1fr; }
}
.adm-card {
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  overflow: hidden;
}
.adm-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line-1);
}
.adm-card__head h3 {
  margin: 0;
  font-size: var(--t-13);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
</style>
