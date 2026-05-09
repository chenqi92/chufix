<script setup lang="ts">
import { ref } from 'vue';
import { CfKVEditor, type KVRow } from '@chufix/vue';

const params = ref<KVRow[]>([
  { key: 'page', value: '1', enabled: true },
  { key: 'pageSize', value: '20', enabled: true },
]);
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px;">
    <CfKVEditor
      v-model="params"
      key-placeholder="参数名"
      value-placeholder="参数值"
    />
    <span style="font-size: 12px; color: var(--fg-3);">
      条目数：<code>{{ params.filter((r) => r.key.trim()).length }}</code>
    </span>
  </div>
</template>
