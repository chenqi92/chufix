<script setup lang="ts">
import { computed, inject } from 'vue';
import { CfTable } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from '../state';
import { initialDict, type DictItem } from '../mock';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

interface DictNode extends DictItem {
  children?: DictNode[];
}

const tree = computed<DictNode[]>(() => {
  const byParent = new Map<string | null, DictItem[]>();
  for (const item of initialDict) {
    const arr = byParent.get(item.parentId) ?? [];
    arr.push(item);
    byParent.set(item.parentId, arr);
  }
  const roots = byParent.get(null) ?? [];
  return roots.map((r) => ({ ...r, children: byParent.get(r.id) ?? [] }));
});

const cols = computed(() => [
  { key: 'label',  title: t.value.col_dict_label,  dataIndex: 'label',  width: 220 },
  { key: 'value',  title: t.value.col_dict_value,  dataIndex: 'value',  width: 200 },
  { key: 'remark', title: t.value.col_dict_remark, dataIndex: 'remark' },
]);
</script>

<template>
  <div class="adm-page">
    <CfTable
      :columns="cols"
      :rows="tree"
      :row-key="(r: DictNode) => r.id"
      :default-expanded-row-keys="tree.map(n => n.id)"
      size="sm"
    />
  </div>
</template>

<style scoped>
.adm-page { display: flex; flex-direction: column; gap: 12px; }
</style>
