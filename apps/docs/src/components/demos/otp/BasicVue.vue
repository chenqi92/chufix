<script setup lang="ts">
import { ref } from 'vue';
import { CfOtpInput } from '@chufix/vue';

const code = ref('');
const filled = ref<string | null>(null);

function onComplete(v: string) {
  filled.value = v;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <CfOtpInput v-model="code" :length="6" auto-focus @complete="onComplete" />
    <p style="margin: 0; font-size: 13px; color: var(--fg-3);">
      当前值：<code>{{ code || '(空)' }}</code>
      <template v-if="filled"> · 已填满：<code>{{ filled }}</code></template>
    </p>
  </div>
</template>
