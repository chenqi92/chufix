<script setup lang="ts">
import { CfChatBubble } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack" style="gap: 4px;">
    <CfChatBubble
      role="user"
      content="帮我把这段 SQL 优化一下，加索引提示和 EXPLAIN 输出。"
      :author="{ name: 'Yifan' }"
      :timestamp="new Date()"
    />
    <CfChatBubble
      role="assistant"
      :author="{ name: 'Claude' }"
      :timestamp="new Date()"
    >
      可以在 <code>user_id</code> 和 <code>created_at</code> 上加一个复合索引；
      下面的 EXPLAIN 已经能命中索引扫描，扫描行数从 320k 降到 12 行。
    </CfChatBubble>
    <CfChatBubble role="assistant" state="streaming" :author="{ name: 'Claude' }">
      正在生成…
    </CfChatBubble>
    <CfChatBubble role="assistant" state="error" :author="{ name: 'Claude' }" />
    <CfChatBubble role="system" content="此对话已开启 Web 搜索能力。" />
  </div>
</template>
