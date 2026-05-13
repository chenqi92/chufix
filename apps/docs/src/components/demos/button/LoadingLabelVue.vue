<script setup lang="ts">
import { ref } from 'vue';
import { CfButton } from '@chufix-design/vue';

const submitting = ref(false);
const saving = ref(false);
const sending = ref(false);

async function submit(): Promise<void> {
  submitting.value = true;
  await new Promise<void>((resolve) => setTimeout(resolve, 1500));
  submitting.value = false;
}
async function save(): Promise<void> {
  saving.value = true;
  await new Promise<void>((resolve) => setTimeout(resolve, 1500));
  saving.value = false;
}
async function send(): Promise<void> {
  sending.value = true;
  await new Promise<void>((resolve) => setTimeout(resolve, 1500));
  sending.value = false;
}
</script>

<template>
  <div class="demo-row">
    <CfButton variant="primary" :loading="submitting" @click="submit">
      {{ submitting ? '提交中…' : '提交' }}
    </CfButton>
    <CfButton variant="secondary" :loading="saving" @click="save">
      {{ saving ? '保存中…' : '保存草稿' }}
    </CfButton>
    <CfButton variant="tertiary" :loading="sending" @click="send">
      {{ sending ? '发送中…' : '发送邮件' }}
    </CfButton>
  </div>
</template>
