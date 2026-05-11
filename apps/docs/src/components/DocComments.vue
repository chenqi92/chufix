<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  CfAlert,
  CfAvatar,
  CfBadge,
  CfButton,
  CfEmpty,
  CfInput,
  CfModal,
  CfTextarea,
} from '@chufix-design/vue';

type CommentStatus = 'approved' | 'pending' | 'rejected';
type IdentityMode = 'anonymous' | 'account';
type UserFormMode = 'login' | 'register';

interface CommentItem {
  id: string;
  parentId?: string | null;
  author: string;
  role?: 'user' | 'admin';
  content: string;
  status?: CommentStatus;
  createdAt: string;
  replies?: CommentItem[];
}

interface CommentUser {
  id: string;
  displayName: string;
  email: string;
  createdAt: string;
}

const isEn = typeof window !== 'undefined' && window.location.pathname.startsWith('/en/');
const T = isEn
  ? {
      eyebrow: 'Feedback & discussion',
      title: 'Discussion',
      unavailableTitle: 'Comments backend not configured',
      unavailableBody: 'This page has the comments module wired up. Once Cloudflare Pages Functions and the D1 binding are configured, submissions will land in the moderation flow.',
      unavailableDevBody: 'Local Astro dev does not run Pages Functions by default. Use Cloudflare Pages, wrangler pages dev, or set PUBLIC_ENABLE_COMMENTS_API=true when testing the deployed API.',
      unavailableRouteBody: 'The current deployment cannot find /api/comments. Check that Cloudflare Pages is deploying apps/docs and includes the Functions directory.',
      unavailableDbBody: 'The current deployment cannot read CHUFIX_COMMENTS_DB. Bind D1 in the same Production/Preview environment and redeploy the site.',
      unavailableHttpBody: 'The comments API responded but is not healthy. Open /api/comments-health on this deployment for the current binding status.',
      unavailableNetworkBody: 'The comments API could not be reached from this page. Check the deployed domain and Pages Functions logs.',
      placeholderNick: 'Nickname',
      placeholderBody: 'Share suggestions, questions, or usage feedback',
      emojiLabel: 'Quick emoji reply',
      emojiSend: 'One-click send',
      emojiAria: 'Send',
      submit: 'Submit',
      loading: 'Loading comments...',
      emptyTitle: 'No public comments yet',
      emptyBody: 'The first high-quality piece of feedback often saves the next reader a wrong turn.',
      role: 'Maintainer',
      reply: 'Reply',
      cancelReply: 'Cancel',
      replyPlaceholder: 'Reply to this thread',
      noticePublished: 'Published.',
      noticeReplyPublished: 'Reply published.',
      noticeSubmitted: 'Submitted. It will appear after moderation.',
      noticeReplySubmitted: 'Reply submitted. It will appear after moderation.',
      noticeFailed: "Couldn't submit just now, please try again shortly.",
      userEntry: 'User',
      adminEntry: 'Admin',
      anonymousName: 'Anonymous',
      anonymousMode: 'Anonymous',
      accountMode: 'Account',
      userTitle: 'Comment identity',
      loginTab: 'Log in',
      registerTab: 'Register',
      displayName: 'Display name',
      email: 'Email',
      password: 'Password',
      login: 'Log in',
      register: 'Register',
      logout: 'Log out',
      useAnonymous: 'Continue anonymously',
      signedInAs: 'Signed in as',
      userLoginFailed: 'Login failed. Check your email and password.',
      userRegisterFailed: 'Registration failed. The email may already exist.',
      adminTitle: 'Admin moderation',
      adminToken: 'Admin token',
      adminLogin: 'Open moderation',
      adminFailed: 'The admin token is invalid or not configured.',
    }
  : {
      eyebrow: '反馈与讨论',
      title: '讨论',
      unavailableTitle: '评论接口尚未启用',
      unavailableBody: '当前页面已经预留评论模块。配置 Cloudflare Pages Functions 和 D1 绑定后，用户评论会进入审核流程。',
      unavailableDevBody: '本地 Astro dev 默认不会运行 Pages Functions。请使用 Cloudflare Pages、wrangler pages dev，或在测试已部署接口时设置 PUBLIC_ENABLE_COMMENTS_API=true。',
      unavailableRouteBody: '当前部署找不到 /api/comments。请确认 Cloudflare Pages 部署的是 apps/docs，并且 Functions 目录已被包含。',
      unavailableDbBody: '当前部署没有读到 CHUFIX_COMMENTS_DB。请在同一个 Production/Preview 环境绑定 D1，并重新部署站点。',
      unavailableHttpBody: '评论 API 有响应但状态异常。可以打开当前部署的 /api/comments-health 查看绑定状态。',
      unavailableNetworkBody: '当前页面无法访问评论 API。请检查部署域名和 Pages Functions 日志。',
      placeholderNick: '昵称',
      placeholderBody: '留下建议、问题或使用反馈',
      emojiLabel: '快捷 emoji 评论',
      emojiSend: '一键发送',
      emojiAria: '发送',
      submit: '提交评论',
      loading: '正在加载评论...',
      emptyTitle: '还没有公开评论',
      emptyBody: '第一条高质量反馈，往往会帮后面的使用者少走一点弯路。',
      role: '维护者',
      reply: '回复',
      cancelReply: '取消',
      replyPlaceholder: '回复这条讨论',
      noticePublished: '评论已发布。',
      noticeReplyPublished: '回复已发布。',
      noticeSubmitted: '评论已提交，审核通过后会显示在这里。',
      noticeReplySubmitted: '回复已提交，审核通过后会显示在这里。',
      noticeFailed: '评论暂时没有提交成功，请稍后再试。',
      userEntry: '用户',
      adminEntry: '超管',
      anonymousName: '匿名用户',
      anonymousMode: '匿名评论',
      accountMode: '注册用户',
      userTitle: '评论身份',
      loginTab: '登录',
      registerTab: '注册',
      displayName: '昵称',
      email: '邮箱',
      password: '密码',
      login: '登录',
      register: '注册',
      logout: '退出',
      useAnonymous: '继续匿名',
      signedInAs: '当前登录',
      userLoginFailed: '登录失败，请检查邮箱和密码。',
      userRegisterFailed: '注册失败，邮箱可能已经存在。',
      adminTitle: '超管审核',
      adminToken: '超管口令',
      adminLogin: '进入审核后台',
      adminFailed: '超管口令不正确，或尚未配置。',
    };

