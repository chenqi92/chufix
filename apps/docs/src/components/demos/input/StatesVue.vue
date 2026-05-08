<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@chufix/vue';

const search = ref('hello');
const email = ref('not-an-email');
const valid = (s: string) => /.+@.+\..+/.test(s);
</script>

<template>
  <div class="demo-stack">
    <Input v-model="search" clearable placeholder="可清空（输入后出现 ×）" />
    <Input
      v-model="email"
      :error="!valid(email)"
      placeholder="错误状态：邮箱格式不对"
    />
    <Input placeholder="禁用" disabled />
    <Input placeholder="只读" readonly model-value="readonly content" />
  </div>
</template>
