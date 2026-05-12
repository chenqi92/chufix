<script setup lang="ts">
import { CfButton, CfIcon } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row">
    <CfButton variant="ghost" size="sm">
      查看详情
      <template #trailing><CfIcon name="arrow-right" /></template>
    </CfButton>
    <CfButton variant="ghost" size="sm">
      <template #leading><CfIcon name="globe" /></template>
      访问官网
    </CfButton>
    <CfButton variant="ghost" size="sm">了解更多 →</CfButton>
  </div>
</template>