const props = withDefaults(defineProps<{
  pageId: string;
  title?: string;
}>(), {
  title: '',
});
const resolvedTitle = computed(() => props.title || T.title);

const api = '/api/comments';
const userApi = '/api/comments-user';
const adminApi = '/api/comments-session';
const apiEnabled = !import.meta.env.DEV || import.meta.env.PUBLIC_ENABLE_COMMENTS_API === 'true';
const loading = ref(true);
const posting = ref(false);
const unavailable = ref(false);
const unavailableBody = ref(T.unavailableBody);
const notice = ref('');
const comments = ref<CommentItem[]>([]);
const author = ref('');
const content = ref('');
const replyingTo = ref('');
const replyContent = ref('');
const quickEmojis = ['👍', '❤️', '🎉', '👀', '🙌', '💡'];

const identityMode = ref<IdentityMode>('anonymous');
const userOpen = ref(false);
const adminOpen = ref(false);
const user = ref<CommentUser | null>(null);
const userFormMode = ref<UserFormMode>('login');
const userDisplayName = ref('');
const userEmail = ref('');
const userPassword = ref('');
const userBusy = ref(false);
const userNotice = ref('');
const adminToken = ref('');
const adminBusy = ref(false);
const adminNotice = ref('');

const count = computed(() =>
  comments.value.reduce((sum, item) => sum + 1 + (item.replies?.length ?? 0), 0),
);
const identityLabel = computed(() =>
  identityMode.value === 'account' && user.value ? user.value.displayName : T.anonymousMode,
);
const canUseAccount = computed(() => identityMode.value === 'anonymous' || Boolean(user.value));
const canSubmit = computed(() =>
  Boolean(content.value.trim()) && canUseAccount.value && !posting.value && !unavailable.value,
);
const canSubmitReply = computed(() =>
  Boolean(replyContent.value.trim()) && canUseAccount.value && !posting.value && !unavailable.value,
);

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(isEn ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function normalize(items: CommentItem[]) {
  const byId = new Map<string, CommentItem>();
  const roots: CommentItem[] = [];

  for (const item of items) {
    byId.set(item.id, { ...item, replies: [] });
  }
  for (const item of byId.values()) {
    if (item.parentId && byId.has(item.parentId)) {
      byId.get(item.parentId)?.replies?.push(item);
    } else {
      roots.push(item);
    }
  }
  return roots;
}

function markUnavailable(message: string) {
  unavailable.value = true;
  unavailableBody.value = message;
  comments.value = [];
}

async function loadUser() {
  try {
    const res = await fetch(userApi, {
      headers: { accept: 'application/json' },
      credentials: 'same-origin',
    });
    if (!res.ok) return;
    const data = await res.json() as { authenticated?: boolean; user?: CommentUser };
    if (data.authenticated && data.user) {
      user.value = data.user;
      identityMode.value = 'account';
    }
  } catch {
    // User identity is optional; comments still work anonymously.
  }
}

async function submitUser() {
  if (userBusy.value) return;
  userBusy.value = true;
  userNotice.value = '';
  try {
    const body: Record<string, string> = {
      action: userFormMode.value,
      email: userEmail.value.trim(),
      password: userPassword.value,
    };
    if (userFormMode.value === 'register') body.displayName = userDisplayName.value.trim();
    const res = await fetch(userApi, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null) as { ok?: boolean; user?: CommentUser } | null;
    if (!res.ok || !data?.user) throw new Error('user auth failed');
    user.value = data.user;
    identityMode.value = 'account';
    userPassword.value = '';
    userOpen.value = false;
  } catch {
    userNotice.value = userFormMode.value === 'register' ? T.userRegisterFailed : T.userLoginFailed;
  } finally {
    userBusy.value = false;
  }
}

async function logoutUser() {
  await fetch(userApi, {
    method: 'DELETE',
    credentials: 'same-origin',
  }).catch(() => null);
  user.value = null;
  identityMode.value = 'anonymous';
  userOpen.value = false;
}

function useAnonymous() {
  identityMode.value = 'anonymous';
  userOpen.value = false;
}

async function adminLogin() {
  if (adminBusy.value) return;
  adminBusy.value = true;
  adminNotice.value = '';
  try {
    const res = await fetch(adminApi, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ token: adminToken.value }),
    });
    if (!res.ok) throw new Error('admin auth failed');
    window.location.href = '/admin/comments/';
  } catch {
    adminNotice.value = T.adminFailed;
  } finally {
    adminBusy.value = false;
  }
}

