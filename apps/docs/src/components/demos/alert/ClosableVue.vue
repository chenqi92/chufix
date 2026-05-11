<script setup lang="ts">
import { CfAlert } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <CfAlert tone="warning" title="可关闭" closable>右侧出现 × 按钮，点击后整个 alert 从 DOM 中移除。</CfAlert>
    <CfAlert tone="info" closable>仅正文 + 关闭按钮，没有 title。</CfAlert>
  </div>
</template>
