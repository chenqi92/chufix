<script setup lang="ts">
import { CfAccordion } from '@chufix/vue';

const items = [
  { value: 'q1', title: '什么是 ChuFix？', content: '一个双框架同源的基础组件库。' },
  { value: 'q2', title: '怎么安装？', content: 'pnpm i @chufix/vue 或 @chufix/react' },
  { value: 'q3', title: '设置主题？', content: '改 [data-theme] 三档主题切换。' },
];
</script>

<template>
  <div style="width: 100%; max-width: 36rem;">
    <CfAccordion
      :items="items"
      mode="multiple"
      variant="separated"
      :default-open="['q1', 'q3']"
    />
  </div>
</template>
