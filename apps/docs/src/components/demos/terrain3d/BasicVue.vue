<script setup lang="ts">
import { computed, ref } from 'vue';
import { CfTerrain3D, type Terrain3DColorScale } from '@chufix-design/maps-vue';

const COLS = 96;
const ROWS = 72;

function generateRiverbed(): number[] {
  const data = new Array<number>(COLS * ROWS);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const u = c / (COLS - 1);
      const v = r / (ROWS - 1);
      const channel = Math.sin((v - 0.5) * Math.PI * 1.4) * 0.4 + (v - 0.5) * 1.2;
      const dist = u - 0.5 - channel;
      const depth = -20 - Math.exp(-dist * dist * 25) * 26;
      const dune = Math.sin(u * 16) * Math.cos(v * 14) * 1.2;
      const noise = (Math.sin(u * 53 + v * 71) + Math.cos(u * 91 - v * 37)) * 0.4;
      const bank = Math.max(0, 1 - Math.exp(-Math.abs(dist) * 4)) * 22;
      data[r * COLS + c] = depth + dune + noise + bank;
    }
  }
  return data;
}

const data = ref<number[]>(generateRiverbed());
const colorScale = ref<Terrain3DColorScale>('depth');
const exaggeration = ref(1.4);
const wireframe = ref(false);
const autoRotate = ref(true);

const picked = ref('点击地形选取采样点');

function regenerate() {
  data.value = generateRiverbed().map((v) => v + (Math.random() - 0.5) * 2);
}

function onPick(p: { x: number; y: number; z: number; row: number; col: number }) {
  const idx = p.row * COLS + p.col;
  const depth = data.value[idx];
  picked.value = `row ${p.row} · col ${p.col} · 水深 ${depth.toFixed(1)} m`;
}

const exaggLabel = computed(() => `垂直夸张 ${exaggeration.value.toFixed(1)}×`);
</script>

<template>
  <div class="t3-demo">
    <div class="t3-demo__controls">
      <label>
        <span>色阶</span>
        <select v-model="colorScale">
          <option value="depth">depth · 水深蓝</option>
          <option value="elevation">elevation · 陆地绿黄</option>
          <option value="delta">delta · 冲淤红蓝</option>
          <option value="viridis">viridis</option>
        </select>
      </label>
      <label>
        <span>{{ exaggLabel }}</span>
        <input type="range" min="0.4" max="3" step="0.1" v-model.number="exaggeration" />
      </label>
      <label class="t3-demo__check">
        <input type="checkbox" v-model="wireframe" />
        线框
      </label>
      <label class="t3-demo__check">
        <input type="checkbox" v-model="autoRotate" />
        自动旋转
      </label>
      <button type="button" class="t3-demo__btn" @click="regenerate">重新生成河床</button>
    </div>
    <CfTerrain3D
      :height-data="data"
      :width="COLS"
      :height="ROWS"
      :color-scale="colorScale"
      :exaggeration="exaggeration"
      :wireframe="wireframe"
      :auto-rotate="autoRotate"
      :renderer-height="540"
      show-grid
      @pick="onPick"
    />
    <code class="t3-demo__pick">{{ picked }}</code>
  </div>
</template>

<style scoped>
.t3-demo {
  display: grid;
  gap: 12px;
}
.t3-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: var(--r-3);
  color: var(--fg-2);
  font-size: var(--t-12);
}
.t3-demo__controls label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.t3-demo__controls select {
  height: 28px;
  padding: 0 8px;
  background: var(--bg-0);
  border: 1px solid var(--line-2);
  border-radius: var(--r-2);
  color: var(--fg-1);
  font-size: var(--t-12);
  font-family: inherit;
}
.t3-demo__controls input[type='range'] {
  width: 120px;
  accent-color: var(--accent-1);
}
.t3-demo__check {
  cursor: pointer;
}
.t3-demo__btn {
  padding: 4px 12px;
  background: var(--accent-1);
  color: var(--fg-on-accent, #fff);
  border: 0;
  border-radius: var(--r-2);
  font-size: var(--t-12);
  cursor: pointer;
  font-family: inherit;
}
.t3-demo__btn:hover {
  background: var(--accent-2);
}
.t3-demo__pick {
  align-self: start;
  padding: 6px 10px;
  background: var(--bg-inset);
  border-radius: var(--r-2);
  font-size: var(--t-12);
  color: var(--fg-2);
}
</style>
