<script setup lang="ts">
import { ref } from 'vue';
import { CfReorderTable, type ReorderColumn } from '@chufix-design/vue';

interface ServiceRow {
  id: string;
  name: string;
  region: string;
  p99: string;
  status: 'healthy' | 'degraded' | 'down';
}

const rows = ref<ServiceRow[]>([
  { id: 'auth', name: 'auth-service', region: 'us-east-1', p99: '38 ms', status: 'healthy' },
  { id: 'order', name: 'order-service', region: 'us-east-1', p99: '92 ms', status: 'degraded' },
  { id: 'pay', name: 'pay-service', region: 'eu-west-1', p99: '120 ms', status: 'degraded' },
  { id: 'mail', name: 'mail-service', region: 'us-west-2', p99: '210 ms', status: 'down' },
  { id: 'cdn', name: 'cdn-edge', region: 'global', p99: '14 ms', status: 'healthy' },
]);

const columns: ReorderColumn<ServiceRow>[] = [
  { key: 'name', label: '服务' },
  { key: 'region', label: '区域', width: '120px' },
  { key: 'p99', label: 'P99', width: '90px', align: 'end' },
  { key: 'status', label: '状态', width: '110px' },
];
</script>

<template>
  <CfReorderTable v-model:rows="rows" :columns="columns" row-key="id" striped>
    <template #cell-status="{ value }">
      <span class="status-pill" :data-tone="value">{{ value }}</span>
    </template>
  </CfReorderTable>
</template>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  font-size: var(--t-12);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.status-pill[data-tone='healthy'] {
  background: var(--status-success-soft);
  color: var(--status-success);
}
.status-pill[data-tone='degraded'] {
  background: var(--status-warning-soft);
  color: var(--status-warning);
}
.status-pill[data-tone='down'] {
  background: var(--status-error-soft);
  color: var(--status-error);
}
</style>
