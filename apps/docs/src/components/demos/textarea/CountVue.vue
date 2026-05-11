<script setup lang="ts">
import { ref } from 'vue';
import { CfTextarea } from '@chufix-design/vue';

const bio = ref('');
</script>

<template>
  <CfTextarea
    v-model="bio"
    placeholder="个人简介（最多 50 字）"
    :rows="3"
    :maxlength="50"
    show-count
  />
</template>
