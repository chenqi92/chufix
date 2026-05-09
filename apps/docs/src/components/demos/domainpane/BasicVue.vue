<script setup lang="ts">
import { CfDomainPane } from '@chufix/vue';
</script>

<template>
  <div style="height: 280px;">
    <CfDomainPane>
      <template #panel-collection><p style="color: var(--fg-2);">REST 集合树（基于 CfTreeView）。</p></template>
      <template #panel-request><p style="color: var(--fg-2);">请求构造器：URL + Headers + Body + Auth。</p></template>
      <template #panel-response><p style="color: var(--fg-2);">响应检查器：Status + Headers + Body + Timing。</p></template>
      <template #panel-mock><p style="color: var(--fg-2);">Mock 规则配置卡。</p></template>
      <template #panel-workflow><p style="color: var(--fg-2);">自动化工作流节点。</p></template>
    </CfDomainPane>
  </div>
</template>
