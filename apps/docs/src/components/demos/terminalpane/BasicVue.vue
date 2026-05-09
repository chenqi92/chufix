<script setup lang="ts">
import { CfTerminalPane, CfAnsiText } from '@chufix/vue';
const sample = '\x1b[32m✓\x1b[0m build succeeded\n\x1b[33m⚠\x1b[0m  warning: 3 unused exports\n\x1b[36m→\x1b[0m running tests…\n';
</script>

<template>
  <div style="height: 280px;">
    <CfTerminalPane>
      <template #panel-terminal><p style="color: var(--fg-2);">完整终端面板槽，可对接 xterm.js。</p></template>
      <template #panel-output>
        <CfAnsiText :text="sample" />
      </template>
      <template #panel-commandline><p style="color: var(--fg-2);">命令输入行 + 历史。</p></template>
    </CfTerminalPane>
  </div>
</template>
