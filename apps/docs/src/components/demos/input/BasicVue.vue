<script setup lang="ts">
import { ref } from 'vue';
import { CfInput } from '@chufix-design/vue';

const name = ref('');
</script>

<template>
  <div class="demo-stack">
    <CfInput v-model="name" placeholder="请输入用户名" />
    <p class="demo-hint">已输入：<code>{{ name || '（空）' }}</code></p>
  </div>
</template>
