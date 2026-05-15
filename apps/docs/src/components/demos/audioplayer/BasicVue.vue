<script setup lang="ts">
import { CfAudioPlayer } from '@chufix-design/vue';

const peaks: number[] = Array.from({ length: 160 }, (_, i) => {
  const a = Math.sin(i * 0.18) * 0.4;
  const b = Math.sin(i * 0.07) * 0.35;
  return Math.min(1, Math.abs(a + b) + 0.15 + Math.random() * 0.05);
});
</script>

<template>
  <CfAudioPlayer
    src="https://cdn.jsdelivr.net/npm/sample-audio-file@1.0.0/sample.mp3"
    :peaks="peaks"
  />
</template>
