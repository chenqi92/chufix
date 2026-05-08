<script setup lang="ts">
import { ref } from 'vue';
import { CfPagination } from '@chufix/vue';

const a = ref(1);
const b = ref(5);
const c = ref(7);
</script>

<template>
  <div class="demo-stack">
    <CfPagination v-model="a" :total="80" :page-size="10" />
    <CfPagination
      v-model="b"
      :total="200"
      :page-size="10"
      show-total
      show-jumper
    />
    <CfPagination v-model="c" :total="500" :page-size="10" :sibling-count="2" size="sm" />
    <CfPagination v-model="c" :total="500" :page-size="10" size="lg" />
  </div>
</template>
