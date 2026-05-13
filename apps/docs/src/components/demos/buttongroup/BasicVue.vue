<script setup lang="ts">
import { CfButtonGroup, CfButton } from '@chufix-design/vue';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <CfButtonGroup aria-label="对齐方式">
      <CfButton variant="tertiary">左</CfButton>
      <CfButton variant="tertiary">中</CfButton>
      <CfButton variant="tertiary">右</CfButton>
    </CfButtonGroup>

    <CfButtonGroup variant="separated" aria-label="操作组">
      <CfButton variant="secondary">复制</CfButton>
      <CfButton variant="secondary">剪切</CfButton>
      <CfButton variant="secondary">粘贴</CfButton>
    </CfButtonGroup>

    <CfButtonGroup orientation="vertical" aria-label="纵向">
      <CfButton variant="tertiary">上移</CfButton>
      <CfButton variant="tertiary">下移</CfButton>
      <CfButton variant="tertiary">删除</CfButton>
    </CfButtonGroup>
  </div>
</template>
