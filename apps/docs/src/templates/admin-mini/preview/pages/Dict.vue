<script setup lang="ts">
/**
 * 字典管理页 —— 父子树形表格 + 完整 CRUD：
 *   - 树形 CfTable（父字典 → 子项）+ 默认展开
 *   - 新增父字典 / 新增子项 / 编辑 / 删除
 *   - 删除二次确认（CfConfirmDialog），删除父字典会连带删除其所有子项
 */
import { computed, h, inject, ref } from 'vue';
import {
  CfTable,
  CfTag,
  CfButton,
  CfModal,
  CfForm,
  CfFormField,
  CfInput,
  CfTextarea,
  CfConfirmDialog,
  toast,
} from '@chufix-design/vue';
import type { TableColumn } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialDict, type DictItem } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

interface DictNode extends DictItem {
  children?: DictNode[];
}

const rows = ref<DictItem[]>(initialDict.map((d) => ({ ...d })));

const tree = computed<DictNode[]>(() => {
  const byParent = new Map<string | null, DictItem[]>();
  for (const item of rows.value) {
    const arr = byParent.get(item.parentId) ?? [];
    arr.push(item);
    byParent.set(item.parentId, arr);
  }
  const roots = byParent.get(null) ?? [];
  return roots.map((r) => ({ ...r, children: byParent.get(r.id) ?? [] }));
});

const dialogOpen = ref(false);
const editing = ref<DictItem | null>(null);
const parentOf = ref<DictItem | null>(null);
const form = ref<{ label: string; value: string; remark: string }>({
  label: '', value: '', remark: '',
});

const confirmOpen = ref(false);
const pendingDelete = ref<DictItem | null>(null);

function openCreateRoot() {
  editing.value = null;
  parentOf.value = null;
  form.value = { label: '', value: '', remark: '' };
  dialogOpen.value = true;
}
function openCreateChild(parent: DictItem) {
  editing.value = null;
  parentOf.value = parent;
  form.value = { label: '', value: '', remark: '' };
  dialogOpen.value = true;
}
function openEdit(row: DictItem) {
  editing.value = row;
  parentOf.value = null;
  form.value = { label: row.label, value: row.value, remark: row.remark };
  dialogOpen.value = true;
}
function askDelete(row: DictItem) {
  pendingDelete.value = row;
  confirmOpen.value = true;
}
function confirmDelete() {
  const r = pendingDelete.value;
  if (!r) return;
  const removeIds = new Set<string>([r.id]);
  // 父字典连带删除全部子项
  for (const it of rows.value) {
    if (it.parentId === r.id) removeIds.add(it.id);
  }
  rows.value = rows.value.filter((x) => !removeIds.has(x.id));
  pendingDelete.value = null;
  toast.success(
    state.locale.value === 'zh'
      ? `已删除 ${removeIds.size} 个条目`
      : `Deleted ${removeIds.size} entries`,
  );
}

function save(): boolean {
  if (!form.value.label.trim() || !form.value.value.trim()) {
    toast.error(state.locale.value === 'zh' ? '名称和值必填' : 'Label and value required');
    return false;
  }
  if (editing.value) {
    const id = editing.value.id;
    rows.value = rows.value.map((r) => (r.id === id ? { ...r, ...form.value } : r));
    toast.success(state.locale.value === 'zh' ? '已更新' : 'Updated');
  } else {
    const nextId = `d-${Date.now().toString(36)}`;
    rows.value = [
      ...rows.value,
      { id: nextId, parentId: parentOf.value?.id ?? null, ...form.value },
    ];
    toast.success(state.locale.value === 'zh' ? '已新增' : 'Created');
  }
  return true;
}

const dialogTitle = computed(() => {
  if (editing.value) return `${t.value.edit}：${editing.value.label}`;
  if (parentOf.value) {
    return state.locale.value === 'zh'
      ? `新增子项 → ${parentOf.value.label}`
      : `New child → ${parentOf.value.label}`;
  }
  return state.locale.value === 'zh' ? '新增父字典' : 'New root entry';
});

