<script setup lang="ts">
import { CfButton, CfIcon } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row">
    <CfButton variant="primary" shape="square" aria-label="搜索">
      <CfIcon name="search" />
    </CfButton>
    <CfButton variant="secondary" shape="square" aria-label="复制到剪贴板">
      <CfIcon name="copy" />
    </CfButton>
    <CfButton variant="tertiary" shape="square" aria-label="删除">
      <CfIcon name="trash" />
    </CfButton>
  </div>
</template>
