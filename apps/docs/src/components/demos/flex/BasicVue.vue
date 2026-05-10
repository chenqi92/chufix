<script setup lang="ts">
import { CfBadge, CfButton, CfFlex, CfTag } from '@chufix-design/vue';
</script>

<template>
  <CfFlex direction="column" gap="lg" style="width: 100%; max-width: 720px;">
    <CfFlex align="center" justify="between" wrap gap="md">
      <CfFlex align="center" wrap gap="sm">
        <CfTag tone="info">Production</CfTag>
        <CfTag tone="success">Healthy</CfTag>
        <CfBadge tone="warning">3 alerts</CfBadge>
      </CfFlex>
      <CfFlex align="center" gap="sm">
        <CfButton variant="ghost">忽略</CfButton>
        <CfButton variant="primary">处理</CfButton>
      </CfFlex>
    </CfFlex>

    <CfFlex wrap gap="md">
      <div class="demo-tile">CPU 42%</div>
      <div class="demo-tile">Memory 68%</div>
      <div class="demo-tile">Queue 12</div>
    </CfFlex>
  </CfFlex>
</template>

<style scoped>
.demo-tile {
  min-width: 150px;
  flex: 1 1 0;
  border: 1px solid var(--line-1);
  border-radius: 8px;
  padding: 16px;
  background: var(--surface-1);
  color: var(--fg-1);
}
</style>
