<script setup lang="ts">
import { ref } from 'vue';
import { CfCard } from '@chufix/vue';

const clicked = ref(0);
</script>

<template>
  <CfCard
    variant="outlined"
    interactive
    style="max-width: 22rem;"
    @click="clicked++"
  >
    <template #header>整卡可点击</template>
    <p style="margin: 0;">把 <code>interactive</code> 打开后，整张卡片成为按钮。键盘 Enter 也可触发。</p>
    <template #footer>
      已点击 <strong>{{ clicked }}</strong> 次
    </template>
  </CfCard>
</template>
