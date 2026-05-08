<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from '@chufix/vue';

const note = ref('');
</script>

<template>
  <Textarea v-model="note" placeholder="说点什么…" :rows="3" />
</template>
