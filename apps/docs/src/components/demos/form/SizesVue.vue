<script setup lang="ts">
import { reactive } from 'vue';
import { CfForm, CfFormField, CfInput, CfSelect } from '@chufix-design/vue';

const a = reactive({ name: '', role: 'admin' });
const b = reactive({ name: '', role: 'admin' });
const c = reactive({ name: '', role: 'admin' });
const roles = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
];
</script>

<template>
  <div class="demo-stack">
    <div>
      <p class="demo-hint">size = sm</p>
      <CfForm :model="a" size="sm" layout="vertical">
        <CfFormField label="姓名" name="name"><CfInput v-model="a.name" /></CfFormField>
        <CfFormField label="角色" name="role"><CfSelect v-model="a.role" :options="roles" /></CfFormField>
      </CfForm>
    </div>
    <div>
      <p class="demo-hint">size = md（默认）</p>
      <CfForm :model="b" size="md" layout="vertical">
        <CfFormField label="姓名" name="name"><CfInput v-model="b.name" /></CfFormField>
        <CfFormField label="角色" name="role"><CfSelect v-model="b.role" :options="roles" /></CfFormField>
      </CfForm>
    </div>
    <div>
      <p class="demo-hint">size = lg</p>
      <CfForm :model="c" size="lg" layout="vertical">
        <CfFormField label="姓名" name="name"><CfInput v-model="c.name" /></CfFormField>
        <CfFormField label="角色" name="role"><CfSelect v-model="c.role" :options="roles" /></CfFormField>
      </CfForm>
    </div>
  </div>
</template>

<style scoped>
.demo-hint { margin: 0 0 8px; color: var(--fg-3); font-size: var(--t-12); }
</style>
