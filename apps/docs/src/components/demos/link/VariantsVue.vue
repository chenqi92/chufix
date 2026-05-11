<script setup lang="ts">
import { CfLink } from '@chufix-design/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px; align-items: flex-start;">
    <CfLink href="#" variant="default">default · 主色，hover 下划线</CfLink>
    <CfLink href="#" variant="subtle">subtle · 跟随父级颜色，hover 显示下划线</CfLink>
    <CfLink href="#" variant="underline">underline · 永久带下划线</CfLink>
    <div style="background: var(--accent-1); color: var(--fg-on-accent); padding: 6px 10px; border-radius: 6px;">
      <CfLink href="#" variant="inverse">inverse · 反色面板内使用</CfLink>
    </div>
  </div>
</template>
