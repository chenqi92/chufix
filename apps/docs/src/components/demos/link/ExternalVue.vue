<script setup lang="ts">
import { CfLink } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px; align-items: flex-start;">
    <CfLink href="https://github.com/chenqi92/chufix">自动识别（http / https 开头）</CfLink>
    <CfLink href="/internal" external>显式标记 external 强制加图标</CfLink>
    <CfLink href="#" target="_blank">target=_blank（新窗口）</CfLink>
  </div>
</template>