async function loadComments() {
  loading.value = true;
  notice.value = '';
  try {
    const res = await fetch(`${api}?pageId=${encodeURIComponent(props.pageId)}`, {
      headers: { accept: 'application/json' },
    });
    if (res.status === 404 || res.status === 501) {
      markUnavailable(T.unavailableRouteBody);
      return;
    }
    if (!res.ok) {
      markUnavailable(T.unavailableHttpBody);
      return;
    }
    const data = await res.json() as {
      ok?: boolean;
      code?: string;
      comments?: CommentItem[];
    };
    if (data.ok === false && data.code === 'COMMENTS_DB_NOT_BOUND') {
      markUnavailable(T.unavailableDbBody);
      return;
    }
    comments.value = normalize(data.comments ?? []);
  } catch {
    markUnavailable(T.unavailableNetworkBody);
  } finally {
    loading.value = false;
  }
}

async function submit(overrideContent?: string, parentId?: string) {
  const nextContent = (overrideContent ?? (parentId ? replyContent.value : content.value)).trim();
  if (!nextContent || posting.value || unavailable.value) return;
  if (identityMode.value === 'account' && !user.value) {
    userOpen.value = true;
    return;
  }

  const anonymous = identityMode.value === 'anonymous';
  const nextAuthor = anonymous
    ? (author.value.trim() || T.anonymousName)
    : (user.value?.displayName ?? author.value.trim());

  posting.value = true;
  notice.value = '';
  try {
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        pageId: props.pageId,
        parentId,
        author: nextAuthor,
        email: anonymous ? '' : user.value?.email,
        anonymous,
        content: nextContent,
      }),
    });
    const data = await res.json().catch(() => null) as {
      code?: string;
      comment?: { status?: CommentStatus };
    } | null;
    if (!res.ok) {
      if (data?.code === 'COMMENTS_DB_NOT_BOUND') markUnavailable(T.unavailableDbBody);
      throw new Error(`HTTP ${res.status}`);
    }
    if (!overrideContent && parentId) replyContent.value = '';
    if (!overrideContent && !parentId) content.value = '';
    if (parentId) replyingTo.value = '';
    const published = data?.comment?.status === 'approved';
    notice.value = parentId
      ? (published ? T.noticeReplyPublished : T.noticeReplySubmitted)
      : (published ? T.noticePublished : T.noticeSubmitted);
    await loadComments();
  } catch {
    notice.value = T.noticeFailed;
  } finally {
    posting.value = false;
  }
}

