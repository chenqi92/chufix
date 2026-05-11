<script setup lang="ts">
import { CfButton, CfPopover } from '@chufix-design/vue';
</script>

<template>
  <div style="display: flex; gap: 12px;">
    <CfPopover placement="bottom">
      <CfButton variant="secondary">自适应宽度</CfButton>
      <template #content>仅按内容自然撑开</template>
    </CfPopover>
    <CfPopover placement="bottom" :width="320">
      <CfButton variant="secondary">固定宽度 320</CfButton>
      <template #content>
        <p style="margin: 0;">这条 popover 强制 320px 宽，便于复杂布局。</p>
      </template>
    </CfPopover>
  </div>
</template>
