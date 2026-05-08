<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@chufix/vue';

const url = ref('');
const search = ref('');
</script>

<template>
  <div class="demo-stack">
    <Input v-model="url" placeholder="example">
      <template #prefix>https://</template>
      <template #suffix>.com</template>
    </Input>
    <Input v-model="search" clearable placeholder="搜索…">
      <template #prefix>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="7" cy="7" r="4" />
          <path d="M10 10l3 3" stroke-linecap="round" />
        </svg>
      </template>
    </Input>
  </div>
</template>
