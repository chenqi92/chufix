<script setup lang="ts">
import { ref } from 'vue';
import { CfTagInput } from '@chufix-design/vue';

const tags = ref<string[]>([]);
</script>

<template>
  <CfTagInput
    v-model="tags"
    :separators="['Enter', ',', ' ']"
    placeholder="回车 / 逗号 / 空格 都能分隔"
  />
</template>
