<script setup lang="ts">
import { ref } from 'vue';
import { CfTransfer, type TransferItem } from '@chufix/vue';

const data: TransferItem[] = [
  { key: 'auth', label: '权限管理' },
  { key: 'audit', label: '审计日志' },
  { key: 'billing', label: '计费' },
  { key: 'monitor', label: '监控告警' },
  { key: 'storage', label: '存储' },
  { key: 'cdn', label: 'CDN', disabled: true },
  { key: 'dns', label: 'DNS 解析' },
];

const target = ref<string[]>(['monitor', 'billing']);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <CfTransfer :data-source="data" v-model="target" searchable />
    <span style="font-size: 12px; color: var(--fg-3);">已选 keys：<code>{{ target.join(', ') || '(空)' }}</code></span>
  </div>
</template>
