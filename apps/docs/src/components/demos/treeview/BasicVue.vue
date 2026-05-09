<script setup lang="ts">
import { ref } from 'vue';
import { CfTreeView, type TreeNode } from '@chufix/vue';

const selected = ref<string | null>('home');
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
          { key: 'contact', label: 'Contact.vue', disabled: true },
        ],
      },
      { key: 'main', label: 'main.ts' },
      { key: 'styles', label: 'styles.css' },
    ],
  },
  {
    key: 'public',
    label: 'public',
    children: [
      { key: 'logo', label: 'logo.svg' },
      { key: 'favicon', label: 'favicon.ico' },
    ],
  },
  { key: 'readme', label: 'README.md' },
];
</script>

<template>
  <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div style="border: 1px solid var(--line-1); border-radius: 8px; padding: 8px;">
      <CfTreeView
        :nodes="nodes"
        :selected-key="selected"
        :default-expanded-keys="['src', 'components', 'public']"
        @update:selected-key="selected = $event"
      />
    </div>
    <div style="border: 1px solid var(--line-1); border-radius: 8px; padding: 8px;">
      <CfTreeView
        v-model="checked"
        :nodes="nodes"
        checkable
        :default-expanded-keys="['src', 'components']"
      />
    </div>
  </div>
</template>
