<script setup lang="ts">
import { CfButton, CfEmpty } from '@chufix-design/vue';

const image = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
  <rect x="26" y="34" width="108" height="82" rx="14" fill="#EEF6FF" stroke="#8BBDF8" stroke-width="4"/>
  <path d="M48 58h64M48 78h42M48 98h56" stroke="#2F7DDD" stroke-width="7" stroke-linecap="round"/>
  <circle cx="118" cy="112" r="22" fill="#EAFBF1" stroke="#20A464" stroke-width="4"/>
  <path d="M108 112l7 7 14-16" stroke="#10824D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`)}`;
</script>

<template>
  <div style="width: 100%; max-width: 34rem;">
    <CfEmpty
      title="还没有发布记录"
      description="可以用 image 传入产品自己的插画，也可以继续用 icon 插槽替换为 SVG / Icon。"
      :image="image"
      image-alt=""
      size="lg"
    >
      <template #action>
        <CfButton variant="primary" size="sm">创建发布记录</CfButton>
      </template>
    </CfEmpty>
  </div>
</template>
