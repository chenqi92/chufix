<script setup lang="ts">
import { CfCol, CfRow } from '@chufix-design/vue';
</script>

<template>
  <div class="grid-demo">
    <section class="grid-concept" aria-label="24 栅格比例示意">
      <div class="grid-guide" aria-hidden="true"></div>
      <CfRow :gutter="[8, 8]">
        <CfCol :span="24"><div class="grid-block grid-block--solid">100%</div></CfCol>
        <CfCol :span="6"><div class="grid-block">25%</div></CfCol>
        <CfCol :span="6" :offset="6"><div class="grid-block">25% + offset 6</div></CfCol>
        <CfCol :span="8"><div class="grid-block">33.33%</div></CfCol>
        <CfCol :span="8" :offset="8"><div class="grid-block">33.33% + offset 8</div></CfCol>
        <CfCol :span="12"><div class="grid-block">50%</div></CfCol>
        <CfCol :span="16"><div class="grid-block">66.66%</div></CfCol>
      </CfRow>
    </section>

    <section class="grid-card">
      <CfRow :gutter="[12, 12]" align="stretch">
        <CfCol :xs="24" :md="12" :lg="8">
          <div class="panel">xs=24 / md=12 / lg=8</div>
        </CfCol>
        <CfCol :xs="24" :md="12" :lg="8">
          <div class="panel">响应式断点</div>
        </CfCol>
        <CfCol :xs="24" :md="24" :lg="8">
          <div class="panel">gutter=[12, 12]</div>
        </CfCol>
      </CfRow>
    </section>
  </div>
</template>

<style scoped>
.grid-demo {
  width: 100%;
  display: grid;
  gap: 18px;
}

.grid-concept {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line-1);
  border-radius: 8px;
  padding: 18px;
  background: var(--surface-1);
}

.grid-guide {
  position: absolute;
  inset: 18px;
  pointer-events: none;
  opacity: .8;
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--accent-1) 8%, transparent) 0,
      color-mix(in srgb, var(--accent-1) 8%, transparent) calc(100% - 8px),
      transparent calc(100% - 8px)
    );
  background-size: 4.1666666667% 100%;
}

.grid-block {
  position: relative;
  z-index: 1;
  min-height: 48px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  background: color-mix(in srgb, var(--accent-1) 68%, white);
  color: white;
  font-weight: 700;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent-1) 18%, transparent);
}

.grid-block--solid {
  background: var(--accent-1);
}

.grid-card {
  border: 1px solid var(--line-1);
  border-radius: 8px;
  padding: 16px;
  background: var(--surface-0);
}

.panel {
  height: 84px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid var(--line-1);
  background: var(--surface-1);
  color: var(--fg-1);
}
</style>
