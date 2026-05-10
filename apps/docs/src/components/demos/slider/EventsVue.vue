<script setup lang="ts">
import { ref } from 'vue';
import { CfBadge, CfSlider, type SliderChangeMeta } from '@chufix-design/vue';

const cpu = ref(40);
const phase = ref('idle');
const logs = ref(['拖动或用键盘调整滑块，会记录 change 与 changeEnd。']);

function push(kind: string, value: number, meta: SliderChangeMeta) {
  phase.value = kind;
  logs.value = [
    `${kind}: value=${value} / source=${meta.source}`,
    ...logs.value,
  ].slice(0, 5);
}
</script>

<template>
  <div class="slider-events">
    <CfSlider
      v-model="cpu"
      :min="0"
      :max="100"
      :step="5"
      ticks
      show-value
      @change="(value, meta) => push('change', value, meta)"
      @change-end="(value, meta) => push('changeEnd', value, meta)"
    />
    <div class="slider-events__status">
      <CfBadge tone="info" :content="phase" />
      <span>CPU 预留 {{ cpu }}%</span>
    </div>
    <div class="slider-events__log" aria-live="polite">
      <code v-for="entry in logs" :key="entry">{{ entry }}</code>
    </div>
  </div>
</template>

<style scoped>
.slider-events {
  display: grid;
  gap: 12px;
  width: min(100%, 620px);
}

.slider-events__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.slider-events__log {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.slider-events__log code {
  white-space: normal;
}
</style>
