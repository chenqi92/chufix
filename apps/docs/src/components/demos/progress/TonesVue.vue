<script setup lang="ts">
import { CfProgress } from '@chufix/vue';
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 28rem;">
    <CfProgress :value="60" tone="primary" show-label />
    <CfProgress :value="60" tone="success" show-label />
    <CfProgress :value="60" tone="warning" show-label />
    <CfProgress :value="60" tone="danger" show-label />
    <CfProgress :value="60" tone="info" show-label />
  </div>
</template>
