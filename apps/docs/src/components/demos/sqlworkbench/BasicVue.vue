<script setup lang="ts">
import { CfSqlWorkbench, CfCodeEditor } from '@chufix/vue';
import { ref } from 'vue';
const sql = ref('SELECT id, name FROM users WHERE created_at > now() - interval \'1 day\';');
</script>

<template>
  <div style="height: 320px;">
    <CfSqlWorkbench>
      <template #panel-editor>
        <CfCodeEditor v-model="sql" language="sql" :rows="10" />
      </template>
      <template #panel-console><p style="color: var(--fg-2);">交互式 SQL REPL（基于 CfCodeEditor + CfDataGrid 结果展示）。</p></template>
      <template #panel-history><p style="color: var(--fg-2);">查询历史侧栏。</p></template>
    </CfSqlWorkbench>
  </div>
</template>
