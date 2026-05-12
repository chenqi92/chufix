<script setup lang="ts">
import { CfIconButton, CfIcon } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row">
    <CfIconButton aria-label="通知（3 条未读）">
      <CfIcon name="bell" />
      <template #badge>3</template>
    </CfIconButton>
    <CfIconButton aria-label="邮件（99+ 封未读）">
      <CfIcon name="mail" />
      <template #badge>99+</template>
    </CfIconButton>
    <CfIconButton aria-label="收件箱（有新内容）">
      <CfIcon name="inbox" />
      <template #badge>•</template>
    </CfIconButton>
  </div>
</template>
