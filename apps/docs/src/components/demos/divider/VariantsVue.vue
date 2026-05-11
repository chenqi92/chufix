<script setup lang="ts">
import { CfDivider } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-stack" style="width: 100%; max-width: 28rem;">
    <CfDivider variant="solid">solid 实线（默认）</CfDivider>
    <CfDivider variant="dashed">dashed 虚线</CfDivider>
    <CfDivider variant="dotted">dotted 点线</CfDivider>
  </div>
</template>
