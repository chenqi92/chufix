<script setup lang="ts">
import { ref } from 'vue';
import { CfOtpInput } from '@chufix-design/vue';

const a = ref('');
const b = ref('');
</script>

<template>
  <div class="demo-stack">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">type = numeric（默认）— 仅 0–9</div>
      <CfOtpInput v-model="a" :length="6" type="numeric" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">type = alphanumeric — 字母 + 数字</div>
      <CfOtpInput v-model="b" :length="6" type="alphanumeric" />
    </div>
  </div>
</template>
