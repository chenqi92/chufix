<script setup lang="ts">
import { CfNetworkPane, CfTimingBar, CfStatusCodeBadge, CfDescriptionList } from '@chufix-design/vue';
const r1 = [
  { label: 'DNS', start: 0, end: 8, colorIndex: 6 },
  { label: 'TLS', start: 8, end: 92, colorIndex: 2 },
  { label: 'Wait', start: 92, end: 245, colorIndex: 1 },
  { label: 'Receive', start: 245, end: 312, colorIndex: 3 },
];
const certInfo = [
  { label: 'Common Name', value: 'api.protoforge.io' },
  { label: 'Issuer', value: "Let's Encrypt R3" },
  { label: 'Valid From', value: '2026-04-12' },
  { label: 'Valid To', value: '2026-07-11' },
  { label: 'SHA-256', value: '6a:bf:34:8d:21:99…' },
];
</script>

<template>
  <div style="height: 320px;">
    <CfNetworkPane>
      <template #panel-har>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <CfStatusCodeBadge :code="200" reason="OK" />
            <span style="font-family: var(--font-mono); font-size: 12px;">/v1/orders · 312ms</span>
          </div>
          <CfTimingBar :phases="r1" />
        </div>
      </template>
      <template #panel-hex>
        <pre style="margin: 0; padding: 8px; font-family: var(--font-mono); font-size: 11px; line-height: 16px; color: var(--fg-1); background: var(--bg-2); border-radius: var(--r-3);">00000000  47 45 54 20 2f 76 31 2f  6f 72 64 65 72 73 20 48  GET /v1/orders H
00000010  54 54 50 2f 31 2e 31 0d  0a 48 6f 73 74 3a 20 61  TTP/1.1..Host: a
00000020  70 69 2e 70 72 6f 74 6f  66 6f 72 67 65 2e 69 6f  pi.protoforge.io</pre>
      </template>
      <template #panel-pcap>
        <p style="color: var(--fg-2); font-size: 13px;">Wireshark 风格的抓包行，由 PCAPRow 子组件渲染（待实现）。</p>
      </template>
      <template #panel-cert>
        <CfDescriptionList :items="certInfo" />
      </template>
      <template #panel-cookie>
        <p style="color: var(--fg-2); font-size: 13px;">域级 cookie 管理（基于 CfDataGrid）。</p>
      </template>
    </CfNetworkPane>
  </div>
</template>
