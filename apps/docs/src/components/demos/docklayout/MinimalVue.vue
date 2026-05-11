<script setup lang="ts">
import { CfDockLayout } from '@chufix-design/vue';
import type { DockGroup } from '@chufix-design/vue';
const layout: DockGroup = {
  id: 'root',
  orientation: 'vertical',
  panels: [
    { id: 'preview', title: '预览', closable: false },
    { id: 'console', title: 'Console', closable: false },
  ],
};
</script>

<template>
  <div style="height: 240px; border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
    <CfDockLayout :layout="layout">
      <template #panel-preview>
        <div style="padding: 16px; color: var(--fg-2);">预览区（这是一个仅 tab 切换的简化布局）</div>
      </template>
      <template #panel-console>
        <pre style="margin: 0; padding: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--fg-2);">$ ready
[14:32] /v1/orders → 200 OK · 288ms</pre>
      </template>
    </CfDockLayout>
  </div>
</template>
