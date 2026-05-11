<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  CfAlert,
  CfAvatar,
  CfBadge,
  CfButton,
  CfEmpty,
  CfInput,
  CfTextarea,
} from '@chufix-design/vue';

type CommentStatus = 'pending' | 'approved' | 'rejected';
type FilterStatus = CommentStatus | 'all';

interface CommentItem {
  id: string;
  pageId: string;
  parentId?: string | null;
  author: string;
  role?: 'user' | 'admin';
  content: string;
  status: CommentStatus;
  moderationReason?: string | null;
  matchedTerms?: string | null;
  createdAt: string;
  updatedAt: string;
  ipHash?: string | null;
  userAgent?: string | null;
}

const sessionApi = '/api/comments-session';
const commentsApi = '/api/comments';
const filters: { value: FilterStatus; label: string }[] = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'all', label: '全部' },
];
const quickEmojis = ['👍', '❤️', '🎉', '👀', '🙌', '💡'];

const authenticated = ref(false);
const checking = ref(true);
const loading = ref(false);
const busyId = ref('');
const setupIssue = ref('');
const loginError = ref('');
const token = ref('');
const filter = ref<FilterStatus>('pending');
const comments = ref<CommentItem[]>([]);
const replyDraft = ref<Record<string, string>>({});

const title = computed(() =>
  filters.find((item) => item.value === filter.value)?.label ?? '待审核',
);

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function statusLabel(status: CommentStatus) {
  if (status === 'approved') return '已通过';
  if (status === 'rejected') return '已拒绝';
  return '待审核';
}

function statusTone(status: CommentStatus) {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'danger';
  return 'warning';
}

function shortHash(value?: string | null) {
  return value ? value.slice(0, 12) : '未记录';
}

function formatMatchedTerms(value?: string | null) {
  if (!value) return '无';
  try {
    const terms = JSON.parse(value) as { phrase?: string; action?: string }[];
    return terms
      .map((item) => `${item.phrase || 'unknown'} / ${item.action || 'review'}`)
      .join('、') || '无';
  } catch {
    return value;
  }
}

async function checkSession() {
  checking.value = true;
  setupIssue.value = '';
  try {
    const res = await fetch(sessionApi, { credentials: 'same-origin' });
    const data = await res.json() as {
      ok?: boolean;
      authenticated?: boolean;
      code?: string;
    };
    if (data.code === 'ADMIN_TOKEN_NOT_CONFIGURED') {
      setupIssue.value = '还没有配置 CHUFIX_COMMENTS_ADMIN_TOKEN，审核后台暂不可登录。';
    }
    authenticated.value = !!data.authenticated;
    if (authenticated.value) await loadComments();
  } catch {
    setupIssue.value = '无法连接评论会话接口，请确认 Pages Functions 已部署。';
  } finally {
    checking.value = false;
  }
}

async function login() {
  loginError.value = '';
  setupIssue.value = '';
  const nextToken = token.value.trim();
  if (!nextToken) return;

  const res = await fetch(sessionApi, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token: nextToken }),
  });
  const data = await res.json().catch(() => ({})) as { code?: string };

  if (!res.ok) {
    loginError.value = data.code === 'ADMIN_TOKEN_NOT_CONFIGURED'
      ? '请先在 Cloudflare Pages 里配置 CHUFIX_COMMENTS_ADMIN_TOKEN。'
      : '登录口令不正确。';
    return;
  }

  token.value = '';
  authenticated.value = true;
  await loadComments();
}

async function logout() {
  await fetch(sessionApi, { method: 'DELETE', credentials: 'same-origin' });
  authenticated.value = false;
  comments.value = [];
}

async function loadComments() {
  loading.value = true;
  setupIssue.value = '';
  try {
    const res = await fetch(
      `${commentsApi}?admin=1&status=${encodeURIComponent(filter.value)}`,
      { credentials: 'same-origin' },
    );
    if (res.status === 403) {
      authenticated.value = false;
      return;
    }
    const data = await res.json() as {
      ok?: boolean;
      code?: string;
      comments?: CommentItem[];
    };
    if (data.code === 'COMMENTS_DB_NOT_BOUND') {
      setupIssue.value = '还没有绑定 CHUFIX_COMMENTS_DB，审核后台暂无数据源。';
      comments.value = [];
      return;
    }
    if (!res.ok || data.ok === false) throw new Error('comments failed');
    comments.value = data.comments ?? [];
  } catch {
    setupIssue.value = '评论列表加载失败，请稍后重试。';
  } finally {
    loading.value = false;
  }
}

