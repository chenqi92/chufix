<script setup lang="ts">
import { CfKbd } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <span>命令面板：<CfKbd :keys="['Ctrl', 'K']" /></span>
    <span>新建：<CfKbd :keys="['⌘', 'N']" /></span>
    <span>大写：<CfKbd>Caps Lock</CfKbd></span>
    <span>组合：<CfKbd :keys="['Shift', 'Alt', 'F']" size="sm" /></span>
  </div>
</template>
