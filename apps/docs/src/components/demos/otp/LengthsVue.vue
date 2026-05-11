<script setup lang="ts">
import { ref } from 'vue';
import { CfOtpInput } from '@chufix-design/vue';

const a = ref('');
const b = ref('');
const c = ref('');
</script>

<template>
  <div class="demo-stack">
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">length = 4 (PIN)</div>
      <CfOtpInput v-model="a" :length="4" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">length = 6（默认 OTP）</div>
      <CfOtpInput v-model="b" :length="6" />
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">length = 8（更长验证码）</div>
      <CfOtpInput v-model="c" :length="8" />
    </div>
  </div>
</template>
