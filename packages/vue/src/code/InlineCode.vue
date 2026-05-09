<script setup lang="ts">
import type { InlineCodeProps } from './variants';

withDefaults(defineProps<InlineCodeProps>(), { size: 'md' });
</script>

<template>
  <code class="cf-code" :class="`cf-code--${size}`"><slot /></code>
</template>
