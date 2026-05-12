<script setup lang="ts">
/**
 * admin-mini · 顶部 header。
 * 左：品牌；中：搜索；右：消息铃铛 / 语言 / 设置齿轮（→ 右抽屉）/ 用户头像（→ 下拉菜单）。
 * 通过 emit 把交互上抛给 AdminMiniDemo 父组件统一处理。
 */
import { computed, inject, ref } from 'vue';
import {
  CfSearchInput,
  CfPopover,
  CfDropdown,
  CfAvatar,
  CfBadge,
  CfTag,
} from '@chufix-design/vue';
import type { DropdownItem } from '@chufix-design/vue';
import { DemoStateKey, STRINGS } from './state';

const state = inject(DemoStateKey)!;
const t = computed(() => STRINGS[state.locale.value]);

const emit = defineEmits<{
  (e: 'open-settings'): void;
  (e: 'open-profile'): void;
  (e: 'open-change-password'): void;
  (e: 'logout'): void;
}>();

const search = ref('');

// 通知 mock 数据，演示用
interface NotifItem { id: number; title: string; from: string; at: string; unread: boolean }
const notifications = ref<NotifItem[]>([
  { id: 1, title: '用户 ada 提交了新角色申请', from: 'system', at: '2 分钟前', unread: true },
  { id: 2, title: '操作日志：grace 导出了登录日志', from: 'audit',  at: '8 分钟前', unread: true },
  { id: 3, title: '字典「日志级别」新增 DEBUG 项', from: 'admin',  at: '32 分钟前', unread: false },
  { id: 4, title: '今日凌晨完成数据库自动备份', from: 'cron',   at: '昨天',       unread: false },
]);

const unreadCount = computed(() => notifications.value.filter((n) => n.unread).length);

function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, unread: false }));
}

const userMenuItems = computed<DropdownItem[]>(() => [
  { key: 'user-info', label: 'Admin · admin@chufix.dev', header: true },
  { key: 'divider-1', divider: true },
  { key: 'profile',         label: t.value.profile },
  { key: 'change-password', label: t.value.change_password },
  { key: 'divider-2', divider: true },
  { key: 'logout',          label: t.value.logout, tone: 'danger' },
]);

function onUserMenu(item: DropdownItem) {
  switch (item.key) {
    case 'profile':         emit('open-profile'); break;
    case 'change-password': emit('open-change-password'); break;
    case 'logout':          emit('logout'); break;
  }
}

function toggleLocale() {
  state.locale.value = state.locale.value === 'zh' ? 'en' : 'zh';
}
</script>

<template>
  <div class="adm-header">
    <div class="adm-header__brand" data-tour="brand">
      <span class="adm-header__logo" />
      <span class="adm-header__title">{{ t.brand }}</span>
      <CfTag size="sm" tone="info" variant="soft">demo</CfTag>
    </div>

    <div class="adm-header__center" data-tour="search">
      <CfSearchInput
        v-model="search"
        :placeholder="t.search_placeholder"
        size="sm"
      />
    </div>

    <div class="adm-header__actions">
      <CfPopover placement="bottom" :width="320">
        <button class="adm-iconbtn" type="button" :aria-label="t.notifications">
          <CfBadge :content="unreadCount" :max="99" :dot="false" :show-zero="false" placement="top-right">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8a6 6 0 1112 0c0 6 3 7 3 7H3s3-1 3-7" />
              <path d="M10 19a2 2 0 004 0" />
            </svg>
          </CfBadge>
        </button>
        <template #content>
          <div class="adm-notif">
            <header class="adm-notif__head">
              <span class="adm-notif__title">{{ t.notifications }}</span>
              <button type="button" class="adm-notif__link" @click="markAllRead">
                {{ t.mark_all_read }}
              </button>
            </header>
            <ul v-if="notifications.length" class="adm-notif__list">
              <li
                v-for="n in notifications"
                :key="n.id"
                class="adm-notif__item"
                :class="{ 'is-unread': n.unread }"
              >
                <span class="adm-notif__dot" />
                <div class="adm-notif__body">
                  <div class="adm-notif__text">{{ n.title }}</div>
                  <div class="adm-notif__meta">{{ n.from }} · {{ n.at }}</div>
                </div>
              </li>
            </ul>
            <div v-else class="adm-notif__empty">{{ t.no_notifications }}</div>
            <footer class="adm-notif__foot">
              <a href="#" @click.prevent>{{ t.view_all }}</a>
            </footer>
          </div>
        </template>
      </CfPopover>

      <button class="adm-iconbtn adm-iconbtn--lang" type="button" :aria-label="t.switch_locale" @click="toggleLocale">
        {{ state.locale.value === 'zh' ? '中' : 'EN' }}
      </button>

      <button class="adm-iconbtn" type="button" :aria-label="t.settings" data-tour="settings" @click="emit('open-settings')">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 017.04 4.04l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.36.94 1.18 1.5 2.15 1.51H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </button>

      <CfDropdown :items="userMenuItems" placement="bottom" :width="200" @select="onUserMenu">
        <button class="adm-user" type="button" data-tour="user">
          <CfAvatar name="Admin" size="sm" />
          <span class="adm-user__name">Admin</span>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>
      </CfDropdown>
    </div>
  </div>
