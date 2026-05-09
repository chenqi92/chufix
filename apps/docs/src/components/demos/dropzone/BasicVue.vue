<script setup lang="ts">
import { ref } from 'vue';
import { CfDropzone } from '@chufix/vue';

const files = ref<File[]>([]);
</script>

<template>
  <CfDropzone
    v-model="files"
    hint="支持拖入或点击选择，多文件均可"
  />
</template>
