<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { tocClass, type TocProps } from './variants';

const props = withDefaults(defineProps<TocProps>(), {
  autoSpy: false,
  maxDepth: 6,
});

const emit = defineEmits<{
  (e: 'update:activeId', id: string | null): void;
}>();

const internalActive = ref<string | null>(null);

let observer: IntersectionObserver | null = null;

function setActive(id: string | null) {
  internalActive.value = id;
  emit('update:activeId', id);
}

function attachObserver() {
  if (!props.autoSpy || typeof window === 'undefined') return;
  observer?.disconnect();
  const root =
    props.scrollRoot && typeof document !== 'undefined'
      ? document.querySelector(props.scrollRoot)
      : null;
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    },
    {
      root: (root as Element | null) ?? null,
      rootMargin: '0px 0px -70% 0px',
      threshold: [0, 1],
    },
  );
  for (const item of props.items) {
    const el = document.getElementById(item.id);
    if (el) observer.observe(el);
  }
}

onMounted(attachObserver);
watch(
  () => [props.items, props.autoSpy, props.scrollRoot],
  attachObserver,
);
onBeforeUnmount(() => observer?.disconnect());

function isActive(id: string) {
  return (props.activeId !== undefined ? props.activeId : internalActive.value) === id;
}

function scrollTo(id: string, e: MouseEvent) {
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
  setActive(id);
}
</script>

<template>
  <nav :class="tocClass()" aria-label="目录">
    <div v-if="title" class="cf-toc__title">{{ title }}</div>
    <ul class="cf-toc__list">
      <li
        v-for="item in items.filter((i) => (i.depth ?? 1) <= maxDepth)"
        :key="item.id"
        class="cf-toc__item"
        :class="[
          `cf-toc__item--depth-${item.depth ?? 1}`,
          isActive(item.id) && 'is-active',
        ]"
      >
        <a
          :href="`#${item.id}`"
          class="cf-toc__link"
          @click="scrollTo(item.id, $event)"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
