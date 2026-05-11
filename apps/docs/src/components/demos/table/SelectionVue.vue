<script setup lang="ts">
import { ref } from 'vue';
import { CfTable, type TableColumn } from '@chufix-design/vue';

interface Row { id: string; name: string; role: string; team: string }

const rows: Row[] = [
  { id: '1', name: 'Alice', role: '前端', team: 'Web' },
  { id: '2', name: 'Bob', role: '后端', team: 'API' },
  { id: '3', name: 'Carol', role: '设计', team: 'UX' },
  { id: '4', name: 'Dave', role: '运维', team: 'Infra' },
];

const selected = ref<string[]>(['1', '3']);

const columns: TableColumn<Row>[] = [
  { key: 'name', title: '姓名', sortable: true },
  { key: 'role', title: '角色' },
  { key: 'team', title: '团队' },
];
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px;">
    <CfTable
      v-model="selected"
      :columns="columns"
      :rows="rows"
      row-key="id"
      selectable="multiple"
      variant="striped"
    />
    <div style="font-size: 12px; color: var(--fg-3);">
      选中：<code>{{ JSON.stringify(selected) }}</code>
    </div>
  </div>
</template>
