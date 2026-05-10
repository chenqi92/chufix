<script setup lang="ts">
import { ref } from 'vue';
import {
  CfSplitter,
  CfTreeView,
  CfCodeEditor,
  CfDataGrid,
  CfTabs,
  CfTabPanel,
  CfButton,
  CfStatusCodeBadge,
} from '@chufix/vue';
import type { TreeNode } from '@chufix/vue';

const schema: TreeNode[] = [
  { id: 'public', label: 'public', children: [
    { id: 'users', label: 'users · 12,400 行' },
    { id: 'orders', label: 'orders · 184,200 行' },
    { id: 'payments', label: 'payments · 62,810 行' },
  ]},
  { id: 'analytics', label: 'analytics', children: [
    { id: 'events', label: 'events · 4.2M 行' },
    { id: 'sessions', label: 'sessions · 920k 行' },
  ]},
];

const sql = ref(`SELECT
  o.id,
  o.amount,
  u.email,
  p.status
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN payments p ON p.order_id = o.id
WHERE o.created_at > now() - interval '7 days'
ORDER BY o.created_at DESC
LIMIT 20;`);

const cols = [
  { key: 'id', title: 'id', dataIndex: 'id', width: 70 },
  { key: 'amount', title: 'amount', dataIndex: 'amount', width: 100 },
  { key: 'email', title: 'email', dataIndex: 'email' },
  { key: 'status', title: 'status', dataIndex: 'status', width: 110 },
];
const rows = [
  { id: '1842', amount: '¥ 480.00', email: 'jane.l@example.com', status: 200 },
  { id: '1841', amount: '¥ 1,200.00', email: 'bob@example.com', status: 200 },
  { id: '1840', amount: '¥ 88.00', email: 'alice@example.com', status: 500 },
  { id: '1839', amount: '¥ 240.00', email: 'tim@example.com', status: 200 },
  { id: '1838', amount: '¥ 3,180.00', email: 'sue@example.com', status: 200 },
  { id: '1837', amount: '¥ 96.00', email: 'kim@example.com', status: 304 },
];

const history = [
  { id: '1', sql: 'SELECT count(*) FROM orders;', when: '2m 前' },
  { id: '2', sql: 'UPDATE users SET status=...', when: '14m 前' },
];
</script>

<template>
  <div class="db">
    <CfSplitter orientation="horizontal" :first-size="220">
      <template #first>
        <div class="db__pane">
          <h3>Schema</h3>
          <CfTreeView :nodes="schema" />
        </div>
      </template>
      <template #second>
        <CfSplitter orientation="vertical" :first-size="160">
          <template #first>
            <div class="db__editor">
              <div class="db__bar">
                <CfButton variant="primary" size="sm">▶ 运行</CfButton>
                <CfButton variant="tertiary" size="sm">保存</CfButton>
                <span class="db__hint">Ctrl + Enter 运行</span>
              </div>
              <CfCodeEditor v-model="sql" language="sql" :rows="6" />
            </div>
          </template>
          <template #second>
            <CfTabs default-value="result">
              <CfTabPanel value="result" label="结果 · 6 行">
                <CfDataGrid :columns="cols" :rows="rows">
                  <template #cell-status="{ row }">
                    <CfStatusCodeBadge :code="row.status" size="sm" />
                  </template>
                </CfDataGrid>
              </CfTabPanel>
              <CfTabPanel value="history" label="历史">
                <ul class="db__hist">
                  <li v-for="h in history" :key="h.id">
                    <code>{{ h.sql }}</code>
                    <span class="db__hist-time">{{ h.when }}</span>
                  </li>
                </ul>
              </CfTabPanel>
              <CfTabPanel value="messages" label="消息">
                <pre class="db__msg">[14:32:01] Query OK · 6 rows · 38ms</pre>
              </CfTabPanel>
            </CfTabs>
          </template>
        </CfSplitter>
      </template>
    </CfSplitter>
  </div>
</template>

<style scoped>
.db {
  height: 560px;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  overflow: hidden;
  font-family: var(--font-sans);
}
.db__pane {
  padding: 12px 14px;
  height: 100%;
  overflow: auto;
}
.db__pane h3 {
  margin: 0 0 8px;
  font-size: var(--t-11);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--fg-3);
  font-weight: var(--w-medium);
}
.db__editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.db__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--line-1);
}
.db__hint {
  font-family: var(--font-mono);
  font-size: var(--t-11);
  color: var(--fg-3);
  margin-left: auto;
}
.db__hist {
  list-style: none;
  margin: 0;
  padding: 8px;
  font-size: var(--t-12);
}
.db__hist > li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 8px;
  border-radius: var(--r-3);
}
.db__hist > li:hover {
  background: var(--bg-2);
}
.db__hist code {
  font-family: var(--font-mono);
  color: var(--fg-1);
  background: transparent;
}
.db__hist-time {
  color: var(--fg-3);
  font-family: var(--font-mono);
  font-size: var(--t-11);
}
.db__msg {
  margin: 0;
  padding: 12px 16px;
  font-family: var(--font-mono);
  font-size: var(--t-12);
  color: var(--fg-2);
}
</style>
