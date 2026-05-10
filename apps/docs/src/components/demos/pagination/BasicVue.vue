<script setup lang="ts">
import { ref } from 'vue';
import { CfPagination } from '@chufix-design/vue';

const page = ref(1);
</script>

<template>
  <CfPagination v-model="page" :total="80" :page-size="10" />
</template>
