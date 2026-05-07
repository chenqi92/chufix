<script setup lang="ts">
import { Card, Button } from '@chukit/vue';
</script>

<template>
  <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); width: 100%;">
    <Card variant="outlined">
      <template #header>Outlined</template>
      默认边框 + 微弱阴影，适合表单分组与设置面板。
      <template #footer>
        <Button size="sm" variant="ghost">取消</Button>
        <Button size="sm">确认</Button>
      </template>
    </Card>

    <Card variant="elevated">
      <template #header>Elevated</template>
      去掉边框、提升阴影，适合卡片网格首页。
    </Card>

    <Card variant="filled" interactive @click="() => alert('clicked')">
      <template #header>Filled · 可点击</template>
      整张卡片作为入口，hover 上浮。
    </Card>
  </div>
</template>
