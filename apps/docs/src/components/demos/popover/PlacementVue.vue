<script setup lang="ts">
import { CfButton, CfPopover } from '@chufix/vue';
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 320px;">
    <CfPopover placement="top">
      <CfButton variant="secondary">top</CfButton>
      <template #content>位于触发器上方</template>
    </CfPopover>
    <CfPopover placement="bottom">
      <CfButton variant="secondary">bottom</CfButton>
      <template #content>位于触发器下方</template>
    </CfPopover>
    <CfPopover placement="left">
      <CfButton variant="secondary">left</CfButton>
      <template #content>位于触发器左侧</template>
    </CfPopover>
    <CfPopover placement="right">
      <CfButton variant="secondary">right</CfButton>
      <template #content>位于触发器右侧</template>
    </CfPopover>
  </div>
</template>
