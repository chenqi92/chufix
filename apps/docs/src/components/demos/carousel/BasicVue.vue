<script setup lang="ts">
import { CfCarousel, type CarouselItem } from '@chufix-design/vue';

const items: CarouselItem[] = [
  { src: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=800&h=300&fit=crop', alt: '场景 1' },
  { src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=300&fit=crop', alt: '场景 2' },
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=300&fit=crop', alt: '场景 3' },
];
</script>

<template>
  <CfCarousel :items="items" autoplay :interval="3000" />
</template>
