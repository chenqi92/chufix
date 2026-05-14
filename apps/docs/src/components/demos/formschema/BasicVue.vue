<script setup lang="ts">
import { ref } from 'vue';
import { CfFormSchema, CfButton, useFormValidation, type FormFieldDef } from '@chufix-design/vue';

const fields: FormFieldDef[] = [
  { name: 'name', label: '姓名', type: 'text', required: true, placeholder: '请输入' },
  { name: 'email', label: '邮箱', type: 'text', placeholder: 'name@example.com' },
  { name: 'role', label: '角色', type: 'select', options: [
    { label: '管理员', value: 'admin' },
    { label: '编辑者', value: 'editor' },
    { label: '访客', value: 'viewer' },
  ] },
  { name: 'bio', label: '简介', type: 'textarea' },
  { name: 'subscribe', label: '订阅', type: 'switch', placeholder: '接收产品更新邮件' },
];

const form = useFormValidation({
  initialValues: { name: '', email: '', role: 'viewer', bio: '', subscribe: false } as Record<string, unknown>,
  validateOn: 'change',
  schema: {
    name: (v) => (!v ? '姓名必填' : (v as string).length < 2 ? '至少 2 字' : undefined),
    email: (v) => (v && !/@/.test(v as string) ? '邮箱格式不正确' : undefined),
  },
});

const submitted = ref<unknown>(null);

function onModelUpdate(next: Record<string, unknown>) {
  for (const k of Object.keys(next)) {
    if (form.values[k] !== next[k]) form.setValue(k, next[k]);
  }
}

async function onSubmit() {
  await form.submit(async (values) => {
    submitted.value = { ...values };
  });
}
</script>

<template>
  <div class="demo-scope">
    <CfFormSchema
      :fields="fields"
      :modelValue="form.values"
      :errors="form.errors"
      @update:modelValue="onModelUpdate"
    />
    <div class="demo-actions">
      <CfButton variant="primary" :disabled="form.isSubmitting" @click="onSubmit">提交</CfButton>
      <CfButton variant="tertiary" @click="() => form.reset()">重置</CfButton>
    </div>
    <pre v-if="submitted" class="demo-pre">{{ submitted }}</pre>
  </div>
</template>

<style scoped>
.demo-scope { max-width: 560px; }
.demo-actions { display: flex; gap: 8px; margin-top: 12px; }
.demo-pre {
  margin-top: 12px;
  padding: 12px;
  background: var(--bg-2);
  border-radius: var(--r-3);
  font-size: var(--t-12);
}
</style>
