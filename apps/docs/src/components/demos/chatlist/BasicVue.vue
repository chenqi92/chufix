<script setup lang="ts">
import { ref } from 'vue';
import { CfChatList, CfChatBubble, CfButton } from '@chufix-design/vue';

interface Msg { id: number; role: 'user' | 'assistant'; content: string; }

const messages = ref<Msg[]>([
  { id: 1, role: 'user', content: '帮我列出 ChuFix UI 的所有图表组件。' },
  { id: 2, role: 'assistant', content: '当前共有 28 种图表，包含 LineChart / AreaChart / BarChart / DonutChart / Treemap / SankeyDiagram 等。' },
  { id: 3, role: 'user', content: '它们都支持鼠标事件吗？' },
  { id: 4, role: 'assistant', content: '是的，全部支持 item-enter / item-leave / click 等事件，部分支持 node / link / vertex 级别事件。' },
]);

function appendOne() {
  messages.value.push({
    id: Date.now(),
    role: 'assistant',
    content: '已新增一条消息 — 列表会自动滚到底部（如果你之前在底部）。',
  });
}
</script>

<template>
  <div class="demo-stack">
    <CfChatList style="height: 320px; border: 1px solid var(--line-1); border-radius: var(--r-4);">
      <CfChatBubble
        v-for="m in messages"
        :key="m.id"
        :role="m.role"
        :content="m.content"
        :author="{ name: m.role === 'user' ? '我' : 'Claude' }"
      />
    </CfChatList>
    <CfButton size="sm" variant="tertiary" @click="appendOne">新增一条消息</CfButton>
  </div>
</template>
