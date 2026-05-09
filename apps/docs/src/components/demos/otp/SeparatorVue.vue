<script setup lang="ts">
import { ref } from 'vue';
import { CfOtpInput } from '@chufix/vue';

const code = ref('');
const completed = ref<string | null>(null);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <CfOtpInput
      v-model="code"
      :length="6"
      :separator-at="3"
      auto-focus
      @complete="(v) => completed = v"
    />
    <p style="margin: 0; font-size: 12px; color: var(--fg-3);">
      当前值：<code>{{ code || '(空)' }}</code>
      <template v-if="completed"> · onComplete 已触发：<code>{{ completed }}</code></template>
    </p>
  </div>
</template>
