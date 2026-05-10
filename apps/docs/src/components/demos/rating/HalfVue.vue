<script setup lang="ts">
import { ref } from 'vue';
import { CfRating } from '@chufix-design/vue';

const value = ref(3.5);
</script>

<template>
  <CfRating v-model="value" allow-half show-value />
</template>
