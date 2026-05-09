<script setup lang="ts">
import { CfDockLayout } from '@chufix/vue';
import type { DockGroup } from '@chufix/vue';

const layout: DockGroup = {
  id: 'root',
  orientation: 'horizontal',
  children: [
    {
      id: 'left',
      orientation: 'vertical',
      panels: [
        { id: 'tree', title: 'Explorer', closable: false },
      ],
      size: '240px',
    },
    {
      id: 'main',
      orientation: 'vertical',
      children: [
        {
          id: 'editor',
          orientation: 'horizontal',
          panels: [
            { id: 'orders', title: 'orders.ts', closable: true, detachable: true },
            { id: 'login', title: 'login.ts', closable: true, detachable: true },
          ],
        },
        {
          id: 'bottom',
          orientation: 'horizontal',
          panels: [
            { id: 'terminal', title: 'Terminal', closable: false },
            { id: 'output', title: 'Output', closable: false },
          ],
          size: '160px',
        },
      ],
    },
  ],
};
</script>

<template>
  <div style="height: 360px; border: 1px solid var(--line-1); border-radius: var(--r-6); overflow: hidden;">
    <CfDockLayout :layout="layout">
      <template #panel-tree>
        <ul style="padding: 12px 16px; margin: 0; list-style: none; font-size: 12px; color: var(--fg-2);">
          <li>📁 src</li>
          <li style="padding-left: 14px;">📄 orders.ts</li>
          <li style="padding-left: 14px;">📄 login.ts</li>
        </ul>
      </template>
      <template #panel-orders>
        <pre style="margin: 0; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--fg-1);">// orders.ts
export const fetchOrders = () =&gt; …</pre>
      </template>
      <template #panel-login>
        <pre style="margin: 0; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--fg-1);">// login.ts
export const login = () =&gt; …</pre>
      </template>
      <template #panel-terminal>
        <pre style="margin: 0; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--fg-1);">$ pnpm dev
[vite] dev server running on :5173</pre>
      </template>
      <template #panel-output>
        <pre style="margin: 0; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--fg-2);">[14:32:01] Build succeeded</pre>
      </template>
    </CfDockLayout>
  </div>
</template>
