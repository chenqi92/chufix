<script setup lang="ts">
import { CfButton, CfIcon } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row demo-row--gap-sm">
    <CfButton variant="secondary" size="sm">
      <template #leading><CfIcon name="edit" /></template>
      编辑
    </CfButton>
    <CfButton variant="secondary" size="sm">
      <template #leading><CfIcon name="copy" /></template>
      复制
    </CfButton>
    <CfButton variant="danger" size="sm">
      <template #leading><CfIcon name="trash" /></template>
      删除
    </CfButton>
  </div>
</template>

<style scoped>
.demo-row--gap-sm { gap: 6px; }
</style>
