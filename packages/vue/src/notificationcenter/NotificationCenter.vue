<script setup lang="ts">
import { computed } from 'vue';
import type {
  NotificationItem,
  NotificationCenterProps,
} from './variants';

const props = withDefaults(defineProps<NotificationCenterProps>(), {
  open: true,
  emptyText: '没有通知',
  showMarkAllRead: true,
  showClearAll: true,
});

const emit = defineEmits<{
  (e: 'item-click', id: string, item: NotificationItem): void;
  (e: 'item-action', id: string, item: NotificationItem): void;
  (e: 'mark-all-read'): void;
  (e: 'clear-all'): void;
  (e: 'close'): void;
}>();

const unreadCount = computed(
  () => props.items.filter((it) => !it.read).length,
);

const bodyStyle = computed(() => {
  if (!props.maxHeight) return undefined;
  const v =
    typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
  return { maxHeight: v };
});
</script>

<template>
  <aside v-if="open" class="cf-notifcenter" role="dialog" aria-label="通知中心">
    <header class="cf-notifcenter__header">
      <div class="cf-notifcenter__title">
        通知
        <span v-if="unreadCount > 0" class="cf-notifcenter__count">{{
          unreadCount
        }}</span>
      </div>
      <div class="cf-notifcenter__head-actions">
        <button
          v-if="showMarkAllRead && unreadCount > 0"
          type="button"
          class="cf-notifcenter__action"
          @click="emit('mark-all-read')"
        >
          全部标为已读
        </button>
        <button
          v-if="showClearAll && items.length > 0"
          type="button"
          class="cf-notifcenter__action"
          @click="emit('clear-all')"
        >
          清空
        </button>
      </div>
    </header>
    <div class="cf-notifcenter__body" :style="bodyStyle">
      <div v-if="!items.length" class="cf-notifcenter__empty">{{ emptyText }}</div>
      <ul v-else class="cf-notifcenter__list">
        <li
          v-for="item in items"
          :key="item.id"
          class="cf-notifcenter__item"
          :class="[
            `cf-notifcenter__item--${item.tone ?? 'default'}`,
            item.read && 'is-read',
          ]"
          @click="emit('item-click', item.id, item)"
        >
          <span class="cf-notifcenter__dot" aria-hidden="true" />
          <div class="cf-notifcenter__content">
            <div class="cf-notifcenter__row">
              <span class="cf-notifcenter__name">{{ item.title }}</span>
              <span v-if="item.timestamp" class="cf-notifcenter__time">{{
                item.timestamp
              }}</span>
            </div>
            <p v-if="item.description" class="cf-notifcenter__desc">
              {{ item.description }}
            </p>
            <button
              v-if="item.actionLabel"
              type="button"
              class="cf-notifcenter__item-action"
              @click.stop="emit('item-action', item.id, item)"
            >
              {{ item.actionLabel }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>
