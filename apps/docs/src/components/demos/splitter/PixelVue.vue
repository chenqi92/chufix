<script setup lang="ts">
import { ref } from 'vue';
import { CfSplitter } from '@chufix/vue';

const size = ref(220);
</script>

<template>
  <CfSplitter v-model="size" unit="px" :min="120" :max="480">
    <template #start>
      <div style="padding: 16px;">侧栏 — 当前 {{ size }}px</div>
    </template>
    <template #end>
      <div style="padding: 16px;">主区域</div>
    </template>
  </CfSplitter>
</template>
