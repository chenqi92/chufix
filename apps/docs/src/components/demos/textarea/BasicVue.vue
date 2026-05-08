<script setup lang="ts">
import { ref } from 'vue';
import { CfTextarea } from '@chufix/vue';

const note = ref('');
</script>

<template>
  <CfTextarea v-model="note" placeholder="说点什么…" :rows="3" />
</template>
