<script setup lang="ts">
import { CfAlert } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack">
    <CfAlert tone="success" variant="soft">soft —— 浅色背景，默认样式。</CfAlert>
    <CfAlert tone="success" variant="outline">outline —— 透明背景 + 同色边框。</CfAlert>
    <CfAlert tone="success" variant="solid">solid —— 满色背景，文字反白。</CfAlert>
  </div>
</template>
