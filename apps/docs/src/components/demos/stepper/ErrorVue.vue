<script setup lang="ts">
import { CfStepper, type StepItem } from '@chufix-design/vue';

const items: StepItem[] = [
  { title: '上传文件', description: '已完成', status: 'done' },
  { title: '解析', description: '识别失败 —— 文件格式错误', status: 'error' },
  { title: '导入', description: '等待中' },
];
</script>

<template>
  <CfStepper :items="items" />
  <p class="adm-hint">
    某一步出错时设 <code>status: 'error'</code>，节点显示 × 图标且强调红色，
    后续步骤保持 pending（不会自动推进）。
  </p>
</template>

<style scoped>
.adm-hint { color: var(--fg-3); font-size: var(--t-12); margin-top: 12px; line-height: 1.6; }
code { font-family: var(--font-mono); color: var(--fg-2); }
</style>
