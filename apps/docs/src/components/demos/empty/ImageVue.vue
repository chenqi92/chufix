<script setup lang="ts">
import { CfButton, CfEmpty } from '@chufix-design/vue';

const image = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
  <ellipse cx="80" cy="132" rx="46" ry="7" fill="#E8EEF7"/>
  <rect x="26" y="32" width="108" height="82" rx="14" fill="#F8FAFC" stroke="#D7E3F2" stroke-width="2"/>
  <path d="M26 52h108" stroke="#E2EAF5" stroke-width="2"/>
  <circle cx="40" cy="42" r="2" fill="#B7C6DA"/>
  <circle cx="48" cy="42" r="2" fill="#B7C6DA"/>
  <circle cx="56" cy="42" r="2" fill="#B7C6DA"/>
  <rect x="44" y="66" width="54" height="8" rx="4" fill="#DDEBFF"/>
  <rect x="44" y="84" width="40" height="7" rx="3.5" fill="#E6ECF5"/>
  <rect x="44" y="100" width="50" height="7" rx="3.5" fill="#E6ECF5"/>
  <circle cx="116" cy="108" r="18" fill="#ECFDF3" stroke="#64C48D" stroke-width="2"/>
  <path d="M107 108.5l6 6 12-13" stroke="#16834F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
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
