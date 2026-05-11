<script setup lang="ts">
import { ref } from 'vue';
import { CfDetachedPanel, CfTearOffTabs } from '@chufix-design/vue';
const tabs = ref([
  { id: 'orders', title: 'orders.ts', closable: true, modified: true },
  { id: 'login', title: 'login.ts', closable: true },
  { id: 'readme', title: 'README.md', closable: true },
]);
const active = ref('orders');
const host = ref<HTMLElement | null>(null);
const detached = ref<{ id: string; title: string } | null>(null);
const detachedX = ref(0);
const detachedY = ref(0);
function tearOff(id: string, item: { id: string; title: string }, x: number, y: number) {
  const rect = host.value?.getBoundingClientRect();
  detached.value = { id, title: item.title };
  detachedX.value = rect ? Math.max(16, x - rect.left - 120) : 24;
  detachedY.value = rect ? Math.max(56, y - rect.top - 24) : 64;
  tabs.value = tabs.value.filter((t) => t.id !== id);
  active.value = tabs.value[0]?.id ?? '';
}
function reattach() {
  if (!detached.value) return;
  tabs.value = [...tabs.value, { ...detached.value, closable: true }];
  active.value = detached.value.id;
  detached.value = null;
}
</script>

<template>
  <div ref="host" class="demo-floating-host demo-floating-host--tearoff">
    <div style="height: 210px; border-bottom: 1px solid var(--line-1); overflow: hidden;">
    <CfTearOffTabs
      :tabs="tabs"
      :model-value="active"
      @update:model-value="(v) => active = v"
      @tear-off="tearOff"
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
    <p class="demo-floating-host__hint">向下拖动任意 tab 触发 tear-off，示例会在容器内生成浮动面板。</p>
    <CfDetachedPanel
      :open="detached !== null"
      :to="host ?? 'body'"
      :x="detachedX"
      :y="detachedY"
      :title="detached?.title"
      :width="280"
      :height="150"
      @update:open="(v) => { if (!v) reattach(); }"
    >
      <pre style="margin: 0; padding: 0; font-family: var(--font-mono); font-size: 12px;">// {{ detached?.id }}
这个 tab 已经脱离主栏，关闭面板即可恢复。</pre>
    </CfDetachedPanel>
  </div>
</template>
