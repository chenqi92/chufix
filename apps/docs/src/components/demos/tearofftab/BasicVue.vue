<script setup lang="ts">
import { ref } from 'vue';
import { CfTearOffTabs } from '@chufix-design/vue';
const tabs = ref([
  { id: 'orders', title: 'orders.ts', closable: true, modified: true },
  { id: 'login', title: 'login.ts', closable: true },
  { id: 'readme', title: 'README.md', closable: true },
]);
const active = ref('orders');
</script>

<template>
  <div style="height: 240px; border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
    <CfTearOffTabs
      :tabs="tabs"
      :model-value="active"
      @update:model-value="(v) => active = v"
      @tear-off="(id) => alert(`Torn off: ${id}\n（消费方在此 spawn DetachedPanel 或新窗口）`)"
      @close="(id) => tabs = tabs.filter(t => t.id !== id)"
    >
      <template #content-orders>
        <pre style="margin: 0; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px;">// orders.ts</pre>
      </template>
      <template #content-login>
        <pre style="margin: 0; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px;">// login.ts</pre>
      </template>
      <template #content-readme>
        <pre style="margin: 0; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px;"># README</pre>
      </template>
    </CfTearOffTabs>
  </div>
</template>
