<script setup lang="ts">
import { ref } from 'vue';
import { CfInput, CfIcon } from '@chufix-design/vue';

const keyword = ref<string>('');
</script>

<template>
  <CfInput
    v-model="keyword"
    type="search"
    clearable
    placeholder="搜索文档、组件、blocks…"
  >
    <template #prefix>
      <CfIcon name="search" />
    </template>
  </CfInput>
</template>
