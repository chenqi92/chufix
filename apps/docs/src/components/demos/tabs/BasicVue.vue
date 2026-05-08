<script setup lang="ts">
import { ref } from 'vue';
import { Tabs } from '@chufix/vue';

const tab = ref('account');
const items = [
  { value: 'account', label: '账户' },
  { value: 'security', label: '安全' },
  { value: 'notifications', label: '通知' },
  { value: 'billing', label: '账单', disabled: true },
];
</script>

<template>
  <Tabs v-model="tab" :items="items">
    <template #default="{ active }">
      <div v-if="active === 'account'">在「账户」页面，可以修改昵称、头像、邮箱。</div>
      <div v-if="active === 'security'">在「安全」页面，可以重置密码、启用两步验证。</div>
      <div v-if="active === 'notifications'">在「通知」页面，可以选择哪些事件推送邮件。</div>
    </template>
  </Tabs>
</template>
