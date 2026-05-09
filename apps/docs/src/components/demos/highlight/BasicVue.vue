<script setup lang="ts">
import { ref } from 'vue';
import { CfHighlight, CfInput } from '@chufix/vue';

const text =
  'ChuFix UI 是一个 Vue 3 与 React 双框架同源的基础组件库；CSS 变量主题、cf-* 类名前缀，纯 HTML/JS 项目也能直接用。';
const q = ref('CSS');
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <CfInput v-model="q" placeholder="输入关键字试试" style="max-width: 280px;" />
    <p style="margin: 0; line-height: 1.6;">
      <CfHighlight :text="text" :match="q" />
    </p>
  </div>
</template>
