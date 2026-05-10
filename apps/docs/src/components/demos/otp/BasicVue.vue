<script setup lang="ts">
import { ref } from 'vue';
import { CfOtpInput } from '@chufix-design/vue';

const code = ref('');
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <CfOtpInput v-model="code" :length="6" />
    <p style="margin: 0; font-size: 12px; color: var(--fg-3);">
      当前值：<code>{{ code || '(空)' }}</code>
    </p>
  </div>
</template>
