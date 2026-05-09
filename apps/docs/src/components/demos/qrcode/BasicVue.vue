<script setup lang="ts">
import { ref } from 'vue';
import { CfQRCode, CfInput } from '@chufix/vue';

const value = ref('https://chufix.com');
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <CfQRCode :value="value" :size="160" ecc="M" />
    <div style="flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 8px;">
      <CfInput v-model="value" placeholder="输入要编码的文本或 URL" />
      <span style="font-size: 12px; color: var(--fg-3);">QR 矩阵在客户端实时计算（Byte 模式，自动选版本）。</span>
    </div>
  </div>
</template>
