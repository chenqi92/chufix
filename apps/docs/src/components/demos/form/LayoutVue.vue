<script setup lang="ts">
import { ref } from 'vue';
import { CfForm, CfFormField, CfInput, CfButton } from '@chufix/vue';

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
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">layout = vertical（默认）</div>
      <CfForm layout="vertical">
        <CfFormField label="姓名"><CfInput v-model="a" /></CfFormField>
        <CfFormField label="邮箱"><CfInput v-model="b" /></CfFormField>
      </CfForm>
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">layout = horizontal</div>
      <CfForm layout="horizontal" :label-width="80">
        <CfFormField label="姓名"><CfInput v-model="c" /></CfFormField>
        <CfFormField label="邮箱"><CfInput v-model="d" /></CfFormField>
      </CfForm>
    </div>
    <div>
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">layout = inline</div>
      <CfForm layout="inline">
        <CfFormField label="姓名"><CfInput v-model="e" /></CfFormField>
        <CfFormField label="邮箱"><CfInput v-model="f" /></CfFormField>
        <CfButton>搜索</CfButton>
      </CfForm>
    </div>
  </div>
</template>
