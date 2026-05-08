<script setup lang="ts">
import { ref } from 'vue';
import { CfCheckbox } from '@chufix/vue';

const agree = ref(false);
</script>

<template>
  <CfCheckbox v-model="agree">我同意服务协议</CfCheckbox>
</template>
