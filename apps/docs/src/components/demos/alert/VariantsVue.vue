<script setup lang="ts">
import { Alert } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack">
    <Alert tone="success" variant="soft">soft —— 浅色背景，默认样式。</Alert>
    <Alert tone="success" variant="outline">outline —— 透明背景 + 同色边框。</Alert>
    <Alert tone="success" variant="solid">solid —— 满色背景，文字反白。</Alert>
  </div>
</template>
