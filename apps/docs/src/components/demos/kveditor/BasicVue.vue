<script setup lang="ts">
import { ref } from 'vue';
import { CfKVEditor, type KVRow } from '@chufix/vue';

const headers = ref<KVRow[]>([
  { key: 'Authorization', value: 'Bearer xxx', enabled: true },
  { key: 'Accept', value: 'application/json', enabled: true },
]);
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px;">
    <CfKVEditor
      v-model="headers"
      key-placeholder="Header"
      value-placeholder="Value"
      show-toggle
    />
    <pre style="font-size: 12px; color: var(--fg-3); margin: 0;">{{ JSON.stringify(headers, null, 2) }}</pre>
  </div>
</template>
