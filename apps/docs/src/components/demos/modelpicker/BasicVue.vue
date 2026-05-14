<script setup lang="ts">
import { ref } from 'vue';
import { CfModelPicker, type ModelOption } from '@chufix-design/vue';

const value = ref('claude-opus-4-7');
const options: ModelOption[] = [
  {
    id: 'claude-opus-4-7',
    label: 'Claude Opus 4.7',
    provider: 'Anthropic',
    capabilities: ['vision', 'thinking'],
    contextWindow: 1_000_000,
    description: '旗舰模型，长上下文 + 推理',
  },
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    capabilities: ['vision'],
    contextWindow: 200_000,
    description: '平衡速度与能力',
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    capabilities: ['vision'],
    contextWindow: 200_000,
    description: '低延迟、高吞吐',
  },
  {
    id: 'gpt-4o',
    label: 'GPT-4o',
    provider: 'OpenAI',
    capabilities: ['vision'],
    contextWindow: 128_000,
  },
  {
    id: 'local-llama',
    label: 'Llama 3 70B',
    provider: '本地',
    capabilities: ['offline'],
    contextWindow: 32_000,
    disabled: true,
  },
];
</script>

<template>
  <div class="demo-stack">
    <CfModelPicker v-model="value" :options="options" />
    <p class="demo-hint">当前 <code>{{ value }}</code></p>
  </div>
</template>
