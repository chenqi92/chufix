<script setup lang="ts">
import { ref } from 'vue';
import { CfTearOffTabs, CfDetachedPanel } from '@chufix/vue';
const tabs = ref([
  { id: 'orders', title: 'orders.ts', closable: true, modified: true },
  { id: 'login', title: 'login.ts', closable: true },
]);
const active = ref('orders');
const detachedId = ref<string | null>(null);
const detachedX = ref(0);
const detachedY = ref(0);
function tearOff(id: string, _: any, x: number, y: number) {
  detachedId.value = id;
  detachedX.value = Math.max(40, x - 100);
  detachedY.value = Math.max(40, y - 20);
  tabs.value = tabs.value.filter((t) => t.id !== id);
}
function reattach() {
  if (detachedId.value) {
    tabs.value = [
      ...tabs.value,
      { id: detachedId.value, title: `${detachedId.value}.ts`, closable: true },
    ];
    detachedId.value = null;
  }
}
</script>

<template>
  <div style="height: 200px; border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
    <CfTearOffTabs
      :tabs="tabs"
      :model-value="active"
      @update:model-value="(v) => active = v"
      @tear-off="tearOff"
      @close="(id) => tabs = tabs.filter((t) => t.id !== id)"
    >
      <template #content-orders>
        <pre style="margin: 0; padding: 12px; font-family: var(--font-mono); font-size: 12px;">// orders.ts
拖动这个 tab 向下可触发 tear-off →</pre>
      </template>
      <template #content-login>
        <pre style="margin: 0; padding: 12px; font-family: var(--font-mono); font-size: 12px;">// login.ts</pre>
      </template>
    </CfTearOffTabs>
  </div>
  <CfDetachedPanel
    :open="detachedId !== null"
    :x="detachedX"
    :y="detachedY"
    :title="`${detachedId ?? ''}.ts`"
    :width="280"
    :height="160"
    @update:open="(v) => { if (!v) reattach(); }"
  >
    <pre style="margin: 0; padding: 0; font-family: var(--font-mono); font-size: 12px;">// 已被分离的 {{ detachedId }}
关闭面板会重新挂回 tab 栏。</pre>
  </CfDetachedPanel>
</template>
