<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@chufix/vue';

const agree = ref(false);
</script>

<template>
  <Checkbox v-model="agree">我同意服务协议</Checkbox>
</template>
