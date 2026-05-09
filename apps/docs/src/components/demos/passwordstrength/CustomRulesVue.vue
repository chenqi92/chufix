<script setup lang="ts">
import { ref } from 'vue';
import { CfPasswordStrength } from '@chufix/vue';
const pwd = ref('');
const requirements = [
  { label: '12+ 位字符', test: (v: string) => v.length >= 12 },
  { label: '不包含空格', test: (v: string) => !!v && !/\s/.test(v) },
  { label: '至少 1 个小写', test: (v: string) => /[a-z]/.test(v) },
  { label: '至少 1 个大写', test: (v: string) => /[A-Z]/.test(v) },
  { label: '至少 1 个数字', test: (v: string) => /\d/.test(v) },
  { label: '至少 1 个特殊字符', test: (v: string) => /[!@#$%^&*]/.test(v) },
];
</script>

<template>
  <div style="max-width: 360px;">
    <CfPasswordStrength v-model="pwd" :requirements="requirements" placeholder="自定义规则…" />
  </div>
</template>
