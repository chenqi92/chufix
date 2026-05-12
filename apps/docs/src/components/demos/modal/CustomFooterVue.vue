<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfModal } from '@chufix-design/vue';

const open = ref<boolean>(false);
const saving = ref<boolean>(false);

async function saveDraft(): Promise<void> {
  saving.value = true;
  await new Promise<void>((resolve) => setTimeout(resolve, 600));
  saving.value = false;
  open.value = false;
}
</script>

<template>
  <CfButton variant="primary" @click="open = true">打开自定义 footer</CfButton>
  <CfModal v-model:open="open" title="导出报告" size="sm">
    <p>选择要导出的格式，并决定是否同时保存草稿。</p>

    <template #footer="{ ok, cancel, loading }">
      <CfButton variant="ghost" :disabled="loading" @click="cancel">
        取消
      </CfButton>
      <CfButton variant="tertiary" :loading="saving" @click="saveDraft">
        保存草稿
      </CfButton>
      <CfButton variant="primary" :loading="loading" @click="ok">
        导出 PDF
      </CfButton>
    </template>
  </CfModal>
</template>
