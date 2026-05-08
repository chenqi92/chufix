<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from '@chufix/vue';

const bio = ref('');
</script>

<template>
  <Textarea
    v-model="bio"
    placeholder="个人简介（最多 50 字）"
    :rows="3"
    :maxlength="50"
    show-count
  />
</template>
