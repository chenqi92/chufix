<script setup lang="ts">
import { ref } from 'vue';
import { CfRating } from '@chufix/vue';

const value = ref(3.5);
</script>

<template>
  <CfRating v-model="value" allow-half show-value />
</template>
