<script setup lang="ts">
import { ref } from 'vue';
import { CfTreeView, type TreeNode } from '@chufix-design/vue';

const checked = ref<string[]>(['styles']);

const nodes: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      {
        key: 'components',
        label: 'components',
        children: [
          { key: 'home', label: 'Home.vue' },
          { key: 'about', label: 'About.vue' },
        ],
      },
      { key: 'main', label: 'main.ts' },
      { key: 'styles', label: 'styles.css' },
    ],
  },
  { key: 'readme', label: 'README.md' },
];
</script>

<template>
  <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div style="border: 1px solid var(--line-1); border-radius: 8px; padding: 8px;">
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">cascade = true（默认）</div>
      <CfTreeView
        v-model="checked"
        :nodes="nodes"
        checkable
        :default-expanded-keys="['src', 'components']"
      />
    </div>
    <div style="border: 1px solid var(--line-1); border-radius: 8px; padding: 8px;">
      <div style="font-size: 12px; color: var(--fg-3); margin-bottom: 4px;">cascade = false</div>
      <CfTreeView
        v-model="checked"
        :nodes="nodes"
        checkable
        :cascade="false"
        :default-expanded-keys="['src', 'components']"
      />
    </div>
  </div>
</template>
