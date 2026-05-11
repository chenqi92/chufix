<script setup lang="ts">
import { ref } from 'vue';
import { CfForm, CfFormField, CfInput, CfButton } from '@chufix-design/vue';

const a = ref('');
const b = ref('');
const c = ref('');
const d = ref('');
const e = ref('');
const f = ref('');
</script>

<template>
  <div class="demo-stack">
    <div>
      <CfForm layout="vertical">
        <CfFormField label="姓名"><CfInput v-model="a" /></CfFormField>
        <CfFormField label="邮箱"><CfInput v-model="b" /></CfFormField>
      </CfForm>
    </div>
    <div>
      <CfForm layout="horizontal" :label-width="80">
        <CfFormField label="姓名"><CfInput v-model="c" /></CfFormField>
        <CfFormField label="邮箱"><CfInput v-model="d" /></CfFormField>
      </CfForm>
    </div>
    <div>
      <CfForm layout="inline">
        <CfFormField label="姓名"><CfInput v-model="e" /></CfFormField>
        <CfFormField label="邮箱"><CfInput v-model="f" /></CfFormField>
        <CfButton>搜索</CfButton>
      </CfForm>
    </div>
  </div>
</template>
