<script setup lang="ts">
import { CfInlineCode, CfCodeBlock } from '@chufix/vue';

const code = `import { CfButton } from '@chufix/vue';

export function Hello() {
  return <CfButton>Click me</CfButton>;
}`;
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 12px;">
    <p>
      行内代码示例：用 <CfInlineCode>npm i @chufix/vue</CfInlineCode> 安装组件库，
      然后从 <CfInlineCode>@chufix/vue</CfInlineCode> 引入即可。
    </p>
    <CfCodeBlock :code="code" language="tsx" title="hello.tsx" show-line-numbers />
  </div>
</template>
