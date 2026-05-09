<script setup lang="ts">
import { ref } from 'vue';
import { CfTreeView, type TreeNode } from '@chufix/vue';

const a = ref<string | null>('main');
const b = ref<string | null>('main');
const c = ref<string | null>('main');

const nodes: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      { key: 'main', label: 'main.ts' },
      { key: 'app', label: 'App.vue' },
    ],
  },
  { key: 'package', label: 'package.json' },
];
</script>

<template>
  <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
    <div style="border: 1px solid var(--line-1); border-radius: 8px; padding: 8px;">
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = sm</div>
      <CfTreeView size="sm" :nodes="nodes" :selected-key="a" :default-expanded-keys="['src']" @update:selected-key="a = $event" />
    </div>
    <div style="border: 1px solid var(--line-1); border-radius: 8px; padding: 8px;">
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = md</div>
      <CfTreeView size="md" :nodes="nodes" :selected-key="b" :default-expanded-keys="['src']" @update:selected-key="b = $event" />
    </div>
    <div style="border: 1px solid var(--line-1); border-radius: 8px; padding: 8px;">
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">size = lg</div>
      <CfTreeView size="lg" :nodes="nodes" :selected-key="c" :default-expanded-keys="['src']" @update:selected-key="c = $event" />
    </div>
  </div>
</template>
