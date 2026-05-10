<script setup lang="ts">
import { CfTextEllipsis } from '@chufix-design/vue';

const long =
  '这是一段较长的文字示例，用来演示多行省略与展开/收起的效果。当内容超出指定行数时会显示省略号，展开按钮把所有内容呈现出来；再次点击则收起。这段文字本身被故意写得长一些以触发溢出。';
</script>

<template>
  <div style="max-width: 360px;">
    <CfTextEllipsis :text="long" :rows="2" expandable />
  </div>
</template>
