<script setup lang="ts">
import { ref } from 'vue';
import { CfTagInput } from '@chufix/vue';

const tags = ref<string[]>(['vue', 'react']);
</script>

<template>
  <CfTagInput v-model="tags" placeholder="输入后按回车添加" />
</template>
