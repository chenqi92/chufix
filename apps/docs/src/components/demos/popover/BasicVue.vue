<script setup lang="ts">
import { CfButton, CfPopover, CfInput } from '@chufix/vue';
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
    <CfPopover placement="bottom">
      <CfButton variant="secondary">点击展开</CfButton>
      <template #content>
        <div style="display: flex; flex-direction: column; gap: 8px; min-width: 200px;">
          <strong>快速操作</strong>
          <CfInput placeholder="搜索…" size="sm" />
          <CfButton size="sm">应用</CfButton>
        </div>
      </template>
    </CfPopover>

    <CfPopover trigger="hover" placement="top">
      <CfButton variant="tertiary">悬停展开</CfButton>
      <template #content>
        <div>悬停 Popover 支持任意富文本。</div>
      </template>
    </CfPopover>
  </div>
</template>
