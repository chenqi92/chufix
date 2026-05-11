<script setup lang="ts">
import { ref } from 'vue';
import { CfPagination } from '@chufix-design/vue';

const page = ref(5);
</script>

<template>
  <CfPagination
    v-model="page"
    :total="200"
    :page-size="10"
    show-total
    show-jumper
  />
</template>
