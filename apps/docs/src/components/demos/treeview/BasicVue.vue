<script setup lang="ts">
import { ref } from 'vue';
import { CfTreeView, type TreeNode } from '@chufix-design/vue';

const selected = ref<string | null>('home');

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
  { key: 'readme', label: 'README.md' },
];
</script>

<template>
  <div style="border: 1px solid var(--line-1); border-radius: 8px; padding: 8px; max-width: 18rem;">
    <CfTreeView
      :nodes="nodes"
      :selected-key="selected"
      :default-expanded-keys="['src', 'components']"
      @update:selected-key="selected = $event"
    />
  </div>
</template>
