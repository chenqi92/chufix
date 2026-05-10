<script setup lang="ts">
import { ref } from 'vue';
import { CfDatePicker } from '@chufix-design/vue';

const value = ref<string | null>(null);
</script>

<template>
  <CfDatePicker v-model="value" clearable show-week-number />
</template>
