<script setup lang="ts">
/**
 * 菜单管理 —— 左侧 CfTreeView 展示菜单层级，右侧 CfForm 编辑选中节点。
 * 关键 ChuFix 组件展示：
 *   - CfTreeView：层级结构、显示连接线、单选、节点图标
 *   - CfIconPicker：图标选择
 *   - CfForm + CfInput + CfNumberInput + CfSwitch + CfTreeSelect：节点元数据
 *   - CfSplitter：左右两栏可拖拽
 *   - CfConfirmDialog：删除二次确认
 */
import { computed, inject, ref, watch } from 'vue';
import {
  CfTreeView,
  CfSplitter,
  CfForm,
  CfFormField,
  CfInput,
  CfNumberInput,
  CfSwitch,
  CfTreeSelect,
  CfIconPicker,
  CfButton,
  CfConfirmDialog,
  CfIcon,
  CfEmpty,
  toast,
} from '@chufix-design/vue';
import type { TreeNode, TreeSelectNode } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialMenus, type MenuEntry } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const menus = ref<MenuEntry[]>(initialMenus.map((m) => ({ ...m })));
const selectedKey = ref<string | null>('m-dashboard');
const expandedKeys = ref<string[]>(['m-authz', 'm-system']);

const draft = ref<MenuEntry | null>(null);
const isCreating = ref(false);

