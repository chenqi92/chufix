<script setup lang="ts">
import { ref } from 'vue';
import { CfTagInput } from '@chufix-design/vue';

const tags = ref<string[]>([]);

function isEmail(t: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}
</script>

<template>
  <div style="display:flex; flex-direction:column; gap:6px;">
    <CfTagInput
      v-model="tags"
      :max="5"
      :validate="isEmail"
      :separators="['Enter', ',', ' ']"
      placeholder="最多 5 个邮箱地址"
    />
    <small style="color: var(--fg-3); font-size: 12px;">
      已添加 {{ tags.length }} / 5；非法格式不会被加入。
    </small>
  </div>
</template>
