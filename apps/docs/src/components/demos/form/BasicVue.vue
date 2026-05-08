<script setup lang="ts">
import { ref } from 'vue';
import {
  CfForm,
  CfFormField,
  CfInput,
  CfTextarea,
  CfSelect,
  CfButton,
} from '@chufix/vue';

const name = ref('');
const email = ref('');
const role = ref('user');
const bio = ref('');
const errors = ref<Record<string, string>>({});

const roles = [
  { label: '普通用户', value: 'user' },
  { label: '管理员', value: 'admin' },
  { label: '只读', value: 'viewer' },
];

function submit() {
  errors.value = {};
  if (!name.value) errors.value.name = '姓名不能为空';
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
    <CfFormField label="角色">
      <CfSelect v-model="role" :options="roles" />
    </CfFormField>
    <CfFormField label="简介">
      <CfTextarea v-model="bio" rows="3" placeholder="一句话介绍自己" />
    </CfFormField>
    <div style="display: flex; gap: 8px;">
      <CfButton @click="submit">提交</CfButton>
      <CfButton variant="ghost" type="reset">重置</CfButton>
    </div>
  </CfForm>
</template>
