<script setup lang="ts">
import { CfButton, toast } from '@chufix-design/vue';

type Pos =
  | 'top-right' | 'top-left' | 'top-center'
  | 'bottom-right' | 'bottom-left' | 'bottom-center';

function show(p: Pos) {
  toast({ title: `Toast at ${p}`, description: '本站全局 Toaster 固定 top-right；改 position 需要在你自己的应用里配置。' });
}
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <CfButton variant="tertiary" @click="show('top-left')">top-left</CfButton>
      <CfButton variant="tertiary" @click="show('top-center')">top-center</CfButton>
      <CfButton variant="tertiary" @click="show('top-right')">top-right</CfButton>
      <CfButton variant="tertiary" @click="show('bottom-left')">bottom-left</CfButton>
      <CfButton variant="tertiary" @click="show('bottom-center')">bottom-center</CfButton>
      <CfButton variant="tertiary" @click="show('bottom-right')">bottom-right</CfButton>
    </div>
    <p class="demo-hint">提示：本站只挂了一个 <code>Toaster</code> 在 <code>top-right</code>，按钮全部都会从这个位置弹出。在你自己的应用里把 <code>&lt;Toaster position="..."/&gt;</code> 改成对应值即可。</p>
  </div>
</template>
