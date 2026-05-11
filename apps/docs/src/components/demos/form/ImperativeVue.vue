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

const model = reactive({ project: '', desc: '' });

const rules: Record<string, FieldRules> = {
  project: [{ required: true, min: 2 }],
  desc: [{ max: 200 }],
};

const formRef = ref<{
  validate: () => Promise<{ valid: boolean }>;
  validateField: (n: string) => Promise<unknown>;
  clearValidate: (n?: string) => void;
  resetFields: () => void;
  submit: () => Promise<void>;
} | null>(null);

async function onlyProject() {
  await formRef.value?.validateField('project');
}
function clear() {
  formRef.value?.clearValidate();
  toast({ type: 'info', message: '已清空错误信息（数据不变）' });
}
function reset() {
  formRef.value?.resetFields();
  toast({ type: 'info', message: '已重置到初始值' });
}
</script>

<template>
  <CfForm
    ref="formRef"
    layout="vertical"
    :model="model"
    :rules="rules"
    @submit="(p: { valid: boolean }) => p.valid && toast({ type: 'success', message: '提交成功' })"
  >
    <CfFormField label="项目名" name="project">
      <CfInput v-model="model.project" />
    </CfFormField>
    <CfFormField label="描述" name="desc" hint="最多 200 字">
      <CfInput v-model="model.desc" />
    </CfFormField>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <CfButton type="submit">submit()</CfButton>
      <CfButton variant="tertiary" @click="onlyProject">validateField('project')</CfButton>
      <CfButton variant="tertiary" @click="clear">clearValidate()</CfButton>
      <CfButton variant="tertiary" @click="reset">resetFields()</CfButton>
    </div>
  </CfForm>
</template>
