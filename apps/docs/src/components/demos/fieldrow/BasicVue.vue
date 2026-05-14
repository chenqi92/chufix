<script setup lang="ts">
import { ref } from 'vue';
import { CfFieldRow } from '@chufix-design/vue';

const name = ref('');
const email = ref('');
</script>

<template>
  <div class="demo-scope">
    <CfFieldRow label="姓名" required hint="2 - 20 字">
      <input class="cf-input" v-model="name" placeholder="请输入" />
    </CfFieldRow>
    <CfFieldRow label="邮箱" :error="email && !/@/.test(email) ? '邮箱格式不正确' : undefined">
      <input class="cf-input" v-model="email" placeholder="name@example.com" />
    </CfFieldRow>
    <CfFieldRow label="备注" layout="horizontal">
      <textarea class="cf-textarea" rows="2" placeholder="可选" />
    </CfFieldRow>
  </div>
</template>

<style scoped>
.demo-scope { display: flex; flex-direction: column; gap: 12px; max-width: 480px; }
</style>
