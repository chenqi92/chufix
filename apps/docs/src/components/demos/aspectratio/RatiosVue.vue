<script setup lang="ts">
import { CfAspectRatio } from '@chufix/vue';

const ratios = [
  { ratio: 21 / 9, label: '21 / 9', hint: '影院', tone: 'blue' },
  { ratio: 16 / 9, label: '16 / 9', hint: '视频', tone: 'cyan' },
  { ratio: 4 / 3, label: '4 / 3', hint: '旧屏', tone: 'amber' },
  { ratio: 1, label: '1 / 1', hint: '方形', tone: 'green' },
  { ratio: 3 / 4, label: '3 / 4', hint: '人像', tone: 'pink' },
  { ratio: 9 / 16, label: '9 / 16', hint: '短视频', tone: 'orange' },
];
</script>

<template>
  <div class="aspect-ratios">
    <div v-for="r in ratios" :key="r.label" class="aspect-ratios__item">
      <CfAspectRatio :ratio="r.ratio">
        <div class="aspect-ratios__card" :data-tone="r.tone">
          <strong>{{ r.label }}</strong>
          <span>{{ r.hint }}</span>
        </div>
      </CfAspectRatio>
    </div>
  </div>
</template>

<style scoped>
.aspect-ratios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
  gap: 0.85rem;
  width: min(100%, 720px);
}

.aspect-ratios__item {
  min-width: 0;
}

.aspect-ratios__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border: 1px solid var(--line-1);
  border-radius: var(--r-8);
  background: var(--bg-1);
  color: var(--fg-1);
  box-shadow: var(--shadow-1);
}

.aspect-ratios__card strong {
  font-family: var(--font-mono);
  font-size: var(--t-14);
  line-height: 1;
}

.aspect-ratios__card span {
  font-size: var(--t-12);
  color: var(--fg-2);
}

.aspect-ratios__card[data-tone='blue'] { background: linear-gradient(135deg, oklch(95% 0.03 225), oklch(88% 0.05 265)); }
.aspect-ratios__card[data-tone='cyan'] { background: linear-gradient(135deg, oklch(95% 0.04 195), oklch(89% 0.05 225)); }
.aspect-ratios__card[data-tone='amber'] { background: linear-gradient(135deg, oklch(96% 0.04 78), oklch(90% 0.06 52)); }
.aspect-ratios__card[data-tone='green'] { background: linear-gradient(135deg, oklch(95% 0.04 148), oklch(89% 0.05 176)); }
.aspect-ratios__card[data-tone='pink'] { background: linear-gradient(135deg, oklch(96% 0.04 340), oklch(90% 0.06 15)); }
.aspect-ratios__card[data-tone='orange'] { background: linear-gradient(135deg, oklch(96% 0.04 62), oklch(90% 0.06 36)); }
</style>
