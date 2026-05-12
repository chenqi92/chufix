<script setup lang="ts">
import { computed, inject, h } from 'vue';
import { CfTable, CfTag } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialRoles, type AdminRole } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const cols = computed(() => [
  { key: 'name', title: t.value.col_role_name, dataIndex: 'name', width: 160 },
  { key: 'description', title: t.value.col_role_desc, dataIndex: 'description' },
  {
    key: 'permissions', title: t.value.col_role_perms, dataIndex: 'permissions',
    render: (v: unknown) =>
      h('div', { style: 'display: inline-flex; gap: 4px; flex-wrap: wrap;' },
        (v as string[]).map((p) =>
          h(CfTag, { size: 'sm', variant: 'outline', tone: 'primary' }, () => p),
        ),
      ),
  },
]);
</script>

<template>
  <div class="adm-page">
    <CfTable :columns="cols" :rows="initialRoles" :row-key="(r: AdminRole) => r.id" size="sm" />
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
</style>
