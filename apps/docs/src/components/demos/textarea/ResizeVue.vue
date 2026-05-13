<script setup lang="ts">
import { ref } from 'vue';
import { CfTextarea } from '@chufix-design/vue';

const a = ref<string>('');
const b = ref<string>('');
const c = ref<string>('');
const d = ref<string>('');
</script>

<template>
  <div class="demo-stack">
    <CfTextarea v-model="a" resize="none"       placeholder="resize = none —— 完全锁定，无拖拽把手"       :rows="2" />
    <CfTextarea v-model="b" resize="vertical"   placeholder="resize = vertical —— 仅纵向可拖（默认）"      :rows="2" />
    <CfTextarea v-model="c" resize="horizontal" placeholder="resize = horizontal —— 仅横向可拖"           :rows="2" />
    <CfTextarea v-model="d" resize="both"       placeholder="resize = both —— 横纵都可拖"                 :rows="2" />
  </div>
</template>
