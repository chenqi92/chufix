<script setup lang="ts">
import { ref } from 'vue';
import { CfPageHeader, CfButton, CfTabs, CfTag } from '@chufix-design/vue';

const tab = ref('overview');
</script>

<template>
  <div style="border: 1px solid var(--line-1); border-radius: 8px; overflow: hidden;">
    <CfPageHeader>
      <template #title>
        <span style="display:inline-flex; gap: 8px; align-items: center;">
          chufix
          <CfTag tone="primary" variant="solid" size="sm">v0.0.1</CfTag>
        </span>
      </template>
      <template #description>
        Vue 3 + React 双框架同源的基础组件库
      </template>
      <template #actions>
        <CfButton variant="tertiary" size="sm">分享</CfButton>
        <CfButton variant="primary" size="sm">部署</CfButton>
      </template>
      <template #tabs>
        <CfTabs
          v-model="tab"
          variant="line"
          :items="[
            { value: 'overview', label: '概览' },
            { value: 'members', label: '成员' },
            { value: 'settings', label: '设置' },
            { value: 'logs', label: '日志' },
          ]"
        />
      </template>
    </CfPageHeader>
  </div>
</template>
