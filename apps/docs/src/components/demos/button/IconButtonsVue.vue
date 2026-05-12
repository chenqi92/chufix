<script setup lang="ts">
import { CfButton, CfIcon } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <CfButton variant="primary">
        <template #leading><CfIcon name="plus" /></template>
        新建
      </CfButton>
      <CfButton variant="secondary">
        下一步
        <template #trailing><CfIcon name="arrow-right" /></template>
      </CfButton>
      <CfButton variant="tertiary">
        <template #leading><CfIcon name="download" /></template>
        导出
        <template #trailing><CfIcon name="chevron-down" /></template>
      </CfButton>
    </div>
  </div>
</template>
