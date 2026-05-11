<script setup lang="ts">
import { CfPluginPane } from '@chufix-design/vue';
</script>

<template>
  <div style="height: 280px;">
    <CfPluginPane>
      <template #panel-card><p style="color: var(--fg-2);">PluginCard 列表 / 网格视图。</p></template>
      <template #panel-manifest><pre style="font-family: var(--font-mono); font-size: 11px;">{
  "name": "@chufix-design/plugin-foo",
  "version": "1.0.0",
  "permissions": ["read:requests"]
}</pre></template>
      <template #panel-permission><p style="color: var(--fg-2);">权限申请对话框（CfConfirmDialog 派生）。</p></template>
      <template #panel-marketplace><p style="color: var(--fg-2);">插件市场搜索 + 列表 + 详情。</p></template>
    </CfPluginPane>
  </div>
</template>
