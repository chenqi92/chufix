<script setup lang="ts">
import { ref } from 'vue';
import { CfEditable, CfText } from '@chufix-design/vue';

const name = ref('北京 #3 机房');
const description = ref('用于承载海外回源流量，QPS 上限 12000。');
const restricted = ref('user@chufix.com');

async function validateName(next: string): Promise<true | string> {
  if (!next.trim()) return '名称不能为空';
  if (next.length > 30) return '不超过 30 个字符';
  return true;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;">
    <div>
      <CfText size="sm" variant="muted">单行可编辑（带校验）</CfText>
      <div style="font-size: var(--t-18); font-weight: var(--w-medium);">
        <CfEditable v-model="name" :validate="validateName" aria-label="机房名称" />
      </div>
    </div>

    <div>
      <CfText size="sm" variant="muted">多行（Ctrl/Cmd+Enter 提交，Esc 取消）</CfText>
      <CfEditable v-model="description" multiline placeholder="点击添加描述..." aria-label="描述" />
    </div>

    <div>
      <CfText size="sm" variant="muted">禁用态</CfText>
      <CfEditable v-model="restricted" disabled aria-label="主账号" />
    </div>
  </div>
</template>