function quickSendEmoji(emoji: string) {
  if (posting.value || unavailable.value) return;
  submit(emoji);
}

function startReply(id: string) {
  replyingTo.value = replyingTo.value === id ? '' : id;
  replyContent.value = '';
}

onMounted(() => {
  if (!apiEnabled) {
    markUnavailable(T.unavailableDevBody);
    loading.value = false;
    return;
  }
  loadUser();
  loadComments();
});
</script>

<template>
  <section class="doc-comments" aria-labelledby="doc-comments-title">
    <div id="doc-comments-modal-root" class="doc-comments__modal-root" />

    <header class="doc-comments__header">
      <div>
        <p class="doc-comments__eyebrow">{{ T.eyebrow }}</p>
        <h2 id="doc-comments-title">{{ resolvedTitle }}</h2>
      </div>
      <div class="doc-comments__header-actions">
        <CfButton type="button" variant="ghost" size="sm" @click="userOpen = true">
          {{ identityLabel }}
        </CfButton>
        <CfButton type="button" variant="ghost" size="sm" @click="adminOpen = true">
          {{ T.adminEntry }}
        </CfButton>
        <CfBadge tone="info" :content="count" show-zero />
      </div>
    </header>

    <CfModal v-model:open="userOpen" :title="T.userTitle" size="sm" to="#doc-comments-modal-root">
      <div class="doc-comments__modal">
        <div class="doc-comments__identity-choice" role="group" :aria-label="T.userTitle">
          <CfButton
            type="button"
            size="sm"
            :variant="identityMode === 'anonymous' ? 'solid' : 'soft'"
            @click="useAnonymous"
          >
            {{ T.anonymousMode }}
          </CfButton>
          <CfButton
            type="button"
            size="sm"
            :variant="identityMode === 'account' ? 'solid' : 'soft'"
            @click="identityMode = 'account'"
          >
            {{ T.accountMode }}
          </CfButton>
        </div>

        <div v-if="user" class="doc-comments__signed">
          <span>{{ T.signedInAs }}</span>
          <strong>{{ user.displayName }}</strong>
          <small>{{ user.email }}</small>
          <CfButton type="button" variant="ghost" size="sm" @click="logoutUser">
            {{ T.logout }}
          </CfButton>
        </div>

        <form v-else class="doc-comments__auth-form" @submit.prevent="submitUser">
          <div class="doc-comments__tabs" role="tablist" :aria-label="T.userTitle">
            <CfButton
              type="button"
              size="sm"
              :variant="userFormMode === 'login' ? 'solid' : 'ghost'"
              @click="userFormMode = 'login'"
            >
              {{ T.loginTab }}
            </CfButton>
            <CfButton
              type="button"
              size="sm"
              :variant="userFormMode === 'register' ? 'solid' : 'ghost'"
              @click="userFormMode = 'register'"
            >
              {{ T.registerTab }}
            </CfButton>
          </div>
          <CfInput
            v-if="userFormMode === 'register'"
            v-model="userDisplayName"
            :placeholder="T.displayName"
            autocomplete="nickname"
          />
          <CfInput v-model="userEmail" :placeholder="T.email" type="email" autocomplete="email" />
          <CfInput
            v-model="userPassword"
            :placeholder="T.password"
            type="password"
            autocomplete="current-password"
          />
          <p v-if="userNotice" class="doc-comments__notice">{{ userNotice }}</p>
          <div class="doc-comments__modal-actions">
            <CfButton type="button" variant="ghost" size="sm" @click="useAnonymous">
              {{ T.useAnonymous }}
            </CfButton>
            <CfButton type="submit" size="sm" :loading="userBusy">
              {{ userFormMode === 'register' ? T.register : T.login }}
            </CfButton>
          </div>
        </form>
      </div>
    </CfModal>

    <CfModal v-model:open="adminOpen" :title="T.adminTitle" size="sm" to="#doc-comments-modal-root">
      <form class="doc-comments__modal" @submit.prevent="adminLogin">
        <CfInput
          v-model="adminToken"
          :placeholder="T.adminToken"
          type="password"
          autocomplete="current-password"
        />
        <p v-if="adminNotice" class="doc-comments__notice">{{ adminNotice }}</p>
        <div class="doc-comments__modal-actions">
          <span />
          <CfButton type="submit" size="sm" :loading="adminBusy">
            {{ T.adminLogin }}
          </CfButton>
        </div>
      </form>
    </CfModal>

    <CfAlert v-if="unavailable" tone="warning" variant="soft" :title="T.unavailableTitle">
      {{ unavailableBody }}
    </CfAlert>

    <form class="doc-comments__form" @submit.prevent="submit()">
      <CfInput
        v-if="identityMode === 'anonymous'"
        v-model="author"
        :placeholder="`${T.placeholderNick}（${T.anonymousMode}）`"
        size="md"
        :disabled="posting || unavailable"
      />
      <div v-else-if="user" class="doc-comments__identity">
        <span>{{ T.signedInAs }}</span>
        <strong>{{ user.displayName }}</strong>
      </div>
      <CfTextarea
        v-model="content"
        :placeholder="T.placeholderBody"
        :rows="4"
        :maxlength="600"
        show-count
        auto-resize
        :disabled="posting || unavailable"
      />
      <div class="doc-comments__emoji" :aria-label="T.emojiLabel">
        <span>{{ T.emojiSend }}</span>
        <CfButton
          v-for="emoji in quickEmojis"
          :key="emoji"
          type="button"
          variant="ghost"
          size="sm"
          shape="square"
          :disabled="posting || unavailable"
          :aria-label="`${T.emojiAria} ${emoji}`"
          @click="quickSendEmoji(emoji)"
        >
          {{ emoji }}
        </CfButton>
      </div>
      <div class="doc-comments__actions">
        <p v-if="notice" class="doc-comments__notice">{{ notice }}</p>
        <CfButton type="submit" size="sm" :loading="posting" :disabled="!canSubmit">
          {{ T.submit }}
        </CfButton>
      </div>
    </form>

    <div v-if="loading" class="doc-comments__loading">{{ T.loading }}</div>
    <CfEmpty
      v-else-if="!comments.length"
      :title="T.emptyTitle"
      :description="T.emptyBody"
      illustration="empty"
    />

    <ol v-else class="doc-comments__list">
      <li v-for="item in comments" :key="item.id" class="doc-comments__item">
        <article class="doc-comment">
          <CfAvatar :name="item.author" size="sm" />
          <div class="doc-comment__body">
            <div class="doc-comment__meta">
              <strong>{{ item.author }}</strong>
              <span v-if="item.role === 'admin'" class="doc-comment__role">{{ T.role }}</span>
              <time :datetime="item.createdAt">{{ formatTime(item.createdAt) }}</time>
            </div>
            <p>{{ item.content }}</p>
            <div class="doc-comment__actions">
              <CfButton
                type="button"
                variant="ghost"
                size="sm"
                :disabled="posting || unavailable"
                @click="startReply(item.id)"
              >
                {{ replyingTo === item.id ? T.cancelReply : T.reply }}
              </CfButton>
            </div>
            <form
              v-if="replyingTo === item.id"
              class="doc-comment__reply-form"
              @submit.prevent="submit(undefined, item.id)"
            >
              <CfTextarea
                v-model="replyContent"
                :placeholder="T.replyPlaceholder"
                :rows="3"
                :maxlength="600"
                show-count
                auto-resize
                :disabled="posting || unavailable"
              />
              <div class="doc-comments__actions">
                <span />
                <CfButton type="submit" size="sm" :loading="posting" :disabled="!canSubmitReply">
                  {{ T.reply }}
                </CfButton>
              </div>
            </form>
          </div>
        </article>

        <ol v-if="item.replies?.length" class="doc-comments__replies">
          <li v-for="reply in item.replies" :key="reply.id" class="doc-comments__reply">
            <article class="doc-comment doc-comment--reply">
              <CfAvatar :name="reply.author" size="sm" />
              <div class="doc-comment__body">
                <div class="doc-comment__meta">
                  <strong>{{ reply.author }}</strong>
                  <span v-if="reply.role === 'admin'" class="doc-comment__role">{{ T.role }}</span>
                  <time :datetime="reply.createdAt">{{ formatTime(reply.createdAt) }}</time>
                </div>
                <p>{{ reply.content }}</p>
              </div>
            </article>
          </li>
        </ol>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.doc-comments {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line-1);
}
.doc-comments__modal-root {
  display: contents;
}
.doc-comments__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.doc-comments__header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
}
.doc-comments__eyebrow {
  margin: 0 0 0.2rem;
  color: var(--fg-3);
  font-size: var(--t-12);
  font-weight: var(--w-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.doc-comments h2 {
  margin: 0;
  font-size: var(--t-20);
  line-height: var(--lh-20);
}
.doc-comments__modal,
.doc-comments__auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.doc-comments__identity-choice,
.doc-comments__tabs,
.doc-comments__modal-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.doc-comments__modal-actions {
  justify-content: space-between;
}
.doc-comments__signed,
.doc-comments__identity {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.65rem;
  color: var(--fg-2);
  font-size: var(--t-13);
}
.doc-comments__signed {
  padding: 0.75rem 0;
}
.doc-comments__signed strong,
.doc-comments__identity strong {
  color: var(--fg-1);
}
.doc-comments__signed small {
  color: var(--fg-3);
}
.doc-comments__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0 1.25rem;
}
.doc-comments__emoji {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}
.doc-comments__emoji span {
  color: var(--fg-3);
  font-size: var(--t-12);
}
.doc-comments__emoji .cf-btn {
  min-width: 2rem;
}
.doc-comments__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.doc-comments__notice,
.doc-comments__loading {
  margin: 0;
  color: var(--fg-2);
  font-size: var(--t-13);
}
.doc-comments__list,
.doc-comments__replies {
  list-style: none;
  margin: 0;
  padding: 0;
}
.doc-comments__item + .doc-comments__item {
  margin-top: 1rem;
}
.doc-comment {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--line-1);
}
.doc-comment__body {
  min-width: 0;
}
.doc-comment__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.55rem;
  color: var(--fg-2);
  font-size: var(--t-12);
}
.doc-comment__meta strong {
  color: var(--fg-1);
  font-size: var(--t-13);
}
.doc-comment__role {
  display: inline-flex;
  align-items: center;
  min-height: 1.25rem;
  padding: 0 0.4rem;
  border-radius: var(--r-3);
  background: var(--accent-soft);
  color: var(--accent-1);
  font-weight: var(--w-semibold);
}
.doc-comment p {
  margin: 0.35rem 0 0;
  color: var(--fg-1);
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.doc-comment__actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 0.4rem;
}
.doc-comment__reply-form {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--line-1);
}
.doc-comments__replies {
  margin-left: 2.75rem;
}
.doc-comment--reply {
  padding-left: 0.75rem;
  border-left: 2px solid var(--line-1);
}
@media (max-width: 640px) {
  .doc-comments__header {
    flex-direction: column;
  }
  .doc-comments__header-actions,
  .doc-comments__actions {
    align-items: stretch;
    flex-direction: column;
  }
  .doc-comments__header-actions .cf-btn,
  .doc-comments__actions .cf-btn {
    width: 100%;
  }
  .doc-comments__replies {
    margin-left: 1rem;
  }
}
</style>
