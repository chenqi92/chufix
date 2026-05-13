<script setup lang="ts">
import { ref } from 'vue';
import { CfTextarea } from '@chufix-design/vue';

const a = ref<string>('');
const b = ref<string>('');
const c = ref<string>('');
</script>

<template>
  <div class="demo-stack">
    <CfTextarea v-model="a" variant="outline" placeholder="outline —— 默认描边" :rows="2" />
    <CfTextarea v-model="b" variant="filled"  placeholder="filled —— 浅色填充背景" :rows="2" />
    <CfTextarea v-model="c" variant="ghost"   placeholder="ghost —— 透明，只在 hover/focus 时可见" :rows="2" />
  </div>
</template>
