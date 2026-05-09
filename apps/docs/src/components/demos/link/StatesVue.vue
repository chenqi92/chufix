<script setup lang="ts">
import { CfLink } from '@chufix/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px; align-items: flex-start;">
    <CfLink href="#" size="sm">小号</CfLink>
    <CfLink href="#" size="md">默认</CfLink>
    <CfLink href="#" size="lg">大号</CfLink>
    <CfLink href="#" disabled>已禁用 — 阻止点击</CfLink>
  </div>
</template>
