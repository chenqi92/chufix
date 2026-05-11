<script setup lang="ts">
import { CfPageHeader, CfButton } from '@chufix-design/vue';
</script>

<template>
  <CfPageHeader
    title="无底边的页头"
    description="bordered=false 把底部分隔线去掉，紧贴页面背景"
    :bordered="false"
  >
    <template #actions>
      <CfButton variant="primary">保存</CfButton>
    </template>
  </CfPageHeader>
</template>
