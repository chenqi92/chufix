<script setup lang="ts">
import { computed, inject, h, ref } from 'vue';
import {
  CfTable,
  CfTag,
  CfButton,
  CfModal,
  CfForm,
  CfFormField,
  CfInput,
  CfSelect,
  CfSearchInput,
} from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialUsers, type AdminUser } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const rows = ref<AdminUser[]>(initialUsers.map((u) => ({ ...u })));
const search = ref('');
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((r) =>
    [r.username, r.name, r.email, r.phone].some((v) => v.toLowerCase().includes(q)),
  );
});

const dialogOpen = ref(false);
const editing = ref<AdminUser | null>(null);
const form = ref<Pick<AdminUser, 'username' | 'name' | 'email' | 'phone' | 'status'>>({
  username: '',
  name: '',
  email: '',
  phone: '',
  status: 'active',
});

function openCreate() {
  editing.value = null;
  form.value = { username: '', name: '', email: '', phone: '', status: 'active' };
  dialogOpen.value = true;
}
function openEdit(row: AdminUser) {
  editing.value = row;
  form.value = {
    username: row.username,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
  };
  dialogOpen.value = true;
}
function remove(row: AdminUser) {
  rows.value = rows.value.filter((r) => r.id !== row.id);
}
function save() {
  if (editing.value) {
    const id = editing.value.id;
    rows.value = rows.value.map((r) => (r.id === id ? { ...r, ...form.value } : r));
  } else {
    const nextId = (rows.value.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
    rows.value = [
      ...rows.value,
      { id: nextId, ...form.value, createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ') },
    ];
  }
  dialogOpen.value = false;
}

const cols = computed(() => [
  { key: 'id',        title: t.value.col_id,         dataIndex: 'id',        width: 60  },
  { key: 'username',  title: t.value.col_username,   dataIndex: 'username',  width: 110 },
  { key: 'name',      title: t.value.col_name,       dataIndex: 'name',      width: 140 },
  { key: 'email',     title: t.value.col_email,      dataIndex: 'email' },
  { key: 'phone',     title: t.value.col_phone,      dataIndex: 'phone',     width: 130 },
  {
    key: 'status', title: t.value.status, dataIndex: 'status', width: 90,
    render: (v: unknown) =>
      h(CfTag,
        { size: 'sm', tone: v === 'active' ? 'success' : 'danger', variant: 'soft' },
        () => (v === 'active' ? t.value.status_active : t.value.status_disabled)),
  },
  { key: 'createdAt', title: t.value.col_created_at, dataIndex: 'createdAt', width: 160 },
  {
    key: 'actions', title: t.value.actions, dataIndex: 'id', width: 130, align: 'right' as const,
    render: (_v: unknown, row: AdminUser) =>
      h('div', { style: 'display: inline-flex; gap: 4px; justify-content: flex-end;' }, [
        h(CfButton, { size: 'sm', variant: 'tertiary', onClick: () => openEdit(row) }, () => t.value.edit),
        h(CfButton, { size: 'sm', variant: 'danger', onClick: () => remove(row) }, () => t.value.delete),
      ]),
  },
]);
</script>

<template>
  <div class="adm-page">
    <header class="adm-page__head">
      <div class="adm-page__head-left">
        <CfSearchInput v-model="search" :placeholder="t.search" size="sm" style="width: 220px;" />
        <span class="adm-page__count">{{ t.total_rows.replace('{n}', String(filtered.length)) }}</span>
      </div>
      <CfButton variant="primary" size="sm" @click="openCreate">+ {{ t.create }}</CfButton>
    </header>

    <CfTable :columns="cols" :rows="filtered" :row-key="(r: AdminUser) => r.id" size="sm" />

    <CfModal
      v-model:open="dialogOpen"
      :title="editing ? t.edit : t.create"
      :ok-text="t.save"
      :cancel-text="t.cancel"
      :on-before-ok="() => { save(); return true; }"
      size="md"
    >
      <CfForm :model="form" layout="vertical">
        <CfFormField :label="t.col_username" name="username">
          <CfInput v-model="form.username" :placeholder="t.col_username" />
        </CfFormField>
        <CfFormField :label="t.col_name" name="name">
          <CfInput v-model="form.name" :placeholder="t.col_name" />
        </CfFormField>
        <CfFormField :label="t.col_email" name="email">
          <CfInput v-model="form.email" type="email" :placeholder="t.col_email" />
        </CfFormField>
        <CfFormField :label="t.col_phone" name="phone">
          <CfInput v-model="form.phone" :placeholder="t.col_phone" />
        </CfFormField>
        <CfFormField :label="t.status" name="status">
          <CfSelect
            v-model="form.status"
            :options="[
              { value: 'active', label: t.status_active },
              { value: 'disabled', label: t.status_disabled },
            ]"
          />
        </CfFormField>
      </CfForm>
    </CfModal>
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
.adm-page__head-left { display: inline-flex; align-items: center; gap: 12px; }
.adm-page__count { color: var(--fg-3); font-size: var(--t-12); }
</style>
