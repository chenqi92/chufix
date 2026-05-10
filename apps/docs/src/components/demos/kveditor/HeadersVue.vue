<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfKVEditor, type KVRow } from '@chufix-design/vue';

const headers = ref<KVRow[]>([
  { key: 'Authorization', value: 'Bearer xxx', enabled: true, description: '鉴权头，每次请求带上' },
  { key: 'Accept', value: 'application/json', enabled: true, description: '声明返回 JSON' },
  { key: 'X-Trace-Id', value: 'auto', enabled: false, description: '调试用，关掉就由网关生成' },
]);
const enabledCount = computed(() => headers.value.filter((r) => r.enabled !== false && r.key.trim()).length);
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px;">
    <CfKVEditor
      v-model="headers"
      key-placeholder="Header"
      value-placeholder="Value"
      show-toggle
      show-description
    />
    <span style="font-size: 12px; color: var(--fg-3);">
      已启用：<code>{{ enabledCount }}</code>
    </span>
  </div>
</template>
