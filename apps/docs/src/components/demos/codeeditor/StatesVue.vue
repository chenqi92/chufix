<script setup lang="ts">
import { ref } from 'vue';
import { CfCodeEditor } from '@chufix/vue';
const ro = ref(`# read-only 模式
# 输入会被拦截，行号 + 灰底突出 readOnly 状态

const cfg = {
  mode: 'view',
  permissions: ['read'],
};`);
const wrapped = ref('这是一段非常长的文本，用来演示 wrap 模式：当行宽超出容器时会自动软换行而不是横向滚动。在普通 wrap=false 模式下，长行会触发水平滚动条；wrap=true 时则像 prose 一样自然换行，适合用来展示 markdown 草稿、SQL 单行语句等场景。');
const noNumbers = ref('// 不显示行号\nfunction tiny() { return 42; }');
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <CfCodeEditor v-model="ro" language="typescript" :rows="5" read-only />
    <CfCodeEditor v-model="wrapped" :rows="4" wrap />
    <CfCodeEditor v-model="noNumbers" :rows="3" :show-line-numbers="false" />
  </div>
</template>
