<script setup lang="ts">
import { ref } from 'vue';
import { CfTimePicker } from '@chufix-design/vue';

const a = ref<string | null>('09:30');
const b = ref<string | null>('09:30');
const c = ref<string | null>('09:30');
</script>

<template>
  <div class="demo-row">
    <CfTimePicker v-model="a" size="sm" clearable />
    <CfTimePicker v-model="b" size="md" clearable />
    <CfTimePicker v-model="c" size="lg" clearable />
  </div>
</template>
