<script setup lang="ts">
import { ref } from 'vue';
import { CfKVEditor, type KVRow } from '@chufix-design/vue';

const env = ref<KVRow[]>([
  { key: 'NODE_ENV', value: 'production', enabled: true },
  { key: 'API_BASE', value: 'https://api.example.com', enabled: true },
  { key: 'CACHE_TTL', value: '3600', enabled: true },
]);
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 16px;">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">readonly</div>
      <CfKVEditor :model-value="env" readonly />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">disabled</div>
      <CfKVEditor :model-value="env" disabled />
    </div>
  </div>
</template>