const deleteDescription = computed(() => {
  const r = pendingDelete.value;
  if (!r) return '';
  if (r.parentId == null) {
    return state.locale.value === 'zh'
      ? `将连带删除「${r.label}」的所有子项，无法撤销。`
      : `All children of "${r.label}" will also be deleted. This cannot be undone.`;
  }
  return r.label;
});

const cols = computed<TableColumn<DictNode>[]>(() => [
  {
    key: 'label', title: t.value.col_dict_label, dataIndex: 'label', width: 240,
    render: (v: unknown, row: DictNode) =>
      h('span', { style: 'display: inline-flex; align-items: center; gap: 6px;' }, [
        h('span', String(v)),
        row.parentId == null
          ? h(CfTag, { size: 'sm', variant: 'soft', tone: 'primary' }, () => state.locale.value === 'zh' ? '父字典' : 'root')
          : null,
      ]),
  },
  { key: 'value',  title: t.value.col_dict_value,  dataIndex: 'value',  width: 200 },
  { key: 'remark', title: t.value.col_dict_remark, dataIndex: 'remark', ellipsis: true },
  {
    key: 'actions', title: t.value.actions, dataIndex: 'id', width: 220, align: 'right' as const,
    fixed: 'right' as const,
    render: (_v: unknown, row: DictNode) =>
      h('div', { style: 'display: inline-flex; gap: 4px; justify-content: flex-end;' }, [
        row.parentId == null
          ? h(CfButton, { size: 'sm', variant: 'tertiary', onClick: () => openCreateChild(row) },
            () => state.locale.value === 'zh' ? '+ 子项' : '+ Child')
          : null,
        h(CfButton, { size: 'sm', variant: 'tertiary', onClick: () => openEdit(row) }, () => t.value.edit),
        h(CfButton, { size: 'sm', variant: 'danger',   onClick: () => askDelete(row) }, () => t.value.delete),
      ]),
  },
]);

const expandedKeys = computed(() => tree.value.map((n) => n.id));
</script>

<template>
  <div class="adm-page">
    <header class="adm-page__head">
      <span class="adm-page__count">
        {{ state.locale.value === 'zh'
          ? `共 ${rows.length} 个条目（${tree.length} 个父字典）`
          : `${rows.length} entries (${tree.length} roots)` }}
      </span>
      <CfButton variant="primary" size="sm" @click="openCreateRoot">
        + {{ state.locale.value === 'zh' ? '新增父字典' : 'New root' }}
      </CfButton>
    </header>

    <CfTable
      :columns="cols"
      :rows="tree"
      :row-key="(r: DictNode) => r.id"
      :default-expanded-row-keys="expandedKeys"
      size="sm"
      :sticky-header="true"
      :hoverable="true"
    />

    <CfModal
      v-model:open="dialogOpen"
      :title="dialogTitle"
      :ok-text="t.save"
      :cancel-text="t.cancel"
      :on-before-ok="save"
      size="sm"
    >
      <CfForm :model="form" layout="vertical">
        <CfFormField :label="t.col_dict_label" name="label">
          <CfInput v-model="form.label" />
        </CfFormField>
        <CfFormField :label="t.col_dict_value" name="value">
          <CfInput v-model="form.value" />
        </CfFormField>
        <CfFormField :label="t.col_dict_remark" name="remark">
          <CfTextarea v-model="form.remark" :rows="2" />
        </CfFormField>
      </CfForm>
    </CfModal>

    <CfConfirmDialog
      v-model:open="confirmOpen"
      tone="warning"
      :title="state.locale.value === 'zh' ? '确认删除？' : 'Delete this entry?'"
      :description="deleteDescription"
      :ok-text="t.delete"
      :cancel-text="t.cancel"
      ok-variant="danger"
      @ok="confirmDelete"
    />
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
.adm-page__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.adm-page__count { color: var(--fg-3); font-size: var(--t-12); }
</style>
