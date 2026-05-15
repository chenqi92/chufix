<script setup lang="ts">
import { ref } from 'vue';
import { CfQueryBuilder, type QueryField, type QueryGroup } from '@chufix-design/vue';

const fields: QueryField[] = [
  { key: 'name', label: '姓名', type: 'string' },
  { key: 'age', label: '年龄', type: 'number' },
  { key: 'created_at', label: '创建时间', type: 'date' },
  { key: 'active', label: '激活', type: 'boolean' },
  {
    key: 'role',
    label: '角色',
    type: 'enum',
    options: [
      { value: 'admin', label: '管理员' },
      { value: 'editor', label: '编辑' },
      { value: 'viewer', label: '只读' },
    ],
  },
];

const query = ref<QueryGroup>({
  combinator: 'AND',
  conditions: [
    { id: 'c1', field: 'name', operator: 'contains', value: 'ali' },
    { id: 'c2', field: 'age', operator: 'gte', value: 18 },
  ],
});
</script>

<template>
  <div class="qb-demo">
    <CfQueryBuilder
      :fields="fields"
      :model-value="query"
      @update:model-value="query = $event"
    />
    <pre class="qb-demo__json">{{ JSON.stringify(query, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.qb-demo {
  display: grid;
  gap: 10px;
}
.qb-demo__json {
  margin: 0;
  padding: 10px 12px;
  background: var(--bg-inset);
  border-radius: var(--r-2);
  font-size: var(--t-12);
  color: var(--fg-2);
  overflow: auto;
}
</style>
