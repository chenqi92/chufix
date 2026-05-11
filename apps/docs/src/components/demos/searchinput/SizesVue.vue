<script setup lang="ts">
import { ref } from 'vue';
import { CfSearchInput } from '@chufix-design/vue';

const a = ref('');
const b = ref('');
const c = ref('');
</script>

<template>
  <div class="demo-stack" style="max-width: 24rem;">
    <CfSearchInput v-model="a" size="sm" placeholder="size = sm" />
    <CfSearchInput v-model="b" size="md" placeholder="size = md" />
    <CfSearchInput v-model="c" size="lg" placeholder="size = lg" />
  </div>
</template>
