<script setup lang="ts">
import { ref } from 'vue';
import { CfPagination } from '@chufix-design/vue';

const a = ref(3);
const b = ref(3);
const c = ref(3);
</script>

<template>
  <div class="demo-stack">
    <CfPagination v-model="a" :total="120" :page-size="10" size="sm" />
    <CfPagination v-model="b" :total="120" :page-size="10" size="md" />
    <CfPagination v-model="c" :total="120" :page-size="10" size="lg" />
  </div>
</template>
