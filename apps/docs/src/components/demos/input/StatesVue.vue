<script setup lang="ts">
import { ref } from 'vue';
import { CfInput } from '@chufix-design/vue';

const search = ref('hello');
const email = ref('not-an-email');
const valid = (s: string) => /.+@.+\..+/.test(s);
</script>

<template>
  <div class="demo-stack">
    <CfInput v-model="search" clearable placeholder="可清空（输入后出现 ×）" />
    <CfInput
      v-model="email"
      :error="!valid(email)"
      placeholder="错误状态：邮箱格式不对"
    />
    <CfInput placeholder="禁用" disabled />
    <CfInput placeholder="只读" readonly model-value="readonly content" />
  </div>
</template>
