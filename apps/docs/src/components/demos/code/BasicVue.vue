<script setup lang="ts">
import { CfInlineCode, CfCodeBlock } from '@chufix/vue';

const code = `import { CfButton } from '@chufix/vue';

export function Hello() {
  return <CfButton>Click me</CfButton>;
}`;
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px;">
    <p>用 <CfInlineCode>npm i @chufix/vue</CfInlineCode> 安装。</p>
    <CfCodeBlock :code="code" language="tsx" title="hello.tsx" />
  </div>
</template>