</template>

<style scoped>
.adm-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 100%;
  width: 100%;
}
.adm-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.adm-header__logo {
  width: 22px;
  height: 22px;
  border-radius: var(--r-4);
  background: linear-gradient(135deg, var(--accent-1), color-mix(in oklch, var(--accent-1), var(--bg-0) 35%));
  box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--accent-1), transparent 50%);
}
.adm-header__title {
  font-weight: var(--w-medium);
  color: var(--fg-1);
  white-space: nowrap;
}
.adm-header__center {
  width: 320px;
  max-width: 36%;
}
.adm-header__center :deep(.cf-searchinput) {
  width: 100%;
}
.adm-header__actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.adm-iconbtn {
  width: 32px;
  height: 32px;
  border-radius: var(--r-4);
  border: 1px solid transparent;
  background: transparent;
  color: var(--fg-2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.adm-iconbtn:hover { background: var(--bg-2); color: var(--fg-1); }
.adm-iconbtn--lang {
  width: auto;
  padding: 0 10px;
  font-size: var(--t-12);
  font-weight: var(--w-medium);
  border: 1px solid var(--line-1);
}
.adm-user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  border-radius: var(--r-pill);
  border: 1px solid transparent;
  background: transparent;
  color: var(--fg-1);
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out);
}
.adm-user:hover { background: var(--bg-2); }
.adm-user__name {
  font-size: var(--t-12);
  font-weight: var(--w-medium);
}
.adm-notif {
  background: var(--bg-1);
  border-radius: var(--r-4);
  min-width: 280px;
}
.adm-notif__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line-1);
}
.adm-notif__title {
  font-weight: var(--w-medium);
  color: var(--fg-1);
  font-size: var(--t-13);
}
.adm-notif__link {
  background: transparent;
  border: 0;
  color: var(--accent-1);
  font-size: var(--t-11);
  cursor: pointer;
  padding: 0;
}
.adm-notif__list {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 280px;
  overflow: auto;
}
.adm-notif__item {
  display: grid;
  grid-template-columns: 16px 1fr;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line-1);
}
.adm-notif__item:last-child { border-bottom: 0; }
.adm-notif__dot {
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--line-2);
}
.adm-notif__item.is-unread .adm-notif__dot {
  background: var(--accent-1);
  border-color: var(--accent-1);
}
.adm-notif__text {
  color: var(--fg-1);
  font-size: var(--t-12);
  line-height: 1.5;
}
.adm-notif__meta {
  margin-top: 2px;
  color: var(--fg-3);
  font-size: var(--t-11);
}
.adm-notif__empty {
  padding: 28px 16px;
  text-align: center;
  color: var(--fg-3);
  font-size: var(--t-12);
}
.adm-notif__foot {
  padding: 8px 12px;
  text-align: center;
  border-top: 1px solid var(--line-1);
}
.adm-notif__foot a {
  color: var(--accent-1);
  font-size: var(--t-12);
}
</style>
