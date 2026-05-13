<script setup lang="ts">
import { ref } from 'vue';
import { CfPagination } from '@chufix-design/vue';

const a = ref(7);
const b = ref(7);
const c = ref(7);
</script>

<template>
  <div class="demo-stack">
    <div>
      <CfPagination v-model="a" :total="500" :page-size="10" :sibling-count="0" />
    </div>
    <div>
      <CfPagination v-model="b" :total="500" :page-size="10" :sibling-count="1" />
    </div>
    <div>
      <CfPagination v-model="c" :total="500" :page-size="10" :sibling-count="2" />
    </div>
  </div>
</template>
