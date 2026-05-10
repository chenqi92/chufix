<script setup lang="ts">
import { ref } from 'vue';
import { CfSearchInput } from '@chufix-design/vue';

const q = ref('');
function handleSearch(v: string) {
  console.log('search:', v);
}
</script>

<template>
  <div style="max-width: 24rem;">
    <CfSearchInput v-model="q" placeholder="搜索文档…" @search="handleSearch" />
  </div>
</template>
