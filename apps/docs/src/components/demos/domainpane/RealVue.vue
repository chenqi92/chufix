<script setup lang="ts">
import { CfDomainPane, CfTreeView, CfMethodBadge, CfStatusCodeBadge, CfKVEditor, CfDescriptionList } from '@chufix-design/vue';
import { ref } from 'vue';
const collection = [
  { id: 'auth', label: 'auth/', children: [
    { id: 'login', label: 'POST /login' },
    { id: 'logout', label: 'POST /logout' },
  ]},
  { id: 'orders', label: 'orders/', children: [
    { id: 'list', label: 'GET /orders' },
    { id: 'create', label: 'POST /orders' },
  ]},
];
const headers = ref([
  { key: 'Authorization', value: 'Bearer {{token}}', enabled: true },
  { key: 'Accept', value: 'application/json', enabled: true },
  { key: 'X-Trace-Id', value: '{{trace_id}}', enabled: false },
]);
const respMeta = [
  { label: 'Status', value: '200 OK' },
  { label: 'Time', value: '288ms' },
  { label: 'Size', value: '4.2 KB' },
];
</script>

<template>
  <div style="height: 360px;">
    <CfDomainPane>
      <template #panel-collection>
        <CfTreeView :nodes="collection" />
      </template>
      <template #panel-request>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <CfMethodBadge kind="post" />
            <span style="font-family: var(--font-mono);">/v1/orders</span>
          </div>
          <div>
            <div style="font-size: 11px; color: var(--fg-3); margin-bottom: 4px;">Headers</div>
            <CfKVEditor v-model="headers" />
          </div>
        </div>
      </template>
      <template #panel-response>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <CfStatusCodeBadge :code="201" reason="Created" />
          <CfDescriptionList :items="respMeta" />
          <pre style="margin: 0; padding: 8px; font-family: var(--font-mono); font-size: 11px; background: var(--bg-2); border-radius: var(--r-3);">{
  "id": "ord_1842",
  "amount": 12340
}</pre>
        </div>
      </template>
      <template #panel-mock>
        <p style="color: var(--fg-2); font-size: 13px;">Mock 规则配置（基于 CfCard + CfSwitch）。</p>
      </template>
      <template #panel-workflow>
        <p style="color: var(--fg-2); font-size: 13px;">自动化工作流节点（基于 CfKanban）。</p>
      </template>
    </CfDomainPane>
  </div>
</template>
