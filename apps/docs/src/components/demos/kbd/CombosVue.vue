<script setup lang="ts">
import { CfKbd } from '@chufix-design/vue';
</script>

<template>
  <div style="display:flex; flex-direction: column; gap: 8px;">
    <span>新建文件：<CfKbd :keys="['⌘', 'N']" /></span>
    <span>关闭标签：<CfKbd :keys="['Ctrl', 'W']" /></span>
    <span>三键组合：<CfKbd :keys="['Ctrl', 'Shift', 'P']" /></span>
    <span>Vim 退出：<CfKbd :keys="['Esc', ':', 'q']" separator=" " /></span>
  </div>
</template>
