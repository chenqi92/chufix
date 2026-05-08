<script setup lang="ts">
import { ref } from 'vue';
import { CfSearchInput } from '@chufix/vue';

const q = ref('');
function handleSearch(v: string) {
  console.log('search:', v);
}
</script>

<template>
  <div class="demo-stack">
    <CfSearchInput v-model="q" placeholder="搜索文档…" @search="handleSearch" />
    <CfSearchInput v-model="q" placeholder="带快捷键提示" shortcut="Ctrl K" />
    <CfSearchInput v-model="q" size="sm" placeholder="小" />
    <CfSearchInput v-model="q" size="lg" placeholder="大" />
    <CfSearchInput modelValue="（已禁用）" disabled />
  </div>
</template>
