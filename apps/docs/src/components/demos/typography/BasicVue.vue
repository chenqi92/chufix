<script setup lang="ts">
import { CfHeading, CfText, CfParagraph } from '@chufix-design/vue';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <CfHeading :level="1">H1 · 主标题（--t-48）</CfHeading>
    <CfHeading :level="2">H2 · 章节（--t-40）</CfHeading>
    <CfHeading :level="3">H3 · 小节（--t-32）</CfHeading>
    <CfHeading :level="4">H4 · 子小节（--t-28）</CfHeading>
    <CfHeading :level="5">H5（--t-22）</CfHeading>
    <CfHeading :level="6">H6（--t-18）</CfHeading>

    <CfParagraph>
      Paragraph 默认 14px / 行高 1.6，承担正文叙述。后置 <CfText weight="semibold">加粗强调</CfText> 和
      <CfText variant="accent">accent 色片段</CfText>，都不破坏段落节奏。
    </CfParagraph>

    <div style="display: flex; gap: 16px; align-items: baseline;">
      <CfText size="xs">xs 11px</CfText>
      <CfText size="sm">sm 12px</CfText>
      <CfText size="md">md 14px</CfText>
      <CfText size="lg">lg 16px</CfText>
      <CfText size="xl">xl 18px</CfText>
    </div>

    <div style="display: flex; gap: 16px;">
      <CfText variant="muted">muted</CfText>
      <CfText variant="subtle">subtle（仅装饰文本，对比 ≈ 3.4）</CfText>
      <CfText variant="success">success</CfText>
      <CfText variant="warning">warning</CfText>
      <CfText variant="error">error</CfText>
    </div>
  </div>
</template>
