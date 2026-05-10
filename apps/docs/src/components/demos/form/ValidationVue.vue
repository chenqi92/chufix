<script setup lang="ts">
import { ref } from 'vue';
import { CfForm, CfFormField, CfInput, CfButton } from '@chufix-design/vue';

const name = ref('');
const email = ref('');
const errors = ref<Record<string, string>>({});

function submit() {
  errors.value = {};
  if (!name.value.trim()) errors.value.name = '姓名不能为空';
  if (!email.value.includes('@')) errors.value.email = '邮箱格式不正确';
}
</script>

<template>
  <CfForm layout="vertical">
    <CfFormField label="姓名" required :error="errors.name">
      <CfInput v-model="name" placeholder="张三" />
    </CfFormField>
    <CfFormField label="邮箱" required hint="用于登录与接收通知" :error="errors.email">
      <CfInput v-model="email" type="email" placeholder="you@example.com" />
    </CfFormField>
    <div style="display: flex; gap: 8px;">
      <CfButton @click="submit">提交</CfButton>
    </div>
  </CfForm>
</template>
