<script setup lang="ts">
import { ref } from 'vue';
import { CfOtpInput } from '@chufix/vue';

const a = ref('');
const b = ref('');
const c = ref('');
</script>

<template>
  <div class="demo-stack">
    <CfOtpInput v-model="a" :length="6" size="sm" />
    <CfOtpInput v-model="b" :length="6" size="md" />
    <CfOtpInput v-model="c" :length="6" size="lg" />
  </div>
</template>
