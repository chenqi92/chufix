<script setup lang="ts">
import { CfPageHeader, CfButton } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <CfPageHeader title="size = sm" description="紧凑头部，适合详情子页或弹窗内" size="sm">
      <template #actions><CfButton size="sm">操作</CfButton></template>
    </CfPageHeader>
    <CfPageHeader title="size = md" description="默认尺寸" size="md">
      <template #actions><CfButton size="sm">操作</CfButton></template>
    </CfPageHeader>
    <CfPageHeader title="size = lg" description="落地页或主页强调" size="lg">
      <template #actions><CfButton size="sm">操作</CfButton></template>
    </CfPageHeader>
  </div>
</template>
