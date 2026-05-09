<script setup lang="ts">
import { CfIcon } from '@chufix/vue';

const motions = [
  {
    icon: 'loader',
    motion: 'spin',
    label: 'spin',
    hint: '加载中',
    tone: 'primary',
  },
  {
    icon: 'circle',
    motion: 'pulse',
    label: 'pulse',
    hint: '状态呼吸',
    tone: 'success',
  },
  {
    icon: 'arrow-down',
    motion: 'bounce',
    label: 'bounce',
    hint: '引导方向',
    tone: 'warning',
  },
] as const;
</script>

<template>
  <div class="motion-demo">
    <div
      v-for="item in motions"
      :key="item.motion"
      class="motion-demo__card"
      :data-tone="item.tone"
    >
      <span class="motion-demo__preview">
        <CfIcon :name="item.icon" :motion="item.motion" size="xl" />
      </span>
      <span class="motion-demo__body">
        <strong>{{ item.label }}</strong>
        <em>{{ item.hint }}</em>
      </span>
      <code>motion="{{ item.motion }}"</code>
    </div>
  </div>
</template>

<style scoped>
.motion-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  width: min(100%, 640px);
}

.motion-demo__card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  background: var(--bg-1);
  color: var(--fg-1);
}

.motion-demo__preview {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  background: var(--bg-inset);
}

.motion-demo__card[data-tone='primary'] .motion-demo__preview { color: var(--accent-1); }
.motion-demo__card[data-tone='success'] .motion-demo__preview { color: var(--status-success); }
.motion-demo__card[data-tone='warning'] .motion-demo__preview { color: var(--status-warning); }

.motion-demo__body {
  display: grid;
  gap: 1px;
  min-width: 0;
}

.motion-demo__body strong {
  font-size: var(--t-13);
  line-height: 1.2;
}

.motion-demo__body em {
  color: var(--fg-3);
  font-size: var(--t-12);
  font-style: normal;
}

.motion-demo__card code {
  grid-column: 1 / -1;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
