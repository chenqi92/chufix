<script setup lang="ts">
import { CfPageHeader, CfButton, CfBreadcrumb } from '@chufix-design/vue';
</script>

<template>
  <div style="border: 1px solid var(--line-1); border-radius: 8px; overflow: hidden;">
    <CfPageHeader
      title="项目设置"
      description="管理项目成员、权限以及通知偏好。"
    >
      <template #breadcrumb>
        <CfBreadcrumb
          :items="[
            { label: '工作台', href: '#' },
            { label: '项目', href: '#' },
            { label: '设置' },
          ]"
        />
      </template>
      <template #actions>
        <CfButton variant="tertiary">取消</CfButton>
        <CfButton variant="primary">保存</CfButton>
      </template>
    </CfPageHeader>
  </div>
</template>
