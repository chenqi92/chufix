<script setup lang="ts">
import { ref } from 'vue';
import { CfSplitter } from '@chufix/vue';

const size = ref(50);
</script>

<template>
  <div style="height: 280px; border: 1px solid var(--line-1); border-radius: 8px; overflow: hidden;">
    <CfSplitter
      v-model="size"
      orientation="vertical"
      :min="20"
      :max="80"
    >
      <template #start>
        <div style="padding: 12px; height: 100%; background: var(--bg-1);">
          <strong>编辑器</strong>
          <pre style="margin: 8px 0 0; font-size: 12px; color: var(--fg-2);">function hello() {{ '{' }}
  return 'hi';
{{ '}' }}</pre>
        </div>
      </template>
      <template #end>
        <div style="padding: 12px; height: 100%; background: var(--bg-2);">
          <strong>控制台</strong>
          <div style="margin-top: 8px; font-family: var(--font-mono); font-size: 12px;">
            &gt; hi
          </div>
        </div>
      </template>
    </CfSplitter>
  </div>
</template>
