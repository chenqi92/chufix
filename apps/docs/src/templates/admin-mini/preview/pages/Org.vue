<script setup lang="ts">
/**
 * 组织架构页 —— 左侧 CfTreeView（部门树）+ 右侧 CfTable（该部门下的成员）。
 * 演示树形单选 + 联动表格 + 默认展开 + 选中节点过滤数据集。
 */
import { computed, h, inject, ref } from 'vue';
import { CfTreeView, CfTable, CfTag, CfSplitter, CfBreadcrumb } from '@chufix-design/vue';
import type { TableColumn, TreeNode } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import {
  initialUsers,
  initialDepartments,
  collectDeptKeys,
  findDepartment,
  type AdminUser,
  type Department,
} from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const selectedKey = ref<string>('d-root');
const expandedKeys = ref<string[]>(['d-root', 'd-rnd', 'd-ops']);

function toTreeNodes(list: Department[]): TreeNode[] {
  return list.map((d) => ({
    key: d.key,
    label: d.label,
    children: d.children ? toTreeNodes(d.children) : undefined,
  }));
}
const treeNodes = computed<TreeNode[]>(() => toTreeNodes(initialDepartments));

const visibleUsers = computed<AdminUser[]>(() => {
  const dept = findDepartment(selectedKey.value);
  if (!dept) return initialUsers;
  const allowed = new Set(collectDeptKeys(dept));
  return initialUsers.filter((u) => u.deptKey && allowed.has(u.deptKey));
});

const breadcrumbItems = computed(() => {
  const dept = findDepartment(selectedKey.value);
  return dept ? [{ label: dept.label }] : [];
});

const cols = computed<TableColumn<AdminUser>[]>(() => [
  { key: 'username', title: t.value.col_username, dataIndex: 'username', width: 120 },
  { key: 'name',     title: t.value.col_name,     dataIndex: 'name',     width: 140 },
  { key: 'email',    title: t.value.col_email,    dataIndex: 'email',    ellipsis: true },
  {
    key: 'deptKey', title: t.value.col_dept, dataIndex: 'deptKey', width: 160,
    render: (v: unknown) => {
      const dept = v ? findDepartment(String(v)) : null;
      return dept
        ? h(CfTag, { size: 'sm', variant: 'soft', tone: 'primary' }, () => dept.label)
        : '—';
    },
  },
  {
    key: 'status', title: t.value.status, dataIndex: 'status', width: 100,
    render: (v: unknown) =>
      h(CfTag,
        { size: 'sm', tone: v === 'active' ? 'success' : 'danger', variant: 'soft' },
        () => (v === 'active' ? t.value.status_active : t.value.status_disabled)),
  },
]);
</script>

<template>
  <div class="adm-page">
    <CfBreadcrumb v-if="breadcrumbItems.length" :items="breadcrumbItems" />
    <p class="adm-page__hint">{{ t.org_select_hint }}</p>

    <CfSplitter orientation="horizontal" :default-size="30" unit="%" class="adm-org">
      <template #start>
        <div class="adm-org__tree">
          <CfTreeView
            :nodes="treeNodes"
            selectable="single"
            :selected-key="selectedKey"
            v-model:expanded-keys="expandedKeys"
            :show-line="true"
            size="sm"
            @update:selectedKey="(k) => (selectedKey = k ?? 'd-root')"
          />
        </div>
      </template>
      <template #end>
        <div class="adm-org__main">
          <div class="adm-org__count">
            {{ t.org_total.replace('{n}', String(visibleUsers.length)) }}
          </div>
          <CfTable
            :columns="cols"
            :rows="visibleUsers"
            :row-key="(r: AdminUser) => String(r.id)"
            size="sm"
            :sticky-header="true"
            :hoverable="true"
          />
        </div>
      </template>
    </CfSplitter>
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
.adm-page__hint { margin: 0; color: var(--fg-3); font-size: var(--t-12); }
.adm-org { min-height: 420px; }
.adm-org__tree {
  height: 100%;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-4);
  padding: 8px;
  overflow: auto;
}
.adm-org__main {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 12px;
}
.adm-org__count {
  color: var(--fg-3);
  font-size: var(--t-12);
}
</style>
