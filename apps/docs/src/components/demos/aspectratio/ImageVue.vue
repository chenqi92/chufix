<script setup lang="ts">
import { CfAspectRatio } from '@chufix/vue';
</script>

<template>
  <div class="aspect-media">
    <CfAspectRatio :ratio="16 / 9">
      <div class="aspect-media__frame">
        <div class="aspect-media__sky" />
        <div class="aspect-media__mountain aspect-media__mountain--back" />
        <div class="aspect-media__mountain aspect-media__mountain--front" />
        <div class="aspect-media__caption">
          <strong>media fills the frame</strong>
          <span>img / video / iframe</span>
        </div>
      </div>
    </CfAspectRatio>
  </div>
</template>

<style scoped>
.aspect-media {
  width: min(100%, 480px);
}

.aspect-media__frame {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line-1);
  border-radius: var(--r-8);
  background: linear-gradient(180deg, oklch(92% 0.04 220), oklch(82% 0.06 190));
  box-shadow: var(--shadow-1);
}

.aspect-media__sky {
  position: absolute;
  top: 16%;
  left: 14%;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: oklch(98% 0.05 86 / 86%);
}

.aspect-media__mountain {
  position: absolute;
  right: -8%;
  bottom: -20%;
  width: 72%;
  height: 68%;
  border-radius: 22% 0 0 0;
  transform: rotate(35deg);
  transform-origin: bottom right;
}

.aspect-media__mountain--back {
  right: 12%;
  bottom: -28%;
  background: oklch(68% 0.09 205 / 78%);
}

.aspect-media__mountain--front {
  background: oklch(48% 0.12 214 / 88%);
}

.aspect-media__caption {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  display: inline-flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid oklch(100% 0 0 / 24%);
  border-radius: var(--r-6);
  background: oklch(20% 0.04 250 / 72%);
  color: white;
  backdrop-filter: blur(8px);
}

.aspect-media__caption strong {
  font-size: var(--t-13);
  line-height: 1.2;
}

.aspect-media__caption span {
  font-family: var(--font-mono);
  font-size: var(--t-11);
  opacity: 0.72;
}
</style>
