<script setup lang="ts">
import { ref } from 'vue';
import { CfMarkdownEditor } from '@chufix-design/vue';
const md = ref(`# 标题一

这是 **加粗**、*斜体*、\`inline code\` 与 [链接](https://chufix.com) 的示例。

## 列表

- 第一项
- 第二项
- 第三项

> 引用文本

\`\`\`ts
const a = 1;
\`\`\`
`);
const mode = ref<'split' | 'edit' | 'preview'>('split');
</script>

<template>
  <CfMarkdownEditor v-model="md" :mode="mode" @update:mode="(m) => mode = m" />
</template>
