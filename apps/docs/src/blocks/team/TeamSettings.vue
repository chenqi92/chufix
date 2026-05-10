<script setup lang="ts">
import { ref } from 'vue';
import {
  CfButton,
  CfDataGrid,
  CfAvatar,
  CfTag,
  CfInput,
  CfSelect,
  CfDropdown,
  CfIconButton,
} from '@chufix-design/vue';

const inviteEmail = ref('');
const inviteRole = ref('member');
const roleOptions = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Viewer', value: 'viewer' },
];

const cols = [
  { key: 'user', title: '成员', dataIndex: 'user' },
  { key: 'role', title: '角色', dataIndex: 'role', width: 110 },
  { key: 'status', title: '状态', dataIndex: 'status', width: 110 },
  { key: 'joined', title: '加入', dataIndex: 'joined', width: 120 },
  { key: 'actions', title: '', dataIndex: 'actions', width: 60 },
];
const rows = [
  { id: '1', name: 'Jane Liu', email: 'jane.l@example.com', avatar: 'JL', role: 'owner', status: 'active', joined: '2024-03-12' },
  { id: '2', name: 'Bob Lin', email: 'bob@example.com', avatar: 'BL', role: 'admin', status: 'active', joined: '2024-04-08' },
  { id: '3', name: 'Alice Chen', email: 'alice@example.com', avatar: 'AC', role: 'member', status: 'active', joined: '2024-09-22' },
  { id: '4', name: 'Tim Wong', email: 'tim@example.com', avatar: 'TW', role: 'member', status: 'pending', joined: '—' },
  { id: '5', name: 'Sue Zhang', email: 'sue@example.com', avatar: 'SZ', role: 'viewer', status: 'active', joined: '2025-02-14' },
];

const memberActions = [
  { label: '修改角色', value: 'role' },
  { label: '重发邀请', value: 'resend' },
  { separator: true },
  { label: '移除成员', value: 'remove', danger: true },
];

function invite() {
  if (!inviteEmail.value) return;
  alert(`邀请 ${inviteEmail.value} 作为 ${inviteRole.value}`);
  inviteEmail.value = '';
}
</script>

<template>
  <div class="team">
    <header class="team__head">
      <h2>团队成员</h2>
      <p>{{ rows.length }} 个成员 · {{ rows.filter(r => r.status === 'pending').length }} 个待加入</p>
    </header>

    <section class="team__invite">
      <CfInput v-model="inviteEmail" placeholder="输入邮箱邀请新成员…" />
      <CfSelect v-model="inviteRole" :options="roleOptions" />
      <CfButton variant="primary" :disabled="!inviteEmail" @click="invite">邀请</CfButton>
    </section>

    <section class="team__list">
      <CfDataGrid :columns="cols" :rows="rows">
        <template #cell-user="{ row }">
          <div class="team__user">
            <CfAvatar size="sm">{{ row.avatar }}</CfAvatar>
            <div class="team__user-info">
              <div class="team__user-name">{{ row.name }}</div>
              <div class="team__user-mail">{{ row.email }}</div>
            </div>
          </div>
        </template>
        <template #cell-role="{ row }">
          <CfTag :tone="row.role === 'owner' ? 'accent' : row.role === 'admin' ? 'info' : 'default'" size="sm">
            {{ row.role }}
          </CfTag>
        </template>
        <template #cell-status="{ row }">
          <CfTag :tone="row.status === 'active' ? 'success' : 'warning'" size="sm">
            {{ row.status === 'active' ? '已加入' : '待加入' }}
          </CfTag>
        </template>
        <template #cell-actions="{ row }">
          <CfDropdown :items="memberActions" @select="(v) => alert(`${v} on ${row.email}`)">
            <CfIconButton aria-label="更多">⋯</CfIconButton>
          </CfDropdown>
        </template>
      </CfDataGrid>
    </section>
  </div>
</template>

<style scoped>
.team {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: var(--font-sans);
}
.team__head h2 {
  margin: 0;
  font-size: var(--t-22);
  font-weight: var(--w-medium);
  color: var(--fg-1);
}
.team__head p {
  margin: 4px 0 0;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.team__invite {
  display: grid;
  grid-template-columns: 1fr 160px auto;
  gap: 8px;
  padding: 12px;
  background: var(--bg-2);
  border-radius: var(--r-6);
}
.team__user {
  display: flex;
  align-items: center;
  gap: 8px;
}
.team__user-name {
  color: var(--fg-1);
  font-weight: var(--w-medium);
  font-size: var(--t-13);
}
.team__user-mail {
  color: var(--fg-3);
  font-family: var(--font-mono);
  font-size: var(--t-11);
}
</style>
