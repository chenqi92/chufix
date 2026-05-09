<script setup lang="ts">
import { CfEmpty, CfButton } from '@chufix/vue';
</script>

<template>
  <div style="width: 100%; max-width: 32rem;">
    <CfEmpty
      title="还没有项目"
      description="创建你的第一个项目来开始使用础件。"
    >
      <template #action>
        <CfButton variant="primary" size="sm">+ 新建项目</CfButton>
      </template>
    </CfEmpty>
  </div>
</template>
