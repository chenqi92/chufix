<script setup lang="ts">
import { CfResult, CfButton } from '@chufix-design/vue';
</script>

<template>
  <CfResult status="success" title="提交成功" description="申请已发送给管理员，预计 1 个工作日内处理。">
    <template #extra>
      <CfButton variant="primary">返回首页</CfButton>
      <CfButton variant="tertiary">再交一份</CfButton>
    </template>
  </CfResult>
</template>