function buildTree(list: MenuEntry[], parentId: string | null = null): TreeNode[] {
  return list
    .filter((m) => m.parentId === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map<TreeNode>((m) => {
      const children = buildTree(list, m.id);
      const iconSpan = m.icon
        ? `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /></svg>`
        : undefined;
      return {
        key: m.id,
        label: m.title + (m.visible ? '' : ' (hidden)'),
        icon: iconSpan,
        children: children.length ? children : undefined,
      };
    });
}
const treeNodes = computed<TreeNode[]>(() => buildTree(menus.value));

function collectMenuDescendantIds(id: string): string[] {
  const out: string[] = [];
  const visit = (parentId: string) => {
    for (const child of menus.value.filter((m) => m.parentId === parentId)) {
      out.push(child.id);
      visit(child.id);
    }
  };
  visit(id);
  return out;
}

function buildParentTree(parentId: string | null, disabledIds: Set<string>): TreeSelectNode[] {
  return menus.value
    .filter((m) => m.parentId === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map((m) => ({
      value: m.id,
      label: m.title,
      disabled: disabledIds.has(m.id),
      children: buildParentTree(m.id, disabledIds),
    }));
}

const parentTreeOptions = computed<TreeSelectNode[]>(() => {
  const disabledIds = new Set<string>();
  if (draft.value && !isCreating.value) {
    disabledIds.add(draft.value.id);
    for (const id of collectMenuDescendantIds(draft.value.id)) disabledIds.add(id);
  }
  return [{
    value: '__root__',
    label: t.value.menu_no_parent,
    children: buildParentTree(null, disabledIds),
  }];
});

const parentSelectValue = computed({
  get: () => draft.value?.parentId ?? '__root__',
  set: (value: string | string[] | undefined) => {
    if (!draft.value || Array.isArray(value)) return;
    draft.value.parentId = value && value !== '__root__' ? value : null;
  },
});

watch(selectedKey, (key) => {
  if (isCreating.value && key === null) return;
  const found = key ? menus.value.find((m) => m.id === key) : null;
  isCreating.value = false;
  draft.value = found ? { ...found } : null;
}, { immediate: true });

function saveDraft() {
  if (!draft.value) return;
  const d = draft.value;
  if (!d.title.trim()) {
    toast.error(state.locale.value === 'zh' ? '名称必填' : 'Title is required');
    return;
  }
  if (!isCreating.value) {
    const disabledIds = new Set([d.id, ...collectMenuDescendantIds(d.id)]);
    if (d.parentId && disabledIds.has(d.parentId)) {
      toast.error(state.locale.value === 'zh' ? '不能选择自身或子级作为父级' : 'Cannot choose itself or a descendant as parent');
      return;
    }
  }
  if (isCreating.value) {
    menus.value = [...menus.value, { ...d }];
    if (d.parentId) expandedKeys.value = [...new Set([...expandedKeys.value, d.parentId])];
    selectedKey.value = d.id;
    isCreating.value = false;
    toast.success(state.locale.value === 'zh' ? '已新增菜单' : 'Menu created');
    return;
  }
  menus.value = menus.value.map((m) => (m.id === d.id ? { ...d } : m));
  if (d.parentId) expandedKeys.value = [...new Set([...expandedKeys.value, d.parentId])];
  toast.success(state.locale.value === 'zh' ? '已更新' : 'Updated');
}

const confirmOpen = ref(false);
function askDelete() {
  if (!selectedKey.value) return;
  confirmOpen.value = true;
}
function confirmDelete() {
  if (!selectedKey.value) return;
  const removeIds = new Set<string>();
  const queue = [selectedKey.value];
  while (queue.length) {
    const id = queue.shift()!;
    removeIds.add(id);
    for (const m of menus.value) if (m.parentId === id) queue.push(m.id);
  }
  menus.value = menus.value.filter((m) => !removeIds.has(m.id));
  selectedKey.value = null;
  draft.value = null;
  toast.success(
    state.locale.value === 'zh'
      ? `已删除 ${removeIds.size} 个菜单项`
      : `Deleted ${removeIds.size} menu entries`,
  );
}

function openCreate() {
  const nextSort = menus.value.filter((m) => m.parentId === null).length + 1;
  isCreating.value = true;
  selectedKey.value = null;
  draft.value = {
    id: `m-${Date.now().toString(36)}`,
    parentId: null,
    title: state.locale.value === 'zh' ? '新菜单' : 'New menu',
    icon: 'square',
    route: '',
    sort: nextSort,
    visible: true,
  };
}

function cancelCreate() {
  isCreating.value = false;
  selectedKey.value = menus.value[0]?.id ?? null;
}
</script>

<template>
  <div class="adm-page">
    <p class="adm-page__hint">{{ t.menu_hint }}</p>

    <CfSplitter orientation="horizontal" :default-size="40" unit="%" class="adm-menus">
      <template #start>
        <div class="adm-menus__tree">
          <header class="adm-menus__tree-head">
            <CfButton size="sm" variant="primary" @click="openCreate">
              + {{ state.locale.value === 'zh' ? '新增菜单' : 'New menu' }}
            </CfButton>
            <CfButton
              size="sm"
              variant="danger"
              :disabled="!selectedKey || isCreating"
              @click="askDelete"
            >
              {{ t.delete }}
            </CfButton>
          </header>
          <div class="adm-menus__tree-body">
            <CfTreeView
              :nodes="treeNodes"
              selectable="single"
              :selected-key="selectedKey"
              v-model:expanded-keys="expandedKeys"
              :show-line="true"
              size="sm"
              @update:selectedKey="(k) => (selectedKey = k ?? null)"
            />
          </div>
        </div>
      </template>
      <template #end>
        <div class="adm-menus__editor">
          <template v-if="draft">
            <header class="adm-menus__editor-head">
              <h3>{{ isCreating ? (state.locale.value === 'zh' ? '新增菜单' : 'New menu') : (draft.title || '—') }}</h3>
              <span class="adm-menus__editor-meta">{{ draft.id }}</span>
            </header>
            <CfForm :model="draft" layout="vertical">
              <CfFormField :label="t.menu_title" name="title">
                <CfInput v-model="draft.title" />
              </CfFormField>
              <CfFormField :label="t.menu_icon" name="icon">
                <CfIconPicker v-model="draft.icon" :placeholder="t.menu_icon" />
                <div v-if="draft.icon" class="adm-menus__preview">
                  <CfIcon :name="draft.icon" />
                  <code>{{ draft.icon }}</code>
                </div>
              </CfFormField>
              <CfFormField :label="t.menu_route" name="route">
                <CfInput v-model="draft.route" placeholder="/example" />
              </CfFormField>
              <div class="adm-menus__row">
                <CfFormField :label="t.menu_parent" name="parentId" style="flex: 1;">
                  <CfTreeSelect
                    v-model="parentSelectValue"
                    :options="parentTreeOptions"
                    searchable
                    size="sm"
                    :placeholder="t.menu_parent"
                  />
                </CfFormField>
                <CfFormField :label="t.menu_sort" name="sort" style="width: 120px;">
                  <CfNumberInput v-model="draft.sort" :min="1" :step="1" />
                </CfFormField>
              </div>
              <CfFormField :label="t.menu_visible" name="visible">
                <CfSwitch v-model="draft.visible" />
              </CfFormField>
            </CfForm>
            <footer class="adm-menus__editor-foot">
              <CfButton v-if="isCreating" variant="tertiary" @click="cancelCreate">{{ t.cancel }}</CfButton>
              <CfButton variant="primary" @click="saveDraft">{{ t.save }}</CfButton>
            </footer>
          </template>
          <CfEmpty v-else :description="t.menu_select_to_edit" />
        </div>
      </template>
    </CfSplitter>

    <CfConfirmDialog
      v-model:open="confirmOpen"
      tone="warning"
      :title="state.locale.value === 'zh' ? '确认删除？' : 'Delete this menu?'"
      :description="state.locale.value === 'zh' ? '将连带删除所有子菜单。' : 'All descendant menu entries will be removed.'"
      :ok-text="t.delete"
      :cancel-text="t.cancel"
      ok-variant="danger"
      @ok="confirmDelete"
    />
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
.adm-page__hint { margin: 0; color: var(--fg-3); font-size: var(--t-12); }

.adm-menus { min-height: 480px; }

.adm-menus__tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-4);
  padding: 10px;
}
.adm-menus__tree-head {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.adm-menus__tree-body {
  flex: 1;
  overflow: auto;
}

.adm-menus__editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 12px;
}
.adm-menus__editor-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid var(--line-1);
  padding-bottom: 8px;
}
.adm-menus__editor-head h3 {
  margin: 0;
  font-size: var(--t-14);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.adm-menus__editor-meta {
  color: var(--fg-3);
  font-family: var(--font-mono);
  font-size: var(--t-11);
}
.adm-menus__editor-foot {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid var(--line-1);
}
.adm-menus__row {
  display: flex;
  gap: 12px;
}
.adm-menus__preview {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid var(--line-1);
  border-radius: var(--r-4);
  background: var(--bg-2);
  color: var(--fg-2);
  font-size: var(--t-12);
}
.adm-menus__preview code { font-family: var(--font-mono); font-size: var(--t-11); }
</style>
