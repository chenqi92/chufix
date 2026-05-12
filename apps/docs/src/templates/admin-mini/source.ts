// admin-mini · 最小后台管理工程。
// 早期作为「多文件 IDE 视图（预览）」的验证示例，现归入 templates 分类。
// Vue / React 源都用 TypeScript 写，JS 变体由 buildWorkspaceBundles 自动派生。

export const vueFiles: Record<string, string> = {
  'src/App.vue': `<script setup lang="ts">
import { ref } from 'vue';
import { CfAppShell, CfNavMenu } from '@chufix/vue';
import Users from './pages/Users.vue';
import Roles from './pages/Roles.vue';

type Route = 'users' | 'roles';

const active = ref<Route>('users');

const nav: Array<{ id: Route; label: string }> = [
  { id: 'users', label: '用户管理' },
  { id: 'roles', label: '角色管理' },
];
</script>

<template>
  <CfAppShell>
    <template #sidebar>
      <CfNavMenu :items="nav" v-model:active="active" />
    </template>
    <Users v-if="active === 'users'" />
    <Roles v-else />
  </CfAppShell>
</template>`,

  'src/pages/Users.vue': `<script setup lang="ts">
import { ref } from 'vue';
import { CfTable } from '@chufix/vue';

interface UserRow {
  id: number;
  name: string;
  email: string;
}

const rows = ref<UserRow[]>([
  { id: 1, name: 'Ada', email: 'ada@example.com' },
  { id: 2, name: 'Linus', email: 'linus@example.com' },
]);
</script>

<template>
  <section>
    <h2>用户管理</h2>
    <CfTable :rows="rows" />
  </section>
</template>`,

  'src/pages/Roles.vue': `<script setup lang="ts">
import { ref } from 'vue';

interface Role {
  id: string;
  name: string;
}

const roles = ref<Role[]>([
  { id: 'admin', name: '管理员' },
  { id: 'viewer', name: '只读' },
]);
</script>

<template>
  <section>
    <h2>角色管理</h2>
    <ul>
      <li v-for="role in roles" :key="role.id">{{ role.name }}</li>
    </ul>
  </section>
</template>`,
};

export const reactFiles: Record<string, string> = {
  'src/App.tsx': `import { useState } from 'react';
import { CfAppShell, CfNavMenu } from '@chufix/react';
import Users from './pages/Users';
import Roles from './pages/Roles';

type Route = 'users' | 'roles';

export default function App() {
  const [active, setActive] = useState<Route>('users');

  const nav: Array<{ id: Route; label: string }> = [
    { id: 'users', label: '用户管理' },
    { id: 'roles', label: '角色管理' },
  ];

  return (
    <CfAppShell sidebar={<CfNavMenu items={nav} active={active} onActiveChange={setActive} />}>
      {active === 'users' ? <Users /> : <Roles />}
    </CfAppShell>
  );
}`,

  'src/pages/Users.tsx': `import { useState } from 'react';
import { CfTable } from '@chufix/react';

interface UserRow {
  id: number;
  name: string;
  email: string;
}

export default function Users() {
  const [rows] = useState<UserRow[]>([
    { id: 1, name: 'Ada', email: 'ada@example.com' },
    { id: 2, name: 'Linus', email: 'linus@example.com' },
  ]);

  return (
    <section>
      <h2>用户管理</h2>
      <CfTable rows={rows} />
    </section>
  );
}`,

  'src/pages/Roles.tsx': `import { useState } from 'react';

interface Role {
  id: string;
  name: string;
}

export default function Roles() {
  const [roles] = useState<Role[]>([
    { id: 'admin', name: '管理员' },
    { id: 'viewer', name: '只读' },
  ]);

  return (
    <section>
      <h2>角色管理</h2>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>{role.name}</li>
        ))}
      </ul>
    </section>
  );
}`,
};
