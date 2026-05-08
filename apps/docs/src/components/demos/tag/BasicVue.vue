<script setup lang="ts">
import { ref } from 'vue';
import { Tag } from '@chukit/vue';

const tags = ref(['Vue', 'Astro', 'Tailwind']);
function remove(t: string) {
  tags.value = tags.value.filter((x) => x !== t);
}
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <Tag>Neutral</Tag>
      <Tag tone="primary">Primary</Tag>
      <Tag tone="success">Success</Tag>
      <Tag tone="warning">Warning</Tag>
      <Tag tone="danger">Danger</Tag>
      <Tag tone="info">Info</Tag>
    </div>
    <div class="demo-row">
      <Tag variant="solid" tone="primary">Solid</Tag>
      <Tag variant="soft" tone="primary">Soft</Tag>
      <Tag variant="outline" tone="primary">Outline</Tag>
      <Tag tone="success" rounded>圆角</Tag>
      <Tag size="sm" tone="info">sm</Tag>
      <Tag size="lg" tone="info">lg</Tag>
    </div>
    <div class="demo-row">
      <Tag
        v-for="t in tags"
        :key="t"
        tone="primary"
        closable
        @close="remove(t)"
      >{{ t }}</Tag>
      <Tag v-if="!tags.length" variant="outline">没了，再点会回来</Tag>
    </div>
  </div>
</template>
