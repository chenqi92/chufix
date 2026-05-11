<script setup lang="ts">
import { CfAspectRatio } from '@chufix-design/vue';
</script>

<template>
  <div class="aspect-demo aspect-demo--basic">
    <CfAspectRatio :ratio="16 / 9">
      <div class="aspect-demo__hero">
        <span class="aspect-demo__ratio">16 / 9</span>
        <span class="aspect-demo__label">video cover</span>
      </div>
    </CfAspectRatio>
  </div>
</template>

<style scoped>
.aspect-demo {
  width: min(100%, 420px);
}

.aspect-demo__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border: 1px solid oklch(80% 0.08 230 / 45%);
  border-radius: var(--r-8);
  background:
    radial-gradient(circle at 18% 18%, oklch(85% 0.12 195 / 70%), transparent 32%),
    linear-gradient(135deg, oklch(66% 0.16 224), oklch(58% 0.18 284));
  color: white;
  box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 18%);
}

.aspect-demo__ratio {
  font-family: var(--font-mono);
  font-size: 1.75rem;
  font-weight: var(--w-semibold);
  line-height: 1;
}

.aspect-demo__label {
  font-size: var(--t-12);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.78;
}
</style>
