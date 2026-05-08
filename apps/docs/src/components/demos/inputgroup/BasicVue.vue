<script setup lang="ts">
import { ref } from 'vue';
import { CfInputGroup, CfInput, CfButton, CfSelect } from '@chufix/vue';

const search = ref('');
const protocol = ref('https');
const host = ref('chufix.com');
const protocols = [
  { label: 'https://', value: 'https' },
  { label: 'http://', value: 'http' },
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
    <CfInputGroup>
      <span class="cf-input-group__addon">@</span>
      <CfInput v-model="search" placeholder="username" />
    </CfInputGroup>

    <CfInputGroup>
      <CfSelect v-model="protocol" :options="protocols" />
      <CfInput v-model="host" placeholder="example.com" />
      <CfButton>访问</CfButton>
    </CfInputGroup>

    <CfInputGroup stretch>
      <CfInput placeholder="搜索…" />
      <CfButton variant="primary">搜索</CfButton>
    </CfInputGroup>
  </div>
</template>
