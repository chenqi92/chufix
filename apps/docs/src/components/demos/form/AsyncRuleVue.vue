<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  CfForm,
  CfFormField,
  CfInput,
  CfButton,
  toast,
  type FieldRules,
} from '@chufix-design/vue';

const model = reactive({ username: '' });

const TAKEN = new Set(['admin', 'root', 'chufix']);

const rules: Record<string, FieldRules> = {
  username: [
    { required: true, min: 3, max: 16 },
    { pattern: /^[a-z][a-z0-9_]*$/, message: '只能小写字母 / 数字 / 下划线，且需小写字母开头' },
    {
      validator: (v) =>
        new Promise<string | void>((resolve) => {
          setTimeout(() => {
            resolve(TAKEN.has(String(v)) ? '该用户名已被占用' : undefined);
          }, 700);
        }),
    },
  ],
};

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);
const checking = ref(false);

async function onSubmit({ valid }: { valid: boolean }) {
  if (valid) toast({ type: 'success', message: '用户名可用' });
}

async function check() {
  checking.value = true;
  await formRef.value?.validate();
  checking.value = false;
}
</script>

<template>
  <CfForm
    ref="formRef"
    layout="vertical"
    :model="model"
    :rules="rules"
    validate-on="blur"
    @submit="onSubmit"
  >
    <CfFormField
      label="用户名"
      name="username"
      hint="`admin` / `root` / `chufix` 已被占用，可触发异步验证"
    >
      <CfInput v-model="model.username" placeholder="3~16 字符" />
    </CfFormField>
    <div style="display: flex; gap: 8px;">
      <CfButton type="submit" :loading="checking">提交</CfButton>
      <CfButton variant="tertiary" @click="check">手动校验</CfButton>
    </div>
  </CfForm>
</template>
