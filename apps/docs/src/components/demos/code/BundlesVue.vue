<script setup lang="ts">
import { CfCodeWorkspace, type CodeWorkspaceBundle } from '@chufix-design/vue';

// 同一个最小应用的 Vue × TS / Vue × JS / React × TS / React × JS 四种实现，
// 通过 bundles[] 一起塞进 CfCodeWorkspace。组件顶部会自动出现「框架 tab + 变体 tab」。

const vueTs = `<script setup lang="ts">
import { ref } from 'vue';
import { CfButton } from '@chufix-design/vue';

const count = ref<number>(0);
<\/script>

<template>
  <div>
    <CfButton @click="count++">count = {{ count }}</CfButton>
  </div>
</template>`;

const vueJs = `<script setup>
import { ref } from 'vue';
import { CfButton } from '@chufix-design/vue';

const count = ref(0);
<\/script>

<template>
  <div>
    <CfButton @click="count++">count = {{ count }}</CfButton>
  </div>
</template>`;

const reactTs = `import { useState } from 'react';
import { CfButton } from '@chufix-design/react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <CfButton onClick={() => setCount((c) => c + 1)}>count = {count}</CfButton>
    </div>
  );
}`;

const reactJs = `import { useState } from 'react';
import { CfButton } from '@chufix-design/react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <CfButton onClick={() => setCount((c) => c + 1)}>count = {count}</CfButton>
    </div>
  );
}`;

const bundles: CodeWorkspaceBundle[] = [
  {
    id: 'vue-ts',
    framework: 'vue',
    variant: 'ts',
    frameworkLabel: 'Vue',
    variantLabel: 'TypeScript',
    files: [{ name: 'src/Counter.vue', content: vueTs, language: 'vue' }],
  },
  {
    id: 'vue-js',
    framework: 'vue',
    variant: 'js',
    frameworkLabel: 'Vue',
    variantLabel: 'JavaScript',
    files: [{ name: 'src/Counter.vue', content: vueJs, language: 'vue' }],
  },
  {
    id: 'react-ts',
    framework: 'react',
    variant: 'ts',
    frameworkLabel: 'React',
    variantLabel: 'TypeScript',
    files: [{ name: 'src/Counter.tsx', content: reactTs, language: 'tsx' }],
  },
  {
    id: 'react-js',
    framework: 'react',
    variant: 'js',
    frameworkLabel: 'React',
    variantLabel: 'JavaScript',
    files: [{ name: 'src/Counter.jsx', content: reactJs, language: 'jsx' }],
  },
];
</script>

<template>
  <CfCodeWorkspace
    title="counter · source"
    root-label="counter"
    :bundles="bundles"
    tone="dark"
    :height="380"
  />
</template>
