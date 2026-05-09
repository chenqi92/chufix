<script setup lang="ts">
import { ref } from 'vue';
import { CfStepper, CfButton, type StepItem } from '@chufix/vue';

const current = ref(1);
const items: StepItem[] = [
  { title: '填写信息', description: '账号 / 邮箱 / 密码' },
  { title: '验证邮箱', description: '收到的邮件中点击链接' },
  { title: '完成', description: '即可开始使用' },
];
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 16px;">
    <CfStepper :items="items" :current="current" />
    <div style="display:inline-flex; gap: 8px;">
      <CfButton
        size="sm"
        variant="tertiary"
        :disabled="current === 0"
        @click="current = Math.max(0, current - 1)"
      >上一步</CfButton>
      <CfButton
        size="sm"
        variant="primary"
        :disabled="current === items.length - 1"
        @click="current = Math.min(items.length - 1, current + 1)"
      >下一步</CfButton>
    </div>
  </div>
</template>
