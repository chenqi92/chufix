<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  CfForm,
  CfFormField,
  CfInput,
  CfButton,
  CfSwitch,
  toast,
  type FieldRules,
} from '@chufix-design/vue';

interface SignupModel {
  name: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
}

const model = reactive<SignupModel>({
  name: '',
  email: '',
  password: '',
  confirm: '',
  agree: false,
});

const rules: Record<string, FieldRules> = {
  name: [{ required: true, min: 2, max: 24, message: '姓名 2~24 个字符' }],
  email: [{ required: true, type: 'email' }],
  password: [{ required: true, min: 8, message: '密码至少 8 位' }],
  confirm: [
    { required: true },
    {
      validator: (v, m) => (v !== (m as SignupModel).password ? '两次输入的密码不一致' : undefined),
    },
  ],
  agree: [{ validator: (v) => (v === true ? undefined : '请阅读并同意条款') }],
};

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> ; resetFields: () => void } | null>(null);

async function onSubmit({ valid }: { valid: boolean }) {
  if (valid) toast({ type: 'success', message: '注册成功' });
}
function reset() {
  formRef.value?.resetFields();
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
    <CfFormField label="姓名" name="name">
      <CfInput v-model="model.name" placeholder="2~24 字符" />
    </CfFormField>
    <CfFormField label="邮箱" name="email" hint="用于登录与接收通知">
      <CfInput v-model="model.email" placeholder="you@example.com" />
    </CfFormField>
    <CfFormField label="密码" name="password">
      <CfInput v-model="model.password" type="password" />
    </CfFormField>
    <CfFormField label="确认密码" name="confirm">
      <CfInput v-model="model.confirm" type="password" />
    </CfFormField>
    <CfFormField name="agree" :label="undefined">
      <label style="display: inline-flex; gap: 8px; align-items: center; font-size: 13px;">
        <CfSwitch v-model="model.agree" />
        我已阅读并同意《用户协议》
      </label>
    </CfFormField>
    <div style="display: flex; gap: 8px;">
      <CfButton type="submit">注册</CfButton>
      <CfButton variant="tertiary" @click="reset">重置</CfButton>
    </div>
  </CfForm>
</template>
