<script setup lang="ts">
import { CfNetworkPane } from '@chufix/vue';
</script>

<template>
  <div style="height: 280px;">
    <CfNetworkPane>
      <template #panel-har><p style="color: var(--fg-2);">HAR 请求瀑布图（基于 CfTimingBar + CfChartCrosshair）。</p></template>
      <template #panel-hex><p style="color: var(--fg-2);">16 进制 + ASCII 双栏视图。</p></template>
      <template #panel-pcap><p style="color: var(--fg-2);">抓包行项列表。</p></template>
      <template #panel-cert><p style="color: var(--fg-2);">X.509 证书字段树。</p></template>
      <template #panel-cookie><p style="color: var(--fg-2);">域级 cookie 管理。</p></template>
    </CfNetworkPane>
  </div>
</template>
