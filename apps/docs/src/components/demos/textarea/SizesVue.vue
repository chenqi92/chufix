<script setup lang="ts">
import { ref } from 'vue';
import { CfTextarea } from '@chufix-design/vue';

const sm = ref<string>('');
const md = ref<string>('');
const lg = ref<string>('');
</script>

<template>
  <div class="demo-stack">
    <CfTextarea v-model="sm" size="sm" placeholder="size = sm（紧凑）" :rows="2" />
    <CfTextarea v-model="md" size="md" placeholder="size = md（默认）" :rows="2" />
    <CfTextarea v-model="lg" size="lg" placeholder="size = lg（宽松）" :rows="2" />
  </div>
</template>
