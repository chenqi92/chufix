<script setup lang="ts">
import { CfButton } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <CfButton size="sm">Small</CfButton>
      <CfButton size="md">Medium</CfButton>
      <CfButton size="lg">Large</CfButton>
    </div>
    <div class="demo-row">
      <CfButton shape="default">默认圆角</CfButton>
      <CfButton shape="pill">Pill</CfButton>
      <CfButton shape="square" aria-label="设置">⚙</CfButton>
    </div>
  </div>
</template>
