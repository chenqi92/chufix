<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { anchorClass, type AnchorItem, type AnchorProps } from './variants';

const props = withDefaults(defineProps<AnchorProps>(), {
  offsetTop: 0,
  bounds: 5,
});

const emit = defineEmits<{ change: [href: string] }>();

const activeHref = ref<string>('');
let scope: Window | Element | null = null;

function flatten(items: AnchorItem[]): AnchorItem[] {
  const out: AnchorItem[] = [];
  for (const it of items) {
    out.push(it);
    if (it.children?.length) out.push(...flatten(it.children));
  }
  return out;
}

function hashId(href: string): string {
  return href.startsWith('#') ? href.slice(1) : href;
}

function update() {
  if (!scope) return;
  const flat = flatten(props.items);
  let chosen = '';
  for (const it of flat) {
    const el = document.getElementById(hashId(it.href));
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top - props.offsetTop <= props.bounds) {
      chosen = it.href;
    }
  }
  if (chosen && chosen !== activeHref.value) {
    activeHref.value = chosen;
    emit('change', chosen);
  } else if (!chosen && flat[0]) {
    activeHref.value = flat[0].href;
  }
}

function onClick(evt: MouseEvent, href: string) {
  evt.preventDefault();
  const el = document.getElementById(hashId(href));
  if (!el) return;
  if (typeof window !== 'undefined' && history?.pushState) {
    history.pushState(null, '', href);
  }
  const rect = el.getBoundingClientRect();
  const targetTop =
    (scope instanceof Window || !scope ? window.scrollY : (scope as Element).scrollTop) +
    rect.top -
    props.offsetTop;
  if (scope instanceof Window || !scope) {
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  } else {
    (scope as Element).scrollTo({ top: targetTop, behavior: 'smooth' });
  }
  activeHref.value = href;
  emit('change', href);
}

onMounted(() => {
  scope = window;
  if (props.target) {
    const el = document.querySelector(props.target);
    if (el) scope = el;
  }
  scope.addEventListener('scroll', update, { passive: true });
  update();
});

onBeforeUnmount(() => {
  if (scope) scope.removeEventListener('scroll', update);
});

const cls = computed(() => anchorClass({ className: props.className }));
</script>

<template>
  <nav :class="cls">
    <ul class="cf-anchor__list">
      <li
        v-for="item in items"
        :key="item.href"
        class="cf-anchor__item"
      >
        <a
          :href="item.href"
          :class="['cf-anchor__link', activeHref === item.href && 'is-active']"
          @click="onClick($event, item.href)"
        >{{ item.label }}</a>
        <ul v-if="item.children?.length" class="cf-anchor__list cf-anchor__list--nested">
          <li
            v-for="child in item.children"
            :key="child.href"
            class="cf-anchor__item"
          >
            <a
              :href="child.href"
              :class="['cf-anchor__link', 'cf-anchor__link--nested', activeHref === child.href && 'is-active']"
              @click="onClick($event, child.href)"
            >{{ child.label }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
