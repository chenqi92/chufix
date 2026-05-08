<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from '@chufix/vue';

const draft = ref('试着多敲几行回车，框会自动撑高，没有滚动条。\n这是第二行。');
</script>

<template>
  <Textarea
    v-model="draft"
    variant="filled"
    auto-resize
    placeholder="自动撑高的多行输入"
  />
</template>
