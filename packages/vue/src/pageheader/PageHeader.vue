<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { pageHeaderClass, type PageHeaderProps } from './variants';

const props = withDefaults(defineProps<PageHeaderProps>(), {
  size: 'md',
  bordered: true,
});

const slots = useSlots();

const cls = computed(() =>
  pageHeaderClass({ size: props.size, bordered: props.bordered }),
);
</script>

<template>
  <header :class="cls">
    <div v-if="slots.breadcrumb" class="cf-page-header__breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div class="cf-page-header__bar">
      <div class="cf-page-header__lead">
        <slot name="back" />
        <div class="cf-page-header__heading">
          <h1 v-if="title || slots.title" class="cf-page-header__title">
            <slot name="title">{{ title }}</slot>
          </h1>
          <p v-if="description || slots.description" class="cf-page-header__description">
            <slot name="description">{{ description }}</slot>
          </p>
        </div>
      </div>
      <div v-if="slots.actions" class="cf-page-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="slots.toolbar" class="cf-page-header__toolbar">
      <slot name="toolbar" />
    </div>
    <div v-if="slots.tabs" class="cf-page-header__tabs">
      <slot name="tabs" />
    </div>
  </header>
</template>
