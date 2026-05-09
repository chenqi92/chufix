<script setup lang="ts">
import { CfLink } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px; align-items: flex-start;">
    <CfLink href="#">默认链接（页面内）</CfLink>
    <CfLink href="https://github.com/chenqi92/chufix">外部链接（自动加图标 + rel）</CfLink>
    <CfLink href="#" variant="subtle">subtle 链接（虚下划线）</CfLink>
    <CfLink href="#" variant="underline">underline 永久带下划线</CfLink>
    <CfLink href="#" disabled>已禁用</CfLink>
  </div>
</template>
