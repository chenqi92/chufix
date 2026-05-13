<script setup lang="ts">
import { ref } from 'vue';
import { CfButton, CfDrawer, toast } from '@chufix-design/vue';

const open = ref<boolean>(false);
const saving = ref<boolean>(false);

async function saveDraft() {
  saving.value = true;
  await new Promise<void>((r) => setTimeout(r, 600));
  saving.value = false;
  toast.success('草稿已保存');
}

async function publish(): Promise<boolean> {
  await new Promise<void>((r) => setTimeout(r, 700));
  toast.success('已发布');
  return true;
}
</script>

<template>
  <CfButton @click="open = true">编辑文章…</CfButton>
  <CfDrawer
    v-model:open="open"
    title="编辑文章"
    description="保存草稿与发布是两个独立的动作。"
    placement="right"
    size="md"
    :on-before-ok="publish"
  >
    <p class="adm-p">这里是文章正文区域 …</p>

    <template #footer="{ ok, cancel, loading }">
      <CfButton variant="ghost"    :disabled="loading" @click="cancel">取消</CfButton>
      <CfButton variant="tertiary" :loading="saving"   @click="saveDraft">保存草稿</CfButton>
      <CfButton variant="primary"  :loading="loading"  @click="ok">发布</CfButton>
    </template>
  </CfDrawer>
</template>

<style scoped>
.adm-p { color: var(--fg-2); line-height: 1.6; margin: 0; }
</style>
