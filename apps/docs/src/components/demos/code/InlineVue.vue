<script setup lang="ts">
import { CfInlineCode } from '@chufix-design/vue';
</script>

<template>
  <div style="display:flex; flex-direction:column; gap: 8px;">
    <p>常用包：<CfInlineCode>@chufix-design/vue</CfInlineCode>、<CfInlineCode>@chufix-design/react</CfInlineCode>、<CfInlineCode>@chufix-design/tokens</CfInlineCode>。</p>
    <p>命令：<CfInlineCode>pnpm dev</CfInlineCode> 启动开发服务器。</p>
    <p>小号：<CfInlineCode size="sm">--config</CfInlineCode> 是命令行参数。</p>
  </div>
</template>
