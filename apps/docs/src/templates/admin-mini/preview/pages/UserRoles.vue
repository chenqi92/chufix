<script setup lang="ts">
import { computed, h, inject, ref } from 'vue';
import { CfTable, CfTag, CfButton, CfModal, CfCheckbox } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import {
  initialUsers,
  initialRoles,
  initialUserRoles,
  type AdminUser,
  type UserRoleLink,
} from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const links = ref<UserRoleLink[]>(initialUserRoles.map((l) => ({ ...l, roleIds: [...l.roleIds] })));

function rolesFor(userId: number): string[] {
  return links.value.find((l) => l.userId === userId)?.roleIds ?? [];
}
function roleName(id: string): string {
  return initialRoles.find((r) => r.id === id)?.name ?? id;
}

const dialogOpen = ref(false);
const editingUser = ref<AdminUser | null>(null);
const draft = ref<Set<string>>(new Set());

function openAssign(u: AdminUser) {
  editingUser.value = u;
  draft.value = new Set(rolesFor(u.id));
  dialogOpen.value = true;
}
function toggleRole(roleId: string) {
  if (draft.value.has(roleId)) draft.value.delete(roleId);
  else draft.value.add(roleId);
  draft.value = new Set(draft.value);
}
function saveAssign() {
  if (!editingUser.value) return;
  const uid = editingUser.value.id;
  const next = [...draft.value];
  const exists = links.value.some((l) => l.userId === uid);
  links.value = exists
    ? links.value.map((l) => (l.userId === uid ? { ...l, roleIds: next } : l))
    : [...links.value, { userId: uid, roleIds: next }];
  dialogOpen.value = false;
}

const cols = computed(() => [
  { key: 'username', title: t.value.col_username, dataIndex: 'username', width: 110 },
  { key: 'name', title: t.value.col_name, dataIndex: 'name', width: 140 },
  {
    key: 'roles', title: t.value.col_user_roles, dataIndex: 'id',
    render: (v: unknown) => {
      const ids = rolesFor(v as number);
      if (!ids.length) {
        return h('span', { style: 'color: var(--fg-3);' }, '—');
      }
      return h('div', { style: 'display: inline-flex; gap: 4px; flex-wrap: wrap;' },
        ids.map((id) =>
          h(CfTag, { size: 'sm', variant: 'soft', tone: 'primary' }, () => roleName(id)),
        ),
      );
    },
  },
  {
    key: 'assign', title: t.value.col_assign, dataIndex: 'id', width: 110, align: 'right' as const,
    render: (_v: unknown, row: AdminUser) =>
      h(CfButton, { size: 'sm', variant: 'tertiary', onClick: () => openAssign(row) }, () => t.value.edit),
  },
]);
</script>

<template>
  <div class="adm-page">
    <CfTable :columns="cols" :rows="initialUsers" :row-key="(r: AdminUser) => r.id" size="sm" />

    <CfModal
      v-model:open="dialogOpen"
      :title="editingUser ? `${editingUser.name} · ${t.col_assign}` : t.col_assign"
      :ok-text="t.save"
      :cancel-text="t.cancel"
      :on-before-ok="() => { saveAssign(); return true; }"
      size="sm"
    >
      <div class="adm-assign">
        <label v-for="r in initialRoles" :key="r.id" class="adm-assign__row">
          <CfCheckbox :model-value="draft.has(r.id)" @update:modelValue="toggleRole(r.id)" />
          <span class="adm-assign__name">{{ r.name }}</span>
          <span class="adm-assign__desc">{{ r.description }}</span>
        </label>
      </div>
    </CfModal>
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
.adm-assign { display: flex; flex-direction: column; gap: 8px; }
.adm-assign__row {
  display: grid;
  grid-template-columns: 22px 120px 1fr;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--r-4);
  cursor: pointer;
}
.adm-assign__row:hover { background: var(--bg-2); }
.adm-assign__name { font-weight: var(--w-medium); color: var(--fg-1); }
.adm-assign__desc { color: var(--fg-3); font-size: var(--t-12); }
</style>