async function changeFilter(next: FilterStatus) {
  filter.value = next;
  await loadComments();
}

async function updateComment(id: string, action: 'approve' | 'reject' | 'pending') {
  busyId.value = id;
  try {
    const res = await fetch(commentsApi, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) throw new Error('update failed');
    await loadComments();
  } finally {
    busyId.value = '';
  }
}

async function deleteComment(id: string) {
  if (!window.confirm('确认删除这条评论及其回复？此操作不可恢复。')) return;
  busyId.value = id;
  try {
    const res = await fetch(`${commentsApi}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (!res.ok) throw new Error('delete failed');
    await loadComments();
  } finally {
    busyId.value = '';
  }
}

async function reply(item: CommentItem, emoji?: string) {
  const content = (emoji ?? replyDraft.value[item.id] ?? '').trim();
  if (!content) return;

  busyId.value = item.id;
  try {
    const res = await fetch(commentsApi, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'reply',
        pageId: item.pageId,
        parentId: item.id,
        content,
      }),
    });
    if (!res.ok) throw new Error('reply failed');
    replyDraft.value[item.id] = '';
    await loadComments();
  } finally {
    busyId.value = '';
  }
}

onMounted(checkSession);
</script>

<template>
  <section class="comments-admin" aria-labelledby="comments-admin-title">
    <header class="comments-admin__header">
      <div>
        <p class="comments-admin__eyebrow">ChuFix Comments</p>
        <h1 id="comments-admin-title">评论审核</h1>
        <p>审核用户反馈、回复问题，并把不合适的评论留在拒绝队列中。</p>
      </div>
      <CfButton v-if="authenticated" variant="ghost" size="sm" @click="logout">
        退出登录
      </CfButton>
    </header>

    <CfAlert v-if="setupIssue" tone="warning" variant="soft" title="配置未完成">
      {{ setupIssue }}
    </CfAlert>

    <div v-if="checking" class="comments-admin__muted">正在检查登录状态...</div>

    <form v-else-if="!authenticated" class="comments-admin__login" @submit.prevent="login">
      <CfInput
        v-model="token"
        type="password"
        placeholder="输入超管口令"
        size="lg"
      />
      <CfButton type="submit" size="lg" :disabled="!token.trim()">
        登录审核后台
      </CfButton>
      <p v-if="loginError" class="comments-admin__error">{{ loginError }}</p>
    </form>

    <template v-else>
      <nav class="comments-admin__filters" aria-label="评论状态筛选">
        <CfButton
          v-for="item in filters"
          :key="item.value"
          type="button"
          :variant="filter === item.value ? 'primary' : 'ghost'"
          size="sm"
          @click="changeFilter(item.value)"
        >
          {{ item.label }}
        </CfButton>
      </nav>

      <div class="comments-admin__summary">
        <strong>{{ title }}</strong>
        <span>{{ comments.length }} 条记录</span>
      </div>

      <div v-if="loading" class="comments-admin__muted">正在加载评论...</div>
      <CfEmpty
        v-else-if="!comments.length"
        title="没有需要处理的评论"
        description="切换筛选可以查看已通过、已拒绝或全部记录。"
        illustration="search"
      />

      <ol v-else class="comments-admin__list">
        <li v-for="item in comments" :key="item.id" class="comments-admin__item">
          <article class="comments-admin-card">
            <div class="comments-admin-card__avatar">
              <CfAvatar :name="item.author" size="sm" />
            </div>
            <div class="comments-admin-card__body">
              <div class="comments-admin-card__meta">
                <strong>{{ item.author }}</strong>
                <CfBadge :tone="statusTone(item.status)" :content="statusLabel(item.status)" />
                <span>{{ item.pageId }}</span>
                <time :datetime="item.createdAt">{{ formatTime(item.createdAt) }}</time>
              </div>
              <p>{{ item.content }}</p>
              <dl class="comments-admin-card__trace">
                <div>
                  <dt>父评论</dt>
                  <dd>{{ item.parentId || '顶层留言' }}</dd>
                </div>
                <div>
                  <dt>审核原因</dt>
                  <dd>{{ item.moderationReason || '无' }}</dd>
                </div>
                <div>
                  <dt>命中规则</dt>
                  <dd>{{ formatMatchedTerms(item.matchedTerms) }}</dd>
                </div>
                <div>
                  <dt>IP Hash</dt>
                  <dd>{{ shortHash(item.ipHash) }}</dd>
                </div>
                <div>
                  <dt>User Agent</dt>
                  <dd>{{ item.userAgent || '未记录' }}</dd>
                </div>
              </dl>

              <div class="comments-admin-card__actions">
                <CfButton
                  v-if="item.status !== 'approved'"
                  size="sm"
                  :loading="busyId === item.id"
                  @click="updateComment(item.id, 'approve')"
                >
                  通过
                </CfButton>
                <CfButton
                  v-if="item.status !== 'rejected'"
                  variant="danger"
                  size="sm"
                  :loading="busyId === item.id"
                  @click="updateComment(item.id, 'reject')"
                >
                  拒绝
                </CfButton>
                <CfButton
                  v-if="item.status !== 'pending'"
                  variant="ghost"
                  size="sm"
                  :loading="busyId === item.id"
                  @click="updateComment(item.id, 'pending')"
                >
                  退回待审
                </CfButton>
                <CfButton
                  variant="ghost"
                  size="sm"
                  :loading="busyId === item.id"
                  @click="deleteComment(item.id)"
                >
                  删除
                </CfButton>
              </div>

              <div class="comments-admin-card__reply">
                <CfTextarea
                  v-model="replyDraft[item.id]"
                  placeholder="以维护者身份回复"
                  :rows="2"
                  auto-resize
                  :disabled="item.status !== 'approved'"
                />
                <div class="comments-admin-card__reply-actions">
                  <div class="comments-admin-card__emoji">
                    <CfButton
                      v-for="emoji in quickEmojis"
                      :key="emoji"
                      type="button"
                      variant="ghost"
                      size="sm"
                      shape="square"
                      :disabled="item.status !== 'approved'"
                      :aria-label="`回复 ${emoji}`"
                      @click="reply(item, emoji)"
                    >
                      {{ emoji }}
                    </CfButton>
                  </div>
                  <CfButton
                    size="sm"
                    variant="secondary"
                    :disabled="item.status !== 'approved' || !replyDraft[item.id]?.trim()"
                    :loading="busyId === item.id"
                    @click="reply(item)"
                  >
                    回复
                  </CfButton>
                </div>
              </div>
            </div>
          </article>
        </li>
      </ol>
    </template>
  </section>
</template>

<style scoped>
.comments-admin {
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}
.comments-admin__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--line-1);
}
.comments-admin__eyebrow {
  margin: 0 0 0.35rem;
  color: var(--fg-3);
  font-size: var(--t-12);
  font-weight: var(--w-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.comments-admin h1 {
  margin: 0;
  font-size: var(--t-28);
  line-height: var(--lh-28);
}
.comments-admin__header p {
  margin: 0.55rem 0 0;
  color: var(--fg-2);
}
.comments-admin__login {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.comments-admin__error,
.comments-admin__muted {
  color: var(--fg-2);
  font-size: var(--t-13);
}
.comments-admin__error {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--status-error);
}
.comments-admin__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.25rem 0;
}
.comments-admin__summary {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--line-1);
  border-bottom: 1px solid var(--line-1);
  color: var(--fg-2);
}
.comments-admin__summary strong {
  color: var(--fg-1);
}
.comments-admin__list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.comments-admin-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--line-1);
  border-radius: var(--r-6);
  background: var(--bg-1);
}
.comments-admin-card__body {
  min-width: 0;
}
.comments-admin-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.65rem;
  color: var(--fg-2);
  font-size: var(--t-12);
}
.comments-admin-card__meta strong {
  color: var(--fg-1);
  font-size: var(--t-14);
}
.comments-admin-card p {
  margin: 0.55rem 0 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--fg-1);
  line-height: 1.7;
}
.comments-admin-card__trace {
  display: grid;
  gap: 0.45rem;
  margin: 0.75rem 0 0;
  padding: 0.75rem;
  border-radius: var(--r-4);
  background: var(--bg-inset);
  color: var(--fg-2);
  font-size: var(--t-12);
}
.comments-admin-card__trace div {
  min-width: 0;
}
.comments-admin-card__trace dt {
  float: left;
  min-width: 5.5rem;
  color: var(--fg-3);
  font-weight: var(--w-semibold);
}
.comments-admin-card__trace dd {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.comments-admin-card__actions,
.comments-admin-card__reply-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.85rem;
}
.comments-admin-card__reply {
  margin-top: 0.85rem;
}
.comments-admin-card__emoji {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
@media (max-width: 640px) {
  .comments-admin__header,
  .comments-admin__login,
  .comments-admin-card {
    display: flex;
    flex-direction: column;
  }
  .comments-admin__login .cf-btn,
  .comments-admin-card__reply-actions .cf-btn {
    width: 100%;
  }
}
</style>
