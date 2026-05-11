<script setup lang="ts">
import { CfCodeWorkspace, type CodeWorkspaceFile } from '@chufix-design/vue';

const files: CodeWorkspaceFile[] = [
  {
    name: 'src/components/StatusPanel.vue',
    language: 'vue',
    content: `<script setup lang="ts">
import { CfEmpty, CfButton } from '@chufix-design/vue';

const title = '还没有发布记录';
<\/script>

<template>
  <CfEmpty :title="title" description="创建第一条记录后会显示在这里。">
    <template #action>
      <CfButton variant="primary" size="sm">创建记录</CfButton>
    </template>
  </CfEmpty>
</template>`,
  },
  {
    name: 'src/components/status-panel.ts',
    language: 'typescript',
    content: `export interface StatusPanelAction {
  id: string;
  label: string;
  tone?: 'primary' | 'secondary';
}

export const actions: StatusPanelAction[] = [
  { id: 'create', label: '创建记录', tone: 'primary' },
  { id: 'import', label: '导入数据', tone: 'secondary' },
];`,
  },
  {
    name: 'src/styles/status-panel.css',
    language: 'css',
    content: `.status-panel {
  min-height: 320px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
}`,
  },
];
</script>

<template>
  <CfCodeWorkspace
    title="status-panel"
    root-label="app"
    :files="files"
    tone="dark"
    editable
    :height="430"
    trim-indent
  />
</template>
