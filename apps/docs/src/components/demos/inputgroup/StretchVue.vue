<script setup lang="ts">
import { ref } from 'vue';
import { CfInputGroup, CfInput, CfButton } from '@chufix-design/vue';

const q = ref('');
</script>

<template>
  <div style="max-width: 24rem;">
    <CfInputGroup stretch>
      <CfInput v-model="q" placeholder="搜索…" />
      <CfButton variant="primary">搜索</CfButton>
    </CfInputGroup>
  </div>
</template>
