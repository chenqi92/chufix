<script setup lang="ts">
import { ref } from 'vue';
import { CfPromptComposer, type PromptAttachment, type SlashCommand, type MentionItem } from '@chufix-design/vue';

const value = ref('');
const loading = ref(false);
const attachments = ref<PromptAttachment[]>([]);
const log = ref('');

const slashCommands: SlashCommand[] = [
  { id: 'summarize', label: 'summarize', description: '总结当前对话' },
  { id: 'translate', label: 'translate', description: '翻译为指定语言' },
  { id: 'web', label: 'web', description: '调用 Web 搜索', match: ['search', '搜索'] },
];

const mentions: MentionItem[] = [
  { id: 'sarah', label: 'Sarah', description: 'Designer' },
  { id: 'yifan', label: 'Yifan', description: 'Engineer' },
  { id: 'lin', label: 'Lin',     description: 'PM' },
];

function onSubmit(text: string) {
  log.value = `提交：${text}`;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    value.value = '';
    attachments.value = [];
  }, 1200);
}

function onAttachAdd(file: File) {
  attachments.value.push({
    id: `${Date.now()}-${file.name}`,
    name: file.name,
    size: file.size,
    mime: file.type,
  });
}

function onAttachRemove(id: string) {
  attachments.value = attachments.value.filter((a) => a.id !== id);
}
</script>

<template>
  <div class="demo-stack">
    <CfPromptComposer
      v-model="value"
      :loading="loading"
      :attachments="attachments"
      :slash-commands="slashCommands"
      :mentions="mentions"
      @submit="onSubmit"
      @stop="loading = false"
      @attach-add="onAttachAdd"
      @attach-remove="onAttachRemove"
    />
    <p v-if="log" class="demo-hint">{{ log }}</p>
    <p class="demo-hint">试一下：输入 <code>/</code> 看 slash 命令；输入 <code>@</code> 看 mention 列表。</p>
  </div>
</template>
