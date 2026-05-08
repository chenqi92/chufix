<script setup lang="ts">
import { type BreadcrumbProps } from './variants';

withDefaults(defineProps<BreadcrumbProps>(), {
  items: () => [],
  separator: '/',
});
</script>

<template>
  <nav class="cf-breadcrumb" aria-label="breadcrumb">
    <ol class="cf-breadcrumb__list">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="cf-breadcrumb__item"
        :class="{ 'is-current': i === items.length - 1 }"
      >
        <a
          v-if="item.href && i !== items.length - 1"
          :href="item.href"
          class="cf-breadcrumb__link"
        >{{ item.label }}</a>
        <span v-else class="cf-breadcrumb__current" aria-current="page">{{ item.label }}</span>
        <span
          v-if="i !== items.length - 1"
          class="cf-breadcrumb__sep"
          aria-hidden="true"
        >{{ separator }}</span>
      </li>
    </ol>
  </nav>
</template>
