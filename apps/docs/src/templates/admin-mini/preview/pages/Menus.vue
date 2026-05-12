<script setup lang="ts">
/**
 * 菜单管理 —— 左侧 CfTreeView 展示菜单层级，右侧 CfForm 编辑选中节点。
 * 关键 ChuFix 组件展示：
 *   - CfTreeView：层级结构、显示连接线、单选、节点图标
 *   - CfIconPicker：图标选择
 *   - CfForm + CfInput + CfNumberInput + CfSwitch + CfSelect：节点元数据
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
  CfSelect,
  CfIconPicker,
  CfButton,
  CfConfirmDialog,
  CfIcon,
  CfEmpty,
  toast,
} from '@chufix-design/vue';
import type { TreeNode } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialMenus, type MenuEntry } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const menus = ref<MenuEntry[]>(initialMenus.map((m) => ({ ...m })));
const selectedKey = ref<string | null>('m-dashboard');
const expandedKeys = ref<string[]>(['m-authz', 'm-system']);

const draft = ref<MenuEntry | null>(null);

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

const parentOptions = computed(() => [
  { value: '__root__', label: t.value.menu_no_parent },
  ...menus.value
    .filter((m) => m.parentId === null)
    .map((m) => ({ value: m.id, label: m.title })),
]);

watch(selectedKey, (key) => {
  const found = key ? menus.value.find((m) => m.id === key) : null;
  draft.value = found ? { ...found } : null;
}, { immediate: true });

function saveDraft() {
  if (!draft.value) return;
  const d = draft.value;
  if (!d.title.trim()) {
    toast.error(state.locale.value === 'zh' ? '名称必填' : 'Title is required');
    return;
  }
  menus.value = menus.value.map((m) => (m.id === d.id ? { ...d } : m));
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

function addChild() {
  if (!selectedKey.value) return;
  const parent = menus.value.find((m) => m.id === selectedKey.value);
  if (!parent || parent.parentId !== null) {
    toast.error(t.value.menu_root_only);
    return;
  }
  const nextSort = menus.value.filter((m) => m.parentId === parent.id).length + 1;
  const newMenu: MenuEntry = {
    id: `m-${Date.now().toString(36)}`,
    parentId: parent.id,
    title: state.locale.value === 'zh' ? '新菜单' : 'New menu',
    icon: 'square',
    route: '/new',
    sort: nextSort,
    visible: true,
  };
  menus.value = [...menus.value, newMenu];
  expandedKeys.value = [...new Set([...expandedKeys.value, parent.id])];
  selectedKey.value = newMenu.id;
  toast.success(state.locale.value === 'zh' ? '已新增' : 'Created');
}

function addRoot() {
  const nextSort = menus.value.filter((m) => m.parentId === null).length + 1;
  const newMenu: MenuEntry = {
    id: `m-${Date.now().toString(36)}`,
    parentId: null,
    title: state.locale.value === 'zh' ? '新一级菜单' : 'New root menu',
    icon: 'square',
    route: '',
    sort: nextSort,
    visible: true,
  };
  menus.value = [...menus.value, newMenu];
  selectedKey.value = newMenu.id;
  toast.success(state.locale.value === 'zh' ? '已新增一级菜单' : 'Created root menu');
}

const selectedIsRoot = computed(() => {
  if (!selectedKey.value) return false;
  return menus.value.find((m) => m.id === selectedKey.value)?.parentId === null;
});
</script>

<template>
  <div class="adm-page">
    <p class="adm-page__hint">{{ t.menu_hint }}</p>

    <CfSplitter orientation="horizontal" :default-size="40" unit="%" class="adm-menus">
      <template #start>
        <div class="adm-menus__tree">
          <header class="adm-menus__tree-head">
            <CfButton size="sm" variant="primary" @click="addRoot">
              + {{ state.locale.value === 'zh' ? '一级菜单' : 'Root' }}
            </CfButton>
            <CfButton
              size="sm"
              variant="tertiary"
              :disabled="!selectedIsRoot"
              @click="addChild"
            >
              {{ t.menu_add_child }}
            </CfButton>
            <CfButton
              size="sm"
              variant="danger"
              :disabled="!selectedKey"
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
              <h3>{{ draft.title || '—' }}</h3>
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
                  <CfSelect
                    :model-value="draft.parentId ?? '__root__'"
                    :disabled="true"
                    :options="parentOptions"
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
