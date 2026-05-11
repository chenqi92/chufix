<script setup lang="ts">
import { ref } from 'vue';
import { CfForm, CfFormField, CfInput, CfButton } from '@chufix-design/vue';

const name = ref('');
const email = ref('');
</script>

<template>
  <CfForm layout="vertical">
    <CfFormField label="姓名">
      <CfInput v-model="name" placeholder="张三" />
    </CfFormField>
    <CfFormField label="邮箱" hint="用于登录">
      <CfInput v-model="email" type="email" placeholder="you@example.com" />
    </CfFormField>
    <CfButton>提交</CfButton>
  </CfForm>
</template>
