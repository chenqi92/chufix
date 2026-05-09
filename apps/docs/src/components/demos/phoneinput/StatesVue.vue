<script setup lang="ts">
import { ref } from 'vue';
import { CfPhoneInput } from '@chufix/vue';
const v1 = ref('138 0013 8000');
const v2 = ref('invalid!!');
const v3 = ref('555 123 4567');
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;">
    <CfPhoneInput v-model="v1" country="CN" size="sm" />
    <CfPhoneInput v-model="v2" country="CN" :error="true" />
    <CfPhoneInput v-model="v3" country="US" size="lg" disabled />
  </div>
</template>
