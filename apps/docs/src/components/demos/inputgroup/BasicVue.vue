<script setup lang="ts">
import { ref } from 'vue';
import { CfInputGroup, CfInput } from '@chufix/vue';

const search = ref('');
</script>

<template>
  <CfInputGroup>
    <span class="cf-input-group__addon">@</span>
    <CfInput v-model="search" placeholder="username" />
  </CfInputGroup>
</template>
