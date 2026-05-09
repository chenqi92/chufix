<script setup lang="ts">
import { ref } from 'vue';
import { CfInputGroup, CfInput } from '@chufix/vue';

const price = ref('');
const url = ref('');
</script>

<template>
  <div class="demo-stack">
    <CfInputGroup>
      <span class="cf-input-group__addon">¥</span>
      <CfInput v-model="price" placeholder="价格" />
      <span class="cf-input-group__addon">RMB</span>
    </CfInputGroup>
    <CfInputGroup>
      <span class="cf-input-group__addon">https://</span>
      <CfInput v-model="url" placeholder="example.com" />
      <span class="cf-input-group__addon">/path</span>
    </CfInputGroup>
  </div>
</template>
