<script setup lang="ts">
import { ref } from 'vue';
import { Textarea } from '@chukit/vue';

const note = ref('');
const bio = ref('一个简短的自我介绍。');
</script>

<template>
  <div class="demo-stack">
    <Textarea
      v-model="note"
      placeholder="说点什么…"
      :rows="3"
      :maxlength="120"
      show-count
    />
    <Textarea
      v-model="bio"
      variant="filled"
      auto-resize
      placeholder="自动撑高的多行输入"
    />
  </div>
</template>
