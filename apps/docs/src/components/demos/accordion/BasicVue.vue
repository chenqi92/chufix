<script setup lang="ts">
import { CfAccordion } from '@chufix/vue';

const items = [
  {
    value: 'q1',
    title: '础件能不能跟其他组件库共存？',
    content: '可以。所有组件名带 Cf 前缀（CfButton / CfInput…），CSS 类名带 cf- 前缀，跟 Element / Ant / Naive 不会冲突。',
  },
  {
    value: 'q2',
    title: '需要 Vue 或 React 吗？',
    content: '不需要。所有视觉走 CSS 类，纯 HTML + <link> 也能拿到 90% 的视觉。Modal / Tooltip / Toast 等带交互的需要少量 JS。',
  },
  {
    value: 'q3',
    title: '主题如何切换？',
    content: '改 <html data-theme=""> 即可，三套主题：dark-cool（默认）/ dark-warm / light。',
  },
];
</script>

<template>
  <div style="width: 100%; max-width: 36rem;">
    <CfAccordion :items="items" mode="single" variant="bordered" />
  </div>
</template>
