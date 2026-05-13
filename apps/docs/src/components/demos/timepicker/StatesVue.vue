<script setup lang="ts">
import { ref } from 'vue';
import { CfTimePicker } from '@chufix-design/vue';

const a = ref<string | null>('14:30');
const b = ref<string | null>(null);
</script>

<template>
  <div class="demo-row">
    <CfTimePicker v-model="a" disabled />
    <CfTimePicker v-model="b" placeholder="无值" disabled />
  </div>
</template>
