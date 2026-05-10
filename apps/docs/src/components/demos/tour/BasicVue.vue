<script setup lang="ts">
import { ref } from 'vue';
import { CfTour, CfButton, type TourStep } from '@chufix-design/vue';

const open = ref(false);

const steps: TourStep[] = [
  {
    target: '#tour-step-1',
    title: '欢迎使用',
    description: '这是引导的第一步，会高亮当前操作目标。',
    placement: 'bottom',
  },
  {
    target: '#tour-step-2',
    title: '关键功能',
    description: '点击这里可以创建一份新的资源。',
    placement: 'bottom',
  },
  {
    target: '#tour-step-3',
    title: '设置入口',
    description: '在这里配置全局偏好，随时可改。',
    placement: 'bottom',
  },
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
    <div style="display: flex; gap: 8px;">
      <CfButton id="tour-step-1" variant="secondary" size="sm">资源列表</CfButton>
      <CfButton id="tour-step-2" variant="primary" size="sm">+ 新建</CfButton>
      <CfButton id="tour-step-3" variant="ghost" size="sm">⚙ 设置</CfButton>
    </div>
    <CfButton size="sm" @click="open = true">开始引导</CfButton>
    <CfTour v-model="open" :steps="steps" />
  </div>
</template>
