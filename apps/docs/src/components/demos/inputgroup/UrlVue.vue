<script setup lang="ts">
import { ref } from 'vue';
import { CfInputGroup, CfInput, CfButton, CfSelect } from '@chufix/vue';

const protocol = ref('https');
const host = ref('chufix.com');
const protocols = [
  { label: 'https://', value: 'https' },
  { label: 'http://', value: 'http' },
];
</script>

<template>
  <CfInputGroup>
    <CfSelect v-model="protocol" :options="protocols" />
    <CfInput v-model="host" placeholder="example.com" />
    <CfButton>访问</CfButton>
  </CfInputGroup>
</template>
