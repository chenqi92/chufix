<script setup lang="ts">
import { ref } from 'vue';
import { CfMarkdownEditor } from '@chufix-design/vue';
const md = ref(`## 备注

仅 **预览** 模式，content 不可编辑。`);
const mode = ref<'split' | 'edit' | 'preview'>('preview');
</script>

<template>
  <CfMarkdownEditor v-model="md" :mode="mode" @update:mode="(m) => mode = m" size="sm" read-only />
</template>
