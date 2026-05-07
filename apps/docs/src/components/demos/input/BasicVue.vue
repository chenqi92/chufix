<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@chukit/vue';

const name = ref('');
const email = ref('user@chukit.dev');
const pwd = ref('');
</script>

<template>
  <div style="display: grid; gap: 0.75rem; max-width: 22rem;">
    <Input v-model="name" placeholder="请输入名字" />
    <Input v-model="email" clearable placeholder="邮箱" />
    <Input v-model="pwd" type="password" placeholder="密码" />
    <small style="color: hsl(var(--ck-muted-fg))">name = {{ name || '空' }}</small>
  </div>
</template>
